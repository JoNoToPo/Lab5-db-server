// Attribution: Claude (Anthropic, https://claude.ai) was used as a reference for this code.

const http = require("http");
const CONFIG = require("./config");
const STRINGS = require("./lang/messages/eng/strings");
const Database = require("./db");

class ApiServer {
    constructor(CONFIG, Database) {
        this.CONFIG = CONFIG;
        this.db = Database;
        this.server = http.createServer((req, res) => this.handle(req, res));
    }

    start() {
        this.server.listen(this.CONFIG.PORT, () => {
            console.log(STRINGS.SERVER_RUNNING.replace("%PORT%", this.config.PORT));
        });
    }

    setCors(res) {
        res.setHeader("Access-Control-Allow-Origin", this.config.ALLOWED_ORIGIN);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    sendJson(res, status, payload) {
        res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(payload));
    }

    async handle(req, res) {
        this.setCors(res);

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        const rawPath = req.url.split("?")[0];
        const prefix = this.config.API_PREFIX;

        if (rawPath !== prefix && !rawPath.startsWith(prefix + "/")) {
            this.sendJson(res, 404, { error: STRINGS.NOT_FOUND });
            return;
        }

        try {
            if (req.method === "GET") {
                await this.handleSelect(rawPath.slice(prefix.length + 1), res);
            } else if (req.method === "POST") {
                await this.handleInsert(req, res);
            } else {
                this.sendJson(res, 405, { error: STRINGS.METHOD_NOT_ALLOWED });
            }
        }
        catch (err) {
            console.error(err);
            this.sendJson(res, 500, { error: STRINGS.SERVER_ERROR});
        }
    }

    async handleSelect(encodedSql, res) {
        let sql = "";
        try {
            sql = decodeURIComponent(encodedSql || "").trim();
        } catch (err) {
            sql = "";
        }
        // Allow the assignment's sample form: /api/v1/sql/"select * from patient"
        if (sql.length > 1 && sql.startsWith("\"") && sql.endsWith("\"")) {
            sql = sql.slice(1, -1).trim();
        }

        if (!sql) {
            this.sendJson(res, 400, { error: STRINGS.EMPTY_QUERY });
            return;
        }

        try {
            const rows = await this.db.runReadQuery(sql);
            this.sendJson(res, 200, { message: STRINGS.QUERY_SUCCESS, result: rows });
        } catch (err) {
            this.sendDbError(res, err);
        }
    }

    async handleInsert(req, res) {
        let body;
        try {
            body = await this.readBody(req);
        } catch (err) {
            this.sendJson(res, 413, { error: STRINGS.BODY_TOO_LARGE });
            return;
        }

        let data;
        try {
            data = JSON.parse(body);
        } catch (err) {
            this.sendJson(res, 400, { error: STRINGS.INVALID_JSON });
            return;
        }

        if (!this.isValidRows(data.rows)) {
            this.sendJson(res, 400, { error: STRINGS.INVALID_ROWS });
            return;
        }

        try {
            const count = await this.db.insertPatients(data.rows);
            this.sendJson(res, 201, {
                message: STRINGS.INSERT_SUCCESS.replace("%COUNT%", count)
            });
        } catch (err) {
            this.sendDbError(res, err);
        }
    }

    // checks if the entered rows are valid
    isValidRows(rows) {
        return Array.isArray(rows) && rows.length > 0 && rows.every((row) =>
            row && typeof row.name === "string" && row.name.trim() !== "" &&
            typeof row.dateOfBirth === "string" && row.dateOfBirth.trim() !== ""
        );
    }

    sendDbError(res, err) {
        const deniedCodes = [
            "ER_TABLEACCESS_DENIED_ERROR",
            "ER_DBACCESS_DENIED_ERROR",
            "ER_SPECIFIC_ACCESS_DENIED_ERROR",
            "ER_COLUMNACCESS_DENIED_ERROR"
        ];
        if (deniedCodes.includes(err.code)) {
            this.sendJson(res, 403, { error: STRINGS.PERMISSION_DENIED });
            return;
        }
        this.sendJson(res, 400, { error: STRINGS.DB_ERROR.replace("%MSG%", err.message) });
    }

    readBody(req) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
                if (body.length > this.config.MAX_BODY_BYTES) {
                    reject(new Error("too large"));
                    req.destroy();
                }
            });
            req.on("end", () => resolve(body));
            req.on("error", reject);
        });
    }
}

const database = new Database(CONFIG);
const apiServer = new ApiServer(CONFIG, database);
apiServer.start();