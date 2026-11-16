export interface TODO {
    id: string;
    task: string;
    isCompleted: boolean;
    remarks: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
