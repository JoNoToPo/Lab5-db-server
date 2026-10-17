// Attribution: Claude (Anthropic, https://claude.ai) was used as a reference for this code.

const http = require("http");
const CONFIG = require("./config");
const STRINGS = require("./strings");
const Database = require("./db");

class ApiServer {
    constructor(CONFIG, Database) {
        this.CONFIG = CONFIG;
        this.db = Database;
        this.server = http.createServer((req, res) => this.handle(req, res));
    }

    start() {
        this.server.listen(this.CONFIG.PORT, () => {
            console.log(STRINGS.SERVER_RUNNING.replace())
        })
    }
}