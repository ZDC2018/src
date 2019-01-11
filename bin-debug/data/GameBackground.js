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
var GameBackGround = (function (_super) {
    __extends(GameBackGround, _super);
    function GameBackGround() {
        var _this = _super.call(this) || this;
        _this._setSceneData = false;
        _this.htimer = new egret.Timer(1000, 0);
        _this._second = 60;
        _this._minute = 2;
        return _this;
    }
    GameBackGround.prototype.changeBackground = function () {
        this.cacheAsBitmap = false;
        this.removeChildren();
        this.createBackGroundImage();
        this.createMapBg();
        this.createPlayerLevelBg();
        this.createCoinBg();
        this.createCoinOutputBg();
        // console.log("背景图share加载:"+GameLogic.closeShare);
        if (!GameLogic.closeShare && typeof (GameLogic.closeShare) != "undefined") {
            this.createShareBg();
        }
        this.cacheAsBitmap = true;
    };
    //创建背景图
    GameBackGround.prototype.createBackGroundImage = function () {
        this.dragContainer = new egret.Sprite();
        if (!this.bgImage) {
            this.bgImage = new egret.Bitmap();
        }
        this.bgImage.texture = RES.getRes(GameData.levelBackgroundImageName);
        this.bgImage.width = GameData.stageW;
        this.bgImage.height = GameData.stageH;
        this.addChild(this.bgImage);
        //前置背景图
        // //console.log(GameData.levelFrontBackgroundImageName);		
        var frontbg = new egret.Bitmap();
        frontbg.texture = RES.getRes(GameData.levelFrontBackgroundImageName);
        frontbg.width = GameData.stageW;
        frontbg.height = GameData.stageH * 0.37;
        frontbg.y = GameData.stageH - frontbg.height; //居底对齐
        this.addChild(frontbg);
    };
    //创建格子地图
    GameBackGround.prototype.createMapBg = function () {
        // //console.log('创建格子地图');
        // let startY:number = (GameData.stageH - (GameData.stageW - 30)/6 - 60)-girdWidth*GameData.MaxColumn;
        // SoundUtils.instance().playOpenGirdSound();
        GameBackGround.girdLockArr[GameData.currentLevel - 1] = new Array();
        var mapbg = new egret.Bitmap(); //添加地图阴影背景
        mapbg.texture = RES.getRes("ui_blackbase_png");
        mapbg.width = GameData.stageW - 40;
        mapbg.height = GameData.girdWidth * GameData.MaxRow;
        mapbg.x = 20;
        mapbg.y = GameData.startY;
        this.addChild(mapbg);
        var mapDataArray = RES.getRes("map_data_json");
        var mapAddData;
        if (GameData.currentLevel < 9) {
            mapAddData = [].concat(mapDataArray[GameData.currentLevel].addmap);
        }
        else {
            mapAddData = [].concat(mapDataArray[0].addmap);
        }
        var gird;
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                // if(GameData.mapData[i][t]!=-1){				
                if (GameData.girdBg.length <= (i * GameData.MaxRow + t)) {
                    gird = new egret.Bitmap();
                    GameData.girdBg.push(gird);
                }
                else {
                    gird = GameData.girdBg[i * GameData.MaxRow + t];
                }
                gird.width = GameData.girdWidth;
                gird.height = GameData.girdWidth * 0.6;
                gird.x = 20 + GameData.girdWidth / 5 + (GameData.girdWidth + GameData.girdWidth / 5) * t;
                gird.y = GameData.startY + 20 + GameData.girdWidth * i;
                if (GameData.mapData[i][t] != -1) {
                    gird.texture = RES.getRes(GameData.girdImageName); //载入地块
                }
                else {
                    gird.texture = RES.getRes(GameData.girdLockImageName); //载入锁定地块						
                }
                // }
                this.addChild(gird);
                if (i * (GameData.MaxRow - 1) + t == mapAddData[0]) {
                    //console.log(i);
                    //console.log(t);
                    var girdLock = ResourceUtils.createBitmapByName("scenebox_lock_text_png");
                    girdLock.x = gird.x + GameData.girdWidth / 6;
                    girdLock.y = gird.y;
                    this.addChild(girdLock);
                    var girdLockLabel = new egret.TextField();
                    girdLockLabel.text = (GameData.currentLevel + 1).toString() + "级解锁";
                    girdLockLabel.size = 15;
                    girdLockLabel.textColor = 0xFFFFFF;
                    girdLockLabel.fontFamily = "黑体";
                    girdLockLabel.width = GameData.girdWidth;
                    girdLockLabel.textAlign = egret.HorizontalAlign.CENTER;
                    girdLockLabel.x = gird.x;
                    girdLockLabel.y = gird.y + 3;
                    this.addChild(girdLockLabel);
                    var girdLockIcon = ResourceUtils.createBitmapByName("shop_buy_lock_png");
                    girdLockIcon.x = gird.x + GameData.girdWidth / 2 - girdLockIcon.width / 2;
                    girdLockIcon.y = gird.y + GameData.girdWidth / 2 - girdLockIcon.height;
                    this.addChild(girdLockIcon);
                    mapAddData.shift();
                    GameBackGround.girdLockArr[GameData.currentLevel - 1].push({ x: gird.x, y: gird.y });
                }
            }
        }
        // //console.log("解锁地块数组:");
        // //console.log(GameBackGround.girdLockArr);
        // if(GameData.currentLevel >1 && GameData.currentLevel<9){
        // 	let m:number = 0;
        // 	while(GameBackGround.girdLockArr[GameData.currentLevel-2].length >0){
        // 		let girdLockArr:any = GameBackGround.girdLockArr[GameData.currentLevel-2];
        // 		let girdLock:any  = girdLockArr.shift();
        // 		//console.log("解锁地块:");
        // 		//console.log(GameBackGround.girdLockArr);
        // 		//console.log(girdLock);
        // 		let mcData = RES.getRes("girdRelease_json");
        // 		let mcTexture = RES.getRes("girdRelease_png");
        // 		//创建动画工厂
        // 		var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        // 		//创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        // 		var mc = new Array();
        // 		mc[m] = new egret.MovieClip(mcDataFactory.generateMovieClipData("girdRelease"));
        // 		mc[m].x = girdLock.x;
        // 		mc[m].y = girdLock.y -20;
        // 		this.addChild(mc[m]);
        // 		mc[m].gotoAndPlay(1,-1);
        // 		mc[m].addEventListener(egret.Event.COMPLETE, function (){
        // 			// egret.log("1,COMPLETE");
        // 			// this.removeChild(mc[m]);
        // 		}, this);
        // 		m++;
        // 		// egret.setTimeout(function(){mc.gotoAndPlay(1);},this,3000);
        // 	}
        // }
    };
    /**
     * 创建等级显示区域背景图
     * author:bigfoot
     * date:2018/08/18
     */
    GameBackGround.prototype.createPlayerLevelBg = function () {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui_level_png");
        bg.width = GameData.girdWidth * 0.44;
        bg.height = GameData.girdWidth * 0.53;
        bg.x = 20;
        bg.y = 30;
        // this.addChild(bg);
        var expBg = new egret.Bitmap();
        expBg.texture = RES.getRes("ui_base_count_png");
        expBg.width = GameData.girdWidth * 3;
        expBg.height = GameData.girdWidth / 3;
        expBg.x = 10 + bg.width;
        expBg.y = GameData.girdWidth * 0.375;
        // //console.log("等级显示背景图片"+bg.y)
        this.addChild(expBg);
    };
    /**
     * 创建金币显示区域背景图
     * author:bigfoot
     * date:2018/08/18
     */
    GameBackGround.prototype.createCoinBg = function () {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui_money_total_png");
        bg.width = GameData.girdWidth / 3;
        bg.height = GameData.girdWidth / 3;
        bg.x = 20;
        bg.y = GameData.girdWidth - 10;
        this.addChild(bg);
        var coinBg = new egret.Bitmap();
        coinBg.texture = RES.getRes("ui_base_count_png");
        coinBg.width = GameData.girdWidth * 1.5;
        coinBg.height = GameData.girdWidth / 3;
        coinBg.x = 20 + GameData.girdWidth / 3;
        coinBg.y = bg.y;
        this.addChild(coinBg);
        // let label:egret.TextField = new egret.TextField(); 
        // label.text = "9999"; 
        // label.width =  3*GameData.girdWidth;
        // label.x = 90;
        // label.y = bg.y;
        // this.addChild( label );
    };
    /**
     * 创建秒产显示区域
     * author:bigfoot
     * date:2018/08/18
     */
    GameBackGround.prototype.createCoinOutputBg = function () {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui_money_sec_png");
        bg.width = GameData.girdWidth / 3 + 5;
        bg.height = GameData.girdWidth / 3;
        bg.x = 25 + GameData.girdWidth / 3 + GameData.girdWidth * 1.5;
        bg.y = GameData.girdWidth - 10;
        this.addChild(bg);
        var secBg = new egret.Bitmap();
        secBg.texture = RES.getRes("ui_base_count_png");
        secBg.width = GameData.girdWidth * 1.5;
        secBg.height = GameData.girdWidth / 3;
        secBg.x = 30 + GameData.girdWidth * 1.5 + 2 * GameData.girdWidth / 3;
        secBg.y = bg.y;
        this.addChild(secBg);
        // let label:egret.TextField = new egret.TextField(); 
        // label.text = "9999"; 
        // label.x = 50+GameData.girdWidth*1.5+2*GameData.girdWidth/3;
        // label.y = 50+ GameData.girdWidth/2;
        // this.addChild( label );
    };
    /**
     * 创建分享两倍金币背景图
     * author:bigfoot
     * date:2018/08/18
     */
    GameBackGround.prototype.createShareBg = function () {
        this.share5x = new egret.Bitmap();
        this.share5x.texture = RES.getRes("ui_share_5x_01_a_png");
        this.share5x.width = GameData.girdWidth * 1.05;
        this.share5x.height = GameData.girdWidth * 0.46;
        this.share5x.x = GameData.stageW - GameData.girdWidth * 1.3;
        this.share5x.y = GameData.girdWidth * 0.875;
        this.addChild(this.share5x);
        this.hint = ResourceUtils.createBitmapByName("ui_share_hint_png");
        this.hint.x = this.share5x.x + this.share5x.width - this.hint.width / 2;
        this.hint.y = this.share5x.y;
        this.addChild(this.hint);
        this.share5x.touchEnabled = true;
        this.share5x.addEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);
        // this.share5x.addEventListener(egret.TouchEvent.TOUCH_TAP, this.x5profit, this);
    };
    GameBackGround.prototype.share = function () {
        //console.log("5倍分享:");
        var shareResult = platform.share("key=backgroud");
        egret.localStorage.setItem("x5Time", new Date().getTime().toString());
        // this.htimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);	
        // GameData.secCoin = CommonFuction.cheng(GameData.secCoin,'5');//秒产5
    };
    GameBackGround.prototype.x5profit = function () {
        this.share5x.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);
        this.share5xOn = new egret.Bitmap();
        this.share5xOn.texture = RES.getRes("ui_share_5x_01_b_png");
        this.share5xOn.width = GameData.girdWidth * 1.05;
        this.share5xOn.height = GameData.girdWidth * 0.46;
        this.share5xOn.x = GameData.stageW - GameData.girdWidth * 1.3;
        this.share5xOn.y = GameData.girdWidth * 0.875;
        this.removeChild(this.share5x);
        this.addChild(this.share5xOn);
        this.htimeBase = ResourceUtils.createBitmapByName("ui_share_5x_timebase_png");
        this.htimeBase.x = this.share5xOn.x + (this.share5xOn.width - this.htimeBase.width) / 2;
        this.htimeBase.y = this.share5xOn.y + this.share5xOn.height + 5;
        this.addChild(this.htimeBase);
        this.htimeText = new egret.TextField();
        this.htimeText.text = "3:00";
        this.htimeText.fontFamily = "黑体";
        this.htimeText.size = 25;
        this.htimeText.textColor = 0xffffff;
        this.htimeText.textAlign = egret.HorizontalAlign.CENTER;
        this.htimeText.x = this.htimeBase.x;
        this.htimeText.y = this.htimeBase.y;
        this.htimeText.width = this.htimeBase.width;
        this.addChild(this.htimeText);
        this.share5xOn.touchEnabled = false;
        this.removeChild(this.hint);
        if (!this.htimer.running) {
            this.htimer.reset();
            this.htimer.start();
            this.cacheAsBitmap = false;
            //console.log("5倍分享:"+this.htimer.running);
        }
        GameBackGround.hTimerStatus = true;
        this.htimer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
    };
    GameBackGround.prototype.shareContinue = function () {
        //console.log("继续5倍秒产:");
        this.share5xOn = new egret.Bitmap();
        this.share5xOn.texture = RES.getRes("ui_share_5x_01_b_png");
        this.share5xOn.width = GameData.girdWidth * 1.05;
        this.share5xOn.height = GameData.girdWidth * 0.46;
        this.share5xOn.x = GameData.stageW - GameData.girdWidth * 1.3;
        this.share5xOn.y = GameData.girdWidth * 0.875;
        this.removeChild(this.share5x);
        this.addChild(this.share5xOn);
        this.htimeBase = ResourceUtils.createBitmapByName("ui_share_5x_timebase_png");
        this.htimeBase.x = this.share5xOn.x + (this.share5xOn.width - this.htimeBase.width) / 2;
        this.htimeBase.y = this.share5xOn.y + this.share5xOn.height + 5;
        this.addChild(this.htimeBase);
        this.htimeText = new egret.TextField();
        this.htimeText.text = "";
        this.htimeText.fontFamily = "黑体";
        this.htimeText.size = 25;
        this.htimeText.textColor = 0xffffff;
        this.htimeText.textAlign = egret.HorizontalAlign.CENTER;
        this.htimeText.x = this.htimeBase.x;
        this.htimeText.y = this.htimeBase.y;
        this.htimeText.width = this.htimeBase.width;
        this.addChild(this.htimeText);
        this.share5xOn.touchEnabled = false;
        this.removeChild(this.hint);
        //console.log(this.htimer.running);
        if (!this.htimer.running) {
            this.htimer.reset();
            this.htimer.start();
            this.cacheAsBitmap = false;
            // //console.log(this.htimer.running);
        }
        GameBackGround.hTimerStatus = true;
        this.htimer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
    };
    Object.defineProperty(GameBackGround.prototype, "second", {
        get: function () {
            return this._second;
        },
        set: function (second) {
            this._second = second;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameBackGround.prototype, "minute", {
        get: function () {
            return this._minute;
        },
        set: function (minute) {
            this._minute = minute;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 显示倒计时
     */
    GameBackGround.prototype.timerFunc = function () {
        // //console.log("5x分享倒计时器"+ this.htimer.running);
        if (this.second == 1 && this.minute == 0) {
            this.htimer.reset();
            GameBackGround.hTimerStatus = false;
            this.timerComFunc();
        }
        this._second--;
        if (this.second == 0) {
            if (this._minute > 0) {
                this._minute--;
                this._second = 59;
            }
        }
        this.htimeText.text = this._minute.toString() + ":" + ('0' + this._second.toString()).slice(-2);
    };
    /**
     * 倒计时结束，秒产恢复
     */
    GameBackGround.prototype.timerComFunc = function () {
        this.removeChild(this.share5xOn);
        this.removeChild(this.htimeText);
        this.removeChild(this.htimeBase);
        this.createShareBg();
        GameData.secCoin = CommonFuction.chu(GameData.secCoin, 5);
        this._second = 61;
        this._minute = 2;
        this.cacheAsBitmap = true;
    };
    GameBackGround.prototype.addDragGird = function (girdLocation) {
        //console.log("显示可以合并的地块")
        var i = Math.floor(girdLocation / GameData.MaxColumn);
        var t = girdLocation % GameData.MaxColumn;
        var gird = new egret.Bitmap();
        gird.width = GameData.girdWidth;
        gird.height = GameData.girdWidth * 0.6;
        gird.x = 20 + GameData.girdWidth / 5 + (GameData.girdWidth + GameData.girdWidth / 5) * t;
        gird.y = GameData.startY + 20 + GameData.girdWidth * i;
        if (GameData.mapData[i][t] != -1) {
            gird.texture = RES.getRes("drag_synthesis_small_png"); //载入地块
        }
        this.addChild(gird);
        // this.dragContainer.addChild(gird); 
    };
    GameBackGround.prototype.clear = function () {
        //console.log("清除背景");
        this.cacheAsBitmap = false;
        this.removeChildren();
        this.cacheAsBitmap = true;
    };
    GameBackGround.prototype.setSceneData = function (i) {
        GameData.bgMusic = "sound_bg0" + i + "_mp3";
        GameData.levelBackgroundImageName = "scene_0" + i + "_back_png";
        GameData.levelFrontBackgroundImageName = "scene_0" + i + "_front_png";
        GameData.girdImageName = "scene_0" + i + "_base_small_png";
        GameData.girdLockImageName = "scene_0" + i + "_base_small_lock_png";
        GameData.setSceneData = true;
    };
    GameBackGround.girdLockArr = [];
    GameBackGround.hTimerStatus = false;
    return GameBackGround;
}(egret.Sprite));
__reflect(GameBackGround.prototype, "GameBackGround");
//# sourceMappingURL=GameBackground.js.map