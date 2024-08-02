"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pgKeys = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
};
exports.default = pgKeys;
