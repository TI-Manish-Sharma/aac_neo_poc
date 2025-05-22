import { BatchQualityMetrics } from "../types/BatchQualityMetrics";
import { BatchQualityService } from "../types/BatchQualityService";

export class ApiBatchQualityService implements BatchQualityService {
  constructor(private apiUrl: string) {}

  async fetchBatchQualityMetrics(): Promise<BatchQualityMetrics> {
    try {
      const response = await fetch(this.apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return BatchQualityMetrics.fromApiResponse(data);
    } catch (error) {
      throw error instanceof Error 
        ? error 
        : new Error('An unknown error occurred fetching batch quality data');
    }
  }
}