import { exec, execSync } from "child_process";

export class DependencyChecker {
    private static singletonInstance: DependencyChecker;

    constructor() {}

    public static instance(): DependencyChecker {
        if (!DependencyChecker.singletonInstance) {
            DependencyChecker.singletonInstance = new DependencyChecker();
        }
        return DependencyChecker.singletonInstance;
    }

    checkDependencies() {
        let installedText = 'Installed';
        let notInstalledText = 'Not installed';
        console.log('Checking dependencies...');
        console.log(`Android SDK [${this.isAndroidSdkInstalled() ? installedText : notInstalledText}] (Required only for mobile testing - ANDROID_HOME)`)
        console.log(`Android ADB [${this.isAdbInstalled() ? installedText : notInstalledText}] (Required only for mobile testing - ANDROID_HOME/tools and ANDROID_HOME/platform-tools)`)
        console.log(`Android AAPT [${this.isAaptInstalled() ? installedText : notInstalledText}] (Required only for Kraken's info command - ANDROID_HOME/build-tools/:version)`)
        console.log(`Appium [${this.isAppiumInstalled() ? installedText : notInstalledText}] (Required only for mobile testing)`)
        console.log(`Java [${this.isJavaInstalled() ? installedText : notInstalledText}] (JAVA_HOME)`)
        console.log('Done.')
    }

    isAndroidSdkInstalled(): Boolean {
        let adb_path = process.env.ANDROID_HOME;
        return adb_path != undefined && adb_path != null;
    }

    isAaptInstalled(): Boolean {
        try {
            let aaptVersion = execSync('aapt version');
            return aaptVersion != undefined && aaptVersion != null;
        } catch(error) {
            return false;
        }
    }

    isAdbInstalled(): Boolean {
        try {
            let adbVersion = execSync('adb version');
            return adbVersion != undefined && adbVersion != null;
        } catch (error) {
            return false;
        }
    }

    isJavaInstalled(): Boolean {
        let java_path = process.env.JAVA_HOME;
        return java_path != undefined && java_path != null;
    }

    isAppiumInstalled(): Boolean {
        try {
            let appiumVersion = execSync('appium -v');
            return appiumVersion != undefined && appiumVersion != null;
        } catch (error) {
            return false;
        }        
    }
}