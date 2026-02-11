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
    }[];
}
