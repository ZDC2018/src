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
var NewHousePanel = (function (_super) {
    __extends(NewHousePanel, _super);
    function NewHousePanel() {
        var _this = _super.call(this) || this;
        /**--------------------------新房子弹窗-------------------------------------------------------- */
        _this._newHousePanel = new egret.Sprite();
        return _this;
    }
    NewHousePanel.prototype.getNewHosuePanel = function (grade) {
        // console.log("打开新房子面板");
        this.addChild(this._newHousePanel);
        var newHouseBase = ResourceUtils.createBitmapByName("newhouses_base_png");
        newHouseBase.x = GameData.stageW / 2 - newHouseBase.width / 2;
        newHouseBase.y = GameData.startY - newHouseBase.height / 2;
        var newHouseMask = new egret.Shape();
        newHouseMask.graphics.beginFill(0x000000, 0.8);
        newHouseMask.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        newHouseMask.graphics.endFill();
        newHouseMask.alpha = 0.8;
        newHouseMask.touchEnabled = true;
        var availableBuyHouseArr = RES.getRes("available_buy_house_json");
        var houseNameLabel = new egret.TextField();
        houseNameLabel.text = availableBuyHouseArr[grade - 1].housename;
        houseNameLabel.textAlign = egret.HorizontalAlign.CENTER;
        houseNameLabel.fontFamily = "黑体";
        houseNameLabel.size = 30;
        houseNameLabel.textColor = 0XFFFFFF;
        houseNameLabel.width = 200;
        houseNameLabel.x = GameData.stageW / 2 - houseNameLabel.width / 2;
        houseNameLabel.y = newHouseBase.y + newHouseBase.height * 0.6;
        var mcData = RES.getRes("newhouse_json");
        var mcTexture = RES.getRes("newhouse_png");
        //创建动画工厂
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        var mc = new egret.MovieClip(mcDataFactory.generateMovieClipData("newhouse"));
        mc.x = GameData.stageW / 2 - 200;
        mc.y = GameData.stageH / 2 - 200;
        var newHouse = ResourceUtils.createBitmapByName("house#houses_a_" + this.addPreZero(grade) + "_big");
        newHouse.width = newHouse.height = 200;
        newHouse.x = GameData.stageW / 2 - newHouse.width / 2;
        newHouse.y = mc.y + mc.height / 2 - newHouse.height / 2 - 40;
        //房子等级
        var houseLevelLabel = new egret.TextField();
        houseLevelLabel.text = "LV " + grade.toString();
        houseLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
        houseLevelLabel.fontFamily = "黑体";
        houseLevelLabel.size = 30;
        houseLevelLabel.textColor = 0Xffffff;
        houseLevelLabel.width = newHouse.width;
        houseLevelLabel.x = newHouse.x;
        houseLevelLabel.y = newHouse.y + newHouse.height + 5;
        var shareBtn = ResourceUtils.createBitmapByName("lvup_obtain_png");
        shareBtn.x = GameData.stageW / 2 - shareBtn.width / 2;
        shareBtn.y = GameData.stageH - GameData.girdWidth * 1.575 - shareBtn.height;
        shareBtn.touchEnabled = true;
        shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);
        var newHouseCoin = ResourceUtils.createBitmapByName("ui_money_total_png");
        newHouseCoin.x = shareBtn.x - newHouseCoin.width / 2;
        newHouseCoin.y = shareBtn.y - newHouseCoin.height - 50;
        var buyHouseConfigArray = RES.getRes("housedown_config_json");
        this.housePrice = buyHouseConfigArray[GameData.maxHouseGrade].first_synthesis;
        var newHouseCoinLabel = new egret.TextField();
        newHouseCoinLabel.text = "X" + CommonFuction.numZero(this.housePrice);
        newHouseCoinLabel.textAlign = egret.HorizontalAlign.LEFT;
        newHouseCoinLabel.fontFamily = "黑体";
        newHouseCoinLabel.size = 48;
        newHouseCoinLabel.textColor = 0Xffffff;
        newHouseCoinLabel.x = newHouseCoin.x + newHouseCoin.width + 10;
        newHouseCoinLabel.y = newHouseCoin.y;
        var closeBtn = new egret.TextField();
        closeBtn.width = shareBtn.width;
        closeBtn.text = "跳过";
        closeBtn.textAlign = egret.HorizontalAlign.CENTER;
        closeBtn.fontFamily = "黑体";
        closeBtn.size = 36;
        closeBtn.textColor = 0Xffffff;
        closeBtn.x = shareBtn.x;
        closeBtn.y = shareBtn.y + shareBtn.height + 60;
        closeBtn.touchEnabled = true;
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeNewHousePanel, this);
        this._newHousePanel.addChild(newHouseMask);
        this._newHousePanel.addChild(newHouseBase);
        this._newHousePanel.addChild(houseNameLabel);
        this._newHousePanel.addChild(mc);
        mc.gotoAndPlay(1, -1);
        this._newHousePanel.addChild(newHouse);
        this._newHousePanel.addChild(houseLevelLabel);
        var waitTime = 0;
        if (!GameLogic.closeShare) {
            this._newHousePanel.addChild(shareBtn);
            waitTime = 3000;
        }
        else {
            waitTime = 500;
        }
        this._newHousePanel.addChild(newHouseCoin);
        this._newHousePanel.addChild(newHouseCoinLabel);
        this._idTimeout = egret.setTimeout(function () {
            this._newHousePanel.addChild(closeBtn);
        }, this, waitTime);
    };
    NewHousePanel.prototype.closeNewHousePanel = function () {
        // console.log("关闭新房子面板")
        SoundUtils.instance().playCloseSound();
        egret.clearTimeout(this._idTimeout);
        while (this._newHousePanel.numChildren) {
            this._newHousePanel.removeChildAt(0);
        }
        this.removeChild(this._newHousePanel);
        // this.timer.start();
    };
    NewHousePanel.prototype.share = function () {
        //console.log("新房子分享")
        platform.share("key=house");
        egret.localStorage.setItem("nhTime", new Date().getTime().toString());
    };
    NewHousePanel.prototype.addProfit = function () {
        // console.log("新房子获取收益");
        // console.log(this.housePrice);		
        GameData.coin = CommonFuction.jia(this.housePrice, GameData.coin.toString());
        this.closeNewHousePanel();
        // SoundUtils.instance().playCloseSound();
        // egret.clearTimeout(this._idTimeout);
        // while(this._newHousePanel.numChildren){
        //     this._newHousePanel.removeChildAt(0);
        // }
        // this.removeChild(this._newHousePanel);
        egret.localStorage.removeItem("nhTime");
    };
    NewHousePanel.prototype.getProfitNum = function () {
        return this.housePrice;
    };
    /**
     * 数字补零
     */
    NewHousePanel.prototype.addPreZero = function (num) {
        return ('00' + num).slice(-3);
    };
    return NewHousePanel;
}(egret.Sprite));
__reflect(NewHousePanel.prototype, "NewHousePanel");
//# sourceMappingURL=NewHousePanel.js.map