import { remote } from 'webdriverio';
import { Client } from './Client';

export class WebClient extends Client {
    browserName: string;
    private browser: any;
    
    constructor(browserName: string, id?: string) {
        super(id);
        this.browserName = browserName;
    }

    async start(): Promise<any> {
        this.createInbox();
        this.browser =  await remote({
            capabilities: {
                browserName: this.browserName
            }
        }, (client: any) => {
            client.readSignal = this.readSignal.bind(this);
            client.writeSignal = this.writeSignal.bind(this);
            return client;
        });
        return this.browser;
    }

    async stop(): Promise<any> {
        this.deleteInbox();
        await this.browser.deleteSession();
    }
}
