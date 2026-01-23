
const conf = {
    mysql_db_uri: String(process.env.DATABASE_URI),
    mongo_db_uri: String(process.env.MONGODB_URI),
    jwt_secret: String(process.env.JWT_SECRET),
    logDirectory: String(process.env.LOG_DIR),
    environment: String(process.env.NODE_ENV),
    resend_api_key: String(process.env.RESEND_API_KEY),
    app_url: String(process.env.APP_URL)
}

export default conf
