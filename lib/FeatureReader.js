"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureReader = void 0;
var FileHelper_1 = require("./FileHelper");
var FeatureFile_1 = require("./FeatureFile");
var FeatureReader = /** @class */ (function () {
    function FeatureReader() {
        this.fileHelper = FileHelper_1.FileHelper.instance();
    }
    FeatureReader.instance = function () {
        if (!FeatureReader.singletonInstance) {
            FeatureReader.singletonInstance = new FeatureReader();
        }
        return FeatureReader.singletonInstance;
    };
    FeatureReader.prototype.getFeatureFiles = function () {
        var currentDirectoryPath = process.cwd();
        var expectedFeaturesPath = currentDirectoryPath + "/features";
        if (!this.fileHelper.directoryPathExists(expectedFeaturesPath)) {
            throw new Error("ERROR: File or directory " + expectedFeaturesPath + " does not exist");
        }
        var featuresInPath = this.fileHelper.featureFilesInPath(expectedFeaturesPath);
        return featuresInPath.map(function (featureFileName) {
            return new FeatureFile_1.FeatureFile(featureFileName);
        });
    };
    return FeatureReader;
}());
exports.FeatureReader = FeatureReader;
//# sourceMappingURL=FeatureReader.js.map