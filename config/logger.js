const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require('fs')

const env = global.isDebug ? 'development' : 'production'
const logDir = 'logs'

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    level: 'info',
    filename: `${logDir}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
})

const messageFmt = info => `${info.timestamp} [${info.level}] :: ${JSON.stringify(info.message)}`

const logger = createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(messageFmt)
    ),
    transports: [
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.printf(messageFmt)
            )
        }),
        dailyRotateFileTransport
    ]
})

module.exports = { logger }