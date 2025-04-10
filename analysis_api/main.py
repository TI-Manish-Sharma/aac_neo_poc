from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import pandas as pd
from typing import List, Optional, Dict, Any
import os
from datetime import datetime, timedelta
from pydantic import BaseModel

# FastAPI app initialization
app = FastAPI(
    title="AAC Plant Batch Quality Analysis API",
    description="API for analyzing quality metrics from AAC manufacturing process",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection settings
CONNECTION_STRING = "mongodb+srv://neoadmin:P%40ssw0rd@acc-neo-cluster.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
DATABASE_NAME = "AACPlantDatabase"
MANUFACTURING_COLLECTION = "ManufacturingProcess"

# Pydantic models for response
class RejectionSummary(BaseModel):
    rejection_type: str
    count: int
    percentage: float

class BatchQualityStats(BaseModel):
    total_batches: int
    rejected_batches: int
    rejection_rate: float
    rejection_by_type: List[RejectionSummary]
    most_common_rejection: str

# MongoDB connection function
def get_mongo_connection():
    try:
        client = MongoClient(CONNECTION_STRING)
        db = client[DATABASE_NAME]
        collection = db[MANUFACTURING_COLLECTION]
        return client, collection
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Helper function to check if a batch has any rejections
def has_rejections(batch_data):
    if 'processSteps' not in batch_data or 'cutting' not in batch_data['processSteps']:
        return False
    
    cutting_data = batch_data['processSteps']['cutting']
    rejection_fields = [
        'tiltingCraneRejection', 'chippingRejection', 'sideCutterRejection',
        'joinedRejection', 'trimmingRejection', 'rejectedDueToHC', 'rejectedDueToVC'
    ]
    
    for field in rejection_fields:
        if field in cutting_data and cutting_data[field] not in [None, 0, "", "No", "N/A"]:
            return True
    
    return False

# Helper function to get rejection type counts
def get_rejection_counts(batches):
    rejection_counts = {
        'tiltingCraneRejection': 0,
        'chippingRejection': 0,
        'sideCutterRejection': 0,
        'joinedRejection': 0,
        'trimmingRejection': 0,
        'wireBrokenHC': 0,
        'wireBrokenVC': 0,
        'rejectedDueToHC': 0,
        'rejectedDueToVC': 0
    }
    
    for batch in batches:
        if 'processSteps' in batch and 'cutting' in batch['processSteps']:
            cutting = batch['processSteps']['cutting']
            for rejection_type in rejection_counts.keys():
                if rejection_type in cutting and cutting[rejection_type] not in [None, 0, "", "No", "N/A"]:
                    rejection_counts[rejection_type] += 1
    
    return rejection_counts

@app.get("/")
def read_root():
    return {"message": "AAC Plant Batch Quality Analysis API"}

@app.get("/api/batch-quality", response_model=BatchQualityStats)
async def get_batch_quality_analysis(
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format"),
    mould_id: Optional[str] = Query(None, description="Filter by mould ID")
):
    try:
        # Connect to MongoDB
        client, collection = get_mongo_connection()
        
        # Build query filter
        query_filter = {}
        if start_date:
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                query_filter["date"] = {"$gte": start.strftime("%Y-%m-%d")}
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use YYYY-MM-DD")
        
        if end_date:
            try:
                end = datetime.strptime(end_date, "%Y-%m-%d")
                if "date" in query_filter:
                    query_filter["date"]["$lte"] = end.strftime("%Y-%m-%d")
                else:
                    query_filter["date"] = {"$lte": end.strftime("%Y-%m-%d")}
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use YYYY-MM-DD")
        
        if mould_id:
            query_filter["mouldId"] = mould_id
        
        # Query MongoDB
        cursor = collection.find(query_filter)
        batches = list(cursor)
        
        # Close MongoDB connection
        client.close()
        
        # If no batches found, return empty response
        if not batches:
            return JSONResponse(
                status_code=404,
                content={"message": "No batches found matching the criteria"}
            )
        
        # Convert to pandas DataFrame for analysis
        df = pd.json_normalize(batches)
        
        # Identify rejected batches
        rejected_batches = [batch for batch in batches if has_rejections(batch)]
        
        # Get rejection counts by type
        rejection_counts = get_rejection_counts(batches)
        
        # Calculate statistics
        total_batches = len(batches)
        rejected_count = len(rejected_batches)
        rejection_rate = (rejected_count / total_batches) * 100 if total_batches > 0 else 0
        
        # Create rejection summary
        rejection_summary = []
        most_common_rejection = None
        max_count = 0
        
        for rejection_type, count in rejection_counts.items():
            if count > 0:
                percentage = (count / total_batches) * 100
                # Format the rejection type name to be more readable
                formatted_type = ' '.join(word.capitalize() for word in rejection_type.replace('Rejection', '').split('Due'))
                
                rejection_summary.append(
                    RejectionSummary(
                        rejection_type=formatted_type,
                        count=count,
                        percentage=round(percentage, 2)
                    )
                )
                
                if count > max_count:
                    max_count = count
                    most_common_rejection = formatted_type
        
        # Sort rejection summary by count in descending order
        rejection_summary.sort(key=lambda x: x.count, reverse=True)
        
        return BatchQualityStats(
            total_batches=total_batches,
            rejected_batches=rejected_count,
            rejection_rate=round(rejection_rate, 2),
            rejection_by_type=rejection_summary,
            most_common_rejection=most_common_rejection if most_common_rejection else "None"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing batch quality: {str(e)}")

@app.get("/api/rejection-trends")
async def get_rejection_trends(
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format"),
    group_by: str = Query("day", description="Group by: day, week, month")
):
    try:
        # Connect to MongoDB
        client, collection = get_mongo_connection()
        
        # Build query filter
        query_filter = {}
        if start_date:
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                query_filter["date"] = {"$gte": start.strftime("%Y-%m-%d")}
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use YYYY-MM-DD")
        
        if end_date:
            try:
                end = datetime.strptime(end_date, "%Y-%m-%d")
                if "date" in query_filter:
                    query_filter["date"]["$lte"] = end.strftime("%Y-%m-%d")
                else:
                    query_filter["date"] = {"$lte": end.strftime("%Y-%m-%d")}
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use YYYY-MM-DD")
        
        # Query MongoDB
        cursor = collection.find(query_filter)
        batches = list(cursor)
        
        # Close MongoDB connection
        client.close()
        
        # If no batches found, return empty response
        if not batches:
            return JSONResponse(
                status_code=404,
                content={"message": "No batches found matching the criteria"}
            )
        
        # Convert to DataFrame
        df = pd.DataFrame(batches)
        
        # Ensure date column is datetime
        df['date'] = pd.to_datetime(df['date'])
        
        # Create a function to determine if a batch has rejections
        def extract_rejection_info(batch):
            has_any_rejection = False
            rejection_types = {}
            
            if 'processSteps' in batch and 'cutting' in batch['processSteps']:
                cutting = batch['processSteps']['cutting']
                rejection_fields = [
                    'tiltingCraneRejection', 'chippingRejection', 'sideCutterRejection',
                    'joinedRejection', 'trimmingRejection', 'rejectedDueToHC', 'rejectedDueToVC'
                ]
                
                for field in rejection_fields:
                    if field in cutting and cutting[field] not in [None, 0, "", "No", "N/A"]:
                        has_any_rejection = True
                        rejection_types[field] = 1
                    else:
                        rejection_types[field] = 0
            
            return pd.Series({
                'has_rejection': has_any_rejection,
                **rejection_types
            })
        
        # Apply the function to extract rejection info
        rejection_info = df.apply(extract_rejection_info, axis=1)
        df = pd.concat([df, rejection_info], axis=1)
        
        # Group by time period
        if group_by == 'day':
            df['period'] = df['date'].dt.date
        elif group_by == 'week':
            df['period'] = df['date'].dt.to_period('W').apply(lambda x: x.start_time.date())
        elif group_by == 'month':
            df['period'] = df['date'].dt.to_period('M').apply(lambda x: x.start_time.date())
        else:
            raise HTTPException(status_code=400, detail="Invalid group_by parameter. Use day, week, or month")
        
        # Calculate rejection trends
        trends = df.groupby('period').agg({
            'batchId': 'count',
            'has_rejection': 'sum',
            'tiltingCraneRejection': 'sum',
            'chippingRejection': 'sum',
            'sideCutterRejection': 'sum',
            'joinedRejection': 'sum',
            'trimmingRejection': 'sum',
            'rejectedDueToHC': 'sum',
            'rejectedDueToVC': 'sum'
        }).reset_index()
        
        # Calculate percentages
        trends['rejection_rate'] = (trends['has_rejection'] / trends['batchId']) * 100
        
        for col in ['tiltingCraneRejection', 'chippingRejection', 'sideCutterRejection',
                   'joinedRejection', 'trimmingRejection', 'rejectedDueToHC', 'rejectedDueToVC']:
            trends[f'{col}_pct'] = (trends[col] / trends['batchId']) * 100
        
        # Convert period to string for JSON serialization
        trends['period'] = trends['period'].astype(str)
        
        # Rename columns for readability
        trends = trends.rename(columns={
            'period': 'Period',
            'batchId': 'TotalBatches',
            'has_rejection': 'RejectedBatches',
            'rejection_rate': 'RejectionRate',
            'tiltingCraneRejection': 'TiltingCraneRejections',
            'chippingRejection': 'ChippingRejections',
            'sideCutterRejection': 'SideCutterRejections',
            'joinedRejection': 'JoinedRejections',
            'trimmingRejection': 'TrimmingRejections',
            'rejectedDueToHC': 'RejectedDueToHC',
            'rejectedDueToVC': 'RejectedDueToVC',
            'tiltingCraneRejection_pct': 'TiltingCraneRate',
            'chippingRejection_pct': 'ChippingRate',
            'sideCutterRejection_pct': 'SideCutterRate',
            'joinedRejection_pct': 'JoinedRate',
            'trimmingRejection_pct': 'TrimmingRate',
            'rejectedDueToHC_pct': 'HCRate',
            'rejectedDueToVC_pct': 'VCRate'
        })
        
        # Round percentage values
        for col in trends.columns:
            if 'Rate' in col:
                trends[col] = trends[col].round(2)
        
        return trends.to_dict(orient='records')
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing rejection trends: {str(e)}")

@app.get("/api/mould-performance")
async def get_mould_performance(
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format")
):
    try:
        # Connect to MongoDB
        client, collection = get_mongo_connection()
        
        # Build query filter
        query_filter = {}
        if start_date:
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                query_filter["date"] = {"$gte": start.strftime("%Y-%m-%d")}
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use YYYY-MM-DD")
        
        if end_date:
            try:
                end = datetime.strptime(end_date, "%Y-%m-%d")
                if "date" in query_filter:
                    query_filter["date"]["$lte"] = end.strftime("%Y-%m-%d")
                else:
                    query_filter["date"] = {"$lte": end.strftime("%Y-%m-%d")}
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use YYYY-MM-DD")
        
        # Query MongoDB
        cursor = collection.find(query_filter)
        batches = list(cursor)
        
        # Close MongoDB connection
        client.close()
        
        # If no batches found, return empty response
        if not batches:
            return JSONResponse(
                status_code=404,
                content={"message": "No batches found matching the criteria"}
            )
        
        # Convert to DataFrame
        df = pd.DataFrame(batches)
        
        # Create a function to determine if a batch has rejections
        def extract_rejection_info(batch):
            has_any_rejection = False
            
            if 'processSteps' in batch and 'cutting' in batch['processSteps']:
                cutting = batch['processSteps']['cutting']
                rejection_fields = [
                    'tiltingCraneRejection', 'chippingRejection', 'sideCutterRejection',
                    'joinedRejection', 'trimmingRejection', 'rejectedDueToHC', 'rejectedDueToVC'
                ]
                
                for field in rejection_fields:
                    if field in cutting and cutting[field] not in [None, 0, "", "No", "N/A"]:
                        has_any_rejection = True
                        break
            
            return has_any_rejection
        
        # Add has_rejection column
        df['has_rejection'] = df.apply(extract_rejection_info, axis=1)
        
        # Group by mould ID
        mould_performance = df.groupby('mouldId').agg({
            'batchId': 'count',
            'has_rejection': 'sum'
        }).reset_index()
        
        # Calculate rejection rate
        mould_performance['rejection_rate'] = (mould_performance['has_rejection'] / mould_performance['batchId']) * 100
        
        # Sort by rejection rate in descending order
        mould_performance = mould_performance.sort_values('rejection_rate', ascending=False)
        
        # Rename columns for readability
        mould_performance = mould_performance.rename(columns={
            'mouldId': 'MouldId',
            'batchId': 'TotalBatches',
            'has_rejection': 'RejectedBatches',
            'rejection_rate': 'RejectionRate'
        })
        
        # Round percentage values
        mould_performance['RejectionRate'] = mould_performance['RejectionRate'].round(2)
        
        return mould_performance.to_dict(orient='records')
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing mould performance: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)