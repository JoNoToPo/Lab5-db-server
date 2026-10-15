const CONFIG = {
    PORT: ProcessingInstruction.env.PORT || 3000,
    API_PREFIX: "/api/v1/sql",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || "*",

    DB_HOST: process.env.DB_HOST || "*",
    DB_PORT: process.env.DB_PORT || 3306,
    DB_NAME: process.env.DB_NAME || "lab5db",

    WRITER_USER: process.env
}