import { GroupByOption } from "./GroupByOption";

export interface RejectionFilters {
    startDate: Date | null;
    endDate: Date | null;
    groupBy: GroupByOption;
}