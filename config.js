// Claude was used as reference

const CONFIG = {
    PORT: process.env.PORT || 3000,
    API_PREFIX: "/lab5/api/v1/sql",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || "*",
    MAX_BODY_BYTES: 1000,

    DB_HOST: process.env.DB_HOST || "*",
    DB_PORT: process.env.DB_PORT || 3306,
    DB_NAME: process.env.DB_NAME || "lab5db",

    WRITER_USER: process.env.DB_WRITER_USER || "lab5_writer",
    WRITER_PASSWORD: process.env.DB_WRITER_PASSWORD || "securepassword123",

    READER_USER: process.env.DB_READER_USER || "lab5_reader",
    READER_PASSWORD: process.env.DB_READER_PASSWORD || "securepassword321"
}

module.exports = CONFIG;