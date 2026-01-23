import conf from "@/src/conf/conf"
import fs from 'fs'
import path from "path"
import { createLogger, transports, format } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

const rootPath = process.cwd()
let logDir = path.join(rootPath, conf.logDirectory || 'logs')

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
}

const logLevel = conf.environment === 'development' ? 'debug' : 'info'

const fileTransport = new DailyRotateFile({
    level: logLevel,
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    handleExceptions: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
    )
})

export default createLogger({
    level: logLevel,
    defaultMeta: {
        service: 'app',
        env: conf.environment
    },
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.colorize(),
                format.printf(({ level, message, timestamp, stack }) =>
                    `${timestamp} [${level}]: ${stack || message}`
                )
            )
        }),
        fileTransport
    ],
    exceptionHandlers: [fileTransport],
    rejectionHandlers: [fileTransport],
    exitOnError: false
})
