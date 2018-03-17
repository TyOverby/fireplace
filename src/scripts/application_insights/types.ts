export interface AiCommon {
    name: string;
    timestamp: Date;
    id: string;
    operation_Id: string;
    operation_ParentId: string;
    operation_Name: string;
    customDimensions: any;
}

export interface AiRequest extends AiCommon {
    url: string;
    success: boolean;
    resultCode: number;
    duration: number;
    performanceBucket: string;
}

export interface AiDependency extends AiCommon {
    duration: number;
}
