/**
 * Centralized logging utility with environment-based log levels
 * 
 * Log Levels (in order of severity):
 * - DEBUG: Detailed information for debugging (development only)
 * - INFO: General informational messages
 * - WARN: Warning messages for potentially harmful situations
 * - ERROR: Error messages for error events
 * 
 * In production builds, only INFO, WARN, and ERROR logs are shown.
 * In development, all log levels including DEBUG are shown.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private currentLevel: LogLevel;

  constructor() {
    // Set log level based on environment
    // Production: INFO and above (suppress DEBUG)
    // Development: DEBUG and above (show everything)
    this.currentLevel = process.env.NODE_ENV === 'production' 
      ? LogLevel.INFO 
      : LogLevel.DEBUG;
  }

  /**
   * Check if a log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: string, message: string, ...args: any[]): [string, ...any[]] {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      return [`[${timestamp}] [${level}] ${message}`, ...args];
    }
    return [message, ...args];
  }

  /**
   * Debug level logging - only shown in development
   * Use for detailed debugging information
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(...this.formatMessage('DEBUG', message, ...args));
    }
  }

  /**
   * Info level logging - shown in production
   * Use for general informational messages
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(...this.formatMessage('INFO', message, ...args));
    }
  }

  /**
   * Warning level logging - shown in production
   * Use for potentially harmful situations
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(...this.formatMessage('WARN', message, ...args));
    }
  }

  /**
   * Error level logging - shown in production
   * Use for error events
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(...this.formatMessage('ERROR', message, ...args));
    }
  }

  /**
   * Set the current log level programmatically
   * Useful for testing or dynamic configuration
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Get the current log level
   */
  getLevel(): LogLevel {
    return this.currentLevel;
  }
}

// Export a singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
};

