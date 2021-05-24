import { FeatureFile } from './FeatureFile';
export declare class FeatureReader {
    private static singletonInstance;
    private fileHelper;
    private constructor();
    static instance(): FeatureReader;
    getFeatureFiles(): FeatureFile[];
}
//# sourceMappingURL=FeatureReader.d.ts.map