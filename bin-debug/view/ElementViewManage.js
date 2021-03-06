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
var ElementViewManage = (function (_super) {
    __extends(ElementViewManage, _super);
    function ElementViewManage(elementLayer) {
        var _this = _super.call(this) || this;
        _this._touchStatus = false; //当前触摸状态，按下时，值为true
        _this._distance = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差
        /**
         * 经验值
         */
        _this._levelExpLabel = new egret.TextField();
        _this._coinLabel = new egret.TextField();
        _this._coinSecLabel = new egret.TextField();
        _this._numText = new egret.TextField(); //倒计时数字
        _this._currentLevelNumText = new egret.TextField(); //当前关卡数字
        /**
         * 经验值进度条
         */
        _this._expBar = new egret.Bitmap();
        /**
         * 添加指示助手
         */
        _this.helpSprit = new egret.Sprite();
        _this._helpHandleOn = false;
        _this.helpTiptxtView = new egret.TextField;
        _this.hideTimer = new egret.Timer(1000, 300);
        _this._recyclePanelOn = false;
        _this.ev = new ElementView(_this._layer);
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        /*-----------------------------焦点相关控制--------------------------------------*/
        _this._currentTapID = -1; //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        /*---------------------------------定时器---------------------------------------*/
        _this._countdown = 10;
        _this.timer = new egret.Timer(1000, 0);
        _this.coinTimer = new egret.Timer(1000, 0);
        _this.floatCoinTimer = new egret.Timer(1000, 0);
        _this.rewardTimer = new egret.Timer(1000, Math.round(Math.random() * 60 + 120));
        // private rewardTimer:egret.Timer = new egret.Timer(12000,1);
        _this.helpHandleTimer = new egret.Timer(6000, 1);
        _this._addReward = false; //没有标志
        _this._rewardIconSprite = new egret.Sprite();
        _this.i = 1;
        /**
         * 飘字,每1000毫秒计算一次
         */
        _this.plusIndex = 5;
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        _this.dragContainer = new egret.Sprite();
        _this._movein = false;
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        /*-----------------------------动画播放控制--------------------------------------*/
        _this.moveEleNum = 0;
        _this._isDeleteOver = true;
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        /**
         * 合并操作过关经验值增加
         * author:bigfootzq
         * date:2018/08/20
         */
        _this.tempExp = 0;
        /**--------------------------升级弹窗----------------------------------------------------------------------------- */
        _this._levelUpPanel = new egret.Sprite();
        /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
        /**-------------------------------------------------------房子回收--------------------------------------------------------------------------------- */
        _this.recycle = new egret.Shape();
        /**
         * 打开确认删除面板
         */
        _this._confirmRecycleContainer = new egret.Sprite();
        _this._confirmBtn = new egret.Bitmap();
        _this._reclaimCheck = ResourceUtils.createBitmapByName("reclaim_check_png");
        _this._isDelete = false;
        _this._isDisableConfirm = false; //是否禁止弹出回收面板
        _this._buyHouseConfigArray = RES.getRes("buy_house_config_json");
        _this._hitEv = new ElementView(_this._layer);
        /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
        /*********************************房屋商城****************************************************************************************************** */
        _this._shopContainer = new egret.Sprite();
        _this._cardScrollView = null;
        _this._cards = null;
        _this._openScrollX = 0;
        _this.moveLocElementNum = 0;
        _this._layer = elementLayer;
        _this.init();
        _this.createTimerBg();
        _this.createExpBar();
        _this.levelExpLabel();
        _this.createNumText();
        _this.addHelpHandle();
        // this.createRecycle();
        // this.addReward();	
        platform.onShow(_this.onShow, _this);
        platform.onHide(_this.onHide, _this);
        return _this;
    }
    /**
     * 初始化所有数据变量
     */
    ElementViewManage.prototype.init = function () {
        //console.log("evm初始化");		
        this.elementViews = new Array();
        var len = GameData.MaxColumn * GameData.MaxRow;
        var el;
        for (var i = 0; i < len; i++) {
            el = new ElementView(this._layer);
            el.id = i;
            el.location = GameData.elements[i].location;
            el.grade = GameData.elements[i].grade;
            el.time = GameData.elements[i].time;
            this.elementViews.push(el);
            el.evm = this; // 给ElementView用来触发 ElementViewManageEvent事件
            el.touchEnabled = true;
            // el.addEventListener(egret.TouchEvent.TOUCH_TAP,this.elTap,this);
            el.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this); //这里是房子拖拽
            el.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        }
        this.hitBox = new PropView(2);
        this.hitBox.id = 2;
        this._layer.addChild(this.hitBox);
        this.hitBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapTimerSpeed, this);
        var shop = new PropView(3);
        shop.id = 3;
        this._layer.addChild(shop);
        shop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openShop, this);
        var scene = new PropView(4);
        scene.id = 4;
        this._layer.addChild(scene);
        scene.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeScene, this);
    };
    /**
     * 倒计时背景图
     */
    ElementViewManage.prototype.createTimerBg = function () {
        var timerBg = new egret.Bitmap();
        timerBg.texture = RES.getRes("ui_time_base_png");
        timerBg.width = GameData.girdWidth / 3;
        timerBg.height = GameData.girdWidth / 3;
        timerBg.x = GameData.stageW / 2 - GameData.girdWidth * 1.867 / 2 + timerBg.width / 2;
        timerBg.y = GameData.stageH - GameData.girdWidth * 1.658 + timerBg.width / 2;
        this._layer.addChild(timerBg);
    };
    ElementViewManage.prototype.levelExpLabel = function () {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui_level_png");
        bg.width = GameData.girdWidth * 0.44;
        bg.height = GameData.girdWidth * 0.53;
        bg.x = GameData.girdWidth / 6;
        bg.y = GameData.girdWidth / 4;
        this._layer.addChild(bg);
        //经验值
        this._levelExpLabel.text = GameData.levelExp + "/" + GameData.levelReqExp;
        this._coinSecLabel.textAlign = egret.HorizontalAlign.CENTER;
        this._levelExpLabel.width = 3 * GameData.girdWidth;
        this._levelExpLabel.x = GameData.girdWidth * 1.7;
        this._levelExpLabel.y = GameData.girdWidth * 0.375 + 5;
        this._layer.addChild(this._levelExpLabel);
        //金币值
        this._coinLabel.text = this.numZero(GameData.coin);
        this._coinLabel.textAlign = egret.HorizontalAlign.CENTER;
        // this._coinLabel.size = 18;
        this._coinLabel.width = 1.5 * GameData.girdWidth;
        // this._coinLabel.x = 10 + GameData.girdWidth/3 +  GameData.girdWidth*1.5/2 - 5;
        this._coinLabel.x = 20 + GameData.girdWidth / 3;
        this._coinLabel.y = GameData.girdWidth - 5;
        this._layer.addChild(this._coinLabel);
        //秒产金币值
        this._coinSecLabel.text = this.numZero(GameData.secCoin);
        this._coinSecLabel.textAlign = egret.HorizontalAlign.CENTER;
        // this._coinSecLabel.size = 18;
        this._coinSecLabel.width = 1.5 * GameData.girdWidth;
        // this._coinSecLabel.x = 25+GameData.girdWidth/3+GameData.girdWidth*1.5 +GameData.girdWidth/3+5 +GameData.girdWidth*1.5/2 -5;
        this._coinSecLabel.x = 30 + GameData.girdWidth * 1.5 + 2 * GameData.girdWidth / 3;
        this._coinSecLabel.y = GameData.girdWidth - 5;
        this._layer.addChild(this._coinSecLabel);
    };
    Object.defineProperty(ElementViewManage.prototype, "coinLableText", {
        get: function () {
            return this._coinLabel.text;
        },
        enumerable: true,
        configurable: true
    });
    ElementViewManage.prototype.createNumText = function () {
        this._numText.x = GameData.stageW / 2 - GameData.girdWidth * 1.867 / 2 + GameData.girdWidth / 6;
        this._numText.y = GameData.stageH - GameData.girdWidth * 1.658 + GameData.girdWidth / 6 + GameData.girdWidth / 24 + 3;
        this._numText.text = "10";
        this._numText.textColor = 0xd8241b;
        this._numText.bold = true;
        if (this._numText.text == "10") {
            this._numText.size = 25;
        }
        this._numText.width = GameData.girdWidth / 3;
        this._numText.textAlign = egret.HorizontalAlign.CENTER;
        this._layer.addChild(this._numText);
        this._currentLevelNumText.x = GameData.girdWidth / 6 - 3;
        this._currentLevelNumText.y = GameData.girdWidth * 2 / 5 - 3;
        this._currentLevelNumText.width = GameData.girdWidth * 0.44;
        this._currentLevelNumText.textAlign = egret.HorizontalAlign.CENTER;
        this._currentLevelNumText.text = GameData.currentLevel.toString();
        // this._currentLevelNumText.text = "Lv"+GameData.currentLevel.toString();
        this._currentLevelNumText.textColor = 0x1C8CAD;
        if (GameData.currentLevel < 10) {
            this._currentLevelNumText.size = 24;
        }
        else if (GameData.currentLevel >= 100) {
            this._currentLevelNumText.size = 18;
        }
        else {
            this._currentLevelNumText.size = 20;
        }
        this._currentLevelNumText.bold = true;
        this._layer.addChild(this._currentLevelNumText);
    };
    ElementViewManage.prototype.createExpBar = function () {
        this._expBar.width = GameData.girdWidth * 3;
        this._expBar.height = GameData.girdWidth / 3 * 0.8;
        this._expBar.x = GameData.girdWidth * 0.44 + 10 + 2;
        this._expBar.y = GameData.girdWidth * 0.375 + GameData.girdWidth / 30;
        // this._expBar.scaleX = GameData.levelExp/GameData.levelReqExp;
        this._expBar.texture = RES.getRes("ui_experience_png");
        var barMask = new egret.Rectangle(0, 0, 0, this._expBar.height);
        this._expBar.mask = barMask;
        this._layer.addChild(this._expBar);
    };
    ElementViewManage.prototype.addHelpTip = function () {
        this.guideBubble = new egret.Bitmap();
        this.guideBubble.texture = RES.getRes("guide_bubble_png");
        this.guideBubble.x = GameData.stageW / 2 - this.guideBubble.width / 2;
        this.guideBubble.y = GameData.stageH - GameData.girdWidth * 1.658 - this.guideBubble.height - 10;
        this.helpTiptxtView.textColor = 0x21344D;
        this.helpTiptxtView.fontFamily = "黑体";
        this.helpTiptxtView.text = "点我加速房子掉落哦！";
        // this.txtView.bold = true;
        this.helpTiptxtView.size = 26;
        this.helpTiptxtView.width = this.guideBubble.width;
        this.helpTiptxtView.textAlign = egret.HorizontalAlign.CENTER;
        this.helpTiptxtView.x = this.guideBubble.x;
        this.helpTiptxtView.y = this.guideBubble.y + 18;
        this.helpSprit.addChild(this.guideBubble);
        this.helpSprit.addChild(this.helpTiptxtView);
    };
    ElementViewManage.prototype.addHelpHandle = function () {
        // console.log("添加指示助手");
        // console.log(this.helpHandleTimer.running);
        this.addHelpTip();
        this.helpHandle = new egret.Bitmap();
        this.helpHandle.texture = RES.getRes("ui_help_png");
        this.helpHandle.x = GameData.stageW / 2;
        this.helpHandle.y = GameData.stageH - GameData.girdWidth * 1.658 / 2;
        this.helpSprit.addChild(this.helpHandle);
        var tw = egret.Tween.get(this.helpHandle, { loop: true });
        tw.to({ scaleX: 0.8, scaleY: 0.8 }, 400, egret.Ease.cubicInOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.cubicInOut);
        if (!this._helpHandleOn) {
            // console.log("添加指示助手成功");
            this._layer.addChild(this.helpSprit);
            this._helpHandleOn = true;
        }
    };
    /**
     * 移除指示助手
     */
    ElementViewManage.prototype.removeHelpHandle = function () {
        // console.log("移除指示助手");
        if (this._helpHandleOn) {
            // console.log("移除指示助手成功");
            this.helpSprit.removeChildren();
            this.helpSprit.parent && this.helpSprit.parent.removeChild(this.helpSprit);
            this._helpHandleOn = false;
            this.helpHandleTimer.reset();
            this.helpHandleTimer.start();
        }
    };
    ElementViewManage.prototype.onShow = function () {
        //console.log("回到前台，读取数据");
        //console.log("时间:"+new Date().getTime());
        // let userGameData =  egret.localStorage.getItem("userGameData");
        // //console.log(userGameData);
        SoundUtils.instance().playBg();
        if (GameLogic.guide && GameData.currentLevel == 1) {
            var evt = new ElementViewManageEvent(ElementViewManageEvent.GUIDE_RESET);
            this.dispatchEvent(evt);
        }
        var currentTime = new Date().getTime();
        var wspTime = egret.localStorage.getItem("wrpTime"); //欢迎回来
        var nhTime = egret.localStorage.getItem("nhTime"); //新房子
        var luTime = egret.localStorage.getItem("luTime"); //升级
        var fhTime = egret.localStorage.getItem("fhTime"); //免费房子
        var x5Time = egret.localStorage.getItem("x5Time"); //5倍加速
        var shareTime = 0;
        if (wspTime) {
            shareTime = Math.round((currentTime - Number(wspTime)) / 1000);
            if (shareTime >= 3) {
                var evt = new ElementViewManageEvent(ElementViewManageEvent.GET_PROFIT);
                this.dispatchEvent(evt);
                // egret.localStorage.removeItem("wrpTime");
            }
            else {
                this.floatText("请分享到其他群，再来领奖励", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
            }
        }
        if (nhTime) {
            shareTime = Math.round((currentTime - Number(nhTime)) / 1000);
            if (shareTime >= 3) {
                var evt = new ElementViewManageEvent(ElementViewManageEvent.CLOSE_NEW_HOUSE_PANEL);
                this.dispatchEvent(evt);
            }
            else {
                this.floatText("请分享到其他群，再来领奖励", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
            }
        }
        if (luTime) {
            shareTime = Math.round((currentTime - Number(luTime)) / 1000);
            if (shareTime >= 3) {
                var evt = new ElementViewManageEvent(ElementViewManageEvent.CLOSE_LEVEL_UP_PANEL);
                this.dispatchEvent(evt);
                // egret.localStorage.removeItem("luTime");
            }
            else {
                this.floatText("请分享到其他群，再来领奖励", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
            }
        }
        if (fhTime) {
            shareTime = Math.round((currentTime - Number(fhTime)) / 1000);
            if (shareTime >= 3) {
                var evt = new ElementViewManageEvent(ElementViewManageEvent.REWARD_HOUSE);
                this.dispatchEvent(evt);
                egret.localStorage.removeItem("fhTime");
            }
            else {
                this.floatText("请分享到其他群，才能领取奖励", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
            }
        }
        if (x5Time) {
            shareTime = Math.round((currentTime - Number(x5Time)) / 1000);
            if (shareTime >= 3) {
                var evt = new ElementViewManageEvent(ElementViewManageEvent.X5_PROFIT);
                this.dispatchEvent(evt);
                egret.localStorage.removeItem("x5Time");
            }
            else {
                this.floatText("请分享到其他群，再来领奖励", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
            }
        }
        SoundUtils.instance().playBg();
        // this.hideTimer.reset();
    };
    ElementViewManage.prototype.onHide = function () {
        //console.log("退出前台");
        // this.hideTimer.addEventListener(egret.TimerEvent.TIMER, this.hideTime, this);
        // this.hideTimer.start();
        // let inMapArrJson = JSON.stringify(inMapArr);
        // let userGameData = JSON.stringify({"currentLevel":GameData.currentLevel,"levelExp":GameData.levelExp,"coin":GameData.coin,"secCoin":secCoin,"due":new Date().getTime(),
        // "inMap":inMapArrJson,"maxHouseGrade":maxHouseGrade,"buyHouseNumber":buyHouseNumber,"closeMusic":GameData.closeMusic,"closeBgMusic":GameData.closeBgMusic});
        // platform.postGameData("userGameData",userGameData);
        var i = GameData.elements.length - 1;
        var inMapArr = new Array();
        var secCoin = this.addSecCoin();
        var maxHouseGrade = GameData.maxHouseGrade; //记录当前最大等级
        inMapArr = [].concat(GameData.elements);
        //console.log("退出前台,记录数据");
        var userGameData = JSON.stringify({ "currentLevel": GameData.currentLevel, "levelExp": GameData.levelExp, "cost": GameData.cost, "coin": GameData.coin, "secCoin": secCoin, "due": new Date().getTime(),
            "inMap": inMapArr, "maxHouseGrade": maxHouseGrade, "buyHouseNumber": GameData.houseBuyNumber, "closeMusic": GameData.closeMusic, "closeBgMusic": GameData.closeBgMusic, "addReward": this._addReward,
            "elementTypeFirstShow": GameData.elementTypeFirstShow });
        egret.localStorage.setItem("userGameData", userGameData);
    };
    ElementViewManage.prototype.hideTime = function () {
        // //console.log("hide计时:"+ this.hideTimer.currentCount);
        // if(this.hideTimer.currentCount == 30){//5分钟后执行退出，上传数据
        var i = GameData.elements.length - 1;
        var inMapArr = new Array();
        var secCoin = this.addSecCoin();
        var maxHouseGrade = GameData.maxHouseGrade; //记录当前最大等级
        // let buyHouseNumber = JSON.stringify(GameData.houseBuyNumber);//记下房屋购买次数
        // while(i > 0){
        // 	if(GameData.elements[i].type.length != 0){
        // 		inMapArr.push(GameData.elements[i]);
        // 	}
        // 	i--;
        // }
        inMapArr = [].concat(GameData.elements);
        //console.log("退出前台,记录数据");
        var userGameData = JSON.stringify({ "currentLevel": GameData.currentLevel, "levelExp": GameData.levelExp, "coin": GameData.coin, "secCoin": secCoin, "due": new Date().getTime(),
            "inMap": inMapArr, "maxHouseGrade": maxHouseGrade, "buyHouseNumber": GameData.houseBuyNumber, "closeMusic": GameData.closeMusic, "closeBgMusic": GameData.closeBgMusic });
        egret.localStorage.setItem("userGameData", userGameData);
        // platform.exitGame(); 
        // }
    };
    ElementViewManage.prototype.mouseDown = function (evt) {
        //console.log("Mouse Down.");
        this.ev = evt.currentTarget;
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.ev.x;
        this._distance.y = evt.stageY - this.ev.y;
        // //console.log("ev.id:"+this.ev.id);
        // //console.log("evt.stageX:"+evt.stageX);
        if (this.ev.grade == 0) {
            // //console.log("纸箱");
            // this.ev.setFocus(false);
            this.openBoxEffect(this.ev.id);
            this.ev.openBox();
            this.starHandler(this.ev.targetX(), this.ev.targetY());
            this.ev.time = GameData.elements[this.ev.id].time;
            this.ev.grade = GameData.elements[this.ev.id].grade ? GameData.elements[this.ev.id].grade : 1;
            if (GameData.elements[this.ev.id].time != 0) {
                this.addLevelExp(this.ev.grade); //开箱子加经验值
                this._levelExpLabel.text = GameData.levelExp.toString() + "/" + GameData.levelReqExp.toString();
                // //console.log(GameData.levelExp);
                // this.showElementById(this.ev.id,false);
                // this.ev.x  = this.ev.targetX();
                // this.ev.y  = this.ev.targetY() - this.ev.height/2;
                this.ev.show(100);
                var evt_1 = new ElementViewManageEvent(ElementViewManageEvent.LEVEL_EXP_UP);
                this.levelExpUp(evt_1);
            }
            this._touchStatus = false;
            // this._currentTapID =this. ev.id;
        }
        else {
            // //console.log("不是纸箱");
            if (!this._recyclePanelOn) {
                this.recyclePanel = new RecyclePanel();
                this._layer.addChild(this.recyclePanel);
                this.recyclePanel.show();
                this._layer.setChildIndex(this.ev, this._layer.numChildren + 1);
                this._recyclePanelOn = true;
                this.helpTiptxtView.text = "房子拖到这里出售哦";
                this.helpTiptxtView.textColor = 0xff0000;
            }
            this.showSynthesisGird(this.ev.id, this.ev.grade);
            this.addMoveinSetGird(this.ev.id);
        }
        if (this._touchStatus) {
            this.ev.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        }
        // //console.log("mouseDown,this._touchStatus:"+this._touchStatus);
    };
    ElementViewManage.prototype.mouseUp = function (evt) {
        // console.log("Mouse Up.");
        // console.log(this.ev);
        this.ev = evt.currentTarget;
        this._touchStatus = false;
        this.ev.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        this.clearSynthesisGird();
        // let rpy = GameData.stageH - GameData.stageW*0.3;	
        // if (this.ev.y < GameData.stageH && this.ev.y >= rpy){
        // 	//console.log("直接删除元素");
        // 	this.deleteElement(this.ev.id,evt.stageX,evt.stageY);
        // 	let housePrice:string =  this._buyHouseConfigArray[this._hitEv.grade].coinNum;
        // 	GameData.coin = CommonFuction.jia(GameData.coin,housePrice);
        // 	this._coinLabel.text = this.numZero(GameData.coin);
        // }
        if (this._recyclePanelOn) {
            this.recyclePanel.clear();
            this._layer.removeChild(this.recyclePanel);
            this._recyclePanelOn = false;
            this.helpTiptxtView.text = "点我加速房子掉落哦";
            this.helpTiptxtView.textColor = 0x21344D;
        }
        // let startY:number = (GameData.stageH - (GameData.stageW - 30)/6 - 60)-GameData.girdWidth*GameData.MaxRow;
        var i = Math.floor((evt.stageY - GameData.startY) / GameData.girdWidth);
        var t = Math.floor((evt.stageX - 44) / (GameData.girdWidth + 24));
        // //console.log(i);
        // //console.log(t);
        // //console.log(GameData.mapData[i][t]);
        if (i >= GameData.MaxRow) {
            this.delHouse(this.ev);
        }
        if (evt.stageY < GameData.startY || i >= GameData.MaxRow || t >= GameData.MaxColumn || i < 0 || t < 0) {
            // //console.log("back1");
            this.ev.back();
        }
        else {
            if (GameData.mapData[i][t] != -1 && GameData.mapData[i][t] != -2) {
                var ele1 = this.ev;
                var ele2 = this.elementViews[GameData.mapData[i][t]];
                // //console.log("ele1.id:"+ele1.id);
                // //console.log("ele2.id:"+ele2.id);
                if (this.ev.id != ele2.id) {
                    this.elementHitTest(ele1, ele2); //不允许撞自己
                }
                else {
                    // //console.log("back2");
                    this.ev.back();
                }
            }
            else if (GameData.mapData[i][t] == -2) {
                // console.log("moveTo");
                // console.log("moveTo:"+this.ev.x);
                // console.log("moveTo:"+this.ev.y);
                // console.log("moveTo:"+this.ev.location);
                var m = Math.floor(GameData.elements[this.ev.id].location / GameData.MaxColumn);
                var n = GameData.elements[this.ev.id].location % GameData.MaxColumn;
                GameData.mapData[i][t] = this.ev.id;
                var tempLocation = i * GameData.MaxColumn + t;
                // //console.log("tempLocation"+tempLocation);			
                for (var l = 0; l < GameData.availableMapId.length; l++) {
                    if (GameData.elements[GameData.availableMapId[l]].location == tempLocation) {
                        // //console.log("id："+GameData.availableMapId[l]);								
                        GameData.elements[GameData.availableMapId[l]].location = this.ev.location;
                    }
                }
                GameData.elements[this.ev.id].location = this.elementViews[this.ev.id].location = this.ev.location = tempLocation;
                // GameData.elements[this.ev.id].grade = this.elementViews[this.ev.id].grade = this.ev.grade;
                this.ev.moveTo(this.ev.targetX(), this.ev.targetY());
                // this.showElementById(this.ev.id,false);
                GameData.mapData[m][n] = -2;
            }
            else {
                this.ev.back();
            }
        }
        // //console.log("mouseUp,this._touchStatus:"+this._touchStatus);
    };
    ElementViewManage.prototype.mouseMove = function (evt) {
        // //console.log("moving now ! touchStatus :" +this._touchStatus);
        // //console.log("moving now ! this.ev.id :" +this.ev.id);
        if (this._touchStatus) {
            this.ev.x = evt.stageX - this._distance.x;
            this.ev.y = evt.stageY - this._distance.y;
            // //console.log("moving now ! Mouse: [X:"+evt.stageX+",Y:"+evt.stageY+"]");
            // //console.log("moving now ! Mouse: [ev.X:"+this.ev.x+",ev.Y:"+this.ev.y+"]");
            // //console.log("moving now ! Mouse: [_distance.X:"+this._distance.x+",_distance.Y:"+this._distance.y+"]");
            var rpy = GameData.stageH - GameData.stageW * 0.4;
            var temp = 0;
            if (this.ev.y < GameData.stageH && this.ev.y >= rpy) {
                // this.recyclePanel.setMask(false);
                temp = this.ev.y;
            }
            //遮罩变色失败，暂时屏蔽
            // if(this.ev.y < rpy && this.ev.y <temp){
            // 	//console.log("向上移动"+temp)
            // 	if(!this.recyclePanel.mask){
            // 		this.recyclePanel.setMask(true);
            // 	}
            // }
            var i = Math.floor((evt.stageY - GameData.startY) / GameData.girdWidth);
            var t = Math.floor((evt.stageX - 44) / (GameData.girdWidth + 24));
            var tempi = void 0;
            var tempt = void 0;
            if (i >= 0 && i < 5 && t >= 0 && t < 5) {
                if (i != tempi || t != tempt) {
                    if (this.moveinSetGrid.parent) {
                        this.dragContainer.removeChild(this.moveinSetGrid);
                    }
                    if (GameData.mapData[i][t] != -1) {
                        this.moveinSetGrid.x = 20 + GameData.girdWidth / 5 + (GameData.girdWidth + GameData.girdWidth / 5) * t;
                        this.moveinSetGrid.y = GameData.startY + 20 + GameData.girdWidth * i;
                        this.dragContainer.addChild(this.moveinSetGrid);
                    }
                }
                tempi = i;
                tempt = t;
            }
        }
    };
    /******************************碰撞检测相关*****************************************************************/
    ElementViewManage.prototype.elementHitTest = function (ev1, ev2) {
        // //console.log("ev1 id"+ev1.id);
        // //console.log("ev2 id"+ev2.id);
        var rectA = ev1.getBounds();
        var rectB = ev2.getBounds();
        //必须加上方块所在的x，y
        rectA.x += ev1.x;
        rectA.y += ev1.y;
        rectB.x += ev2.x;
        rectB.y += ev2.y;
        // let isHit:boolean = ev1.hitTestPoint(ev2.targetX(),ev2.targetY());
        var isHit = rectA.intersects(rectB);
        // //console.log(isHit);
        if (isHit) {
            // //console.log("ev1 grade"+ev1.grade);
            // //console.log("ev2 grade"+ev2.grade);
            var i = Math.floor(GameData.elements[ev1.id].location / GameData.MaxColumn);
            var t = GameData.elements[ev1.id].location % GameData.MaxColumn;
            var m = Math.floor(GameData.elements[ev2.id].location / GameData.MaxColumn);
            var n = GameData.elements[ev2.id].location % GameData.MaxColumn;
            if (this.elementViews[ev1.id].grade == this.elementViews[ev2.id].grade && this.elementViews[ev2.id].grade <= GameData.elementTypes.length) {
                // //console.log(GameData.elementTypeFirstShow);
                if (!GameData.elementTypeFirstShow[GameData.elements[ev1.id].grade]) {
                    // console.log("恭喜合成新房子:"+GameData.elements[ev1.id].grade );//房子第一次出现
                    //console.log(GameData.elementTypeFirstShow);
                    GameData.elementTypeFirstShow[GameData.elements[ev1.id].grade] = true;
                    // this.newHousePanel = new NewHousePanel();
                    // this._layer.parent.addChild(this.newHousePanel);
                    // this.newHousePanel.getNewHosuePanel(this.elementViews[ev1.id].grade+1);
                    var evt_2 = new ElementViewManageEvent(ElementViewManageEvent.OPEN_NEW_HOUSE_PANEL);
                    evt_2.grade = this.elementViews[ev1.id].grade + 1;
                    this.dispatchEvent(evt_2);
                    if (this.elementViews[ev1.id].grade + 1 >= GameData.maxHouseGrade) {
                        GameData.maxHouseGrade = this.elementViews[ev1.id].grade + 1; //当前获得房屋最高等级
                    }
                    if (GameData.maxHouseGrade == 2) {
                        // this.addHelpTip();
                        this.timerToBox2();
                    }
                    if (GameData.maxHouseGrade == 4) {
                        this.addReward();
                    }
                    SoundUtils.instance().playNewHouseSound(); //播放获得新房子音效
                }
                //console.log("消除动画");
                if (GameData.elements[ev1.id].type !== 'b0' && GameData.elements[ev1.id].type !== 'b1') {
                    this._isDeleteOver = false;
                    // this.playRecycleAni(ev1.id,ev2.targetX(),ev2.targetY(),true);
                    ev1.removeAniCall();
                    this.ev = null;
                }
                // //console.log("mapData删除后的值"+GameData.mapData[i][t]);					
                GameData.elements[ev1.id].grade = 0; //删除的元素级别置为0
                this.elementViews[ev1.id].time = GameData.elements[ev1.id].time = 0; //删除后元素的创建时间置为0;
                GameData.elements[ev2.id].grade = GameData.elements[ev2.id].grade + 1; //合并后升级
                this.elementViews[ev1.id].grade = 0;
                this.elementViews[ev2.id].grade += 1;
                this.addLevelExp(GameData.elements[ev2.id].grade); //根据新和成的房子等级加经验值
                this._levelExpLabel.text = this._levelExpLabel.text = GameData.levelExp.toString() + "/" + GameData.levelReqExp.toString();
                // this._expBar.scaleX = GameData.levelExp/GameData.levelReqExp;
                var barMask = new egret.Rectangle(0, 0, GameData.levelExp / GameData.levelReqExp * this._expBar.width, this._expBar.height);
                this._expBar.mask = barMask;
                SoundUtils.instance().playMergeSound(); //播放合成音效
                this.openBoxEffect(ev2.id); //合成房子特效
                this.showElementById(ev2.id, false);
                this.starHandler(ev2.targetX(), ev2.targetY());
                this.elementViews[ev2.id].time = GameData.elements[ev2.id].time = new Date().getTime(); //合并时间;
                if (GameData.availableMapId.length == 0) {
                    this.timer.start();
                    if (!this.helpHandleTimer.running) {
                        this.helpHandleTimer.reset();
                        this.helpHandleTimer.start();
                    }
                    // //console.log(GameData.availableMapId.length);
                    GameData.mapData[i][t] = -2; //删除元素后把这块格子置为-2,表示无元素
                    GameData.availableMapId.push(ev1.id); //将空白地块加入可用地图数组
                }
                else {
                    GameData.mapData[i][t] = -2; //删除元素后把这块格子置为-2,表示无元素
                    GameData.availableMapId.push(ev1.id); //将空白地块加入可用地图数组
                    // console.log("合成房子后回收空白地块");
                    // console.log(GameData.availableMapId.length);
                    // console.log(GameData.availableMapId);
                }
                var evt = new ElementViewManageEvent(ElementViewManageEvent.LEVEL_EXP_UP);
                this.levelExpUp(evt);
                // this.delOver(eover);
                // //console.log(GameData.elements[evt.ele2]);
            }
            else {
                this.changeLocationWithScaleOrBack(ev1.id, ev2.id, true);
                GameData.mapData[i][t] = ev2.id;
                GameData.mapData[m][n] = ev1.id;
            }
        }
        else {
            this.ev.back(); //如果没碰到弹回原处
        }
    };
    // public setNewElementFocus(location:number){
    // 	this.elementViews[this._currentTapID].setFocus(false);
    // 	this.elementViews[location].setFocus(true);
    // 	this._currentTapID=location;
    // }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /**
     * 添加上一关留存在地图上的元素
     */
    ElementViewManage.prototype.addLastLevelElements = function () {
        //console.log("添加上一关的留存元素:")
        var ele;
        var len = GameData.MaxRow * GameData.MaxColumn;
        for (var l = 0; l < len; l++) {
            ele = this.elementViews[l];
            ele.grade = GameData.elements[l].grade;
            ele.location = GameData.elements[l].location;
            ele.time = GameData.elements[l].time;
            ele.x = ele.targetX();
            ele.y = GameData.startY - ele.width;
            var i = Math.floor(ele.location / GameData.MaxColumn);
            var t = ele.location % GameData.MaxColumn; //修改成4*5地图后，t的计算方式变化
            // //console.log("所有id: "+ele.id);
            // //console.log("type: "+GameData.elements[l].type );
            if (GameData.elements[l].type == "b1") {
                ele.grade = 0;
                GameData.mapData[i][t] = ele.id;
                ele.setTexture("ui_box_gift_png");
                ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50, -7);
                // //console.log("添加上一关的留存元素:"+GameData.elements[l].type);						
            }
            else if (ele.grade == 0 && GameData.elements[l].type == "b0") {
                GameData.mapData[i][t] = ele.id;
                ele.setTexture("ui_box_general_png");
                ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
                // //console.log("添加上一关的留存元素:"+GameData.elements[l].type);		
            }
            else if (GameData.elements[l].grade != 0 && GameData.elements[l].type != "b1") {
                GameData.mapData[i][t] = ele.id;
                ele.setTexture("house#houses_a_" + this.addPreZero(ele.grade) + "_big");
                ele.show((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
                // GameData.availableMapId.splice(l,1);//将使用过的MapId从可用数组里面删除
                // //console.log("availableMapId:"+GameData.availableMapId);
            }
            // console.log("剩余空地:");
            // console.log(GameData.availableMapId.length);
            // console.log(GameData.availableMapId);
            //console.log("添加上一关的留存元素"+ele.time);									
        }
    };
    /*
    *开场随机元素掉落，2018/08/10
    *author:bigfoot
    */
    ElementViewManage.prototype.showElement = function () {
        //console.log("开场随机元素掉落");		
        var ele;
        if (GameData.availableMapId.length != 0) {
            var l = Math.floor(Math.random() * GameData.availableMapId.length);
            var id = GameData.availableMapId[l]; //随机从可以使用的MapId里面抽取一个
            var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
            var t = GameData.elements[id].location % GameData.MaxColumn; //修改成4*5地图后，t的计算方式变化
            // //console.log("随机id: "+id);
            // //console.log("随机i: "+i);
            // //console.log("随机t: "+t);
            // //console.log(GameData.mapData[i][t]);
            if (GameData.mapData[i][t] != -1) {
                GameData.mapData[i][t] = id;
                ele = this.elementViews[GameData.mapData[i][t]];
                GameData.elements[id].type = "b0";
                ele.setTexture("ui_box_general_png");
                ele.x = ele.targetX();
                ele.y = GameData.startY - ele.width;
                ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
                SoundUtils.instance().playBoxDownSound(); //播放箱子掉落音效
                GameData.availableMapId.splice(l, 1); //将使用过的MapId从可用数组里面删除
                this.timerToBox2();
                // console.log("剩余空地:");
                // console.log(GameData.availableMapId.length);
                // console.log(GameData.availableMapId);
            }
        }
        else {
            this.timerToBox2();
        }
        // //console.log("可用地图Id: "+GameData.availableMapId);
    };
    /*
    *单个随机纸箱掉落，2018/08/16
    *author:bigfoot
    */
    ElementViewManage.prototype.showRandomElement = function () {
        //console.log("随机掉落开始");	
        var ele;
        // console.log("可用地图Id: "+GameData.availableMapId);
        // //console.log("mapData: "+GameData.mapData);
        // //console.log("elements: "+GameData.elements);
        for (var l = 0; l < GameData.availableMapId.length; l++) {
            var id = GameData.availableMapId[l];
            var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
            var t = GameData.elements[id].location % GameData.MaxColumn;
            // //console.log("随机id: "+id);
            // //console.log("随机元素的type: "+GameData.elements[id].type);
            // //console.log("随机元素的location: "+GameData.elements[id].location);
            // //console.log("随机i: "+i);
            // //console.log("随机t: "+t);
            if (GameData.mapData[i][t] != -2) {
                GameData.availableMapId.splice(l, 1);
            }
        }
        // console.log("可用地图Id2: "+GameData.availableMapId);
        if (GameData.availableMapId.length == 0) {
            this.timer.stop();
            this.removeHelpHandle();
            this.helpHandleTimer.stop(); //没有多余空地时候不显示指示助手
        }
        else {
            var l = Math.floor(Math.random() * GameData.availableMapId.length);
            var id = GameData.availableMapId[l]; //随机从可以使用的MapId里面抽取一个
            var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
            var t = GameData.elements[id].location % GameData.MaxColumn;
            GameData.mapData[i][t] = id;
            ele = this.elementViews[GameData.mapData[i][t]];
            ele.location = GameData.elements[id].location;
            var ran = Math.ceil(Math.random() * 100);
            if (ran <= GameData.boxDownWeight) {
                GameData.elements[id].type = "b0";
                ele.setTexture("ui_box_general_png");
            }
            else if (GameData.boxDownWeight < ran) {
                GameData.elements[id].type = "b1";
                ele.setTexture("ui_box_gift_png");
            }
            ele.x = ele.targetX();
            ele.y = GameData.startY - ele.width;
            ele.grade = 0;
            // //console.log("ele.y: "+ele.y)
            // //console.log("ele.targety: "+ele.targetY())
            ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50, -7);
            SoundUtils.instance().playBoxDownSound(); //播放箱子掉落音效
            GameData.availableMapId.splice(l, 1); //将使用过的MapId从可用数组里面删除
            // //console.log("随机id: "+id);
            // //console.log("随机元素的type: "+GameData.elements[id].type);
            // //console.log("随机元素的location: "+ele.location);
            // //console.log("随机元素的grade: "+ele.grade);
            // //console.log("随机i: "+i);
            // //console.log("随机t: "+t);
            // //console.log("随机元素: ");
            // //console.log(GameData.elements[id]);
            // //console.log(GameData.mapData[i][t]);
            // console.log("剩余空地:");
            // console.log(GameData.availableMapId.length);
            // console.log(GameData.availableMapId);
        }
    };
    /*
    *指定id元素创建，2018/08/16
    *author:bigfoot
    */
    ElementViewManage.prototype.showElementById = function (id, isFirst) {
        if (isFirst === void 0) { isFirst = true; }
        // console.log("指定id元素掉落");
        // let GameData.startY:number  = (GameData.stageH - (GameData.stageW - 30)/6 - 60 )-GameData.girdWidth*GameData.MaxRow;
        var ele;
        var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
        var t = GameData.elements[id].location % GameData.MaxColumn;
        if (GameData.mapData[i][t] != -1) {
            // GameData.mapData[i][t] = id;
            ele = this.elementViews[id];
            ele.x = ele.targetX();
            if (isFirst) {
                ele.y = GameData.startY - ele.width;
            }
            else {
                // ele.y = ele.targetY() + ele.height/4;
                ele.y = ele.targetY();
            }
            // console.log(GameData.elements[id].type);
            if (GameData.elements[id].type == "b") {
                GameData.elements[id].type = "b0";
                GameData.mapData[i][t] = id;
                ele.setTexture("ui_box_general_png");
                ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
                var index = GameData.availableMapId.indexOf(id);
                GameData.availableMapId.splice(index, 1);
            }
            else {
                ele.setTexture("house#houses_a_" + this.addPreZero(this.elementViews[id].grade) + "_big");
                ele.show((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
            }
            // console.log("剩余空地:");
            // console.log(GameData.availableMapId.length);
            // console.log(GameData.availableMapId);
            // this._currentTapID = -1;
        }
    };
    ElementViewManage.prototype.timerToBox2 = function () {
        // //console.log("开场元素掉落完成以后可用地图Id: "+GameData.availableMapId);
        // this.timer = new egret.Timer(1000, 0);//
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timeFuc, this);
        this.coinTimer.addEventListener(egret.TimerEvent.TIMER, this.addCoin, this);
        this.floatCoinTimer.addEventListener(egret.TimerEvent.TIMER, this.floatCoin, this);
        this.rewardTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.addReward, this);
        this.helpHandleTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.addHelpHandle, this);
        this.timer.start();
        this.coinTimer.start();
        this.floatCoinTimer.start();
        this.helpHandleTimer.start();
        if (!this._addReward && GameData.maxHouseGrade >= 4) {
            this.rewardTimer.start();
        }
        else {
            this.rewardTimer.reset(); //如果已经有了，那么重新开始计时
            this.rewardTimer.start();
        }
    };
    /**
     * 生成免费分享奖励
     */
    ElementViewManage.prototype.addReward = function () {
        // console.log("生成免费奖励图标");
        this._rewardShareIcon = ResourceUtils.createBitmapByName("shop#shop_bubble_png");
        this._rewardShareIcon.x = GameData.stageW - 15 - GameData.girdWidth * 0.93 - this._rewardShareIcon.width;
        this._rewardShareIcon.y = GameData.stageH - GameData.girdWidth * 0.966 - 30;
        if (!this._addReward && GameData.maxHouseGrade >= 4) {
            // console.log("生成免费奖励图标成功");
            this._addReward = true; //如果没有免费标志，那么加上
            this._layer.addChild(this._rewardIconSprite);
            this._rewardIconSprite.addChild(this._rewardShareIcon);
            this.rewardTimer.reset();
            this.rewardTimer.start();
        }
        else {
            // console.log("已经有图标了，重置时间");
            this.rewardTimer.reset(); //如果已经有了，那么重新开始计时
            this.rewardTimer.start();
        }
        // console.log("生成免费奖励倒计时："+this.rewardTimer.currentCount);
    };
    ElementViewManage.prototype.timeFuc = function () {
        // console.log("生成免费奖励倒计时状态："+this.rewardTimer.running);
        this._numText.text = this._countdown.toString();
        // this.hitBox.setBoxImg(10 -this._countdown +1);
        this._countdown-- ? this._countdown < 0 : this._countdown = 1;
        if (this._countdown == 0 && this._isDeleteOver) {
            this.timer.delay = 1000;
            this.showRandomElement();
            this.hitBox.ResetMcFrameRate();
            this._countdown = 10;
        }
        // //console.log(this._countdown);
        // //console.log(this._isDeleteOver);
    };
    Object.defineProperty(ElementViewManage.prototype, "countdown", {
        get: function () {
            return this._countdown;
        },
        set: function (countdown) {
            this._countdown = countdown;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 点击倒计时加速，每点击一下减一秒
     */
    ElementViewManage.prototype.tapTimerSpeed = function (evt) {
        this.removeHelpHandle();
        if (this.helpTiptxtView)
            this.helpTiptxtView.parent && this.helpTiptxtView.parent.removeChild(this.helpTiptxtView);
        if (this.guideBubble)
            this.guideBubble.parent && this.guideBubble.parent.removeChild(this.guideBubble);
        SoundUtils.instance().playHitBoxSound();
        var pv = evt.currentTarget;
        // //console.log("pv.id"+pv.id);
        if (pv.id == 2) {
            if (this.timer.delay > 0) {
                // this.timer.delay -= 100;
                this.timer.delay = 0.7 * this.timer.delay;
            }
            else {
                this.timer.delay = 1000;
            }
            pv.setPlayTime(1);
        }
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /********************************************************************************* */
    /*---------------------------------------------------金币计算------------------------------------------------------*、
    /**
     * 总金币计算
     * author:bigfootzq
     * date:2018/09/11
     */
    ElementViewManage.prototype.addCoin = function () {
        console.log("生成免费奖励次数：" + this.rewardTimer.repeatCount);
        console.log("生成免费奖励当前次数：" + this.rewardTimer.currentCount);
        console.log(this.rewardTimer.repeatCount - this.rewardTimer.currentCount);
        // //console.log("每秒加金币："+GameData.secCoin);
        var secTotalcoin = this.addSecCoin();
        // let gbg= new GameBackGround();
        // //console.log(GameBackGround.hTimerStatus);
        if (GameBackGround.hTimerStatus) {
            GameData.secCoin = CommonFuction.cheng(secTotalcoin, '5');
            this.floatCoinTimer.delay = 200;
        }
        else {
            GameData.secCoin = secTotalcoin;
            this.floatCoinTimer.delay = 1000;
        }
        // GameData.coin  += Number(secTotalcoin);
        GameData.coin = CommonFuction.jia(GameData.coin, GameData.secCoin);
        this._coinLabel.text = this.numZero(GameData.coin);
        this._coinSecLabel.text = this.numZero(GameData.secCoin);
    };
    /**
     * 数字补零
     */
    ElementViewManage.prototype.addPreZero = function (num) {
        return ('00' + num).slice(-3);
    };
    /**
     * 数字去零计算
     */
    ElementViewManage.prototype.numZero = function (num) {
        // //console.log("数字去0计算"+num);
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
    /**
     * 数字去零计算舍去小数点
     */
    ElementViewManage.prototype.numZero2 = function (num) {
        // //console.log("数字去0计算"+num);
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
            numString = numString.slice(0, -1 * zeroNumber * 3) + zeroConfigArr[zeroNumber - 1].company;
        }
        else {
            numString = Math.round(num).toString();
        }
        return numString;
    };
    /**
     * 秒产金币计算
     * author:bigfootzq
     * date:2018/09/11
     */
    ElementViewManage.prototype.addSecCoin = function () {
        var secTotalcoin = '0';
        var houseDownArr = RES.getRes("housedown_config_json"); //读取房子等级生成金币数据
        //遍历GameData.elements[],对每个等级的房子乘以秒产，每秒刷新一次
        for (var l = 0; l < this.elementViews.length; l++) {
            if (this.elementViews[l].grade != 0) {
                // let houseSecCoin:number = houseDownArr[this.elementViews[l].grade-1].coin_num * Math.pow(10,houseDownArr[this.elementViews[l].grade-1].coin_Base);
                var houseSecCoin = houseDownArr[this.elementViews[l].grade - 1].coin_num;
                // secTotalcoin = CommonFuction.jia(secTotalcoin,CommonFuction.cheng(this.elementViews[l].grade.toString(),houseSecCoin));
                secTotalcoin = CommonFuction.jia(secTotalcoin, houseSecCoin);
            }
        }
        // //console.log("每秒增加金币："+secTotalcoin );
        // if (CommonFuction.compareMax(secTotalcoin,GameData.secCoin)){
        // 	GameData.secCoin = secTotalcoin
        // }
        // //console.log("每秒增加金币返回值："+GameData.secCoin );
        return secTotalcoin;
    };
    ElementViewManage.prototype.floatCoin = function () {
        var houseDownArr = RES.getRes("housedown_config_json"); //读取房子等级生成金币数据
        for (var l = 0; l < this.elementViews.length; l++) {
            if (this.elementViews[l].time != 0 && this.elementViews[l].grade > 0) {
                // //console.log("飘字 : ");
                // //console.log(this.elementViews[l].grade-1);
                var houseSecCoin = houseDownArr[this.elementViews[l].grade - 1].coin_num;
                // let houseSecCoin:number = houseDownArr[this.elementViews[l].grade-1].coin_num * Math.pow(10,houseDownArr[this.elementViews[l].grade-1].coin_Base);
                var curretTime = new Date().getTime();
                var timeDiffrent = Math.floor((curretTime - this.elementViews[l].time) / 1000);
                // //console.log("curretTime : "+ curretTime );
                // //console.log("thisTime : "+ this.elementViews[l].time);
                // //console.log("timeDiffrent : "+ timeDiffrent );
                // //console.log(houseDownArr[this.elementViews[l].grade-1].coin_time);
                // //console.log("求余 : ");
                // //console.log(Number(timeDiffrent) % Number(houseDownArr[this.elementViews[l].grade-1].coin_time*2) );
                var speed = void 0;
                var index = 1;
                if (GameBackGround.hTimerStatus) {
                    speed = 160;
                    index = 5;
                }
                else {
                    speed = 800;
                    index = 1;
                    this.plusIndex = 1;
                }
                if (Number(timeDiffrent) % Number(houseDownArr[this.elementViews[l].grade - 1].coin_time * 2) == 0 && this._isDeleteOver) {
                    // console.log("飘出金币")
                    this.plusIndex--;
                    // console.log(this.plusIndex);
                    if (this.plusIndex == 0) {
                        this.elementViews[l].playScale();
                        SoundUtils.instance().playHouseCoinSound();
                        this.plusIndex = index;
                    }
                    this.floatCoinText(this.numZero2(houseSecCoin), this.elementViews[l].targetX() - 15, this.elementViews[l].targetY() - 15, speed);
                }
            }
        }
    };
    ElementViewManage.prototype.showSynthesisGird = function (id, grade) {
        var gbg = new GameBackGround();
        for (var l = 0; l < this.elementViews.length; l++) {
            if (this.elementViews[l].grade == grade && this.elementViews[l].grade > 0 && this.elementViews[l].id != id) {
                //console.log(this.elementViews[l].location);
                var i = Math.floor(this.elementViews[l].location / GameData.MaxColumn);
                var t = this.elementViews[l].location % GameData.MaxColumn;
                var gird = new egret.Bitmap();
                gird.width = GameData.girdWidth;
                gird.height = GameData.girdWidth * 0.6;
                gird.x = 20 + GameData.girdWidth / 5 + (GameData.girdWidth + GameData.girdWidth / 5) * t;
                gird.y = GameData.startY + 20 + GameData.girdWidth * i;
                if (GameData.mapData[i][t] != -1) {
                    gird.texture = RES.getRes("drag_synthesis_small_png"); //载入地块
                }
                this._layer.addChildAt(this.dragContainer, 0);
                this.dragContainer.addChild(gird);
            }
        }
    };
    ElementViewManage.prototype.addMoveinSetGird = function (id) {
        this.moveinSetGrid = new egret.Bitmap();
        var i = Math.floor(this.elementViews[id].location / GameData.MaxColumn);
        var t = this.elementViews[id].location % GameData.MaxColumn;
        this.moveinSetGrid.width = GameData.girdWidth;
        this.moveinSetGrid.height = GameData.girdWidth * 0.6;
        this.moveinSetGrid.x = 20 + GameData.girdWidth / 5 + (GameData.girdWidth + GameData.girdWidth / 5) * t;
        this.moveinSetGrid.y = GameData.startY + 20 + GameData.girdWidth * i;
        this.moveinSetGrid.texture = RES.getRes("drag_moveinset_small_png"); //载入地块
        this.dragContainer.addChild(this.moveinSetGrid);
        this._movein = true;
    };
    ElementViewManage.prototype.clearSynthesisGird = function () {
        while (this.dragContainer.numChildren) {
            this.dragContainer.removeChildAt(0);
        }
    };
    /*-----------------------------播放 删除动画--------------------------------------*/
    /**
     * isBack = true
     * 可以交换，但是交换后没有发生位置移动
     * 移除焦点
     * 播放一个交换的动画，然后两个位置再换回来
     * isBack=false
     * 播放 删除动画-
    */
    ElementViewManage.prototype.changeLocationWithScaleOrBack = function (id1, id2, isBack) {
        //从 e1id 交换到 e2id
        var e1id = id1; //有焦点的元素
        var e2id = id2;
        if (this.elementViews[id2].focus) {
            e1id = id2;
            e2id = id1;
        }
        var temp = this.elementViews[e1id].location;
        this.elementViews[e1id].location = this.elementViews[e2id].location;
        this.elementViews[e2id].location = temp;
        GameData.elements[e1id].location = this.elementViews[e1id].location;
        GameData.elements[e2id].location = this.elementViews[e2id].location;
        // this.elementViews[e1id].setFocus(false);
        if (this._layer.getChildIndex(this.elementViews[e1id]) < this._layer.getChildIndex(this.elementViews[e2id])) {
            this._layer.swapChildren(this.elementViews[e1id], this.elementViews[e2id]);
        }
        if (isBack) {
            var xx = this.elementViews[e1id].targetX();
            var yy = this.elementViews[e1id].targetY();
            var x = this.elementViews[e2id].targetX();
            var y = this.elementViews[e2id].targetY();
            this.elementViews[e1id].moveTo(xx, yy);
            this.elementViews[e2id].moveTo(x, y);
            // this.elementViews[e1id].moveAndBack(this.elementViews[e2id].location,true);
            // this.elementViews[e2id].moveAndBack(this.elementViews[e1id].location);
        }
        else {
            this.elementViews[e1id].moveAndScale(this.elementViews[e2id].location, true);
            this.elementViews[e2id].moveAndScale(this.elementViews[e1id].location);
        }
        this._currentTapID = -1;
    };
    /**
     * 播放曲线动画，此类型动画用于可消除过关条件得情况
     */
    ElementViewManage.prototype.playReqRemoveAn = function (id, tx, ty) {
        this.moveEleNum++;
        var el = this.elementViews[id];
        if (el.parent) {
            this._layer.setChildIndex(el, this._layer.numChildren);
        }
        el.playCurveMove(tx, ty);
    };
    /**
     * 播放放大动画，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
     */
    ElementViewManage.prototype.playRemoveAni = function (id) {
        // this.moveEleNum++;
        var el = this.elementViews[id];
        if (el.parent) {
            this._layer.setChildIndex(el, this._layer.numChildren);
        }
        el.playRemoveAni();
    };
    /**
     * scale控制播放放大动画，默认放大，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
     */
    ElementViewManage.prototype.playRecycleAni = function (id, x, y, scale) {
        if (scale === void 0) { scale = true; }
        // this.moveEleNum++;
        var el = this.elementViews[id];
        if (el.parent) {
            this._layer.setChildIndex(el, this._layer.numChildren);
        }
        if (scale) {
            el.playRecycleAni(x, y);
        }
        else {
            el.playRemoveAniNoScale(x, y);
        }
    };
    /**
     * 删除完毕重新开始计时
     */
    ElementViewManage.prototype.delOver = function (evt) {
        if (evt) {
            // //console.log("删除完毕");
            this._isDeleteOver = true;
        }
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    //删除动画完成，现在更新地图元素
    ElementViewManage.prototype.updateMap = function (evt) {
        this.moveEleNum--;
        if (this.moveEleNum == 0) {
            this.dispatchEvent(evt);
        }
    };
    ElementViewManage.prototype.addLevelExp = function (grade) {
        var levelExp = 0;
        var houseDownArr = RES.getRes("housedown_config_json"); //读取房子等级生成金币数据
        if (grade >= 1) {
            levelExp = houseDownArr[grade - 1].down_exp;
        }
        GameData.levelExp += Number(levelExp);
        this.tempExp += Number(levelExp);
        if (this.tempExp >= 80) {
            //console.log("将总资产上传到云");
            var score = CommonFuction.jia(GameData.coin, GameData.cost);
            platform.setUserCloudStorage([{ key: "score", value: this.numZero(score) + "" }]); //将总资产上传到云
            this.tempExp = 0;
        }
    };
    /**
     *
     */
    ElementViewManage.prototype.starHandler = function (x, y) {
        //console.log("经验值黄星");
        var star1 = ResourceUtils.createBitmapByName("star_png");
        star1.width = GameData.girdWidth * 0.44;
        star1.height = GameData.girdWidth * 0.53;
        star1.x = x - star1.width / 2;
        star1.y = y - star1.height / 2;
        ;
        this._layer.addChild(star1);
        var star2 = ResourceUtils.createBitmapByName("star_png");
        star2.width = GameData.girdWidth * 0.44 * 0.8;
        star2.height = GameData.girdWidth * 0.53 * 0.8;
        star2.x = x - star2.width / 2;
        star2.y = y - star2.height / 2;
        ;
        this._layer.addChild(star2);
        var star3 = ResourceUtils.createBitmapByName("star_png");
        star3.width = GameData.girdWidth * 0.44 * 0.4;
        star3.height = GameData.girdWidth * 0.53 * 0.4;
        star3.x = x - star3.width / 2;
        star3.y = y - star3.height / 2;
        ;
        this._layer.addChild(star3);
        var tw1 = egret.Tween.get(star1);
        var tw2 = egret.Tween.get(star2);
        var tw3 = egret.Tween.get(star3);
        tw1.to({ x: 20, y: 30 }, 1000, egret.Ease.cubicInOut);
        tw2.wait(250).to({ scaleX: 0.8, scaleY: 0.8, x: 29, y: 39 }, 750, egret.Ease.cubicInOut);
        tw3.wait(500).to({ scaleX: 0.4, scaleY: 0.4, x: 48, y: 58 }, 500, egret.Ease.cubicInOut).call(function () {
            this._layer.removeChild(star1);
            this._layer.removeChild(star2);
            this._layer.removeChild(star3);
            ;
        }, this);
    };
    /**
     * 经验值超过过关经验值的时候发出消息
     * author:bigfootzq
     * date:2018/09/01
     */
    ElementViewManage.prototype.levelExpUp = function (evt) {
        if (GameData.levelExp >= GameData.levelReqExp) {
            // //console.log("levelExpup函数"+GameData.coin)
            // //console.log("levelExpup函数"+GameData.levelCoin)
            // GameData.coin +=  Number(GameData.levelCoin);//通关加奖励金币
            this.timer.stop(); //这一关结束了，暂停计时器
            this.coinTimer.stop();
            this.floatCoinTimer.stop();
            SoundUtils.instance().stopBg();
            // //console.log("免费ICON的布尔值："+this._addReward.toString())
            egret.localStorage.setItem("rewardIconStatus", this._addReward.toString());
            this.dispatchEvent(evt);
            var userGameData = egret.localStorage.getItem("userGameData");
            if (userGameData) {
                //console.log("读取旧数据成功")
                var oldData = JSON.parse(userGameData);
                //console.log(oldData);
                if (CommonFuction.compareMax(oldData.cost, GameData.cost)) {
                    GameData.cost = oldData.cost;
                }
            }
            else {
                //console.log("没有旧数据");        
            }
            var score = CommonFuction.jia(GameData.coin, GameData.cost);
            platform.setUserCloudStorage([{ key: "score", value: this.numZero(score) + "" }]); //将总资产上传到云
        }
    };
    ElementViewManage.prototype.getLevelUpPanel = function () {
        this.timer.stop();
        this._layer.addChild(this._levelUpPanel);
        var levelUpMask = new egret.Shape();
        levelUpMask.graphics.beginFill(0x000000, 0.8);
        levelUpMask.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        levelUpMask.graphics.endFill();
        levelUpMask.alpha = 0.8;
    };
    ElementViewManage.prototype.createRecycle = function () {
        //console.log("添加回收站");
        this.recycle.width = GameData.girdWidth * 0.6 + 5;
        this.recycle.height = GameData.girdWidth * 0.708 + 5;
        var x = GameData.stageW - 10 - this.recycle.width * 3 / 2 - 5;
        var y = GameData.stageH - this.recycle.height - GameData.girdWidth * 1.21 - 15;
        this.recycle.graphics.beginFill(0x000000, 0);
        // this.recycle.graphics.drawRect(this.recycle.x,this.recycle.y,this.recycle.width,this.recycle.height);
        this.recycle.graphics.drawRect(x, y, this.recycle.width, this.recycle.height);
        this.recycle.graphics.endFill();
        this._layer.addChild(this.recycle);
    };
    ElementViewManage.prototype.openConfirmRecycle = function () {
        this.timer.stop();
        this.floatCoinTimer.stop();
        SoundUtils.instance().playClickSound();
        this._layer.addChild(this._confirmRecycleContainer);
        var confirmBase = ResourceUtils.createBitmapByName("reclaim_base_png");
        confirmBase.x = GameData.stageW / 2 - confirmBase.width / 2;
        confirmBase.y = GameData.stageH / 2 - confirmBase.height / 2;
        var confirmMask = new egret.Shape();
        confirmMask.graphics.beginFill(0x000000, 0.8);
        confirmMask.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        confirmMask.graphics.endFill();
        confirmMask.alpha = 0.8;
        this._confirmRecycleContainer.addChild(confirmMask);
        this._confirmRecycleContainer.addChild(confirmBase);
        var grade = this._hitEv.grade;
        var newHouse = ResourceUtils.createBitmapByName("house#houses_a_" + this.addPreZero(grade) + "_big");
        newHouse.x = confirmBase.x + confirmBase.width / 2 - newHouse.width / 2;
        newHouse.y = confirmBase.y + GameData.stageW / 10;
        //房子等级
        var houseLevelLabel = new egret.TextField();
        houseLevelLabel.text = "LV " + grade.toString();
        houseLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
        houseLevelLabel.fontFamily = "黑体";
        houseLevelLabel.size = 20;
        houseLevelLabel.textColor = 0X7D3705;
        houseLevelLabel.width = newHouse.width;
        houseLevelLabel.x = newHouse.x;
        houseLevelLabel.y = newHouse.y + newHouse.height + 15;
        this._confirmRecycleContainer.addChild(newHouse);
        this._confirmRecycleContainer.addChild(houseLevelLabel);
        //房子价格
        var newHouseCoin = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
        newHouseCoin.x = confirmBase.x + confirmBase.width / 4 + 18;
        newHouseCoin.y = houseLevelLabel.y + houseLevelLabel.height + 25;
        var housePriceLabel = new egret.TextField();
        // let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade-1].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade-1].coinBase);
        // let housePrice:number =  Number(this._buyHouseConfigArray[this._hitEv.grade-1].coinNum);
        var housePrice = this._buyHouseConfigArray[this._hitEv.grade - 1].coinNum;
        housePriceLabel.text = this.numZero(housePrice);
        housePriceLabel.textAlign = egret.HorizontalAlign.CENTER;
        housePriceLabel.size = 20;
        housePriceLabel.fontFamily = "黑体";
        housePriceLabel.width = newHouse.width;
        housePriceLabel.height = newHouseCoin.height;
        housePriceLabel.x = houseLevelLabel.x;
        housePriceLabel.y = newHouseCoin.y + 4;
        this._confirmRecycleContainer.addChild(newHouseCoin);
        this._confirmRecycleContainer.addChild(housePriceLabel);
        this._confirmBtn = ResourceUtils.createBitmapByName("reclaim_sure_png");
        this._confirmBtn.touchEnabled = true;
        this._confirmBtn.x = confirmBase.x + (confirmBase.width / 2 - this._confirmBtn.width) / 2;
        this._confirmBtn.y = confirmBase.y + confirmBase.height * 3 / 4 - 20;
        var closeBtn = ResourceUtils.createBitmapByName("reclaim_cancel_png");
        closeBtn.touchEnabled = true;
        closeBtn.x = confirmBase.x + confirmBase.width / 2 + (confirmBase.width / 2 - closeBtn.width) / 2;
        closeBtn.y = confirmBase.y + confirmBase.height * 3 / 4 - 20;
        this._confirmRecycleContainer.addChild(this._confirmBtn);
        this._confirmRecycleContainer.addChild(closeBtn);
        this._confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeConfirmRecycle, this);
        var disableConfirm = new egret.Shape();
        disableConfirm.graphics.beginFill(0x000000, 0);
        disableConfirm.graphics.drawRect(confirmBase.x + confirmBase.width / 5, confirmBase.y + confirmBase.height * 0.85, 60, 25);
        disableConfirm.graphics.endFill();
        disableConfirm.touchEnabled = true;
        disableConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.disableConfirm, this);
        this._confirmRecycleContainer.addChild(disableConfirm);
        this._reclaimCheck.x = confirmBase.x + confirmBase.width / 5 + 5;
        this._reclaimCheck.y = confirmBase.y + confirmBase.height * 0.85;
    };
    /**
     * 关闭确认删除面板
     */
    ElementViewManage.prototype.closeConfirmRecycle = function () {
        //console.log("关闭删除面板");
        this.timer.start();
        this.floatCoinTimer.start();
        SoundUtils.instance().playCloseSound();
        while (this._confirmRecycleContainer.numChildren) {
            this._confirmRecycleContainer.removeChildAt(0);
        }
        this._layer.removeChild(this._confirmRecycleContainer);
        this._hitEv.back();
    };
    ElementViewManage.prototype.confirm = function () {
        //console.log("确认删除")
        var x = GameData.stageW - 10 - this.recycle.width - 5;
        var y = GameData.stageH - this.recycle.height / 2 - GameData.girdWidth * 1.21 - 15;
        this.deleteElement(this._hitEv.id, x, y);
        var housePrice = this._buyHouseConfigArray[this._hitEv.grade].coinNum;
        // let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade].coinBase);
        // GameData.coin += Number(housePrice);
        GameData.coin = CommonFuction.jia(GameData.coin.toString, housePrice);
        this._coinLabel.text = this.numZero(GameData.coin);
        this.closeConfirmRecycle();
    };
    ElementViewManage.prototype.disableConfirm = function () {
        if (!this._isDisableConfirm) {
            this._confirmRecycleContainer.addChild(this._reclaimCheck);
            this._isDisableConfirm = true;
        }
        else {
            if (this._reclaimCheck.parent) {
                this._reclaimCheck.parent.removeChild(this._reclaimCheck);
                this._isDisableConfirm = false;
            }
        }
    };
    /***
     * 删除房子
     * author:bigfootzq
     * date:2018/11/22
     */
    ElementViewManage.prototype.recycleHouse = function (evt) {
        this._hitEv = evt.currentTarget;
        var isHit = this.recycle.hitTestPoint(evt.stageX, evt.stageY);
        //console.log("删除碰撞检测"+isHit);
        if (isHit) {
            //console.log("删除元素");
            if (this._isDisableConfirm) {
                //console.log("直接删除元素");
                this.deleteElement(this._hitEv.id, evt.stageX, evt.stageY);
                // let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade].coinBase);
                var housePrice = this._buyHouseConfigArray[this._hitEv.grade].coinNum;
                GameData.coin = CommonFuction.jia(GameData.coin, housePrice);
                this._coinLabel.text = this.numZero(GameData.coin);
            }
            else {
                this.openConfirmRecycle();
                var x = GameData.stageW - 10 - this.recycle.width - 5;
                var y = GameData.stageH - this.recycle.height / 2 - GameData.girdWidth * 1.21 - 15;
                this._hitEv.moveTo(x, y);
            }
        }
        else {
            this._hitEv.back();
        }
    };
    /***
     * 新版删除房子
     * author:bigfootzq
     * date:2018/12/24
     */
    ElementViewManage.prototype.delHouse = function (ev) {
        this._hitEv = ev;
        var x = GameData.stageW / 2 - GameData.girdWidth * 1.3 / 2;
        ;
        var y = GameData.stageH - GameData.girdWidth * 1.64;
        var rectA = this._hitEv.getBounds();
        var rectB = new egret.Rectangle(x, y, GameData.girdWidth * 1.3, GameData.girdWidth * 1.44);
        ;
        //必须加上方块所在的x，y
        rectA.x += this._hitEv.x;
        rectA.y += this._hitEv.y;
        // rectB.x += x;
        // rectB.y += y;
        // let isHit:boolean = ev1.hitTestPoint(ev2.targetX(),ev2.targetY());
        var isHit = rectA.intersects(rectB);
        //console.log("删除碰撞检测"+isHit);
        if (isHit) {
            //console.log("直接删除元素");
            // console.log(this._hitEv);
            // console.log(this._hitEv.id);
            // console.log(GameData.elements[this._hitEv.id].grade);
            // let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade].coinBase);
            var housePrice = this._buyHouseConfigArray[this._hitEv.grade - 1].sellcoefficient;
            GameData.coin = CommonFuction.jia(GameData.coin, housePrice);
            this.delfloatCoinText(this._hitEv.x, this._hitEv.y, this._hitEv.grade);
            this._coinLabel.text = this.numZero(GameData.coin);
            this.deleteElement(this._hitEv.id, this._hitEv.x, this._hitEv.y);
        }
        else {
            this._hitEv.back();
        }
    };
    /**
     * 直接删除元素
     * author:bigfootzq
     * date:2018/11/18
     */
    ElementViewManage.prototype.deleteElement = function (id, x, y) {
        var i = Math.floor(this.elementViews[id].location / GameData.MaxColumn);
        var t = this.elementViews[id].location % GameData.MaxColumn;
        if (GameData.elements[id].type !== 'b0' || GameData.elements[id].type !== 'b1') {
            this._isDeleteOver = false;
            this.playRecycleAni(id, x, y);
        }
        this.elementViews[id].grade = GameData.elements[id].grade = 0;
        this.elementViews[id].time = GameData.elements[id].time = 0;
        if (GameData.availableMapId.length == 0) {
            this.timer.start();
            //console.log(GameData.availableMapId.length);
            GameData.mapData[i][t] = -2; //删除元素后把这块格子置为-2,表示无元素
            GameData.availableMapId.push(id); //将空白地块加入可用地图数组
            if (!this.helpHandleTimer.running) {
                this.helpHandleTimer.reset();
                this.helpHandleTimer.start();
            }
        }
        else {
            GameData.mapData[i][t] = -2; //删除元素后把这块格子置为-2,表示无元素
            GameData.availableMapId.push(id); //将空白地块加入可用地图数组
        }
    };
    /**
     * 回收房屋金币飘字
     */
    ElementViewManage.prototype.delfloatCoinText = function (x, y, grade) {
        // console.log("删除房屋金币飘字");
        var housePrice = this._buyHouseConfigArray[grade - 1].sellcoefficient;
        var coinView = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
        coinView.x = x;
        coinView.y = y;
        var txtView = new egret.TextField;
        // txtView.textColor = 0xDC143C;
        txtView.textColor = 0xFFFFFF;
        txtView.text = this.numZero(housePrice);
        txtView.bold = true;
        txtView.size = 30;
        txtView.x = coinView.x + coinView.width;
        txtView.y = coinView.y;
        this._layer.addChild(coinView);
        this._layer.addChild(txtView);
        var twn = egret.Tween.get(coinView);
        twn.wait(200).to({ "alpha": 1, x: 20, y: GameData.girdWidth - 10, scaleX: 1.2, scaleY: 1.2 }, 1000, egret.Ease.sineInOut).to({ scaleX: 1, scaleY: 1 }).call(function () {
            this._layer.removeChild(coinView);
        }, this);
        var twn = egret.Tween.get(txtView);
        twn.wait(200).to({ "alpha": 1, x: 20 + GameData.girdWidth / 3, y: GameData.girdWidth - 10, scaleX: 1.2, scaleY: 1.2 }, 1000, egret.Ease.sineInOut).to({ scaleX: 1, scaleY: 1 }).call(function () {
            this._layer.removeChild(txtView);
        }, this);
    };
    ElementViewManage.prototype.openShop = function () {
        //console.log('打开商店');
        this.timer.stop();
        this.rewardTimer.stop();
        SoundUtils.instance().playClickSound();
        this._layer.parent.addChild(this._shopContainer);
        var shopBase = ResourceUtils.createBitmapByName("shop#shop_base_png");
        shopBase.width = GameData.stageW;
        shopBase.height = shopBase.width * 0.618;
        shopBase.x = 0;
        shopBase.y = GameData.stageH - shopBase.height;
        var shopMask = new egret.Shape();
        shopMask.graphics.beginFill(0x000000, 0.8);
        shopMask.graphics.drawRect(shopBase.x, shopBase.y + GameData.stageW / 16, shopBase.width, shopBase.height);
        shopMask.graphics.endFill();
        shopMask.alpha = 0.8;
        this._shopContainer.addChild(shopMask);
        this._shopContainer.addChild(shopBase);
        var closeShopBtn = ResourceUtils.createBitmapByName("shop#shop_close_png");
        closeShopBtn.touchEnabled = true;
        closeShopBtn.x = GameData.stageW - closeShopBtn.width;
        closeShopBtn.y = GameData.stageH - shopBase.height;
        this._shopContainer.addChild(closeShopBtn);
        closeShopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeShop, this);
        //创建内容，
        this._cards = this.createCards();
        // this._cards.cacheAsBitmap = true;
        // this._cards.touchEnabled = true;
        // //创建ScrollView
        this._cardScrollView = new egret.ScrollView();
        this._cardScrollView.setContent(this._cards);
        this._cardScrollView.width = shopBase.width;
        this._cardScrollView.height = shopBase.height;
        this._cardScrollView.x = shopBase.width / 2;
        this._cardScrollView.y = GameData.stageH - shopBase.height / 2;
        this._cardScrollView.anchorOffsetX = this._cardScrollView.width / 2;
        this._cardScrollView.anchorOffsetY = this._cardScrollView.height / 2;
        this._cardScrollView.setScrollLeft(this._openScrollX);
        //垂直滚动设置为 on 
        this._cardScrollView.verticalScrollPolicy = "off";
        //水平滚动设置为 auto
        this._cardScrollView.horizontalScrollPolicy = "on";
        // //console.log(this._cards);
        this._shopContainer.addChild(this._cardScrollView);
    };
    ElementViewManage.prototype.closeShop = function () {
        //console.log("关闭商店");
        this.timer.start();
        this.rewardTimer.start();
        SoundUtils.instance().playCloseSound();
        while (this._shopContainer.numChildren) {
            this._shopContainer.removeChildAt(0);
        }
        this._layer.parent.removeChild(this._shopContainer);
    };
    ElementViewManage.prototype.createCards = function (level) {
        if (level === void 0) { level = 0; }
        var cards = new egret.Sprite();
        this._shopCardArr = new Array();
        this._housePriceLabelArr = new Array();
        this._buyBtnArr = new Array();
        cards.height = GameData.stageW * 0.375;
        // cards.cacheAsBitmap = true;
        // cards.width = GameData.stageW*2.5;//不定义滚动卡片的宽度
        var availableBuyHouseArr = RES.getRes("available_buy_house_json");
        this.availableHouseLevel = availableBuyHouseArr[GameData.maxHouseGrade - 1].availableLevel;
        // //console.log( this._buyHouseConfigArray);
        // //console.log(availableHouseLevel);
        // //console.log(GameData.maxHouseGrade);
        for (var i = 0; i <= GameData.elementTypes.length; i++) {
            //房卡底图
            var shopCard = ResourceUtils.createBitmapByName("shop#shop_card_png");
            var houseNameLabel = new egret.TextField();
            var houseLevel = i + 1;
            var shopHouse = null;
            var houseLevelLabel = new egret.TextField();
            this._housePriceLabel = new egret.TextField();
            // let housePrice:number =   this._buyHouseConfigArray[i].coinNum * Math.pow(10, this._buyHouseConfigArray[i].coinBase) * (1+ this._buyHouseConfigArray[i].buff*GameData.houseBuyNumber[i]/10000); 
            var housePrice = '0';
            if (GameData.houseBuyNumber[i] < this._buyHouseConfigArray[i].additionmax) {
                //  housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].addition * GameData.houseBuyNumber[i];
                housePrice = CommonFuction.jia(this._buyHouseConfigArray[i].coinNum, CommonFuction.cheng(this._buyHouseConfigArray[i].addition, GameData.houseBuyNumber[i].toString()));
            }
            else {
                // housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].additionmax * GameData.houseBuyNumber[i];	
                housePrice = CommonFuction.jia(this._buyHouseConfigArray[i].coinNum, CommonFuction.cheng(this._buyHouseConfigArray[i].addition, this._buyHouseConfigArray[i].additionmax));
            }
            //  //console.log(housePrice);
            var buyBtn = ResourceUtils.createBitmapByName("shop#shop_buy_02_png");
            var buyBtnCoin = ResourceUtils.createBitmapByName("shop#shop_money_02_png");
            var shopBuyLock = ResourceUtils.createBitmapByName("shop#shop_buy_lock_png");
            this.buyBtnView = new ShopCardView(houseLevel);
            this.buyBtnView.houseLevel = houseLevel;
            this.buyBtnView.housePrcice = housePrice;
            // this._shopCardArr.push(buyBtnView);
            if (houseLevel <= this.availableHouseLevel) {
                shopHouse = ResourceUtils.createBitmapByName("house#houses_a_" + this.addPreZero(houseLevel) + "_big");
                houseNameLabel.text = availableBuyHouseArr[i].housename;
                if (CommonFuction.compareMax(GameData.coin, housePrice)) {
                    // buyBtn = ResourceUtils.createBitmapByName("shop_buy_01_png");
                    this.buyBtnView.bitmap.texture = RES.getRes("shop#shop_buy_01_png");
                    this.buyBtnView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyHouse, this);
                    buyBtnCoin = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
                    this._housePriceLabel.textColor = 0X681B00;
                    this._openScrollX = 20 + (10 + shopCard.width) * i - 10 - shopCard.width / 2;
                }
                else {
                    buyBtn = ResourceUtils.createBitmapByName("shop#shop_buy_02_png");
                    buyBtnCoin = ResourceUtils.createBitmapByName("shop#shop_money_02_png");
                    this._housePriceLabel.textColor = 0X333333;
                }
            }
            else {
                shopHouse = ResourceUtils.createBitmapByName("house#houses_a_" + this.addPreZero(houseLevel) + "_black");
                buyBtn = ResourceUtils.createBitmapByName("shop#shop_buy_02_png");
                houseNameLabel.text = "???";
            }
            shopCard.width = GameData.stageW / 4;
            shopCard.height = GameData.stageW * 0.375;
            shopCard.y = shopCard.height / 2;
            shopCard.x += 20 + (10 + shopCard.width) * i;
            //房子名称
            houseNameLabel.textAlign = egret.HorizontalAlign.CENTER;
            houseNameLabel.size = 18;
            houseNameLabel.textColor = 0XFFFFFF;
            houseNameLabel.width = shopCard.width * 0.8;
            houseNameLabel.x = shopCard.x + shopCard.width / 10;
            houseNameLabel.y = shopCard.y + 24;
            //房子
            shopHouse.x = shopCard.x + shopCard.width / 2 - shopHouse.width / 2;
            shopHouse.y = shopCard.y + shopCard.height / 2 - shopHouse.height / 2;
            //购买按钮
            this.buyBtnView.x = buyBtn.x = shopCard.x + (shopCard.width - buyBtn.width) / 2;
            this.buyBtnView.y = buyBtn.y = shopCard.y + shopCard.height - buyBtn.height / 2;
            shopBuyLock.x = buyBtn.x + buyBtn.width / 2 - shopBuyLock.width / 2;
            shopBuyLock.y = buyBtn.y + (buyBtn.height - shopBuyLock.height) / 2;
            //房子等级
            houseLevelLabel.text = "LV " + houseLevel.toString();
            houseLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
            houseLevelLabel.fontFamily = "黑体";
            houseLevelLabel.bold = true;
            houseLevelLabel.size = 18;
            houseLevelLabel.textColor = 0X7D3705;
            houseLevelLabel.width = shopCard.width * 0.8;
            houseLevelLabel.x = shopCard.x + shopCard.width / 10;
            houseLevelLabel.y = buyBtn.y - houseLevelLabel.height - 8;
            //购买按钮金币
            buyBtnCoin.x = buyBtn.x + 8;
            buyBtnCoin.y = buyBtn.y + (buyBtn.height - buyBtnCoin.height) / 2 - 3;
            //房子价格
            this._housePriceLabel.text = this.numZero(housePrice);
            this._housePriceLabel.textAlign = egret.HorizontalAlign.CENTER;
            this._housePriceLabel.size = 20;
            this._housePriceLabel.width = buyBtn.width - buyBtnCoin.width;
            this._housePriceLabel.height = buyBtn.height;
            this._housePriceLabel.x = buyBtnCoin.x + buyBtnCoin.width;
            this._housePriceLabel.y = buyBtnCoin.y + 5;
            // //console.log(this.numZero(housePrice));
            this._housePriceLabelArr.push(this._housePriceLabel);
            this._buyBtnArr.push(buyBtnCoin);
            cards.addChild(shopCard);
            cards.addChild(houseNameLabel);
            cards.addChild(shopHouse);
            cards.addChild(houseLevelLabel);
            if ((houseLevel == this.availableHouseLevel) && GameData.houseBuyNumber[houseLevel - 1] == 0) {
                this._newIcon = ResourceUtils.createBitmapByName("shop#shop_new_png");
                this._newIcon.x = 20 + (10 + shopCard.width) * (this.availableHouseLevel - 1) + shopCard.width / 2 - this._newIcon.width / 2;
                this._newIcon.y = houseNameLabel.y + houseNameLabel.height + 10;
                cards.addChild(this._newIcon);
            }
            if (houseLevel <= this.availableHouseLevel) {
                if (CommonFuction.compareMax(GameData.coin, housePrice)) {
                    cards.addChild(this.buyBtnView);
                }
                else {
                    cards.addChild(buyBtn);
                }
                cards.addChild(buyBtnCoin);
                cards.addChild(this._housePriceLabel);
            }
            else {
                cards.addChild(buyBtn);
                cards.addChild(shopBuyLock);
            }
            if (this.availableHouseLevel >= 2 && i == this.availableHouseLevel - 1 && this._addReward) {
                this._rewardShare = ResourceUtils.createBitmapByName("shop#shop_reward_share_png");
                this._rewardShare.touchEnabled = true;
                // this._rewardShare.width = shopCard.width*3/5;
                this._rewardShare.width = buyBtn.width;
                // this._rewardShare.x = 20+ (10+shopCard.width)*(this.availableHouseLevel-2) + (shopCard.width - this._rewardShare.width)/2;
                // this._rewardShare.y = shopCard.y - this._rewardShare.height/2;
                this._rewardShare.x = buyBtn.x;
                this._rewardShare.y = buyBtn.y;
                cards.addChildAt(this._rewardShare, cards.numChildren);
                this._rewardShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rewardShare, this);
            }
            // if (i == 1){
            //     let rewardVideo:egret.Bitmap = ResourceUtils.createBitmapByName("shop_reward_video_png");
            //     rewardVideo.touchEnabled = true;
            //     rewardVideo.width = shopCard.width*3/5;
            //     rewardVideo.x = 20+ shopCard.width + 20 +(shopCard.width - rewardVideo.width)/2 ;
            //     rewardVideo.y = shopCard.y - rewardVideo.height/2
            //     cards.addChild(rewardVideo);
            //     rewardVideo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rewardVedio,this);
            // }
        }
        return cards;
    };
    ElementViewManage.prototype.buyHouse = function (evt) {
        //console.log("购买房屋");     
        var newHouse = evt.currentTarget;
        var housePrice = '0';
        if (GameData.houseBuyNumber[newHouse.houseLevel - 1] < this._buyHouseConfigArray[newHouse.houseLevel - 1].additionmax) {
            //  housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].addition * GameData.houseBuyNumber[i];
            housePrice = CommonFuction.jia(this._buyHouseConfigArray[newHouse.houseLevel - 1].coinNum, CommonFuction.cheng(this._buyHouseConfigArray[newHouse.houseLevel - 1].addition, GameData.houseBuyNumber[newHouse.houseLevel - 1].toString()));
        }
        else {
            // housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].additionmax * GameData.houseBuyNumber[i];	
            housePrice = CommonFuction.jia(this._buyHouseConfigArray[newHouse.houseLevel - 1].coinNum, CommonFuction.cheng(this._buyHouseConfigArray[newHouse.houseLevel - 1].addition, this._buyHouseConfigArray[newHouse.houseLevel - 1].additionmax));
        }
        if (CommonFuction.compareMax(GameData.coin, housePrice)) {
            for (var l = 0; l < GameData.availableMapId.length; l++) {
                var id = GameData.availableMapId[l];
                var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
                var t = GameData.elements[id].location % GameData.MaxColumn;
                if (GameData.mapData[i][t] != -2) {
                    GameData.availableMapId.splice(l, 1);
                }
            }
            if (GameData.availableMapId.length == 0) {
                //console.log("没有多余空地,无法购买")
                this.removeHelpHandle();
                this.helpHandleTimer.stop(); //没有多余空地时候不显示指示助手
                this.floatText("没有多余空地啦", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
            }
            else {
                var l = Math.floor(Math.random() * GameData.availableMapId.length);
                var id = GameData.availableMapId[l]; //随机从可以使用的MapId里面抽取一个
                var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
                var t = GameData.elements[id].location % GameData.MaxColumn;
                var ele = this.elementViews[id];
                GameData.mapData[i][t] = id;
                ele.grade = 0;
                GameData.elements[id].grade = newHouse.houseLevel;
                ele.location = GameData.elements[id].location;
                GameData.elements[id].type = "b1";
                ele.setTexture("ui_box_gift_png");
                ele.x = ele.targetX();
                ele.y = GameData.startY - ele.width;
                ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50, -7);
                SoundUtils.instance().playBoxDownSound(); //播放箱子掉落音效
                GameData.availableMapId.splice(l, 1); //将使用过的MapId从可用数组里面删除
                // console.log("剩余空地:");
                // console.log(GameData.availableMapId.length);
                // console.log(GameData.availableMapId);
                if (newHouse.houseLevel == this.availableHouseLevel && GameData.houseBuyNumber[newHouse.houseLevel - 1] == 0) {
                    var cards = this._newIcon.parent;
                    if (cards) {
                        cards.removeChild(this._newIcon);
                    }
                }
                GameData.houseBuyNumber[newHouse.houseLevel - 1] += 1;
                // let housePrice:number =   this._buyHouseConfigArray[newHouse.houseLevel-1].coinNum * Math.pow(10, this._buyHouseConfigArray[newHouse.houseLevel-1].coinBase) * (1+ this._buyHouseConfigArray[newHouse.houseLevel-1].buff*GameData.houseBuyNumber[newHouse.houseLevel-1]/10000);	
                // let housePrice:number = 0;
                // if (GameData.houseBuyNumber[newHouse.houseLevel-1] < this._buyHouseConfigArray[newHouse.houseLevel-1].additionmax){
                // 	housePrice  =   Number(this._buyHouseConfigArray[newHouse.houseLevel-1].coinNum  + this._buyHouseConfigArray[newHouse.houseLevel-1].addition * GameData.houseBuyNumber[newHouse.houseLevel-1]);
                // }else{
                // 	housePrice =  Number(this._buyHouseConfigArray[newHouse.houseLevel-1].coinNum  + this._buyHouseConfigArray[newHouse.houseLevel-1].additionmax * GameData.houseBuyNumber[newHouse.houseLevel-1]);				
                // }
                if (GameData.houseBuyNumber[newHouse.houseLevel - 1] < this._buyHouseConfigArray[newHouse.houseLevel - 1].additionmax) {
                    //  housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].addition * GameData.houseBuyNumber[i];
                    housePrice = CommonFuction.jia(this._buyHouseConfigArray[newHouse.houseLevel - 1].coinNum, CommonFuction.cheng(this._buyHouseConfigArray[newHouse.houseLevel - 1].addition, GameData.houseBuyNumber[newHouse.houseLevel - 1].toString()));
                }
                else {
                    // housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].additionmax * GameData.houseBuyNumber[i];	
                    housePrice = CommonFuction.jia(this._buyHouseConfigArray[newHouse.houseLevel - 1].coinNum, CommonFuction.cheng(this._buyHouseConfigArray[newHouse.houseLevel - 1].addition, this._buyHouseConfigArray[newHouse.houseLevel - 1].additionmax));
                }
                // //console.log("购买房屋:"+ housePrice);
                this._housePriceLabelArr[newHouse.houseLevel - 1].text = this.numZero(housePrice);
                // GameData.coin -= Number(newHouse.housePrcice);
                GameData.coin = CommonFuction.jian(GameData.coin, newHouse.housePrcice);
                this._coinLabel.text = this.numZero(GameData.coin);
                // GameData.cost += Number(newHouse.housePrcice);//购买房屋的总花费
                GameData.cost = CommonFuction.jia(GameData.cost, newHouse.housePrcice);
            }
        }
        else {
            // //console.log(this.buyBtnView.parent);
            // this._cards.removeChild(this.buyBtnView);
            // this.buyBtnView.bitmap.texture = RES.getRes("shop_money_02_png");
            // this._cards.addChild(this.buyBtnView);
            this.floatText("没有足够的金币", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
        }
    };
    ElementViewManage.prototype.rewardShare = function () {
        // console.log("rewardShare");	
        if (!GameLogic.closeShare && typeof (GameLogic.closeShare) != "undefined") {
            var shareResult = platform.share("key=reward");
            egret.localStorage.setItem("fhTime", new Date().getTime().toString());
            // //console.log(shareResult);	
        }
        else {
            this.rewardHouse();
        }
    };
    //免费获得房屋
    ElementViewManage.prototype.rewardHouse = function () {
        // console.log("获得免费房屋")
        for (var l = 0; l < GameData.availableMapId.length; l++) {
            var id = GameData.availableMapId[l];
            var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
            var t = GameData.elements[id].location % GameData.MaxColumn;
            if (GameData.mapData[i][t] != -2) {
                GameData.availableMapId.splice(l, 1);
            }
        }
        if (GameData.availableMapId.length == 0) {
            //console.log("没有多余空地,无法获得免费房屋")
            this.removeHelpHandle();
            this.helpHandleTimer.stop(); //没有多余空地时候不显示指示助手
            this.floatText("没有多余空地啦", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
        }
        else {
            var l = Math.floor(Math.random() * GameData.availableMapId.length);
            var id = GameData.availableMapId[l]; //随机从可以使用的MapId里面抽取一个
            var i = Math.floor(GameData.elements[id].location / GameData.MaxColumn);
            var t = GameData.elements[id].location % GameData.MaxColumn;
            var ele = this.elementViews[id];
            GameData.mapData[i][t] = id;
            ele.grade = 0;
            var availableBuyHouseArr = RES.getRes("available_buy_house_json");
            // GameData.elements[id].grade = availableBuyHouseArr[GameData.maxHouseGrade-1].availableLevel -1;
            GameData.elements[id].grade = availableBuyHouseArr[GameData.maxHouseGrade - 1].availableLevel;
            ele.location = GameData.elements[id].location;
            GameData.elements[id].type = "b1";
            ele.setTexture("ui_box_gift_png");
            ele.x = ele.targetX();
            ele.y = GameData.startY - ele.width;
            ele.showBox((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50, -7);
            // ele.showBox(3000);
            SoundUtils.instance().playBoxDownSound(); //播放箱子掉落音效
            GameData.availableMapId.splice(l, 1); //将使用过的MapId从可用数组里面删除
            // console.log("剩余空地:");
            // console.log(GameData.availableMapId.length);
            // console.log(GameData.availableMapId);
            // console.log("标志位"+this._addReward);
            //获得免费房屋后移除里外两个标志
            if (this._addReward) {
                // console.log("移除里外两个标志");
                this._rewardShare.parent && this._rewardShare.parent.removeChild(this._rewardShare);
                this._rewardIconSprite.removeChildren();
                this._rewardIconSprite.parent && this._rewardIconSprite.parent.removeChild(this._rewardIconSprite);
                // console.log(this._rewardShareIcon.parent);
                this._addReward = false; //标志位置为false
                // console.log(this._addReward);
                this.rewardTimer.reset(); //计时器重置
                this.rewardTimer.start(); //计时器重置
                // console.log(this.rewardTimer.running);
            }
        }
        SoundUtils.instance().playBg();
    };
    ElementViewManage.prototype.rewardVedio = function () {
    };
    /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /**-----------------------------------------------飘字动画------------------------------------------------------------------------------------------------- */
    ElementViewManage.prototype.floatText = function (text, x, y, speed) {
        var txtView = new egret.TextField;
        // txtView.textColor = 0xffffff;
        txtView.textColor = 0xE84818;
        txtView.text = text;
        txtView.size = 30;
        txtView.x = x;
        txtView.y = y;
        txtView.width = GameData.stageW;
        txtView.textAlign = egret.HorizontalAlign.CENTER;
        txtView.fontFamily = "黑体";
        txtView.strokeColor = 0xffffff;
        txtView.stroke = 1;
        this._layer.parent ? this._layer.parent.addChild(txtView) : this._layer.addChild(txtView);
        var twn = egret.Tween.get(txtView);
        twn.wait(speed).to({ "alpha": 0.1, y: y - 40, scaleX: 1, scaleY: 1 }, 500).wait(500).call(function () {
            this._layer.parent ? this._layer.parent.removeChild(txtView) : this._layer.addChild(txtView);
        }, this);
    };
    ElementViewManage.prototype.floatCoinText = function (text, x, y, speed) {
        var txtView = new egret.TextField;
        // txtView.textColor = 0xDC143C;
        txtView.textColor = 0xFFFFFF;
        txtView.fontFamily = "黑体";
        txtView.text = text;
        txtView.bold = true;
        txtView.size = 30;
        txtView.width = GameData.girdWidth * 2 / 3;
        txtView.textAlign = egret.HorizontalAlign.LEFT;
        txtView.x = x;
        txtView.y = y;
        var coinView = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
        coinView.x = x - coinView.width;
        coinView.y = y;
        this._layer.addChild(coinView);
        this._layer.addChild(txtView);
        var twn = egret.Tween.get(coinView);
        twn.wait(100).to({ "alpha": 0.1, y: y - 30, scaleX: 1, scaleY: 1 }, 800, egret.Ease.sineInOut).call(function () {
            this._layer.removeChild(coinView);
        }, this);
        var twn = egret.Tween.get(txtView);
        twn.wait(100).to({ "alpha": 0.1, y: y - 30, scaleX: 1, scaleY: 1 }, 800, egret.Ease.sineInOut).call(function () {
            this._layer.removeChild(txtView);
        }, this);
    };
    /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /**------------------------------------开箱子特效------------------------------------------------------------------- */
    ElementViewManage.prototype.openBoxEffect = function (id) {
        //console.log("开箱子加特效")
        var type = GameData.elements[id].type;
        var mcData = RES.getRes("openbox_json");
        var mcTexture = RES.getRes("openbox_png");
        //创建动画工厂
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        if (type == "b0") {
            var mc1_1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("openbox"));
            mc1_1.width = this.elementViews[id].width;
            mc1_1.height = this.elementViews[id].height;
            mc1_1.x = this.elementViews[id].targetX() - GameData.girdWidth * 4 / 5 - 7;
            mc1_1.y = this.elementViews[id].targetY() - GameData.girdWidth * 4 / 5 - 15;
            // //console.log(mc1.x);
            // //console.log(mc1.y);
            this._layer.addChild(mc1_1);
            mc1_1.gotoAndPlay(1);
            mc1_1.addEventListener(egret.Event.COMPLETE, function () {
                // egret.log("1,COMPLETE");
                this._layer.removeChild(mc1_1);
            }, this);
        }
        else if (type == "b1") {
            var mc2_1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("opengift"));
            mc2_1.width = this.elementViews[id].width;
            mc2_1.height = this.elementViews[id].height;
            mc2_1.x = this.elementViews[id].targetX() - GameData.girdWidth * 4 / 5 - 7;
            mc2_1.y = this.elementViews[id].targetY() - GameData.girdWidth * 4 / 5 - 7;
            this._layer.addChild(mc2_1);
            mc2_1.gotoAndPlay(1);
            mc2_1.addEventListener(egret.Event.COMPLETE, function () {
                // egret.log("1,COMPLETE");
                this._layer.removeChild(mc2_1);
            }, this);
        }
        else {
            //console.log("合成房子特效")
            var mc3_1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("synthesis"));
            mc3_1.width = this.elementViews[id].width;
            mc3_1.height = this.elementViews[id].height;
            mc3_1.x = this.elementViews[id].targetX() - GameData.girdWidth * 4 / 5 - 7;
            mc3_1.y = this.elementViews[id].targetY() - GameData.girdWidth * 4 / 5;
            this._layer.addChild(mc3_1);
            mc3_1.gotoAndPlay(1);
            mc3_1.addEventListener(egret.Event.COMPLETE, function () {
                // egret.log("1,COMPLETE");
                this._layer.removeChild(mc3_1);
            }, this);
        }
    };
    /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /**--------------------------------------------------------切换场景----------------------------------------------------------------------------------- */
    ElementViewManage.prototype.changeScene = function () {
        //console.log("打开切换场景");
        var event = new ElementViewManageEvent(ElementViewManageEvent.OPEN_SCENES);
        this.dispatchEvent(event);
        //console.log(event);
        // let changeScenePanel = new ChangeScenePanel()
        // 	this._layer.parent.addChild(changeScenePanel);
        // 	changeScenePanel.show();
    };
    /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /*-----------------------------更新整个地图中元素位置--------------------------------------*/
    ElementViewManage.prototype.updateMapData = function () {
        //console.log("重新布局");
        var len = this.elementViews.length;
        //this.moveLocElementNum = 0;
        for (var i = 0; i < len; i++) {
            this.elementViews[i].location = GameData.elements[i].location;
            this.elementViews[i].setTexture("e" + GameData.elements[i].type + "_png");
            this.elementViews[i].moveNewLocation();
        }
    };
    ElementViewManage.prototype.moveNewLocationOver = function (event) {
        this.moveLocElementNum++;
        if (this.moveLocElementNum == (GameData.MaxColumn * GameData.MaxRow)) {
            var evt = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
            this.dispatchEvent(evt);
            this.moveLocElementNum = 0; //重置
        }
    };
    return ElementViewManage;
}(egret.EventDispatcher));
__reflect(ElementViewManage.prototype, "ElementViewManage");
//# sourceMappingURL=ElementViewManage.js.map