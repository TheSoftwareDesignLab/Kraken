export interface ClientInterface {
    start(): Promise<any>;
    stop(): Promise<any>;
}
