"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KrakenMobile = void 0;
var TestScenario_1 = require("./TestScenario");
var FeatureReader_1 = require("./FeatureReader");
var KrakenMobile = /** @class */ (function () {
    function KrakenMobile() {
        this.scenariosQueue = [];
        this.buildScenariosQueue();
    }
    KrakenMobile.prototype.start = function () {
        this.executeNextScenario();
    };
    KrakenMobile.prototype.buildScenariosQueue = function () {
        var _this = this;
        var features = FeatureReader_1.FeatureReader.instance().getFeatureFiles();
        features.forEach(function (feature) {
            _this.scenariosQueue.push(new TestScenario_1.TestScenario(feature));
        });
    };
    KrakenMobile.prototype.executeNextScenario = function () {
        if (this.scenariosQueue.length <= 0) {
            return null;
        }
        var scenario = this.scenariosQueue.shift();
        if (!scenario) {
            return null;
        }
        scenario.run();
        return scenario;
    };
    return KrakenMobile;
}());
exports.KrakenMobile = KrakenMobile;
//# sourceMappingURL=KrakenMobile.js.map