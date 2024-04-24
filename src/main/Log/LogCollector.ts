import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
class Logger {
  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger()
    }
    return this.instance
  }
  private static instance: Logger | undefined
  private logger: WinstonLogger;
  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      transports: [
        new transports.File({ filename: 'errors.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        })
      ]
    });
  }
  private sendToRenderer(level: string, message: string, meta: any) {
    
  }
  public info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
    this.sendToRenderer('info', message, meta);
  }

  public warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
    this.sendToRenderer('warn', message, meta);
  }

  public error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
    this.sendToRenderer('error', message, meta);
  }

  public debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
    this.sendToRenderer('debug', message, meta);
  }
}
export const logger = Logger.getInstance();