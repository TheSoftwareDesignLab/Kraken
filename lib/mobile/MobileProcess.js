"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileProcess = void 0;
var remote = require('webdriverio').remote;
var exec = require("child_process").exec;
var portfinder = require('portfinder');
var MobileProcess = /** @class */ (function () {
    function MobileProcess(deviceId) {
        this.deviceId = deviceId;
        this.defaultClientTimout = 60000;
    }
    MobileProcess.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.availablePort()];
                    case 1:
                        _a.port = _b.sent();
                        this.proc = exec("appium -p " + this.port);
                        this.proc.stdout.on('data', this.onStdout.bind(this));
                        this.proc.stderr.on('data', this.onStderr.bind(this));
                        this.clientStartingTime = Date.now();
                        return [2 /*return*/, new Promise(this.waitForClientToStart.bind(this))];
                }
            });
        });
    };
    MobileProcess.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.deleteSession()];
                    case 1:
                        _a.sent();
                        this.proc.kill('SIGINT');
                        return [2 /*return*/];
                }
            });
        });
    };
    // Helpers
    MobileProcess.prototype.generaOpts = function (udid) {
        return {
            path: '/wd/hub',
            port: this.port,
            capabilities: {
                platformName: "Android",
                deviceName: "Android Emulator",
                app: "./app.apk",
                appPackage: "es.usc.citius.servando.calendula",
                appActivity: "es.usc.citius.servando.calendula.activities.StartActivity",
                automationName: "UiAutomator2",
                udid: udid
            }
        };
    };
    ;
    MobileProcess.prototype.availablePort = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        portfinder.basePort = 8000;
                        portfinder.highestPort = 8100;
                        return [4 /*yield*/, portfinder.getPortPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileProcess.prototype.startProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("Starting process on device: " + this.deviceId);
                        _a = this;
                        return [4 /*yield*/, remote(this.generaOpts(this.deviceId))];
                    case 1:
                        _a.client = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileProcess.prototype.waitForClientToStart = function (resolve, reject) {
        if (this.client) {
            resolve(this.client);
        }
        else if ((Date.now() - this.clientStartingTime) >= this.defaultClientTimout) {
            reject(new Error("Timeout"));
        }
        else {
            setTimeout(this.waitForClientToStart.bind(this, resolve, reject), 2000);
        }
    };
    MobileProcess.prototype.onStdout = function (data) {
        var dataText = data.toString();
        if (dataText.includes("started on 0.0.0.0:" + this.port)) {
            this.startProcess();
        }
    };
    MobileProcess.prototype.onStderr = function (data) {
        var dataText = data.toString();
        console.log("Error starting process on device: " + this.deviceId);
        console.log(dataText);
        this.proc.kill('SIGINT');
    };
    return MobileProcess;
}());
exports.MobileProcess = MobileProcess;
//# sourceMappingURL=MobileProcess.js.map