// Node.js code to migrate Excel data to Cosmos DB for MongoDB (vCore)
// with Vector Search capabilities

const { MongoClient } = require('mongodb');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const util = require('util');
// Azure Cosmos DB for MongoDB (vCore) configuration
const connectionString = "mongodb+srv://neoadmin:P%40ssw0rd@acc-neo-cluster.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const databaseName = "AACPlantDatabase";
const manufacturingCollection = "ManufacturingProcess";
const autoclaveCollection = "AutoclaveProcess";

async function connectToMongoDB() {
    try {
        const client = new MongoClient(connectionString);
        await client.connect();
        console.log("Connected to Azure Cosmos DB for MongoDB");

        const database = client.db(databaseName);
        const mfgCollection = database.collection(manufacturingCollection);
        const acvCollection = database.collection(autoclaveCollection);

        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (!collectionNames.includes(manufacturingCollection)) {
            console.log(`Creating ${manufacturingCollection} collection...`);
            await mfgCollection.insertOne({ _id: "dummy", temp: true });
            await mfgCollection.deleteOne({ _id: "dummy" });
            console.log(`${manufacturingCollection} collection created`);
        }

        if (!collectionNames.includes(autoclaveCollection)) {
            console.log(`Creating ${autoclaveCollection} collection...`);
            await acvCollection.insertOne({ _id: "dummy", temp: true });
            await acvCollection.deleteOne({ _id: "dummy" });
            console.log(`${autoclaveCollection} collection created`);
        }

        return { client, mfgCollection, acvCollection };
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

function parseExcelTime(excelTime) {
    if (!excelTime || typeof excelTime !== 'object') return null;

    try {
        return excelTime.toISOString().split('T')[1].substring(0, 5);
    } catch (e) {
        return null;
    }
}

async function processExcelData(filePath) {
    // Read Excel file
    const workbook = XLSX.readFile(filePath, {
        cellDates: true,
        cellNF: true
    });

    // Process data from each sheet
    const batchingSheet = workbook.Sheets['1. Batching '];
    const ferryCartSheet = workbook.Sheets['2.Ferry Cart '];
    const tiltingCraneSheet = workbook.Sheets['3.Tilting Crane'];
    const cuttingSheet = workbook.Sheets['4.Cutting Report'];
    const segregationSheet = workbook.Sheets['6.Segregation Report'];

    // Convert sheets to JSON
    const batchingData = XLSX.utils.sheet_to_json(batchingSheet, {
        range: 2, // Skip header row
        defval: null
    });
    const ferryCartData = XLSX.utils.sheet_to_json(ferryCartSheet, {
        range: 2, // Skip header row
        defval: null
    });
    const tiltingCraneData = XLSX.utils.sheet_to_json(tiltingCraneSheet, {
        range: 2, // Skip header row
        defval: null
    });
    const cuttingData = XLSX.utils.sheet_to_json(cuttingSheet, {
        range: 2, // Skip header row
        defval: null
    });
    const segregationData = XLSX.utils.sheet_to_json(segregationSheet, {
        range: 2, // Skip header row
        defval: null
    });

    // Get date from sheets (in real implementation, extract from specific cells)
    const processDate = new Date().toISOString().split('T')[0]; // Sample date

    // Create documents for each batch
    const batchDocuments = [];

    // Process batching data
    for (let i = 0; i < batchingData.length; i++) {
        const batchRow = batchingData[i];
        if (!batchRow['Batch No.']) continue;

        const batchId = batchRow['Batch No.'].toString();
        const mouldId = batchRow['Mould No.'].toString();

        // Find corresponding data in other sheets
        const ferryCartRow = ferryCartData.find(row =>
            row['Batch No.'] && row['Batch No.'].toString() === batchId &&
            row['Mould No.'] && row['Mould No.'].toString() === mouldId
        );

        const tiltingCraneRow = tiltingCraneData.find(row =>
            row['Batch No.'] && row['Batch No.'].toString() === batchId &&
            row['Mould No.'] && row['Mould No.'].toString() === mouldId
        );

        const cuttingRow = cuttingData.find(row =>
            row['Batch No.'] && row['Batch No.'].toString() === batchId &&
            row['Mould No.'] && row['Mould No.'].toString() === mouldId
        );

        const segregationRow = segregationData.find(row =>
            row['Batch No.'] && row['Batch No.'].toString() === batchId &&
            row['Mould No.'] && row['Mould No.'].toString() === mouldId
        );

        // Create document (MongoDB format)
        const document = {
            _id: `batch_${batchId}_${processDate.replace(/-/g, '')}`,
            batchId: batchId,
            mouldId: mouldId,
            status: "Completed",
            date: processDate,
            processSteps: {
                batching: {
                    shift: "Day", // Extract from sheet in real implementation
                    materials: {
                        freshSlurry: batchRow['Fresh Slurry Kg'] || 0,
                        wasteSlurry: batchRow['Waste Slurry Kg'] || 0,
                        cement: batchRow['Cement Kg'] || 0,
                        lime: batchRow['Lime Kg'] || 0,
                        gypsum: batchRow['Gypsum Kg'] || 0,
                        aluminumPowder: batchRow['Aluminum  Powder GM'] || 0,
                        dcPowder: batchRow['D C Powder GM'] || 0,
                        water: batchRow['Water Kg'] || 0,
                        solutionOil: batchRow['Solu. Oil Litre'] || 0
                    },
                    process: {
                        mixingTime: batchRow['Mixing Time'] || 0,
                        dischargeTime: parseExcelTime(batchRow['Discharge Time']),
                        dischargeTemp: batchRow['Discharge Temp.'] || 0
                    }
                }
            },
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: "migration_script"
            }
        };

        // Add ferry cart data if available
        if (ferryCartRow) {
            document.processSteps.ferryCarts = {
                shift: "Day", // Extract from sheet in real implementation
                measurements: {
                    flow: ferryCartRow['Flow'] || 0,
                    temp: ferryCartRow['Temp.'] || 0,
                    height: ferryCartRow['Height'] || 0,
                    time: parseExcelTime(ferryCartRow['Time'])
                }
            };
        }

        // Add tilting crane data if available
        if (tiltingCraneRow) {
            document.processSteps.tiltingCrane = {
                shift: "Day", // Extract from sheet in real implementation
                measurements: {
                    risingQuality: tiltingCraneRow['Rising   Less / Over / Ok'] || "",
                    temp: tiltingCraneRow['Temp.'] || 0,
                    time: parseExcelTime(tiltingCraneRow['Time']),
                    hardness: tiltingCraneRow['Hardness'] || 0
                }
            };
        }

        // Add cutting data if available
        if (cuttingRow) {
            document.processSteps.cutting = {
                cuttingTime: parseExcelTime(cuttingRow['Cutting Time']),
                blockSize: cuttingRow['Block Size'] || null,
                tiltingCraneRejection: cuttingRow['Tilting Crane Rejection'] || null,
                chippingRejection: cuttingRow['Chipping Rejection'] || null,
                sideCutterRejection: cuttingRow['Side Cutter Rejection'] || null,
                joinedRejection: cuttingRow['Joined Rejection'] || null,
                trimmingRejection: cuttingRow['Trimming Rejection'] || null,
                wireBrokenHC: cuttingRow['Wire Broken HC'] || null,
                wireBrokenVC: cuttingRow['Wire Broken VC'] || null,
                rejectedDueToHC: cuttingRow['Rejected Due to HC'] || null,
                rejectedDueToVC: cuttingRow['Rejected Due to VC'] || null,
                dimensionCheck: cuttingRow['Dimension Check'] || null
            };
        }

        // Add segregation data if available
        if (segregationRow) {
            document.processSteps.segregation = {
                shift: "Day", // Extract from sheet in real implementation
                totalBlocks: segregationRow['Total Blocks'] || 0,
                size: segregationRow['Size'] || null,
                defects: {
                    "1": {
                        rainCracksCuts: segregationRow['1-RainCracks/Cuts'] || 0,
                        cornerCracksCuts: segregationRow['1-CornerCracks/Cuts'] || 0,
                        cornerDamage: segregationRow['1-CornerDemage'] || 0,
                        chippedBlocks: segregationRow['1-ChippedBlocks'] || 0
                    },
                    "2": {
                        rainCracksCuts: segregationRow['2-RainCracks/Cuts'] || 0,
                        cornerCracksCuts: segregationRow['2-CornerCracks/Cuts'] || 0,
                        cornerDamage: segregationRow['2-CornerDemage'] || 0,
                        chippedBlocks: segregationRow['2-ChippedBlocks'] || 0
                    },
                    "3": {
                        rainCracksCuts: segregationRow['3-RainCracks/Cuts'] || 0,
                        cornerCracksCuts: segregationRow['3-CornerCracks/Cuts'] || 0,
                        cornerDamage: segregationRow['3-CornerDemage'] || 0,
                        chippedBlocks: segregationRow['3-ChippedBlocks'] || 0
                    },
                    "4": {
                        rainCracksCuts: segregationRow['4-RainCracks/Cuts'] || 0,
                        cornerCracksCuts: segregationRow['4-CornerCracks/Cuts'] || 0,
                        cornerDamage: segregationRow['4-CornerDemage'] || 0,
                        chippedBlocks: segregationRow['4-ChippedBlocks'] || 0
                    },
                    "5": {
                        rainCracksCuts: segregationRow['5-RainCracks/Cuts'] || 0,
                        cornerCracksCuts: segregationRow['5-CornerCracks/Cuts'] || 0,
                        cornerDamage: segregationRow['5-CornerDemage'] || 0,
                        chippedBlocks: segregationRow['5-ChippedBlocks'] || 0
                    },
                    "6": {
                        rainCracksCuts: segregationRow['6-RainCracks/Cuts'] || 0,
                        cornerCracksCuts: segregationRow['6-CornerCracks/Cuts'] || 0,
                        cornerDamage: segregationRow['6-CornerDemage'] || 0,
                        chippedBlocks: segregationRow['6-ChippedBlocks'] || 0
                    }
                },
                totalDefects: segregationRow['Total Defects'] || 0,
            };
        }

        // Add to batch documents array
        batchDocuments.push(document);
    }

    return batchDocuments;
}

async function processAutoclaveData(filePath) {
    // Read Excel file
    const workbook = XLSX.readFile(filePath, {
        cellDates: true,
        cellNF: true
    });

    // Access the 5.Autoclave sheet
    const autoclaveSheet = workbook.Sheets['5.Autoclave'];
    if (!autoclaveSheet) {
        console.error("5.Autoclave sheet not found");
        return [];
    }

    // Convert the sheet to JSON
    const autoclaveData = XLSX.utils.sheet_to_json(autoclaveSheet, {
        range: 2, // Skip header rows
        defval: null // Use null for empty cells
    });

    // Process and structure the autoclave data
    const processedData = [];

    autoclaveData.forEach(row => {
        processedData.push({
            autoclaveId: row['Autoclave Id'],
            shift: row['Shift'],
            batchesProcessed: row['Batches Processed'],
            previousDoorOpenTime: parseExcelTime(row['Previous Door Open Time']),
            previousDoorOpenPressure: parseExcelTime(row['Previous Door Open Pressure']),
            doorCloseTime: parseExcelTime(row['Door Close Time']),
            doorClosePressure: row['Door Close Pressure'],
            vacuumFinishTime: parseExcelTime(row['Vacuum Finish Time']),
            vacuumFinishPressure: row['Vacuum Finish Pressure'],
            slowSteamStartTime: parseExcelTime(row['Slow Steam Start Time']),
            slowSteamStartPressure: row['Slow Steam Start Pressure'],
            fastSteamStartTime: parseExcelTime(row['Fast Steam Start Time']),
            fastSteamStartPressure: row['Fast Steam Start  Pressure'],
            maxPressureTime: parseExcelTime(row['Max Pressure Time']),
            maxPressure: row['Max Pressure'],
            releaseStartTime: parseExcelTime(row['Release start Time']),
            releaseStartPressure: row['Release start  Pressure'],
            doorOpenTime: parseExcelTime(row['Door Open Time']),
            doorOpenPressure: row['Door Open  Pressure'],
            doorCloseDuration: parseExcelTime(row['Door Close Duration']),
            vacuumFinishDuration: parseExcelTime(row['Vaccum Finish Duration']),
            slowSteamDuration: parseExcelTime(row['Slow Steam Duration']),
            fastSteamDuration: parseExcelTime(row['Fast Steam Duration']),
            maxPressureDuration: parseExcelTime(row['Max Pressure Duration']),
            releaseStartDuration: parseExcelTime(row['Release start Duration']),
            doorOpenDuration: parseExcelTime(row['Door Open  Duration'])
        });
    });

    return processedData;
}

async function uploadToMongoDB(mfgCollection, acvCollection, { manufacturingDocs, autoclaveDocs }) {
    console.log(`Uploading ${manufacturingDocs.length} manufacturing documents to MongoDB...`);

    if (manufacturingDocs.length > 0) {
        try {
            const mfgResult = await mfgCollection.insertMany(manufacturingDocs);
            console.log(`${mfgResult.insertedCount} manufacturing documents inserted successfully`);
        } catch (error) {
            console.error("Error uploading manufacturing documents:", error);
        }
    }

    console.log(`Uploading ${autoclaveDocs.length} autoclave documents to MongoDB...`);

    if (autoclaveDocs.length > 0) {
        try {
            const acvResult = await acvCollection.insertMany(autoclaveDocs);
            console.log(`${acvResult.insertedCount} autoclave documents inserted successfully`);
        } catch (error) {
            console.error("Error uploading autoclave documents:", error);
        }
    }
}

async function main() {
    let client;

    try {
        // Connect to MongoDB
        const { client: mongoClient, mfgCollection, acvCollection } = await connectToMongoDB();
        client = mongoClient;

        // Process Excel data
        const excelFilePath = path.join(__dirname, 'aac_plant_reports.xlsx');
        let manufacturingDocs = await processExcelData(excelFilePath);
        let autoclaveDocs = await processAutoclaveData(excelFilePath);

        // Upload to MongoDB
        // console.log("Collection name:", collection.collectionName);
        // console.log(util.inspect(manufacturingDocs.find(x=>x.batchId==='1520'), { showHidden: false, depth: null, colors: true }));
        // console.log(util.inspect(autoclaveDocs, { showHidden: false, depth: null, colors: true }));
        await uploadToMongoDB(mfgCollection, acvCollection, { manufacturingDocs, autoclaveDocs });
        console.log("Data upload completed successfully");
    } catch (error) {
        console.error("Error in main function:", error);
    } finally {
        if (client) {
            await client.close();
            console.log("MongoDB connection closed");
        }
    }
}

main();