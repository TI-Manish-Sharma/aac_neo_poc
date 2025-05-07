import { ApiResponse } from "../../shared/types/ApiResponse";
import { SegregationAnalysisData } from "../types/SegregationAnalysisData";

export async function fetchSegregationAnalysis(
    apiUrl: string
): Promise<ApiResponse<SegregationAnalysisData>> {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    data: null as any,
                    error: "No data found for the selected criteria.",
                    status: 404
                };
            }

            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: SegregationAnalysisData = await response.json();

        // CReate delay in response to simulate loading time
        // await new Promise((resolve) => setTimeout(resolve, 5000));

        return {
            data,
            status: response.status
        };
    } catch (error) {
        return {
            data: null as any,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 500
        };
    }
}