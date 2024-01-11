import winston from "winston";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export class AppLogger {
  private static instance: AppLogger;
  private logger: winston.Logger;

  private constructor() {
    let loggerFormat = winston.format.printf(({ level, message, timestamp, filename }) => {
      return `\n[${level.toUpperCase()}] ${timestamp} ${filename}\n${message}`;
    });

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json(), loggerFormat),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${process.env.LOG_PATH}\\${process.env.LOG_FILE_NAME}`,
          maxsize: parseInt(process.env.LOG_MAX_FILE_SIZE as string),
          maxFiles: parseInt(process.env.LOG_MAX_FILE_COUNT as string),
        }),
      ],
    });
  }

  public static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger();
    }

    return AppLogger.instance;
  }

  public getLogger(fileName: string): winston.Logger {
    return this.logger.child({ filename: fileName });
  }
}
