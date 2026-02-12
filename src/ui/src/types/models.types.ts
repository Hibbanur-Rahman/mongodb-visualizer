export interface Model{
    name: string;
    collection: string;
    fields: {
        name: string;
        type: string;
        required: boolean;
        ref?: string;
        unique?: boolean;
        index?: boolean;
        default?: unknown;
        enum?: (string | number | boolean)[];
        isArray?: boolean;
        min?: number;
        max?: number;
    }[];
}

export interface ModelDataResponse {
    success: boolean;
    data: {
        records: Array<Record<string, unknown>>;
        pagination: {
            total: number;
            limit: number;
            skip: number;
            hasMore: boolean;
        };
    };
}
