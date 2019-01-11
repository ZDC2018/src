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
var LevelUpPanel = (function (_super) {
    __extends(LevelUpPanel, _super);
    function LevelUpPanel() {
        return _super.call(this) || this;
    }
    LevelUpPanel.prototype.show = function () {
        //console.log("显示城市升级面板")
        var LevelUpMask = new egret.Shape();
        LevelUpMask.graphics.beginFill(0x000000, 0.8);
        LevelUpMask.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        LevelUpMask.graphics.endFill();
        LevelUpMask.alpha = 0.8;
        LevelUpMask.touchEnabled = true;
        var LevelUpEffect = ResourceUtils.createBitmapByName("effect_lvup_b_08_png");
        LevelUpEffect.x = GameData.stageW / 2 - LevelUpEffect.width / 2;
        LevelUpEffect.y = GameData.girdWidth + 20;
        this.addChild(LevelUpMask);
        this._mcData = RES.getRes("effect_lvup_json");
        this._mcTexture = RES.getRes("effect_lvup_png");
        //创建动画工厂
        var mcDataFactory = new egret.MovieClipDataFactory(this._mcData, this._mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        var mc1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("level_up_a"));
        var mc2 = new egret.MovieClip(mcDataFactory.generateMovieClipData("level_up_b"));
        mc1.x = mc2.x = GameData.stageW / 2 - LevelUpEffect.width / 2;
        mc1.y = mc2.y = GameData.girdWidth + 20;
        this.addChild(mc2); //a上层，b下层
        this.addChild(mc1);
        //添加播放完成事件
        mc1.addEventListener(egret.Event.COMPLETE, function () {
            // egret.log("1,COMPLETE");
            this.removeChild(mc1);
        }, this);
        // //添加循环播放完成事件
        // mc1.addEventListener(egret.Event.LOOP_COMPLETE, function (){
        //     egret.log("1,LOOP_COMPLETE");
        // }, this);
        //  //添加播放完成事件
        // mc2.addEventListener(egret.Event.COMPLETE, function (){
        //     egret.log("2,COMPLETE");
        //     mc2.gotoAndStop(8);
        // }, this);
        // //添加循环播放完成事件
        // mc2.addEventListener(egret.Event.LOOP_COMPLETE, function (){
        //     egret.log("2,LOOP_COMPLETE");
        // }, this);
        //播放升级动画
        // mc1.gotoAndStop(4);
        mc1.gotoAndPlay(1);
        mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, function (e) {
            // //console.log(e.type,e.frameLabel, mc1.currentFrame);//frame_label @fall 6
            mc2.gotoAndPlay(1);
        }, this);
        // mc1.play();
        var currentLevelLabel = new egret.TextField();
        currentLevelLabel.text = GameData.currentLevel.toString();
        currentLevelLabel.width = GameData.girdWidth * 3 / 4;
        currentLevelLabel.x = LevelUpEffect.x + LevelUpEffect.width / 2 - currentLevelLabel.width / 2;
        currentLevelLabel.y = LevelUpEffect.y + LevelUpEffect.height * 0.44 - currentLevelLabel.height / 2;
        currentLevelLabel.fontFamily = "黑体";
        if (GameData.currentLevel <= 100) {
            currentLevelLabel.size = 40;
        }
        else {
            currentLevelLabel.size = 32;
        }
        currentLevelLabel.textColor = 0x2F8ED1;
        currentLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(currentLevelLabel);
        var newMap = "";
        var str = "";
        if (GameData.currentLevel < 10) {
            switch (GameData.currentLevel) {
                case 2:
                    newMap = "14、15";
                    break;
                case 3:
                    newMap = "2、3";
                    break;
                case 4:
                    newMap = "18、19";
                    break;
                case 5:
                    newMap = "1、4";
                    break;
                case 6:
                    newMap = "5、8";
                    break;
                case 7:
                    newMap = "9、12";
                    break;
                case 8:
                    newMap = "13、16";
                    break;
                case 9:
                    newMap = "17、20";
                    break;
            }
            str = "解锁：                \n\n1，第" + newMap + "地块\n";
        }
        else {
            if (GameData.currentLevel == 11) {
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁黄金农场背景";
            }
            else if (GameData.currentLevel == 21) {
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁塞北雪乡背景";
            }
            else if (GameData.currentLevel == 31) {
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁缤纷小镇背景";
            }
            else if (GameData.currentLevel == 41) {
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁不夜之城背景";
            }
            else {
                str = "解锁：\n\n1，所有地块都已经解锁\n";
            }
        }
        var LevelUpLabel = new egret.TextField();
        LevelUpLabel.text = str;
        LevelUpLabel.width = GameData.stageW / 2;
        LevelUpLabel.x = GameData.stageW / 2 - LevelUpLabel.width / 2;
        LevelUpLabel.y = LevelUpEffect.y + LevelUpEffect.height * 3 / 4;
        LevelUpLabel.fontFamily = "黑体";
        LevelUpLabel.size = 30;
        LevelUpLabel.textColor = 0xFFFFFF;
        LevelUpLabel.textAlign = egret.HorizontalAlign.CENTER;
        // this.addChild(LevelUpLabel);//不加了
        var getBtn = ResourceUtils.createBitmapByName("lvup_obtain_png");
        getBtn.x = GameData.stageW / 2 - getBtn.width / 2;
        getBtn.y = GameData.stageH - GameData.girdWidth * 1.575 * 2 - getBtn.height;
        getBtn.touchEnabled = true;
        getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);
        var LevelUpProfitTextLabel = new egret.TextField();
        LevelUpProfitTextLabel.text = "升级福利";
        LevelUpProfitTextLabel.width = GameData.girdWidth * 5 / 4;
        LevelUpProfitTextLabel.height = GameData.girdWidth / 3;
        LevelUpProfitTextLabel.x = GameData.stageW / 2 - LevelUpLabel.width / 2;
        LevelUpProfitTextLabel.y = getBtn.y - LevelUpProfitTextLabel.height - 30;
        LevelUpProfitTextLabel.fontFamily = "黑体";
        LevelUpProfitTextLabel.size = 35;
        LevelUpProfitTextLabel.textColor = 0xFFE974;
        LevelUpProfitTextLabel.textAlign = egret.HorizontalAlign.LEFT;
        // this.addChild(LevelUpProfitTextLabel);
        var LevelUpCoin = ResourceUtils.createBitmapByName("ui_money_total_png");
        LevelUpCoin.x = LevelUpProfitTextLabel.x + LevelUpProfitTextLabel.width + 20;
        LevelUpCoin.x = getBtn.x;
        LevelUpCoin.y = LevelUpProfitTextLabel.y - (LevelUpCoin.height - LevelUpProfitTextLabel.height) / 2;
        // LevelUpCoin.width = LevelUpCoin.height =  LevelUpProfitTextLabel.height;
        this.addChild(LevelUpCoin);
        //奖励玩家当前可购买最大的房子金币*2
        var buyHouseConfigArray = RES.getRes("buy_house_config_json");
        var availableBuyHouseGrade = 1;
        if (GameData.maxHouseGrade >= 4) {
            availableBuyHouseGrade = GameData.maxHouseGrade - 2;
        }
        else {
            availableBuyHouseGrade = 1;
        }
        this.levelUpProfit = CommonFuction.cheng(buyHouseConfigArray[availableBuyHouseGrade - 1].coinNum, 2);
        var LevelUpProfitLabel = new egret.TextField();
        LevelUpProfitLabel.text = CommonFuction.numZero(this.levelUpProfit);
        LevelUpProfitLabel.width = GameData.girdWidth * 2;
        LevelUpProfitLabel.height = GameData.girdWidth / 3;
        LevelUpProfitLabel.x = LevelUpCoin.x + LevelUpCoin.width + 20;
        LevelUpProfitLabel.y = getBtn.y - LevelUpProfitLabel.height - 28;
        LevelUpProfitLabel.fontFamily = "黑体";
        LevelUpProfitLabel.size = 35;
        LevelUpProfitLabel.textColor = 0xFFE974;
        LevelUpProfitLabel.textAlign = egret.HorizontalAlign.LEFT;
        this.addChild(LevelUpProfitLabel);
        var waitTime = 0;
        if (!GameLogic.closeShare) {
            this.addChild(getBtn);
            waitTime = 3000;
        }
        else {
            waitTime = 500;
        }
        var closeBtn = new egret.TextField();
        closeBtn.width = getBtn.width;
        closeBtn.text = "跳过";
        closeBtn.textAlign = egret.HorizontalAlign.CENTER;
        closeBtn.fontFamily = "黑体";
        closeBtn.size = 36;
        closeBtn.textColor = 0Xffffff;
        closeBtn.x = getBtn.x;
        closeBtn.y = getBtn.y + getBtn.height + 40;
        closeBtn.touchEnabled = true;
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
        this._idTimeout = egret.setTimeout(function () {
            this.addChild(closeBtn);
        }, this, waitTime);
    };
    LevelUpPanel.prototype.share = function () {
        platform.share("key=welcome");
        egret.localStorage.setItem("luTime", new Date().getTime().toString());
    };
    LevelUpPanel.prototype.getLevelUpProfit = function () {
        // console.log("获取升级金币");
        this.closePanel();
        // console.log(this.levelUpProfit);
        GameData.coin = CommonFuction.jia(this.levelUpProfit, GameData.coin.toString());
        SoundUtils.instance().playCloseSound();
        egret.clearTimeout(this._idTimeout);
        while (this.numChildren) {
            this.removeChildAt(0);
        }
        egret.localStorage.removeItem("luTime");
    };
    LevelUpPanel.prototype.getProfitNum = function () {
        return this.levelUpProfit;
    };
    LevelUpPanel.prototype.closePanel = function () {
        //console.log("关闭城市升级面板");
        SoundUtils.instance().playCloseSound();
        egret.clearTimeout(this._idTimeout);
        while (this.numChildren) {
            this.removeChildAt(0);
        }
    };
    return LevelUpPanel;
}(egret.Sprite));
__reflect(LevelUpPanel.prototype, "LevelUpPanel");
//# sourceMappingURL=LevelUpPanel.js.map