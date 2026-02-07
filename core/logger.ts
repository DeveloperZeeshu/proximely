import conf from "@/conf/conf"
import { createLogger, transports, format } from "winston"

const isProd = conf.environment === 'production'
const logLevel = conf.environment === 'development' ? 'debug' : 'info'

const loggerTransports: any[] = [
    new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            isProd ? format.json() : format.colorize(),
            format.printf(({ level, message, timestamp, stack }) =>
                `${timestamp} [${level}]: ${stack || message}`
            )
        )
    })
]

if (!isProd) {
    const fs = require('fs')
    const path = require('path')
    const DailyRotateFile = require('winston-daily-rotate-file')

    const rootPath = process.cwd()
    const logDir = path.join(rootPath, conf.logDirectory || 'logs')

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
    }

    loggerTransports.push(
        new DailyRotateFile({
            level: logLevel,
            filename: path.join(logDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            handleExceptions: true,
            handleRejections: true,
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.json()
            )
        })
    )
}

const logger = createLogger({
    level: logLevel,
    defaultMeta: {
        service: 'app',
        env: conf.environment
    },
    transports: loggerTransports,
    exitOnError: false
})

export default logger
