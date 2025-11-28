export const logger = {
    info: (message: string, context?: Record<string, unknown>) =>
        console.log(JSON.stringify({ level: "info", message, timestamp: new Date().toISOString(), context })),
    warn: (message: string, context?: Record<string, unknown>) =>
        console.warn(JSON.stringify({ level: "warn", message, timestamp: new Date().toISOString(), context })),
    error: (message: string, context?: Record<string, unknown>) =>
        console.error(JSON.stringify({ level: "error", message, timestamp: new Date().toISOString(), context })),
};
