/// <reference types="node" />
export declare const TABLE_ALREADY_EXISTS_ERROR: {
    new (tableName: any): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const EMPTY_RESULT_ERROR: {
    new (message?: string | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const DUPLICATE_ENTRY_ERROR: {
    new (message?: string | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const MYSQL_ERROR_CODE: {
    TABLE_ALREADY_EXISTS: number;
    DUPLICATE_ENTRY: number;
};
