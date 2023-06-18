require("dotenv").config();

const mongoDb = {
    connectionString : process.env.MONGO_CONNECTION_STRING
}

const redis = {
    connectionString : process.env.REDIS_CONNECTION_STRING
}

export {
    mongoDb,
    redis
}