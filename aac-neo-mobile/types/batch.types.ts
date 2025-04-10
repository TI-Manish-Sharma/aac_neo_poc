export interface BatchFormData {
    batchNumber: string;
    mouldNumber: string;
}

export interface BatchRecord extends BatchFormData {
    id: string;
    createdAt: string;
    status: 'in-progress' | 'completed';
}