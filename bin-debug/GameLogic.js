var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
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
var GameLogic = (function () {
    function GameLogic(gameStage) {
        this._returnGame = true; //返回游戏
        /*-----------------------------携带道具被点击--------------------------------------
        private usePropClick(evt:PropViewManageEvent)
        {
            PropLogic.useProp(PropViewManage.propType);//操作数据
            this.pvm.useProp();
            // this.removeAndOver(null);  //播放删除动画，道具如今已经改变，所以不用播放删除动画
        }
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        this._hasOldData = false;
        this._gameStage = gameStage;
        this.init();
    }
    GameLogic.prototype.init = function () {
        GameData.initData(); //初始化数据
        if (this._returnGame && !GameLogic.guide) {
            this.loadOldData();
        }
        //console.log("当前关卡："+GameData.currentLevel);
        var mapDataArray = RES.getRes("map_data_json");
        var mapData;
        if (GameData.currentLevel < 10) {
            mapData = mapDataArray[GameData.currentLevel - 1];
        }
        else {
            mapData = mapDataArray[8];
        }
        //console.log(mapData);
        var levelDataArray = RES.getRes("level_data_json"); //初始化GameData数据
        var levelData = levelDataArray[GameData.currentLevel - 1];
        //console.log(levelData);		
        MapDataParse.createMapData(mapData.map); //创建地图数据
        LevelGameDataParse.parseLevelGameData(levelData);
        // let element = [0,1,2,3,4,5,6,7,8,9,10,11];
        // ElementTypeParse.creatElementTypeData(element);//改成直接在gamedata里面定义elementsType
        this.mapc = new MapControl();
        this.mapc.createElementAllMap();
        this.gbg = new GameBackGround();
        this._gameStage.addChild(this.gbg);
        this.gbg.changeBackground();
        if (GameData.currentLevel != 1) {
            this.setGbgShareTimer();
            GameLogic.guide = false;
        }
        else {
            GameLogic.guide = false;
        }
        var lec = new egret.Sprite();
        this._gameStage.addChild(lec);
        this.levm = new LevelReqViewManage(lec);
        // this.levm.createCurrentLevelReq();
        var pvmc = new egret.Sprite();
        this._gameStage.addChild(pvmc);
        this.pvm = new PropViewManage(pvmc);
        var cc = new egret.Sprite();
        this._gameStage.addChild(cc);
        this.evm = new ElementViewManage(cc);
        SoundUtils.instance().initSound();
        SoundUtils.instance().playBg();
        //console.log("游戏场景初始化"+this._returnGame);
        if (GameLogic.guide && GameData.currentLevel == 1 && GameData.availableMapId.length == 4) {
            this.evm.showElementById(0);
            this.evm.showElementById(1);
            this.gv = new GuideView();
            this._gameStage.addChild(this.gv);
            this.gv.guideFirst();
        }
        else {
            this.wrp = new WelcomeRetrunPanel();
            if (this._returnGame && GameData.coin != '0') {
                this._gameStage.addChild(this.wrp);
                this.wrp.show(GameData.secCoin, this._due);
            }
            if (!this._hasOldData) {
                this.evm.showElement();
            }
            else {
                this.evm.addLastLevelElements();
                this.evm.timerToBox2();
                // this.evm.showElement();
            }
        }
        var csp = new egret.Sprite();
        this._gameStage.addChild(csp);
        this.csp = new ChangeScenePanel(csp);
        // /注册侦听器，即指定事件由  哪个对象  的哪个方法来接受
        // this.evm.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER,this.removeAndOver,this);
        // this.evm.addEventListener(ElementViewManageEvent.TAP_TWO_ELEMENT,this.viewTouchTap,this);
        this.evm.addEventListener(ElementViewManageEvent.OPEN_NEW_HOUSE_PANEL, this.openNewHousePanel, this);
        this.evm.addEventListener(ElementViewManageEvent.CLOSE_NEW_HOUSE_PANEL, this.getNewHouseProfit, this);
        this.evm.addEventListener(ElementViewManageEvent.LEVEL_EXP_UP, this.nextLevelTest, this);
        this.evm.addEventListener(ElementViewManageEvent.CLOSE_LEVEL_UP_PANEL, this.getLevelUpProfit, this);
        this.evm.addEventListener(ElementViewManageEvent.OPEN_SCENES, this.openScenes, this);
        this.csp.addEventListener(ElementViewManageEvent.CHANGE_SCENE, this.changeScene, this);
        this.evm.addEventListener(ElementViewManageEvent.GET_PROFIT, this.addProfit, this);
        this.evm.addEventListener(ElementViewManageEvent.X5_PROFIT, this.x5Profit, this);
        this.evm.addEventListener(ElementViewManageEvent.REWARD_HOUSE, this.rewardHouse, this);
        this.evm.addEventListener(ElementViewManageEvent.GUIDE_STEP_TWO, this.guideStepTwo, this);
        this.evm.addEventListener(ElementViewManageEvent.GUIDE_STEP_THREE, this.guideStepThree, this);
        this.evm.addEventListener(ElementViewManageEvent.GUIDE_RESET, this.init, this);
        // this.evm.addEventListener(ElementViewManageEvent.USE_PROP_CLICK,this.usePropClick,this);
    };
    GameLogic.prototype.loadOldData = function () {
        //console.log("读取旧数据")
        var userGameData = egret.localStorage.getItem("userGameData");
        if (userGameData) {
            //console.log("读取旧数据成功")
            this._hasOldData = true;
            var oldData = JSON.parse(userGameData);
            //console.log(oldData);
            GameData.closeMusic = oldData.closeMusic ? oldData.closeBgMusic : false;
            GameData.closeBgMusic = oldData.closeBgMusic ? oldData.closeBgMusic : false;
            GameData.currentLevel = oldData.currentLevel;
            GameData.levelExp = oldData.levelExp;
            GameData.cost = oldData.cost;
            GameData.coin = oldData.coin ? oldData.coin : '0';
            GameData.secCoin = oldData.secCoin;
            this._due = oldData.due;
            GameData.oldElements = oldData.inMap;
            GameData.maxHouseGrade = oldData.maxHouseGrade ? oldData.maxHouseGrade : 1;
            GameData.houseBuyNumber = oldData.buyHouseNumber;
            GameData.elementTypeFirstShow = oldData.elementTypeFirstShow;
            if (oldData.addRewrd) {
                this.evm.addReward();
            }
        }
        else {
            //console.log("没有旧数据");
            this._returnGame = false;
        }
    };
    GameLogic.prototype.onShow = function () {
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
                        return [2 /*return*/, oldData];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    GameLogic.prototype.nextLevelTest = function (evt) {
        //console.log('levelup监听事件成功');
        var shareTimer;
        if (GameBackGround.hTimerStatus) {
            shareTimer = JSON.stringify({ "status": true, "minute": this.gbg.minute, "second": this.gbg.second });
        }
        else {
            shareTimer = JSON.stringify({ "status": false });
        }
        //console.log("初始化后加速时间状态:"+GameBackGround.hTimerStatus);
        //console.log("剩余时间:"+shareTimer);
        egret.localStorage.setItem("shareTimer", shareTimer);
        var rewardIconStatus = egret.localStorage.getItem("rewardIconStatus");
        //console.log("rewardIconStatus:"+rewardIconStatus);
        GameData.currentLevel++; //关卡数目加1
        if (GameData.currentLevel >= 200) {
            this.isGameOver();
        }
        else {
            this.clear();
            GameData.oldElements = [].concat(GameData.elements);
            this._returnGame = false;
            this._hasOldData = true;
            this.init();
            if (rewardIconStatus == "true") {
                //console.log("加载免费图标")
                this.evm.addReward();
            }
            SoundUtils.instance().playLevelUpSound(); //播放升级音效
            SoundUtils.instance().playNewLandSound(); //播放开放新地块音效
            //console.log('到下一关');
            this.levelUpPanel = new LevelUpPanel();
            this._gameStage.addChild(this.levelUpPanel);
            this.levelUpPanel.show();
        }
    };
    /*************************************************新手引导*************************************************************************************************** */
    GameLogic.prototype.guideStepTwo = function () {
        // console.log('guideStepTwo监听事件成功');
        this.gv.clear();
        this.gv.guideTwo();
    };
    GameLogic.prototype.guideStepThree = function () {
        // console.log('guideStepThree监听事件成功');
        this.gv.clear();
        this.gv.guideThree();
    };
    /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /**************************************************新房子********************************************************************************************* */
    GameLogic.prototype.openNewHousePanel = function (evt) {
        // console.log('openNewHousePanel监听事件成功');
        if (GameLogic.guide && evt.grade == 2) {
            this.gv.clear();
            GameLogic.guide = false;
            console.log(GameLogic.guide);
            this._gameStage.removeChild(this.gv);
            this.gbg.clear();
            this.gbg.changeBackground();
        }
        this.nhp = new NewHousePanel();
        this._gameStage.addChild(this.nhp);
        this.nhp.getNewHosuePanel(evt.grade);
    };
    GameLogic.prototype.getNewHouseProfit = function (evt) {
        // console.log('getNewHouseProfit监听事件成功');
        this.nhp.addProfit();
        this._gameStage.removeChild(this.nhp);
        this.floatProfitText(CommonFuction.numZero(this.nhp.getProfitNum()));
    };
    /**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    GameLogic.prototype.getLevelUpProfit = function (evt) {
        //console.log('levelupProfit监听事件成功');
        this.levelUpPanel.getLevelUpProfit();
        this._gameStage.removeChild(this.levelUpPanel);
        this.floatProfitText(CommonFuction.numZero(this.levelUpPanel.getProfitNum()));
    };
    GameLogic.prototype.openScenes = function (evt) {
        //console.log('打开场景监听事件成功');
        this.csp.show();
    };
    GameLogic.prototype.changeScene = function (evt) {
        //console.log('切换场景监听事件成功');
        this.gbg.clear();
        this.gbg.setSceneData(evt.sceneId);
        this.gbg.changeBackground();
        if (GameBackGround.hTimerStatus) {
            this.gbg.shareContinue();
        }
        SoundUtils.instance().stopBg();
        SoundUtils.instance().initBgSound();
        SoundUtils.instance().playBg();
    };
    GameLogic.prototype.addProfit = function () {
        //console.log('wrp获得离线收益监听事件成功');
        this.wrp.addProfit();
        this.wrp.closePanel();
        this._gameStage.removeChild(this.wrp);
        this.floatProfitText(CommonFuction.numZero(this.wrp.getProfitNum()));
    };
    /**
     * 欢迎回归收益飘字
     */
    GameLogic.prototype.floatProfitText = function (profit) {
        //console.log("增加离线收益成功");
        var wrp = new WelcomeRetrunPanel();
        var coinView = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
        coinView.x = GameData.stageW / 8 + GameData.stageW * 3 / 16;
        // coinView.y = (GameData.stageH - GameData.stageW*3/4*1.464)/2;
        coinView.y = GameData.stageH - GameData.girdWidth * 1.575 * 2;
        var txtView = new egret.TextField;
        // txtView.textColor = 0xDC143C;
        txtView.textColor = 0xFFFFFF;
        txtView.text = profit;
        txtView.bold = true;
        txtView.size = 30;
        txtView.x = coinView.x + coinView.width + 20;
        txtView.y = coinView.y;
        this._gameStage.addChild(coinView);
        this._gameStage.addChild(txtView);
        var twn = egret.Tween.get(coinView);
        twn.wait(200).to({ "alpha": 1, x: 20, y: GameData.girdWidth - 10, scaleX: 1.2, scaleY: 1.2 }, 1000, egret.Ease.sineInOut).to({ scaleX: 0.6, scaleY: 0.6 }).call(function () {
            this._gameStage.removeChild(coinView);
        }, this);
        var twn = egret.Tween.get(txtView);
        twn.wait(200).to({ "alpha": 1, x: 20 + GameData.girdWidth / 3, y: GameData.girdWidth - 10, scaleX: 1.2, scaleY: 1.2 }, 1000, egret.Ease.sineInOut).to({ scaleX: 1, scaleY: 1 }).call(function () {
            this._gameStage.removeChild(txtView);
        }, this);
    };
    GameLogic.prototype.x5Profit = function () {
        this.gbg.x5profit();
    };
    GameLogic.prototype.rewardHouse = function () {
        this.evm.rewardHouse();
    };
    GameLogic.prototype.setGbgShareTimer = function () {
        var shareTimer = egret.localStorage.getItem("shareTimer");
        if (shareTimer) {
            shareTimer = JSON.parse(egret.localStorage.getItem("shareTimer"));
            //console.log("设定分享时间"+shareTimer);
            if (shareTimer.status) {
                this.gbg.minute = shareTimer.minute;
                this.gbg.second = shareTimer.second;
                this.gbg.shareContinue();
            }
        }
        // GameData.secCoin = CommonFuction.chu(GameData.secCoin,5);
    };
    GameLogic.prototype.clear = function () {
        GameData.availableMapId = [];
        while (this._gameStage.numChildren) {
            this._gameStage.removeChildAt(0);
        }
    };
    /*-----------------------------视图管理器中存在两个被tap的元素，进行判断--------------------------------------
    private viewTouchTap(evt:ElementViewManageEvent){
        if (GameData.elements[evt.ele1].type ==  GameData.elements[evt.ele2].type ){//如果两个点击元素type相同，都是房子，那么检测是否可以合并
            if(GameData.elements[evt.ele1].grade ==  GameData.elements[evt.ele2].grade){//如果等级相同，那么合并
                    // //console.log("消除动画");
                    this.evm.playRemoveAni(evt.ele1);
                    // this.evm.playRemoveAni(evt.ele2);
                    // //console.log(evt.ele1);
                    let i = Math.floor( GameData.elements[evt.ele1].location /GameData.MaxColumn);
                    let t = GameData.elements[evt.ele1].location % GameData.MaxColumn;
                    //console.log("删除的房子id:"+GameData.elements[evt.ele1].id+ "删除的房子location:"+GameData.elements[evt.ele1].location);
                    //console.log("i:"+i);
                    //console.log("t:"+t);
                    GameData.mapData[i][t] = -2 //删除元素后把这块格子置为-2,表示无元素
                    
                    GameData.elements[evt.ele2].grade = GameData.elements[evt.ele2].grade + 1;//合并后升级
                    this.evm.addLevelExp(GameData.elements[evt.ele2].grade);//根据新和成的房子等级加经验值
                    this.evm.showElementById(evt.ele2);
                    // //console.log(GameData.elements[evt.ele2]);
                    this.isGameOver();
            }else{//如果等级不同，那么交换位置
                    this.evm.changeLocationWithScaleOrBack(evt.ele1,evt.ele2,true);
            }
        }else{

        }
        
    }
    */
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-----------------------------元素置换动画播放结束，数据操作，并播放删除动画--------------------------------------*/
    /**
     * 即将删除的元素移动结束
     * 开始搜索删除数据，并且播放删除动画
     * 更新地图数据
     * 更新其他数据
     */
    GameLogic.prototype.removeAndOver = function (evt) {
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*---------------------------所有元素都删除完毕后，创建新元素，并刷新视图---------------------------------*/
    // private createNewElement(evt:ElementViewManageEvent)
    // {
    // 	//多次调用 问题 通过计数器 解决
    //     //console.log("刷新地图数据！！！！！！！！");
    //     // this.mapc.updateMapLocation();
    //     // this.evm.updateMapData();       
    // }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-----------------------------删除动画完成后，检测地图中是否存在剩余可消除元素--------------------------------------*/
    GameLogic.prototype.checkOtherElementLink = function (evt) {
        //console.log("所有动画逻辑结束");
        //检测步数和关卡数
        this.isGameOver();
    };
    GameLogic.prototype.isGameOver = function () {
        //console.log("通关");
        if (!this.gameoverpanel) {
            this.gameoverpanel = new GameOverPanel();
            this._gameStage.addChild(this.gameoverpanel);
            this.gameoverpanel.show(true);
            GameData.currentLevel = 1; //当前关卡为1重新开始
            this.gameoverpanel.addEventListener(ElementViewManageEvent.GAME_OVER, this.init, this);
        }
    };
    GameLogic.version = "1.11.0"; //新手引导
    return GameLogic;
}());
__reflect(GameLogic.prototype, "GameLogic");
//# sourceMappingURL=GameLogic.js.map