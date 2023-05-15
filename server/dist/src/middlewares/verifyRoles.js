"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyRoles = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.role) {
            return res.sendStatus(403);
        }
        if (req.role !== allowedRole) {
            return res.sendStatus(401);
        }
        next();
    };
};
exports.default = verifyRoles;
//# sourceMappingURL=verifyRoles.js.map