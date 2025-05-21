import { ApiResponse } from "../../shared/types/ApiResponse";
import { RejectionTrend } from "../types/RejectionTrend";
import { RejectionTrendsParams } from "../types/RejectionTrendsParams";

export async function fetchRejectionTrends(
    apiUrl: string,
    params: RejectionTrendsParams
): Promise<ApiResponse<RejectionTrend[]>> {
    try {
        // Build query string from params
        const queryParams = new URLSearchParams();

        if (params.group_by) {
            queryParams.append('group_by', params.group_by);
        }

        if (params.start_date) {
            queryParams.append('start_date', params.start_date);
        }

        if (params.end_date) {
            queryParams.append('end_date', params.end_date);
        }

        const url = `${apiUrl}?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    data: [],
                    status: 404
                };
            }

            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: RejectionTrend[] = await response.json();

        return {
            data,
            status: response.status
        };
    } catch (error) {
        return {
            data: [],
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 500
        };
    }
}