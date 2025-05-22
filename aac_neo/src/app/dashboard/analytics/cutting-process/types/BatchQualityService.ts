import { BatchQualityMetrics } from "./BatchQualityMetrics";

export interface BatchQualityService {
  fetchBatchQualityMetrics(): Promise<BatchQualityMetrics>;
}