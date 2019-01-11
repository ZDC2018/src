var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
/**
 * Created by Channing on 2014/9/17.
 * Edited by bigfootzq on 2018/09/18
 */
var GameStartView = (function (_super) {
    __extends(GameStartView, _super);
    function GameStartView() {
        var _this = _super.call(this) || this;
        _this.initView();
        return _this;
    }
    GameStartView.prototype.initView = function () {
        //console.log("GameStartView初始化");
        var bg = ResourceUtils.createBitmapByName("loading_base_png");
        bg.width = GameData.scentWidth;
        bg.height = GameData.scentHeight;
        var bgLogo = ResourceUtils.createBitmapByName("loading_logo_png");
        bgLogo.width = GameData.scentWidth * 0.95;
        bgLogo.height = bgLogo.width * 1.167;
        bgLogo.x = (GameData.scentWidth - bgLogo.width) / 2;
        bgLogo.y = bgLogo.x * 2;
        this.addChild(bg);
        this.addChild(bgLogo);
        var start_btn = new MyButtonForGame("loading_start_png", "loading_start_png");
        this.addChild(start_btn);
        var _swidth = GameData.scentWidth / 2 - start_btn.width / 2;
        var _sheight = GameData.scentHeight * 3 / 4 - start_btn.height;
        start_btn.x = _swidth;
        start_btn.y = _sheight;
        // //console.log(start_btn.y);
        this.userInfoButton = platform.createUserInfoButton();
        //console.log(this.userInfoButton);           
        start_btn.setClick(this.showStartView.bind(this));
        this.thisContainer = new egret.Sprite();
        this.addChild(this.thisContainer);
        // this.onShow().then(oldData =>{
        // 	GameData.closeMusic = oldData.closeMusic?oldData.closeBgMusic:false;
        // 	GameData.closeBgMusic = oldData.closeBgMusic?oldData.closeBgMusic:false;
        // 	GameData.curretLevel = 3;
        // 	GameData.levelExp = oldData.levelExp;
        // 	GameData.coin = Number(oldData.coin)?Number(oldData.coin):0;
        // 	let secCoin = Number(oldData.secCoin);
        // 	let due = oldData.due;
        //     GameData.oldElements = JSON.parse(oldData.inMap);
        // 	GameData.maxHouseGrade = oldData.maxHouseGrade?oldData.maxHouseGrade:1;
        // 	GameData.houseBuyNumber = oldData.buyHouseNumber;
        // 	//console.log("获取旧数据后的关卡："+GameData.curretLevel);
        // 	//console.log("获取旧数据后的关卡："+GameData.oldElements);
        // });
    };
    GameStartView.prototype.showStartView = function () {
        if (this.parent)
            this.parent.removeChild(this);
        GameSceneView.game.start();
        this.userInfoButton.hide();
    };
    GameStartView.prototype.onShow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wxData, userGameData, oldData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wxData = platform.getLaunchOptionsSync();
                        if (!wxData) return [3 /*break*/, 2];
                        return [4 /*yield*/, platform.getGameData("userGameData")];
                    case 1:
                        userGameData = _a.sent();
                        oldData = userGameData[0];
                        //console.log(oldData);
                        return [2 /*return*/, oldData];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    GameStartView.prototype.showOtherView = function () {
        //EgretShare.moreGame();
    };
    return GameStartView;
}(egret.Sprite));
__reflect(GameStartView.prototype, "GameStartView");
//# sourceMappingURL=GameStartView.js.map