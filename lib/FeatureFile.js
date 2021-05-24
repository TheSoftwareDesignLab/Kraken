"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFile = void 0;
var Gherkin = require("@cucumber/gherkin");
var Messages = require("@cucumber/messages");
var FeatureFile = /** @class */ (function () {
    function FeatureFile(filePath) {
        this.filePath = filePath;
        var uuidFn = Messages.IdGenerator.uuid();
        var builder = new Gherkin.AstBuilder(uuidFn);
        var matcher = new Gherkin.GherkinClassicTokenMatcher();
        var parser = new Gherkin.Parser(builder, matcher);
        var gherkinDocument = parser.parse("Feature: ...");
        var pickles = Gherkin.compile(gherkinDocument, this.filePath, uuidFn);
        console.log(pickles);
    }
    return FeatureFile;
}());
exports.FeatureFile = FeatureFile;
//# sourceMappingURL=FeatureFile.js.map