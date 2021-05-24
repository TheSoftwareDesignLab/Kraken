"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
var fs = require("fs");
var FileHelper = /** @class */ (function () {
    function FileHelper() {
    }
    FileHelper.instance = function () {
        if (!FileHelper.singletonInstance) {
            FileHelper.singletonInstance = new FileHelper();
        }
        return FileHelper.singletonInstance;
    };
    FileHelper.prototype.directoryPathExists = function (path) {
        return fs.existsSync(path);
    };
    FileHelper.prototype.filesInPath = function (path) {
        return fs.readdirSync(path);
    };
    FileHelper.prototype.featureFilesInPath = function (path) {
        var filesInFeaturePath = this.filesInPath(path);
        return filesInFeaturePath.filter(function (fileName) {
            return fileName.match(/\.feature$/);
        });
    };
    return FileHelper;
}());
exports.FileHelper = FileHelper;
//# sourceMappingURL=FileHelper.js.map