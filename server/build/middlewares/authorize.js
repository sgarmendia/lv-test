"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
var authorize = function (roles) {
    return function (req, res, next) {
        try {
            var user = req.user;
            if (!user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            if (!roles.includes(user.role)) {
                res.status(403).json({ error: "Forbidden" });
                return;
            }
            next();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
};
exports.authorize = authorize;
