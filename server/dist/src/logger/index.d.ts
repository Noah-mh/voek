declare const log: import("pino").Logger<{
    transport: {
        target: string;
    };
    base: {
        pid: boolean;
    };
    timestamp: () => string;
}>;
export default log;
