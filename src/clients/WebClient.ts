import { remote } from 'webdriverio';
import { ClientInterface } from '../interfaces/ClientInterface';
import { Device } from '../devices/Device';

export class WebClient implements ClientInterface {
    deviceId: string;
    browserName: string;
    private browser: any;
    

    constructor(browserName: string, deviceId?: string, ) {
        this.browserName = browserName;
        this.deviceId = deviceId || Device.generateRandomId();
    }

    async start() {
        this.browser =  await remote({
            capabilities: {
                browserName: this.browserName
            }
        });
        return this.browser;
    }

    async stop() {
        await this.browser.deleteSession()
    }
}
