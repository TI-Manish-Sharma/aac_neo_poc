// types/batch.ts

export interface BatchData {
    batchNo: number;
    mouldNo: number;
    freshSlurryKg: number;
    wasteSlurryKg: number;
    cementKg: number;
    limeKg: number;
    gypsumKg: number;
    aluminumPowderGm: number;
    dcPowderGm: number;
    waterKg: number;
    soluOilLitre: number;
    mixingTime: number;
    dischargeTime: string;
    dischargeTemp: number;
}

export interface Alert {
    id: string;
    message: string;
    type: 'warning' | 'error';
    timestamp: Date;
}

export interface Metrics {
    totalBatches: number;
    avgMixingTime: number;
    avgDischargeTemp: number;
    avgWaterUsage: number;
    avgDischargeTime: string;
}

export interface ChartData {
    trendData: TrendDataPoint[];
    materialComposition: MaterialCompositionData[];
    tempCategories: TemperatureCategories;
}

export interface TrendDataPoint {
    batch: number;
    mixingTime: number;
    dischargeTemp: number;
    waterKg: number;
    freshSlurryKg: number;
    wasteSlurryKg: number;
    cementKg: number;
    limeKg: number;
    gypsumKg: number;
    aluminumPowderGm: number;
    dcPowderGm: number;
    soluOilLitre: number;
    sequence: number;
}

export interface MaterialCompositionData {
    name: string;
    value: number;
    color: string;
}

export interface TemperatureCategories {
    optimal: number;
    acceptable: number;
    high: number;
}

export interface ParameterRanges {
    waterKg: { min: number; max: number };
    mixingTime: { min: number; max: number };
    dischargeTemp: { optimal: number; max: number };
}

export interface TemperatureStatus {
    label: string;
    class: string;
}

// Constants
export const PARAMETER_RANGES: ParameterRanges = {
    waterKg: { min: 70, max: 125 },
    mixingTime: { min: 2.5, max: 3.2 },
    dischargeTemp: { optimal: 47, max: 48 }
};

export const INITIAL_BATCH_DATA: BatchData[] = [
    { batchNo: 1520, mouldNo: 3, freshSlurryKg: 2395, wasteSlurryKg: 300, cementKg: 340, limeKg: 205, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 2.8, dischargeTime: '4:04', dischargeTemp: 47 },
    { batchNo: 1521, mouldNo: 15, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 345, limeKg: 195, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 3, dischargeTime: '4:09', dischargeTemp: 47 },
    { batchNo: 1522, mouldNo: 18, freshSlurryKg: 2399, wasteSlurryKg: 300, cementKg: 342, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 90, soluOilLitre: 3, mixingTime: 2.75, dischargeTime: '4:13', dischargeTemp: 48 },
    { batchNo: 1523, mouldNo: 22, freshSlurryKg: 2396, wasteSlurryKg: 300, cementKg: 340, limeKg: 205, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 75, soluOilLitre: 3, mixingTime: 2.85, dischargeTime: '4:18', dischargeTemp: 47 },
    { batchNo: 1524, mouldNo: 21, freshSlurryKg: 2401, wasteSlurryKg: 300, cementKg: 340, limeKg: 195, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 85, soluOilLitre: 3, mixingTime: 3, dischargeTime: '4:25', dischargeTemp: 47 },
    { batchNo: 1525, mouldNo: 27, freshSlurryKg: 2398, wasteSlurryKg: 300, cementKg: 340, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 115, soluOilLitre: 3, mixingTime: 2.95, dischargeTime: '4:30', dischargeTemp: 48 },
    { batchNo: 1526, mouldNo: 32, freshSlurryKg: 2395, wasteSlurryKg: 300, cementKg: 340, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 100, soluOilLitre: 3, mixingTime: 2.79, dischargeTime: '4:35', dischargeTemp: 47 },
    { batchNo: 1527, mouldNo: 4, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 340, limeKg: 205, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 3, dischargeTime: '4:41', dischargeTemp: 48 },
    { batchNo: 1528, mouldNo: 6, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 340, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 75, soluOilLitre: 3, mixingTime: 3, dischargeTime: '4:47', dischargeTemp: 47 },
    { batchNo: 1529, mouldNo: 9, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 340, limeKg: 195, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 3, dischargeTime: '4:52', dischargeTemp: 47 },
    { batchNo: 1530, mouldNo: 11, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 341, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 75, soluOilLitre: 3, mixingTime: 3, dischargeTime: '4:58', dischargeTemp: 47 },
    { batchNo: 1531, mouldNo: 19, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 348, limeKg: 195, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 120, soluOilLitre: 3, mixingTime: 3, dischargeTime: '5:03', dischargeTemp: 48 },
    { batchNo: 1532, mouldNo: 23, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 342, limeKg: 205, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 3, dischargeTime: '5:08', dischargeTemp: 47 },
    { batchNo: 1533, mouldNo: 24, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 340, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 75, soluOilLitre: 3, mixingTime: 2.98, dischargeTime: '5:14', dischargeTemp: 48 },
    { batchNo: 1534, mouldNo: 26, freshSlurryKg: 2400, wasteSlurryKg: 300, cementKg: 342, limeKg: 205, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 100, soluOilLitre: 3, mixingTime: 3, dischargeTime: '5:20', dischargeTemp: 47 },
    { batchNo: 1535, mouldNo: 5, freshSlurryKg: 2399, wasteSlurryKg: 300, cementKg: 341, limeKg: 195, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 2.79, dischargeTime: '5:25', dischargeTemp: 48 },
    { batchNo: 1536, mouldNo: 2, freshSlurryKg: 2397, wasteSlurryKg: 300, cementKg: 340, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 90, soluOilLitre: 3, mixingTime: 2.84, dischargeTime: '5:30', dischargeTemp: 48 },
    { batchNo: 1537, mouldNo: 31, freshSlurryKg: 2398, wasteSlurryKg: 300, cementKg: 340, limeKg: 200, gypsumKg: 25, aluminumPowderGm: 1230, dcPowderGm: 15, waterKg: 110, soluOilLitre: 3, mixingTime: 2.85, dischargeTime: '5:35', dischargeTemp: 47 }
];