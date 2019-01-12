class GameLogic {
	private _gameStage:egret.Sprite;
	public constructor(gameStage:egret.Sprite) {
		this._gameStage = gameStage;
        this.init();
	}

	
    /*-----------------------------初始化数据,创建各种控制器--------------------------------------*/
	private evm:ElementViewManage; 	
 	private levm: LevelReqViewManage;
	private mapc:MapControl;
	private pvm:PropViewManage;
	private wrp:WelcomeRetrunPanel;
	private csp:ChangeScenePanel;
	private gbg:GameBackGround;
	private levelUpPanel:LevelUpPanel;
	private nhp:NewHousePanel;
	private gv:GuideView;
	private timer: egret.Timer;
	private _returnGame:boolean  = true;//返回游戏
	public static closeShare:boolean;
	public static guide:boolean;//新手引导
	public static version:string = "1.13.1";//新手引导
	private init(){
		GameData.initData();  //初始化数据
		if (this._returnGame && !GameLogic.guide){
			this.loadOldData()
		}
		//console.log("当前关卡："+GameData.currentLevel);
		let mapDataArray =  RES.getRes("map_data_json");
		let mapData:any;
		if (GameData.currentLevel < 10 ){
			mapData = mapDataArray[GameData.currentLevel-1];
		}else{
			mapData = mapDataArray[8];
		}
		//console.log(mapData);
		let levelDataArray = RES.getRes("level_data_json");//初始化GameData数据
		let levelData = levelDataArray[GameData.currentLevel-1];
		//console.log(levelData);		
		MapDataParse.createMapData(mapData.map);//创建地图数据
		LevelGameDataParse.parseLevelGameData(levelData); 
		

		this.mapc = new MapControl();
		this.mapc.createElementAllMap();

		

		this.gbg= new GameBackGround();
		this._gameStage.addChild(this.gbg);
		this.gbg.changeBackground();
		if (GameData.currentLevel != 1 ){
			this.setGbgShareTimer();
			GameLogic.guide = false;
		}else{
			GameLogic.guide = true;//默认第一关true
		}


		
		let lec:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild(lec);
		this.levm = new LevelReqViewManage(lec);
		// this.levm.createCurrentLevelReq();

		let pvmc:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild(pvmc);
		this.pvm = new PropViewManage(pvmc);
		
		let cc:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild( cc );
		this.evm = new ElementViewManage(cc);
   		
		SoundUtils.instance().initSound();
		SoundUtils.instance().playBg();
		//console.log("游戏场景初始化"+this._returnGame);
		if(GameLogic.guide && GameData.currentLevel == 1 && GameData.availableMapId.length == 4){
			this.evm.showElementById(0);
			this.evm.showElementById(1);
			this.gv = new GuideView();
			this._gameStage.addChild( this.gv );
			this.gv.guideFirst();	
		}else{
			this.wrp = new WelcomeRetrunPanel();
			if	(this._returnGame && GameData.coin != '0'){		
				this._gameStage.addChild(this.wrp);
				this.wrp.show(GameData.secCoin,this._due);
			}

			if (!this._hasOldData){
				this.evm.showElement();
			}else{
				this.evm.addLastLevelElements();
				this.evm.timerToBox2();
				// this.evm.showElement();
			}
		}


		let csp:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild( csp );
		this.csp  = new ChangeScenePanel(csp);

		let nhc:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild(nhc);
		this.nhp = new NewHousePanel(nhc)
		
		// /注册侦听器，即指定事件由  哪个对象  的哪个方法来接受
		// this.evm.addEventListener(ElementViewManageEvent.TAP_TWO_ELEMENT,this.viewTouchTap,this);
		this.evm.addEventListener(ElementViewManageEvent.OPEN_NEW_HOUSE_PANEL,this.openNewHousePanel,this);
		this.evm.addEventListener(ElementViewManageEvent.GET_NEW_HOUSE_PROFIT,this.getNewHouseProfit,this);
		this.nhp.addEventListener(ElementViewManageEvent.CLOSE_NEW_HOUSE_PANEL,this.addLevelExp,this);
		this.evm.addEventListener(ElementViewManageEvent.LEVEL_EXP_UP,this.nextLevelTest,this);
		this.evm.addEventListener(ElementViewManageEvent.CLOSE_LEVEL_UP_PANEL,this.getLevelUpProfit,this);
		this.evm.addEventListener(ElementViewManageEvent.OPEN_SCENES,this.openScenes,this);
		this.csp.addEventListener(ElementViewManageEvent.CHANGE_SCENE,this.changeScene,this);
		this.evm.addEventListener(ElementViewManageEvent.GET_PROFIT,this.addProfit,this);
		this.evm.addEventListener(ElementViewManageEvent.X5_PROFIT,this.x5Profit,this);
		this.evm.addEventListener(ElementViewManageEvent.REWARD_HOUSE ,this.rewardHouse,this);
		this.evm.addEventListener(ElementViewManageEvent.GUIDE_STEP_TWO,this.guideStepTwo,this);
		this.evm.addEventListener(ElementViewManageEvent.GUIDE_STEP_THREE,this.guideStepThree,this);
		this.evm.addEventListener(ElementViewManageEvent.GUIDE_RESET,this.init,this);
		
	}
	



	/*------------------------------------------------------------------------------------------------*/
	private _hasOldData:boolean = false;
	private _due:any
	private loadOldData(){
        //console.log("读取旧数据")
        let userGameData =  egret.localStorage.getItem("userGameData");
        if(userGameData){
			 //console.log("读取旧数据成功")
			this._hasOldData = true;
            let oldData = JSON.parse(userGameData);
			//console.log(oldData);
            GameData.closeMusic = oldData.closeMusic?oldData.closeBgMusic:false;
			GameData.closeBgMusic = oldData.closeBgMusic?oldData.closeBgMusic:false;
			GameData.currentLevel = oldData.currentLevel;
			GameData.levelExp = oldData.levelExp;
			GameData.cost = oldData.cost;
			GameData.coin = oldData.coin?oldData.coin:'0';
			GameData.secCoin = oldData.secCoin;
			this._due = oldData.due;
            GameData.oldElements = oldData.inMap;
			GameData.maxHouseGrade = oldData.maxHouseGrade?oldData.maxHouseGrade:1;
			GameData.houseBuyNumber = oldData.buyHouseNumber;
			GameData.elementTypeFirstShow = oldData.elementTypeFirstShow;
			if(oldData.addRewrd){
				this.evm.addReward();
			}
			
        }else{
            //console.log("没有旧数据");
			this._returnGame = false;           
        }
    }

	private async onShow(){
		//console.log("GameLogic进入游戏");
		let wxData = platform.getLaunchOptionsSync();
		//console.log(wxData);
		if(wxData){
			//console.log(wxData);
			let userGameData = await platform.getGameData("userGameData");
			//console.log("获取旧数据");
			//console.log(userGameData);
			let oldData = userGameData[0];
			return oldData;
		}
	}

	private nextLevelTest(evt:ElementViewManageEvent){
		//console.log('levelup监听事件成功');
		let shareTimer:string;
		if(GameBackGround.hTimerStatus){
			shareTimer = JSON.stringify({"status":true,"minute":this.gbg.minute,"second":this.gbg.second});
		}else{
			shareTimer = JSON.stringify({"status":false});
		}
		//console.log("初始化后加速时间状态:"+GameBackGround.hTimerStatus);
		//console.log("剩余时间:"+shareTimer);
		egret.localStorage.setItem("shareTimer",shareTimer); 
		let rewardIconStatus = egret.localStorage.getItem("rewardIconStatus");
		//console.log("rewardIconStatus:"+rewardIconStatus);
		GameData.currentLevel++;//关卡数目加1
		if (GameData.currentLevel >= 200){
			this.isGameOver();
		}else{
			this.clear();
			GameData.oldElements = [].concat(GameData.elements);
			this._returnGame = false;
			this._hasOldData = true;
			
			this.init();
			if(rewardIconStatus == "true"){
				//console.log("加载免费图标")
				this.evm.addReward();
			}

			SoundUtils.instance().playLevelUpSound()//播放升级音效
			SoundUtils.instance().playNewLandSound()//播放开放新地块音效
			//console.log('到下一关');
			this.levelUpPanel = new LevelUpPanel();
			this._gameStage.addChild(this.levelUpPanel);
			this.levelUpPanel.show();
		}

	}
	/*************************************************新手引导*************************************************************************************************** */
	private guideStepTwo(){
		// console.log('guideStepTwo监听事件成功');
		this.gv && this.gv.clear()
		this.gv && this.gv.guideTwo();
	}

	private guideStepThree(){
		// console.log('guideStepThree监听事件成功');
		this.gv && this.gv.clear()
		this.gv && this.gv.guideThree();
	}

	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
	/**************************************************新房子********************************************************************************************* */
	private openNewHousePanel(evt:ElementViewManageEvent){
		// console.log('openNewHousePanel监听事件成功');
		if(GameLogic.guide && evt.grade == 2){
			this.gv.clear();
			GameLogic.guide = false;
			console.log(GameLogic.guide);
			this._gameStage.removeChild(this.gv);
			this.gbg.clear();
			this.gbg.changeBackground();	
		}
		
		this.nhp.getNewHosuePanel(evt.grade);
	}

	private getNewHouseProfit(evt:ElementViewManageEvent){
			// console.log('getNewHouseProfit监听事件成功');
			this.nhp.addProfit();
			// this._gameStage.removeChild(this.nhp);
			this.floatProfitText(CommonFuction.numZero(this.nhp.getProfitNum()));
	}

	private addLevelExp(evt:ElementViewManageEvent){
		// console.log('closeNewHousePanel监听事件成功');
		this.evm.addLevelExp(GameData.maxHouseGrade);
	}

	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	/**---------------------------------------------城市升级--------------------------------------------------------------------------------------------*/
	private getLevelUpProfit(evt:ElementViewManageEvent){
			//console.log('levelupProfit监听事件成功');
			this.levelUpPanel.getLevelUpProfit();
			this._gameStage.removeChild(this.levelUpPanel);
			this.floatProfitText(CommonFuction.numZero(this.levelUpPanel.getProfitNum()));
	}

	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	private openScenes(evt:ElementViewManageEvent){
		//console.log('打开场景监听事件成功');
		this.csp.show();
	}

	private changeScene(evt:ElementViewManageEvent){
		//console.log('切换场景监听事件成功');
		this.gbg.clear();
		this.gbg.setSceneData(evt.sceneId);
		this.gbg.changeBackground();
		if(GameBackGround.hTimerStatus){
			this.gbg.shareContinue();
		}
		SoundUtils.instance().stopBg();
		SoundUtils.instance().initBgSound();
		SoundUtils.instance().playBg();
	}
	private addProfit(){
		//console.log('wrp获得离线收益监听事件成功');
		this.wrp.addProfit();
		this.wrp.closePanel();
		this._gameStage.removeChild(this.wrp);
		this.floatProfitText(CommonFuction.numZero(this.wrp.getProfitNum()));
	}
	/**
	 * 欢迎回归收益飘字
	 */
	private floatProfitText(profit:string){
		//console.log("增加离线收益成功");
		let wrp = new WelcomeRetrunPanel();
		let coinView = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
		coinView.x =  GameData.stageW/8+GameData.stageW*3/16;
		// coinView.y = (GameData.stageH - GameData.stageW*3/4*1.464)/2;
		coinView.y = GameData.stageH - GameData.girdWidth*1.575*2;
		var txtView: egret.TextField = new egret.TextField;
		// txtView.textColor = 0xDC143C;
		txtView.textColor = 0xFFFFFF;
		txtView.text = profit;
		txtView.bold = true;
		txtView.size = 30;
		txtView.x = coinView.x +coinView.width +20;
		txtView.y = coinView.y;
		this._gameStage.addChild(coinView);
		this._gameStage.addChild(txtView);

		var twn: egret.Tween = egret.Tween.get(coinView);
		twn.wait(200).to({ "alpha": 1,x:20,y:GameData.girdWidth -10,scaleX:1.2,scaleY:1.2}, 1000,egret.Ease.sineInOut).to({scaleX:0.6,scaleY:0.6}).call(function () {
			this._gameStage.removeChild(coinView);
		}, this);

		var twn: egret.Tween = egret.Tween.get(txtView);
		twn.wait(200).to({ "alpha": 1,x:20+GameData.girdWidth/3 ,y:GameData.girdWidth -10,scaleX:1.2,scaleY:1.2}, 1000,egret.Ease.sineInOut).to({scaleX:1,scaleY:1}).call(function () {
			this._gameStage.removeChild(txtView);
		}, this);
	}

	private x5Profit(){
		this.gbg.x5profit();
	}

	private rewardHouse(){
		this.evm.rewardHouse();
	}
	private setGbgShareTimer(){
		
		let shareTimer:any = egret.localStorage.getItem("shareTimer"); 
		if(shareTimer){
			shareTimer = JSON.parse(egret.localStorage.getItem("shareTimer"));
			//console.log("设定分享时间"+shareTimer);
			if(shareTimer.status){
				this.gbg.minute = shareTimer.minute;
				this.gbg.second = shareTimer.second;
				this.gbg.shareContinue();
			} 
		}
		
		
		// GameData.secCoin = CommonFuction.chu(GameData.secCoin,5);
	}

	private clear():void{
		GameData.availableMapId = [];
        while(this._gameStage.numChildren){
            this._gameStage.removeChildAt(0);
        }
    }



	
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/  

	/*-----------------------------检测当前游戏是否GameOver------------------------------*/
		private gameoverpanel:GameOverPanel;
		private isGameOver()
		{
			//console.log("通关");
			if(!this.gameoverpanel)
			{
				this.gameoverpanel = new GameOverPanel();
				this._gameStage.addChild(this.gameoverpanel);
				this.gameoverpanel.show(true);
				GameData.currentLevel = 1;//当前关卡为1重新开始
				this.gameoverpanel.addEventListener(ElementViewManageEvent.GAME_OVER,this.init,this);
				
			}
		}
		/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
}