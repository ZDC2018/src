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
var WelcomeRetrunPanel = (function (_super) {
    __extends(WelcomeRetrunPanel, _super);
    function WelcomeRetrunPanel() {
        return _super.call(this) || this;
    }
    WelcomeRetrunPanel.prototype.show = function (secCoin, due) {
        //  console.log("显示欢迎回来面板")
        var panelBase = ResourceUtils.createBitmapByName("profit_base_png");
        panelBase.width = GameData.stageW * 3 / 4;
        panelBase.height = panelBase.width * 1.464;
        panelBase.x = GameData.stageW / 8;
        panelBase.y = (GameData.stageH - panelBase.height) / 2;
        this.addChild(panelBase);
        var currentTime = new Date().getTime();
        var timeDiffrent = Math.floor((currentTime - due) / 1000); //计算离线时间，单位秒
        if (timeDiffrent >= 8 * 60 * 60) {
            timeDiffrent = 8 * 60 * 60; //最多计算8小时的收益
        }
        this.profitNum = CommonFuction.cheng(secCoin, timeDiffrent.toString());
        var profit = this.numZero(this.profitNum);
        var profitLabel = new egret.TextField();
        profitLabel.text = profit;
        profitLabel.width = panelBase.width / 3 + panelBase.width / 10;
        profitLabel.x = panelBase.x + panelBase.width / 4;
        profitLabel.y = panelBase.y + panelBase.width - 3;
        profitLabel.fontFamily = "黑体";
        profitLabel.size = 50;
        profitLabel.textColor = 0xFFD7B7;
        profitLabel.textAlign = egret.HorizontalAlign.LEFT;
        this.addChild(profitLabel);
        var profitMultipLabel = new egret.TextField();
        profitMultipLabel.text = "X10";
        profitMultipLabel.width = panelBase.width / 5;
        profitMultipLabel.x = profitLabel.x + profitLabel.width + 5;
        profitMultipLabel.y = profitLabel.y;
        profitMultipLabel.fontFamily = "黑体";
        profitMultipLabel.size = 50;
        profitMultipLabel.textColor = 0xFFD83C;
        profitMultipLabel.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(profitMultipLabel);
        var getBtn = ResourceUtils.createBitmapByName("profit_receive_png");
        getBtn.width = panelBase.width / 2;
        getBtn.height = getBtn.width * 0.3125;
        getBtn.x = panelBase.x + (panelBase.width - getBtn.width) / 2;
        getBtn.y = panelBase.y + panelBase.height - getBtn.height * 3 / 2;
        getBtn.touchEnabled = true;
        getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getProfit, this);
        if (!GameLogic.closeShare) {
            this.addChild(getBtn);
        }
        var closeBtn = ResourceUtils.createBitmapByName("ranking_close_png");
        closeBtn.x = panelBase.x + panelBase.width - closeBtn.width - 4;
        closeBtn.y = panelBase.y + 4;
        closeBtn.touchEnabled = true;
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
        this.addChild(closeBtn);
    };
    WelcomeRetrunPanel.prototype.getProfit = function () {
        // console.log("获取收益");
        var shareResult = platform.share("key=welcome");
        egret.localStorage.setItem("wrpTime", new Date().getTime().toString());
        // GameData.coin += this.profitNum*10;
        // this.closePanel();
        // let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GET_PROFIT);
        // this.dispatchEvent(evt);
        // console.log(evt);
        /*
        if (share){
            let coinView = ResourceUtils.createBitmapByName("shop_money_01_png");
            coinView.x =  GameData.stageW/8+GameData.stageW*3/16;
            coinView.y = (GameData.stageH - GameData.stageW*3/4*1.464)/2;
            var txtView: egret.TextField = new egret.TextField;
            // txtView.textColor = 0xDC143C;
            txtView.textColor = 0xFFFFFF;
            txtView.text = this.numZero(this.profitNum*10);
            txtView.bold = true;
            txtView.size = 30;
            txtView.x = coinView.x +coinView.width;
            txtView.y = coinView.y;
            this.addChild(coinView);
            this.addChild(txtView);

            var twn: egret.Tween = egret.Tween.get(coinView);
            twn.wait(1000).to({ "alpha": 0.1 ,x:20,y:GameData.girdWidth -10,scaleX:1,scaleY:1}, 8000,egret.Ease.sineInOut).call(function () {
                this.removeChild(coinView);
            }, this);

            
            var twn: egret.Tween = egret.Tween.get(txtView);
            twn.wait(1000).to({ "alpha": 0.1 ,x:20+GameData.girdWidth/3,y:GameData.girdWidth -10,scaleX:1,scaleY:1}, 8000,egret.Ease.sineInOut).call(function () {
                this.removeChild(txtView);
            }, this);
        }
        */
    };
    WelcomeRetrunPanel.prototype.closePanel = function () {
        // console.log("关闭欢迎回来面板");
        while (this.numChildren) {
            this.removeChildAt(0);
        }
        egret.localStorage.removeItem("wrpTime");
    };
    WelcomeRetrunPanel.prototype.addProfit = function () {
        // console.log("增加收益")
        var profitNumString = CommonFuction.cheng(this.profitNum, '10');
        GameData.coin = CommonFuction.jia(GameData.coin, CommonFuction.cheng(this.profitNum, '10'));
    };
    WelcomeRetrunPanel.prototype.getProfitNum = function () {
        return CommonFuction.cheng(this.profitNum, '10');
    };
    /**
     * 数字去零计算
     */
    WelcomeRetrunPanel.prototype.numZero = function (num) {
        // console.log("数字去0计算"+num);
        var numString;
        if (typeof (num) == "number") {
            numString = Math.floor(num).toString();
        }
        else {
            // numString = num.split(".")[0];
            numString = num;
        }
        var zeroConfigArr = RES.getRes("zero_config_json");
        var numLength = numString.length;
        var zeroNumber = Math.floor((numLength - 1) / 3);
        if (zeroNumber > 0) {
            numString = numString.slice(0, -1 * zeroNumber * 3) + "." + numString.slice(numLength - zeroNumber * 3, numLength - zeroNumber * 3 + 2) + zeroConfigArr[zeroNumber - 1].company;
        }
        else {
            numString = num.toString();
        }
        return numString;
    };
    return WelcomeRetrunPanel;
}(egret.Sprite));
__reflect(WelcomeRetrunPanel.prototype, "WelcomeRetrunPanel");
//# sourceMappingURL=WelcomeRetrunPanel.js.map