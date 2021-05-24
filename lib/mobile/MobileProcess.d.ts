export declare class MobileProcess {
    deviceId: string;
    port: any;
    proc: any;
    private client;
    private defaultClientTimout;
    private clientStartingTime;
    constructor(deviceId: string);
    start(): Promise<unknown>;
    stop(): Promise<void>;
    generaOpts(udid: string): {
        path: string;
        port: any;
        capabilities: {
            platformName: string;
            deviceName: string;
            app: string;
            appPackage: string;
            appActivity: string;
            automationName: string;
            udid: string;
        };
    };
    availablePort(): Promise<any>;
    private startProcess;
    private waitForClientToStart;
    private onStdout;
    private onStderr;
}
//# sourceMappingURL=MobileProcess.d.ts.map