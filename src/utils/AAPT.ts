import { FileHelper } from "./FileHelper";

const { execSync } = require("child_process");

export class AAPT {
    private static singletonInstance: AAPT;

    private constructor() { }

    public static instance(): AAPT {
        if (!AAPT.singletonInstance) {
            AAPT.singletonInstance = new AAPT();
        }
        return AAPT.singletonInstance;
    }

    apkInfo(apkPath: string): any {
        if (!FileHelper.instance().pathExists(apkPath)) {
            throw new Error(
                `ERROR: File or directory ${apkPath} does not exist`
            );
        }

        const aaptResult: string = execSync(`aapt dump badging ${apkPath}`).toString();
        return {
            apkLaunchActivity: this.extractApkLaunchActivityFromDumpBadging(aaptResult),
            apkPackage: this.extractApkPackageFromDumpBadging(aaptResult)
        }
    }

    private extractApkLaunchActivityFromDumpBadging(aapt: string) {
        let activity = aapt.trim().split('\n').find((line) => {
            let activityLine = line.match(/launchable-activity/);
            return activityLine;
        });

        if (activity) {
            let match: any = activity.match(/name=(.*) label/);
            if (match && match.length > 1) {
                activity = match[1].trim().replaceAll('\'', '');
            }
        };
        return activity;
    }

    private extractApkPackageFromDumpBadging(aapt: string) {
        let appPackage = aapt.trim().split('\n').find((line) => {
            let activityLine = line.match(/package/);
            return activityLine;
        });

        if (appPackage) {
            let match: any = appPackage.match(/name=(.*) versionCode/);
            if (match && match.length > 1) {
                appPackage = match[1].trim().replaceAll('\'', '');
            }
        };
        return appPackage;
    }
}
