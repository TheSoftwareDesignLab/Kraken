import { remote } from 'webdriverio';
import { Client } from './Client';

export class WebClient extends Client {
    browserName: string;
    otherParams: any;
    private browser: any;
    
    constructor(browserName: string, otherParams?: any, id?: string) {
        super(id);
        this.browserName = browserName;
        this.otherParams = otherParams;
    }

    async start(): Promise<any> {
        this.createInbox();
        this.browser =  await remote({
            capabilities: this.capabilities()
        }, (client: any) => {
            client.readSignal = this.readSignal.bind(this);
            client.writeSignal = this.writeSignal.bind(this);
            client.lastSignal = this.inboxLastSignal.bind(this);
            return client;
        });
        return this.browser;
    }

    private capabilities(): any {
        return {
            browserName: this.browserName,
            ...this.otherParams
        }
    }

    async stop(): Promise<any> {
        this.deleteInbox();
        await this.browser.deleteSession();
    }
}
