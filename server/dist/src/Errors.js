"use strict";
/* eslint-disable max-classes-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MYSQL_ERROR_CODE = exports.DUPLICATE_ENTRY_ERROR = exports.EMPTY_RESULT_ERROR = exports.TABLE_ALREADY_EXISTS_ERROR = void 0;
const TABLE_ALREADY_EXISTS_ERROR = class TABLE_ALREADY_EXISTS_ERROR extends Error {
    constructor(tableName) {
        super(`Table ${tableName} already exists!`);
    }
};
exports.TABLE_ALREADY_EXISTS_ERROR = TABLE_ALREADY_EXISTS_ERROR;
const EMPTY_RESULT_ERROR = class EMPTY_RESULT_ERROR extends Error {
};
exports.EMPTY_RESULT_ERROR = EMPTY_RESULT_ERROR;
const DUPLICATE_ENTRY_ERROR = class DUPLICATE_ENTRY_ERROR extends Error {
};
exports.DUPLICATE_ENTRY_ERROR = DUPLICATE_ENTRY_ERROR;
exports.MYSQL_ERROR_CODE = {
    TABLE_ALREADY_EXISTS: 1050,
    DUPLICATE_ENTRY: 1062,
};
//# sourceMappingURL=Errors.js.map