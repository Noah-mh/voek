/* eslint-disable max-classes-per-file */

export const TABLE_ALREADY_EXISTS_ERROR = class TABLE_ALREADY_EXISTS_ERROR extends Error {
    constructor(tableName: any) {
        super(`Table ${tableName} already exists!`);
    }
};

export const EMPTY_RESULT_ERROR = class EMPTY_RESULT_ERROR extends Error {};
export const DUPLICATE_ENTRY_ERROR = class DUPLICATE_ENTRY_ERROR extends Error {};

export const MYSQL_ERROR_CODE = {
    TABLE_ALREADY_EXISTS: 1050,
    DUPLICATE_ENTRY: 1062,
};