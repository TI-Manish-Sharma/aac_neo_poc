export class RejectionType {
    constructor(
        readonly type: string,
        readonly count: number,
        readonly percentage: number
    ) { }

    static create(type: string, count: number, totalBatches: number): RejectionType {
        const percentage = Number(((count / totalBatches) * 100).toFixed(2));
        return new RejectionType(type, count, percentage);
    }
}