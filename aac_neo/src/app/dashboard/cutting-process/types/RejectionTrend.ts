export interface RejectionTrend {
    Period: string;
    TotalBatches: number;
    RejectedBatches: number;
    RejectionRate: number;
    TiltingCraneRejections: number;
    ChippingRejections: number;
    SideCutterRejections: number;
    JoinedRejections: number;
    TrimmingRejections: number;
    RejectedDueToHC: number;
    RejectedDueToVC: number;
    TiltingCraneRate: number;
    ChippingRate: number;
    SideCutterRate: number;
    JoinedRate: number;
    TrimmingRate: number;
    HCRate: number;
    VCRate: number;
}