const mysql = require("mysql2/promise");

class Database {
    constructor(config) {
        this.config = config;

        const common = {
            host: config.DB_HOST,
            port: config.DB_PORT,
            database: config.DB_NAME,
            connectionLimit: 5,
            dateStrings: true,
            // Default is already false, stated explicitly: one statement per
            // request, so "SELECT 1; DROP TABLE patient" is rejected outright.
            multipleStatements: false
        };

        this.writerPool = mysql.createPool({
            ...common,
            user: config.WRITER_USER,
            password: config.WRITER_PASSWORD
        });

        this.readerPool = mysql.createPool({
            ...common,
            user: config.READER_USER,
            password: config.READER_PASSWORD
        })
    }

    async ensurePatientTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS patient (
                patientid   INT(11) NOT NULL AUTO_INCREMENT,
                name        VARCHAR(100) NOT NULL,
                dateOfBirth DATETIME NOT NULL,
                PRIMARY KEY (patientid)
            ) ENGINE=InnoDB`;
        await this.writerPool.query(sql);
    }

    async insertPatients(rows) {
        await this.ensurePatientTable();
        const values = rows.map((row) => [row.name, row.dateOfBirth]);
        const [result] = await this.writerPool.query(
            "INSERT INTO patient (name, dateOfBirth) VALUES ?",
            [values]
        );
        return result.affectedRows;
    }

    async runReadQuery(sql) {
        const [rows] = await this.readerPool.query(sql);
        return rows;
    }
}

module.exports = Database;