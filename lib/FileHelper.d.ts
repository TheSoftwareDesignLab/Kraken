export declare class FileHelper {
    private static singletonInstance;
    private constructor();
    static instance(): FileHelper;
    directoryPathExists(path: string): boolean;
    filesInPath(path: string): string[];
    featureFilesInPath(path: string): string[];
}
//# sourceMappingURL=FileHelper.d.ts.map