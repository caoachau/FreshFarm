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
exports.__esModule = true;
exports.POST = void 0;
var server_1 = require("next/server");
var VIETQR_API_URL = "https://api.vietqr.io/v2/generate";
function POST(request) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var _d, amount, addInfo, clientId, apiKey, accountNo, accountName, acqId, payload, vietqrRes, err, data, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    _d = _e.sent(), amount = _d.amount, addInfo = _d.addInfo;
                    if (!amount || amount <= 0) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid amount" }, { status: 400 })];
                    }
                    clientId = process.env.VIETQR_CLIENT_ID;
                    apiKey = process.env.VIETQR_API_KEY;
                    accountNo = process.env.VIETQR_ACCOUNT_NO;
                    accountName = process.env.VIETQR_ACCOUNT_NAME;
                    acqId = process.env.VIETQR_ACQ_ID;
                    if (!clientId || !apiKey || !accountNo || !accountName || !acqId) {
                        console.error("VietQR env is not configured");
                        return [2 /*return*/, server_1.NextResponse.json({ error: "VietQR is not configured on server" }, { status: 500 })];
                    }
                    payload = {
                        accountNo: accountNo,
                        accountName: accountName,
                        acqId: Number(acqId),
                        amount: Math.round(amount),
                        addInfo: addInfo || "THANH TOAN DON HANG FRESHFARM",
                        format: "text",
                        template: "compact"
                    };
                    return [4 /*yield*/, fetch(VIETQR_API_URL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-client-id": clientId,
                                "x-api-key": apiKey
                            },
                            body: JSON.stringify(payload)
                        })];
                case 2:
                    vietqrRes = _e.sent();
                    if (!!vietqrRes.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, vietqrRes.json()["catch"](function () { return ({}); })];
                case 3:
                    err = _e.sent();
                    console.error("VietQR error:", err);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to generate VietQR", detail: err }, { status: 500 })];
                case 4: return [4 /*yield*/, vietqrRes.json()
                    // Chuẩn hoá lại response cho frontend
                ];
                case 5:
                    data = _e.sent();
                    // Chuẩn hoá lại response cho frontend
                    return [2 /*return*/, server_1.NextResponse.json({
                            raw: data,
                            qrData: ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.qrData) || ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.qrCode) || null,
                            qrImage: ((_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.qrDataURL) || null
                        })];
                case 6:
                    error_1 = _e.sent();
                    console.error("Error generating VietQR:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to generate VietQR" }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
