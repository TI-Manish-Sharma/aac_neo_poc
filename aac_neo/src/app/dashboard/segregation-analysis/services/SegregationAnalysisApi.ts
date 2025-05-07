// src/app/dashboard/segregation-analysis/services/SegregationAnalysisApi.ts
import { SegregationAnalysisData, SegregationAnalysisParams } from "../types";

export interface SegregationAnalysisService {
    fetchSegregationAnalysisData(params: SegregationAnalysisParams): Promise<SegregationAnalysisData>;
}

export class ApiSegregationAnalysisService implements SegregationAnalysisService {
    constructor(private apiUrl: string) { }

    async fetchSegregationAnalysisData(params: SegregationAnalysisParams): Promise<SegregationAnalysisData> {
        try {
            // Build query string from params
            const queryParams = new URLSearchParams();

            if (params.start_date) {
                queryParams.append('start_date', params.start_date);
            }

            if (params.end_date) {
                queryParams.append('end_date', params.end_date);
            }

            if (params.mould_id) {
                queryParams.append('mould_id', params.mould_id);
            }

            const url = `${this.apiUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No data found for the selected criteria.');
                }
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data: SegregationAnalysisData = await response.json();
            return data;
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('An unknown error occurred fetching segregation analysis data');
        }
    }
}