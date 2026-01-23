import "server-only"
import mongoose, { Mongoose } from "mongoose"
import conf from "../conf/conf"

const MONGODB_URI = conf.mongo_db_uri
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}

mongoose.set("bufferCommands", false)

type MongooseCache = {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached = globalThis.mongoose ??= {
  conn: null,
  promise: null,
}

export async function connectToDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'radius_buy_test',
      maxPoolSize: 10,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
