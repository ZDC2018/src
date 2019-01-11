class ElementViewManage extends egret.EventDispatcher {
	private _layer:egret.Sprite; //元素存在的容器
	public constructor(elementLayer:egret.Sprite) {
		super();
        this._layer = elementLayer;
        this.init();
		this.createTimerBg();
		this.createExpBar();
		this.levelExpLabel();
		this.createNumText();
		this.addHelpHandle();
		// this.createRecycle();
		// this.addReward();	
		platform.onShow(this.onShow, this);		
		platform.onHide(this.onHide, this);	
		this.getVideoAd();
	}
	
	 /*-----------------------------初始化数据--------------------------------------*/
    //ElementView对象池，全局仅最多GameData.MaxRow*GameData.MaxColumn个，默认为20个
	private elementViews:ElementView[];
    private _touchStatus:boolean = false;              //当前触摸状态，按下时，值为true
    private _distance:egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差
	private hitBox:PropView;
	
	/**
	 * 初始化所有数据变量
	 */
	private init(){
		//console.log("evm初始化");		
		this.elementViews = new Array();
		let len:number = GameData.MaxColumn*GameData.MaxRow;
		let el:ElementView;
		for (let i = 0; i < len; i++) {
			el = new ElementView(this._layer);
			el.id=i;
			el.location = GameData.elements[i].location;
			el.grade = GameData.elements[i].grade;
			el.time = GameData.elements[i].time;
			this.elementViews.push(el);
			el.evm = this;// 给ElementView用来触发 ElementViewManageEvent事件
			el.touchEnabled = true;
			// el.addEventListener(egret.TouchEvent.TOUCH_TAP,this.elTap,this);
			el.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);//这里是房子拖拽
       		el.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
		}
		this.hitBox = new PropView(2);
		this.hitBox.id = 2;
		this._layer.addChild(this.hitBox);
		this.hitBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapTimerSpeed,this);	

		let shop:PropView = new PropView(3);
		shop.id = 3;
		this._layer.addChild(shop);
		shop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.openShop,this);

		let scene:PropView = new PropView(4);
		scene.id = 4;
		this._layer.addChild(scene);
		scene.addEventListener(egret.TouchEvent.TOUCH_TAP,this.changeScene,this);
		

	}
	/**
	 * 倒计时背景图
	 */
	private createTimerBg(){
        let timerBg:egret.Bitmap = new egret.Bitmap();
		timerBg.texture= RES.getRes("ui_time_base_png");
		timerBg.width = GameData.girdWidth/3;
		timerBg.height = GameData.girdWidth/3;
		timerBg.x= GameData.stageW/2 - GameData.girdWidth*1.867/2 + timerBg.width/2;
		timerBg.y=GameData.stageH - GameData.girdWidth*1.658  + timerBg.width/2;
		this._layer.addChild(timerBg);
    }
	/**
	 * 经验值
	 */
	private _levelExpLabel:egret.TextField =new egret.TextField();
	private _coinLabel:egret.TextField =new egret.TextField();
	private _coinSecLabel:egret.TextField =new egret.TextField();
	private levelExpLabel(){
		let bg:egret.Bitmap = new egret.Bitmap();
		bg.texture= RES.getRes("ui_level_png");
		bg.width = GameData.girdWidth*0.44;
		bg.height = GameData.girdWidth*0.53;
		bg.x= GameData.girdWidth/6;
		bg.y= GameData.girdWidth/4;
		this._layer.addChild(bg);
		//经验值
		
		this._levelExpLabel.text = GameData.levelExp + "/" + GameData.levelReqExp; 
		this._coinSecLabel.textAlign = egret.HorizontalAlign.CENTER;
		this._levelExpLabel.width =  3*GameData.girdWidth;
		this._levelExpLabel.x = GameData.girdWidth*1.7;
		this._levelExpLabel.y = GameData.girdWidth*0.375 +5;
		this._layer.addChild( this._levelExpLabel );

		//金币值
		this._coinLabel.text = this.numZero(GameData.coin);
		this._coinLabel.textAlign = egret.HorizontalAlign.CENTER;
		// this._coinLabel.size = 18;
		this._coinLabel.width =  1.5*GameData.girdWidth;
		// this._coinLabel.x = 10 + GameData.girdWidth/3 +  GameData.girdWidth*1.5/2 - 5;
		this._coinLabel.x = 20 + GameData.girdWidth/3 ;
		this._coinLabel.y = GameData.girdWidth-5;
		this._layer.addChild( this._coinLabel );
		//秒产金币值
		this._coinSecLabel.text = this.numZero(GameData.secCoin);
		this._coinSecLabel.textAlign = egret.HorizontalAlign.CENTER;
		// this._coinSecLabel.size = 18;
		this._coinSecLabel.width =  1.5*GameData.girdWidth;
		// this._coinSecLabel.x = 25+GameData.girdWidth/3+GameData.girdWidth*1.5 +GameData.girdWidth/3+5 +GameData.girdWidth*1.5/2 -5;
		this._coinSecLabel.x = 30+GameData.girdWidth*1.5+2*GameData.girdWidth/3;
		this._coinSecLabel.y = GameData.girdWidth -5;
		this._layer.addChild( this._coinSecLabel );
	}
	public get coinLableText():string{
		return this._coinLabel.text;
	}
	private _numText:egret.TextField =new egret.TextField();//倒计时数字
	private _currentLevelNumText:egret.TextField =new egret.TextField();//当前关卡数字
	private createNumText(){		
		this._numText.x= GameData.stageW/2 - GameData.girdWidth*1.867/2  +  GameData.girdWidth/6 ;
		this._numText.y=GameData.stageH - GameData.girdWidth*1.658 +  GameData.girdWidth/6 +GameData.girdWidth/24 + 3;
		this._numText.text = "10";
		this._numText.textColor = 0xd8241b;
		this._numText.bold = true;
		if (this._numText.text == "10"){
			this._numText.size = 25;
		}
		this._numText.width = GameData.girdWidth/3;
		this._numText.textAlign = egret.HorizontalAlign.CENTER;
		this._layer.addChild( this._numText );

		this._currentLevelNumText.x= GameData.girdWidth/6 -3;
		this._currentLevelNumText.y= GameData.girdWidth*2/5 -3;
		this._currentLevelNumText.width = GameData.girdWidth*0.44;
		this._currentLevelNumText.textAlign = egret.HorizontalAlign.CENTER;
		this._currentLevelNumText.text = GameData.currentLevel.toString();
		// this._currentLevelNumText.text = "Lv"+GameData.currentLevel.toString();
		this._currentLevelNumText.textColor = 0x1C8CAD;
		if(GameData.currentLevel<10){
			this._currentLevelNumText.size = 24;
		}else if(GameData.currentLevel >=100){
			this._currentLevelNumText.size = 18;
		}else{
			this._currentLevelNumText.size = 20;
		}
		this._currentLevelNumText.bold = true;
		this._layer.addChild( this._currentLevelNumText );
		
	}
	/**
	 * 经验值进度条
	 */
	private _expBar:egret.Bitmap=new egret.Bitmap()
	private barMask:egret.Rectangle;
	private createExpBar(){
		this._expBar.width = GameData.girdWidth*3;
		this._expBar.height = GameData.girdWidth/3*0.8;
		this._expBar.x = GameData.girdWidth*0.44 + 10+2;
		this._expBar.y = GameData.girdWidth*0.375+GameData.girdWidth/30;
		// this._expBar.scaleX = GameData.levelExp/GameData.levelReqExp;
		this._expBar.texture = RES.getRes("ui_experience_png"); 
		// this.barMask =  new egret.Rectangle(0, 0, 0, this._expBar.height);
		this.barMask =  new egret.Rectangle(0, 0, GameData.levelExp/GameData.levelReqExp*this._expBar.width, this._expBar.height);
		this._expBar.mask = this.barMask;
		this._layer.addChild( this._expBar );
				
	}

	/**
	 * 添加指示助手
	 */
	private helpSprit:egret.Sprite = new egret.Sprite();
	private helpHandle:egret.Bitmap;
	private _helpHandleOn:boolean = false;
    private helpTiptxtView: egret.TextField = new egret.TextField;
    private guideBubble:egret.Bitmap;
	private addHelpTip():void{
		this.guideBubble = new egret.Bitmap();
		this.guideBubble.texture= RES.getRes("guide_bubble_png");
		this.guideBubble.x = GameData.stageW/2 - this.guideBubble.width/2
		this.guideBubble.y = GameData.stageH - GameData.girdWidth*1.658 -this.guideBubble.height - 10;
		this.helpTiptxtView.textColor = 0x21344D;
		this.helpTiptxtView.fontFamily = "黑体";
		this.helpTiptxtView.text = "点我加速房子掉落哦！";
		// this.txtView.bold = true;
		this.helpTiptxtView.size = 26;
		this.helpTiptxtView.width = this.guideBubble.width;
		this.helpTiptxtView.textAlign = egret.HorizontalAlign.CENTER;
		this.helpTiptxtView.x = this.guideBubble.x;
		this.helpTiptxtView.y = this.guideBubble.y+18;
        this.helpSprit.addChild(this.guideBubble);
        this.helpSprit.addChild(this.helpTiptxtView);
	}
	public addHelpHandle():void{
		// console.log("添加指示助手");
		// console.log(this.helpHandleTimer.running);
		this.addHelpTip();
		this.helpHandle = new egret.Bitmap();
		this.helpHandle.texture= RES.getRes("ui_help_png");
		this.helpHandle.x = GameData.stageW/2;
		this.helpHandle.y = GameData.stageH - GameData.girdWidth*1.658/2;
		this.helpSprit.addChild(this.helpHandle);
		var tw:egret.Tween = egret.Tween.get(this.helpHandle,{loop:true});
		tw.to({scaleX:0.8,scaleY:0.8},400, egret.Ease.cubicInOut).to({scaleX:1,scaleY:1},200, egret.Ease.cubicInOut);
		if(!this._helpHandleOn){
			// console.log("添加指示助手成功");
			this._layer.addChild(this.helpSprit);
			this._helpHandleOn = true;
		}
	}
	/**
	 * 移除指示助手
	 */
	private removeHelpHandle(){
		// console.log("移除指示助手");
		if (this._helpHandleOn){
			// console.log("移除指示助手成功");
			this.helpSprit.removeChildren();
			this.helpSprit.parent && this.helpSprit.parent.removeChild(this.helpSprit);
			this._helpHandleOn = false;
			this.helpHandleTimer.reset();
			this.helpHandleTimer.start();
		}
	}
	private onShow(){
		//console.log("回到前台，读取数据");
		//console.log("时间:"+new Date().getTime());
		// let userGameData =  egret.localStorage.getItem("userGameData");
		// //console.log(userGameData);
		SoundUtils.instance().playBg();

		if(GameLogic.guide && GameData.currentLevel ==1){
			let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GUIDE_RESET);
			this.dispatchEvent(evt);
		}
		let currentTime:number = new Date().getTime();
		let wspTime:string = egret.localStorage.getItem("wrpTime");//欢迎回来
		let nhTime:string = egret.localStorage.getItem("nhTime");//新房子
		let luTime:string = egret.localStorage.getItem("luTime");//升级
		let fhTime:string = egret.localStorage.getItem("fhTime");//免费房子
		let x5Time:string = egret.localStorage.getItem("x5Time");//5倍加速
		let shareTime:number = 0;

		if(wspTime){
			shareTime = Math.round((currentTime - Number(wspTime))/1000);
			if (shareTime >= 3){
				let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GET_PROFIT);
				this.dispatchEvent(evt);
				// egret.localStorage.removeItem("wrpTime");
			}else{
				this.floatText("请分享到其他群，再来领奖励",0,GameData.stageH-GameData.stageW*0.618-100,1000);
			}
			
		}
		if(nhTime){
			shareTime = Math.round((currentTime - Number(nhTime))/1000);
			if (shareTime >= 3){
				let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GET_NEW_HOUSE_PROFIT);
				this.dispatchEvent(evt);
			}else{
				this.floatText("请分享到其他群，再来领奖励",0,GameData.stageH-GameData.stageW*0.618-100,1000);
			}
			
		}
		if(luTime){
			shareTime = Math.round((currentTime - Number(luTime))/1000);
			if (shareTime >= 3){
				let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.CLOSE_LEVEL_UP_PANEL);
				this.dispatchEvent(evt);
				// egret.localStorage.removeItem("luTime");
			}else{
				this.floatText("请分享到其他群，再来领奖励",0,GameData.stageH-GameData.stageW*0.618-100,1000);
			}
			
		}
		if(fhTime){
			shareTime = Math.round((currentTime - Number(fhTime))/1000);
			if (shareTime >= 3){
				let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.REWARD_HOUSE);
				this.dispatchEvent(evt);
				egret.localStorage.removeItem("fhTime");
			}else{
				this.floatText("请分享到其他群，才能领取奖励",0,GameData.stageH-GameData.stageW*0.618-100,1000);
			}
			
		}
		if(x5Time){
			shareTime = Math.round((currentTime - Number(x5Time))/1000);
			if (shareTime >= 3){
				let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.X5_PROFIT);
				this.dispatchEvent(evt);
				egret.localStorage.removeItem("x5Time");
			}else{
				this.floatText("请分享到其他群，再来领奖励",0,GameData.stageH-GameData.stageW*0.618-100,1000);
			}
		}
		SoundUtils.instance().playBg();
		// this.hideTimer.reset();
	}
	private hideTimer:egret.Timer = new egret.Timer(1000, 300);
	private onHide(){
		//console.log("退出前台");
		// this.hideTimer.addEventListener(egret.TimerEvent.TIMER, this.hideTime, this);
		// this.hideTimer.start();
		
		// let inMapArrJson = JSON.stringify(inMapArr);
		// let userGameData = JSON.stringify({"currentLevel":GameData.currentLevel,"levelExp":GameData.levelExp,"coin":GameData.coin,"secCoin":secCoin,"due":new Date().getTime(),
		// "inMap":inMapArrJson,"maxHouseGrade":maxHouseGrade,"buyHouseNumber":buyHouseNumber,"closeMusic":GameData.closeMusic,"closeBgMusic":GameData.closeBgMusic});
		
		// platform.postGameData("userGameData",userGameData);
		let i = GameData.elements.length -1;
		let inMapArr = new Array();
		let secCoin = this.addSecCoin();
		let maxHouseGrade  = GameData.maxHouseGrade;//记录当前最大等级
		inMapArr = [].concat(GameData.elements);
		//console.log("退出前台,记录数据");
		let userGameData = JSON.stringify({"currentLevel":GameData.currentLevel,"levelExp":GameData.levelExp,"cost":GameData.cost,"coin":GameData.coin,"secCoin":secCoin,"due":new Date().getTime(),
		"inMap":inMapArr,"maxHouseGrade":maxHouseGrade,"buyHouseNumber":GameData.houseBuyNumber,"closeMusic":GameData.closeMusic,"closeBgMusic":GameData.closeBgMusic,"addReward":this._addReward,
		"elementTypeFirstShow":GameData.elementTypeFirstShow});
		egret.localStorage.setItem("userGameData",userGameData);	
	}

	private hideTime(){
		// //console.log("hide计时:"+ this.hideTimer.currentCount);
		// if(this.hideTimer.currentCount == 30){//5分钟后执行退出，上传数据
			let i = GameData.elements.length -1;
			let inMapArr = new Array();
			let secCoin = this.addSecCoin();
			let maxHouseGrade  = GameData.maxHouseGrade;//记录当前最大等级
			// let buyHouseNumber = JSON.stringify(GameData.houseBuyNumber);//记下房屋购买次数
			// while(i > 0){
			// 	if(GameData.elements[i].type.length != 0){
			// 		inMapArr.push(GameData.elements[i]);
			// 	}
			// 	i--;
			// }
			inMapArr = [].concat(GameData.elements);
			//console.log("退出前台,记录数据");
			let userGameData = JSON.stringify({"currentLevel":GameData.currentLevel,"levelExp":GameData.levelExp,"coin":GameData.coin,"secCoin":secCoin,"due":new Date().getTime(),
			"inMap":inMapArr,"maxHouseGrade":maxHouseGrade,"buyHouseNumber":GameData.houseBuyNumber,"closeMusic":GameData.closeMusic,"closeBgMusic":GameData.closeBgMusic});
			egret.localStorage.setItem("userGameData",userGameData);
			// platform.exitGame(); 
		// }
	}
	/*-----------------------------拖拽控制相关------------------------------------------------------------*/
	private recyclePanel:RecyclePanel;
	private _recyclePanelOn:boolean = false;
	private ev:ElementView = new ElementView(this._layer);
	private mouseDown(evt:egret.TouchEvent){
        //console.log("Mouse Down.");
		this.ev = <ElementView>evt.currentTarget;
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.ev.x;
        this._distance.y = evt.stageY - this.ev.y;
		// //console.log("ev.id:"+this.ev.id);
		// //console.log("evt.stageX:"+evt.stageX);
		if (this.ev.grade == 0){//纸箱的等级设置为0，如果点击的是纸箱，那么变成房子并选中，
			// //console.log("纸箱");
			// this.ev.setFocus(false);
			
			this.openBoxEffect(this.ev.id);
			this.ev.openBox();
			this.starHandler(this.ev.targetX(),this.ev.targetY());
			this.ev.time = GameData.elements[this.ev.id].time;
			this.ev.grade = GameData.elements[this.ev.id].grade?GameData.elements[this.ev.id].grade:1 ;
			if (GameData.elements[this.ev.id].time != 0){
				this.addLevelExp(this.ev.grade);//开箱子加经验值
				this._levelExpLabel.text = GameData.levelExp.toString() +"/"+GameData.levelReqExp.toString(); 
				// //console.log(GameData.levelExp);
				// this.showElementById(this.ev.id,false);
				// this.ev.x  = this.ev.targetX();
				// this.ev.y  = this.ev.targetY() - this.ev.height/2;
				this.ev.show(100);
				let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.LEVEL_EXP_UP);
				this.levelExpUp(evt);
			}
			this._touchStatus =false;
			// this._currentTapID =this. ev.id;
		}else{
			// //console.log("不是纸箱");
			if (!this._recyclePanelOn){
				this.recyclePanel = new RecyclePanel();
				this._layer.addChild(this.recyclePanel);
				this.recyclePanel.show();
				this._layer.setChildIndex(this.ev, this._layer.numChildren + 1)
				this._recyclePanelOn = true;
				this.helpTiptxtView.text = "房子拖到这里出售哦";
				this.helpTiptxtView.textColor = 0xff0000;
			}
			this.showSynthesisGird(this.ev.id,this.ev.grade);
			this.addMoveinSetGird(this.ev.id);
			
		}
		if(this._touchStatus){
			this.ev.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
		}
		// //console.log("mouseDown,this._touchStatus:"+this._touchStatus);
    }

    private mouseUp(evt:egret.TouchEvent){
        // console.log("Mouse Up.");
        // console.log(this.ev);
		this.ev = <ElementView>evt.currentTarget;
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
		
		if (this._recyclePanelOn){
			this.recyclePanel.clear();
			this._layer.removeChild(this.recyclePanel);
			this._recyclePanelOn = false;
			this.helpTiptxtView.text = "点我加速房子掉落哦";
			this.helpTiptxtView.textColor = 0x21344D;
		}
		// let startY:number = (GameData.stageH - (GameData.stageW - 30)/6 - 60)-GameData.girdWidth*GameData.MaxRow;
		let i:number = Math.floor((evt.stageY - GameData.startY)/GameData.girdWidth);
		let t:number = Math.floor((evt.stageX - 44)/(GameData.girdWidth+24));
		// //console.log(i);
		// //console.log(t);
		// //console.log(GameData.mapData[i][t]);
		if (i >= GameData.MaxRow){
			this.delHouse(this.ev);
		}
		if(evt.stageY < GameData.startY || i >= GameData.MaxRow || t >= GameData.MaxColumn || i < 0 || t < 0){
			 	// //console.log("back1");
				this.ev.back();
		}else{
			if(GameData.mapData[i][t] != -1 && GameData.mapData[i][t] != -2 ){
				
				let ele1 = this.ev;
				let ele2 = this.elementViews[GameData.mapData[i][t]];
				// //console.log("ele1.id:"+ele1.id);
				// //console.log("ele2.id:"+ele2.id);
				if(this.ev.id != ele2.id){
					this.elementHitTest(ele1,ele2);//不允许撞自己
				}
				else{
					// //console.log("back2");
					this.ev.back();				
				}			
			}else if (GameData.mapData[i][t] == -2 ){//如果是空地，房子可以移动过去
				// console.log("moveTo");
				// console.log("moveTo:"+this.ev.x);
				// console.log("moveTo:"+this.ev.y);
				// console.log("moveTo:"+this.ev.location);
				let m = Math.floor( GameData.elements[this.ev.id].location /GameData.MaxColumn);
				let n = GameData.elements[this.ev.id].location % GameData.MaxColumn;
				GameData.mapData[i][t] = this.ev.id;
				let  tempLocation:number = i*GameData.MaxColumn +t;
				// //console.log("tempLocation"+tempLocation);			
				for (let l = 0;l < GameData.availableMapId.length; l++){
					if (GameData.elements[GameData.availableMapId[l]].location == tempLocation){
							// //console.log("id："+GameData.availableMapId[l]);								
							GameData.elements[GameData.availableMapId[l]].location = this.ev.location
					}
				}
	
				GameData.elements[this.ev.id].location = this.elementViews[this.ev.id].location = this.ev.location =tempLocation;
				// GameData.elements[this.ev.id].grade = this.elementViews[this.ev.id].grade = this.ev.grade;

				this.ev.moveTo(this.ev.targetX(),this.ev.targetY());
				// this.showElementById(this.ev.id,false);
				GameData.mapData[m][n] = -2;
			}else{
				this.ev.back();
			}
		}
		// //console.log("mouseUp,this._touchStatus:"+this._touchStatus);
    }

	private moveinSetGrid:egret.Bitmap;
    private mouseMove(evt:egret.TouchEvent){	
		// //console.log("moving now ! touchStatus :" +this._touchStatus);
		// //console.log("moving now ! this.ev.id :" +this.ev.id);
        if( this._touchStatus )
        {
            this.ev.x = evt.stageX - this._distance.x;
           	this.ev.y = evt.stageY - this._distance.y;
			
            // //console.log("moving now ! Mouse: [X:"+evt.stageX+",Y:"+evt.stageY+"]");
            // //console.log("moving now ! Mouse: [ev.X:"+this.ev.x+",ev.Y:"+this.ev.y+"]");
            // //console.log("moving now ! Mouse: [_distance.X:"+this._distance.x+",_distance.Y:"+this._distance.y+"]");
			let rpy = GameData.stageH - GameData.stageW*0.4;
			let temp:number = 0;	
			if (this.ev.y < GameData.stageH && this.ev.y >= rpy){
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
			let i:number = Math.floor((evt.stageY - GameData.startY)/GameData.girdWidth);
			let t:number = Math.floor((evt.stageX - 44)/(GameData.girdWidth+24));	
			let tempi:number;
			let tempt:number;	
			if ( i>= 0 && i < 5 && t>= 0 && t < 5){
				if( i != tempi || t != tempt){
					if (this.moveinSetGrid.parent){
						this.dragContainer.removeChild(this.moveinSetGrid);	
					}
					if(GameData.mapData[i][t] != -1 ){	
						this.moveinSetGrid.x =20+GameData.girdWidth/5+(GameData.girdWidth+GameData.girdWidth/5)*t;
						this.moveinSetGrid.y =GameData.startY+20+GameData.girdWidth*i;
						this.dragContainer.addChild(this.moveinSetGrid);	
					}
				}	
				tempi = i;
				tempt = t;
			}
		
        }
		
    }
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	private newHousePanel:NewHousePanel;
	/******************************碰撞检测相关*****************************************************************/
	private elementHitTest(ev1:ElementView,ev2:ElementView):void{

		// //console.log("ev1 id"+ev1.id);
		// //console.log("ev2 id"+ev2.id);
		let rectA:egret.Rectangle = ev1.getBounds();
		let rectB:egret.Rectangle = ev2.getBounds();
	
		//必须加上方块所在的x，y
		rectA.x += ev1.x;
		rectA.y += ev1.y;
		rectB.x += ev2.x;
		rectB.y += ev2.y;
		// let isHit:boolean = ev1.hitTestPoint(ev2.targetX(),ev2.targetY());
		let isHit:boolean = rectA.intersects(rectB)
		// //console.log(isHit);
		if(isHit){//碰到了，检测是否同级，
			// //console.log("ev1 grade"+ev1.grade);
			// //console.log("ev2 grade"+ev2.grade);
			let i = Math.floor( GameData.elements[ev1.id].location /GameData.MaxColumn);
			let t = GameData.elements[ev1.id].location % GameData.MaxColumn;	
			let m = Math.floor( GameData.elements[ev2.id].location /GameData.MaxColumn);
			let n = GameData.elements[ev2.id].location % GameData.MaxColumn;			
			if(this.elementViews[ev1.id].grade ==  this.elementViews[ev2.id].grade && this.elementViews[ev2.id].grade <= GameData.elementTypes.length){//如果等级相同，那么合并
					// //console.log(GameData.elementTypeFirstShow);
					if(!GameData.elementTypeFirstShow[GameData.elements[ev1.id].grade]){
						// console.log("恭喜合成新房子:"+GameData.elements[ev1.id].grade );//房子第一次出现
						//console.log(GameData.elementTypeFirstShow);
						GameData.elementTypeFirstShow[GameData.elements[ev1.id].grade] = true;
						// this.newHousePanel = new NewHousePanel();
						// this._layer.parent.addChild(this.newHousePanel);
						// this.newHousePanel.getNewHosuePanel(this.elementViews[ev1.id].grade+1);
						GameData.newHouse = true;
						let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.OPEN_NEW_HOUSE_PANEL);
						evt.grade = this.elementViews[ev1.id].grade+1
						this.dispatchEvent(evt);
				
						if ( this.elementViews[ev1.id].grade+1 >= GameData.maxHouseGrade){
							GameData.maxHouseGrade = this.elementViews[ev1.id].grade+1;//当前获得房屋最高等级
						}
						if(GameData.maxHouseGrade == 2){
							// this.addHelpTip();
							this.timerToBox2();
						}
					
						if(GameData.maxHouseGrade == 2){
							this.addReward();
						}
						SoundUtils.instance().playNewHouseSound();//播放获得新房子音效
					}else{
						this.addLevelExp(GameData.elements[ev2.id].grade+1);//根据新和成的房子等级加经验值
					}
					//console.log("消除动画");
					if(GameData.elements[ev1.id].type !== 'b0' && GameData.elements[ev1.id].type !== 'b1'){
						this._isDeleteOver = false;
						ev1.removeAniCall();		
						this.ev = null;				
					}
				
					// //console.log("mapData删除后的值"+GameData.mapData[i][t]);					
					this.elementViews[ev1.id].grade = GameData.elements[ev1.id].grade = 0;//删除的元素级别置为0
					this.elementViews[ev1.id].time = GameData.elements[ev1.id].time = 0;//删除后元素的创建时间置为0;
					GameData.elements[ev2.id].grade = GameData.elements[ev2.id].grade + 1;//合并后升级
					this.elementViews[ev2.id].grade = GameData.elements[ev2.id].grade;
					this._levelExpLabel.text = GameData.levelExp.toString() +"/"+GameData.levelReqExp.toString(); 
					this.barMask =  new egret.Rectangle(0, 0, GameData.levelExp/GameData.levelReqExp*this._expBar.width, this._expBar.height);
					this._expBar.mask = this.barMask;
					SoundUtils.instance().playMergeSound();//播放合成音效
					this.openBoxEffect(ev2.id);//合成房子特效
					this.showElementById(ev2.id,false);
					this.starHandler(ev2.targetX(),ev2.targetY());
					this.elementViews[ev2.id].time = GameData.elements[ev2.id].time = new Date().getTime();//合并时间;
					if(GameData.availableMapId.length == 0){
						this.timer.start();
						if(!this.helpHandleTimer.running){
							this.helpHandleTimer.reset();
							this.helpHandleTimer.start();
						}
						// //console.log(GameData.availableMapId.length);
						GameData.mapData[i][t] = -2 //删除元素后把这块格子置为-2,表示无元素
						GameData.availableMapId.push(ev1.id);//将空白地块加入可用地图数组
						
					}
					else{
						GameData.mapData[i][t] = -2 //删除元素后把这块格子置为-2,表示无元素
						GameData.availableMapId.push(ev1.id);//将空白地块加入可用地图数组
						// console.log("合成房子后回收空白地块");
						// console.log(GameData.availableMapId.length);
						// console.log(GameData.availableMapId);
					}
					
					// this.delOver(eover);
			}else{//如果等级不同，那么交换位置
				this.changeLocationWithScaleOrBack(ev1.id,ev2.id,true);
				GameData.mapData[i][t] = ev2.id;
				GameData.mapData[m][n] = ev1.id;
			}
		}else{
			this.ev.back();//如果没碰到弹回原处
		}
	}

	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	/*-----------------------------焦点相关控制--------------------------------------*/

	private _currentTapID:number = -1;  //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象

	// public setNewElementFocus(location:number){
	// 	this.elementViews[this._currentTapID].setFocus(false);
	// 	this.elementViews[location].setFocus(true);
	// 	this._currentTapID=location;
	// }

	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	/**
	 * 添加上一关留存在地图上的元素
	 */
	public addLastLevelElements():void{
		//console.log("添加上一关的留存元素:")
		let ele:ElementView;
		let len:number = GameData.MaxRow *  GameData.MaxColumn;
		for(let l=0;l<len;l++){
			ele = this.elementViews[l];
			ele.grade = GameData.elements[l].grade;
			ele.location = GameData.elements[l].location;
			ele.time = GameData.elements[l].time;
			ele.x = ele.targetX();
			ele.y = GameData.startY - ele.width;
			let i = Math.floor( ele.location /GameData.MaxColumn);
			let t = ele.location % GameData.MaxColumn;//修改成4*5地图后，t的计算方式变化
			// //console.log("所有id: "+ele.id);
			// //console.log("type: "+GameData.elements[l].type );
			if(GameData.elements[l].type == "b1"){
				ele.grade = 0;
				GameData.mapData[i][t] = ele.id;			
				ele.setTexture( "ui_box_gift_png" );
				ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50,-7);
				// //console.log("添加上一关的留存元素:"+GameData.elements[l].type);						
			}else if(ele.grade == 0 && GameData.elements[l].type == "b0"){
				GameData.mapData[i][t] = ele.id;			
				ele.setTexture( "ui_box_general_png" );
				ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50);
				// //console.log("添加上一关的留存元素:"+GameData.elements[l].type);		
			}else if (GameData.elements[l].grade != 0 && GameData.elements[l].type != "b1"){
				GameData.mapData[i][t] = ele.id;
				ele.setTexture( "house#houses_a_"+this.addPreZero(ele.grade)+"_big" );		
				ele.show((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50);
				// GameData.availableMapId.splice(l,1);//将使用过的MapId从可用数组里面删除
				// //console.log("availableMapId:"+GameData.availableMapId);
			}
			// console.log("剩余空地:");
			// console.log(GameData.availableMapId.length);
			// console.log(GameData.availableMapId);
				//console.log("添加上一关的留存元素"+ele.time);									
		}
	}

	/*
	*开场随机元素掉落，2018/08/10
	*author:bigfoot
	*/
	public showElement(){
		//console.log("开场随机元素掉落");		
		let ele:ElementView;
		if (GameData.availableMapId.length != 0){
			let l = Math.floor(Math.random()*GameData.availableMapId.length);
			let id = GameData.availableMapId[l];//随机从可以使用的MapId里面抽取一个
			let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
			let t = GameData.elements[id].location % GameData.MaxColumn;//修改成4*5地图后，t的计算方式变化
			
			// //console.log("随机id: "+id);
			// //console.log("随机i: "+i);
			// //console.log("随机t: "+t);
			// //console.log(GameData.mapData[i][t]);
			if(GameData.mapData[i][t]!=-1 ){
				GameData.mapData[i][t] = id;
				ele = this.elementViews[GameData.mapData[i][t]];
				GameData.elements[id].type = "b0";
				ele.setTexture( "ui_box_general_png" );
				ele.x = ele.targetX();
				ele.y = GameData.startY - ele.width;
				ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50);
				SoundUtils.instance().playBoxDownSound()//播放箱子掉落音效
				GameData.availableMapId.splice(l,1);//将使用过的MapId从可用数组里面删除
				this.timerToBox2()
				// console.log("剩余空地:");
				// console.log(GameData.availableMapId.length);
				// console.log(GameData.availableMapId);
			}
		}else{
			this.timerToBox2();
		}
		// //console.log("可用地图Id: "+GameData.availableMapId);
		
	}

	/*
	*单个随机纸箱掉落，2018/08/16
	*author:bigfoot
	*/
	public showRandomElement(){
		//console.log("随机掉落开始");	
		let ele:ElementView;
		
		// console.log("可用地图Id: "+GameData.availableMapId);
		// //console.log("mapData: "+GameData.mapData);
		// //console.log("elements: "+GameData.elements);
		for(let l:number = 0;l<GameData.availableMapId.length;l++){
			let id:number = GameData.availableMapId[l];
			let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
			let t = GameData.elements[id].location % GameData.MaxColumn;
			// //console.log("随机id: "+id);
			// //console.log("随机元素的type: "+GameData.elements[id].type);
			// //console.log("随机元素的location: "+GameData.elements[id].location);
			// //console.log("随机i: "+i);
			// //console.log("随机t: "+t);
			if(GameData.mapData[i][t] != -2 ){
				GameData.availableMapId.splice(l,1);
			}
		}
		// console.log("可用地图Id2: "+GameData.availableMapId);
		if (GameData.availableMapId.length == 0 ){
			this.timer.stop();
			this.removeHelpHandle();
			this.helpHandleTimer.stop();//没有多余空地时候不显示指示助手
		}else{
			let l = Math.floor(Math.random()*GameData.availableMapId.length);
			let id = GameData.availableMapId[l];//随机从可以使用的MapId里面抽取一个
			let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
			let t = GameData.elements[id].location % GameData.MaxColumn;
			GameData.mapData[i][t] = id;
			ele = this.elementViews[GameData.mapData[i][t]];
			ele.location = GameData.elements[id].location;
			let ran=Math.ceil(Math.random()*100);
			if (ran <= GameData.boxDownWeight){	
				GameData.elements[id].type = "b0";
				ele.setTexture( "ui_box_general_png" );
			}else if(GameData.boxDownWeight < ran){
				GameData.elements[id].type = "b1";
				ele.setTexture( "ui_box_gift_png" );
			}
			ele.x = ele.targetX();
			ele.y = GameData.startY - ele.width;
			ele.grade = 0;
			// //console.log("ele.y: "+ele.y)
			// //console.log("ele.targety: "+ele.targetY())
			ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50,-7);
			SoundUtils.instance().playBoxDownSound()//播放箱子掉落音效
			GameData.availableMapId.splice(l,1);//将使用过的MapId从可用数组里面删除
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
	}

	
	/*
	*指定id元素创建，2018/08/16
	*author:bigfoot
	*/
	public showElementById(id:number,isFirst:boolean = true){
		// console.log("指定id元素掉落");
		// let GameData.startY:number  = (GameData.stageH - (GameData.stageW - 30)/6 - 60 )-GameData.girdWidth*GameData.MaxRow;
		let ele:ElementView;
		let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
		let t =GameData.elements[id].location % GameData.MaxColumn;
		if( GameData.mapData[i][t] != -1){
			// GameData.mapData[i][t] = id;
			ele = this.elementViews[id];
			ele.x = ele.targetX();
			if(isFirst){
				ele.y = GameData.startY - ele.width;
			}else{
				// ele.y = ele.targetY() + ele.height/4;
				ele.y = ele.targetY();
			}
			// console.log(GameData.elements[id].type);
			if(GameData.elements[id].type == "b"){
				GameData.elements[id].type = "b0";
				GameData.mapData[i][t] = id;
				ele.setTexture( "ui_box_general_png" );
				ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50);
				let index = GameData.availableMapId.indexOf(id);
				GameData.availableMapId.splice(index,1);
			}else{
				ele.setTexture( "house#houses_a_"+this.addPreZero(this.elementViews[id].grade)+"_big" );
				ele.show((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50);
			}
			// console.log("剩余空地:");
			// console.log(GameData.availableMapId.length);
			// console.log(GameData.availableMapId);

			// this._currentTapID = -1;
		}
	}

	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	/*---------------------------------定时器---------------------------------------*/
	private _countdown:number = 10;
	private timer: egret.Timer = new egret.Timer(1000, 0);
	private coinTimer: egret.Timer = new egret.Timer(1000, 0);
	private floatCoinTimer: egret.Timer = new egret.Timer(1000, 0);
	private rewardTimer:egret.Timer = new egret.Timer(1000,Math.round(Math.random()*30 + 30));
	// private rewardTimer:egret.Timer = new egret.Timer(12000,1);
	private helpHandleTimer:egret.Timer = new egret.Timer(6000,1)

	

	public timerToBox2(){
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
		if (!this._addReward && GameData.maxHouseGrade >= 4){
			this.rewardTimer.start();
		}else{
			this.rewardTimer.reset();//如果已经有了，那么重新开始计时
			this.rewardTimer.start();
		} 
    }

	private _rewardShareIcon:egret.Bitmap;
	private _addReward:boolean = false;//没有标志
	private _rewardIconSprite:egret.Sprite = new egret.Sprite();
	/**
	 * 生成免费分享奖励
	 */
	public addReward(){
		console.log("生成免费奖励图标");
		this._rewardShareIcon = ResourceUtils.createBitmapByName("shop#shop_bubble_png");
		this._rewardShareIcon.x =  GameData.stageW - 15 - GameData.girdWidth*0.93 -this._rewardShareIcon.width;
		this._rewardShareIcon.y = GameData.stageH - GameData.girdWidth*0.966 -30;
		if (!this._addReward && GameData.maxHouseGrade >= 2){
			// console.log("生成免费奖励图标成功");
			this._addReward = true;//如果没有免费标志，那么加上
			this._layer.addChild(this._rewardIconSprite); 
			this._rewardIconSprite.addChild(this._rewardShareIcon);
			this.rewardTimer.reset()
			this.rewardTimer.start();
		}else{
			// console.log("已经有图标了，重置时间");
			this.rewardTimer.reset();//如果已经有了，那么重新开始计时
			this.rewardTimer.start();
		}	
		// console.log("生成免费奖励倒计时："+this.rewardTimer.currentCount);
		
	}

    private timeFuc(){
		// console.log("生成免费奖励倒计时状态："+this.rewardTimer.running);
		this._numText.text = this._countdown.toString();
		// this.hitBox.setBoxImg(10 -this._countdown +1);
        this._countdown--?this._countdown<0:this._countdown=1;
		
        if (this._countdown == 0 && this._isDeleteOver){
			this.timer.delay = 1000;
			this.showRandomElement();
			this.hitBox.ResetMcFrameRate();
            this._countdown = 10;
        }
        
        // //console.log(this._countdown);
        // //console.log(this._isDeleteOver);
    }

	public set countdown(countdown:number){
		this._countdown = countdown;
	}
	public get countdown():number{
		return  this._countdown;
	}

	private i:number = 1;
	private mc1:egret.MovieClip;
	private mc2:egret.MovieClip;
	/**
	 * 点击倒计时加速，每点击一下减一秒
	 */
	private tapTimerSpeed(evt:egret.TouchEvent){
		this.removeHelpHandle();
		if(this.helpTiptxtView)
		this.helpTiptxtView.parent && this.helpTiptxtView.parent.removeChild(this.helpTiptxtView);
		if(this.guideBubble)
		this.guideBubble.parent && this.guideBubble.parent.removeChild(this.guideBubble);
		SoundUtils.instance().playHitBoxSound();
		let pv:PropView = <PropView>evt.currentTarget;
		// //console.log("pv.id"+pv.id);
		if( pv.id == 2){
			if (this.timer.delay  > 0){
				// this.timer.delay -= 100;
				this.timer.delay = 0.7*this.timer.delay;
       		}else{
				this.timer.delay = 1000;
				
			}
			pv.setPlayTime(1);
		}
	}
	


	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	/********************************************************************************* */
	
	/*---------------------------------------------------金币计算------------------------------------------------------*、
	/**
	 * 总金币计算
	 * author:bigfootzq
	 * date:2018/09/11
	 */

	private addCoin():void{
		// console.log("生成免费奖励次数："+this.rewardTimer.repeatCount);
		// console.log("生成免费奖励当前次数："+this.rewardTimer.currentCount);	
		console.log(this.rewardTimer.repeatCount - this.rewardTimer.currentCount);	
		// //console.log("每秒加金币："+GameData.secCoin);
		let secTotalcoin:string = this.addSecCoin();
		// let gbg= new GameBackGround();
		// //console.log(GameBackGround.hTimerStatus);
		if(GameBackGround.hTimerStatus){
			GameData.secCoin = CommonFuction.cheng(secTotalcoin,'5');
			this.floatCoinTimer.delay = 200;
		}else{
			GameData.secCoin = secTotalcoin;
			this.floatCoinTimer.delay = 1000;
		}
		// GameData.coin  += Number(secTotalcoin);
		GameData.coin  = CommonFuction.jia(GameData.coin,GameData.secCoin);
		
		this._coinLabel.text = this.numZero(GameData.coin);
		this._coinSecLabel.text = this.numZero(GameData.secCoin);
	}


	/**
	 * 数字补零
	 */
	private  addPreZero(num){
		return ('00'+num).slice(-3);
	}
	/**	
	 * 数字去零计算
	 */
	private numZero(num:any):string{
		// //console.log("数字去0计算"+num);
		let numString:string;
		if(typeof(num) == "number"){
			numString = Math.floor(num).toString();
		}else{
			// numString = num.split(".")[0];
			numString = num;
		}
		let numLength:number = numString.length;
		let zeroNumber:number = Math.floor( (numLength-1) / 3);
		if (zeroNumber > 0){
				numString = numString.slice(0,-1*zeroNumber*3) + "."+numString.slice(numLength-zeroNumber*3,numLength-zeroNumber*3+2)+ GameData.zeroConfigArr[zeroNumber - 1].company;		
		}else{
			numString = num.toString();
		}
		return numString;
	}

	/**	
	 * 数字去零计算舍去小数点
	 */
	private numZero2(num:any):string{
		// //console.log("数字去0计算"+num);
		let numString:string;
		if(typeof(num) == "number"){
			numString = Math.floor(num).toString();
		}else{
			// numString = num.split(".")[0];
			numString = num;
		}
		let numLength:number = numString.length;
		let zeroNumber:number = Math.floor( (numLength-1) / 3);
		if (zeroNumber > 0){
				numString = numString.slice(0,-1*zeroNumber*3) + GameData.zeroConfigArr[zeroNumber - 1].company;		
		}else{
			numString = Math.round(num).toString();
		}
		return numString;
	}

	/**
	 * 秒产金币计算
	 * author:bigfootzq
	 * date:2018/09/11
	 */
	private addSecCoin():string {
		let secTotalcoin:string = '0';
		//遍历GameData.elements[],对每个等级的房子乘以秒产，每秒刷新一次
		for(let l:number = 0;l < this.elementViews.length; l++){
			if(this.elementViews[l].grade != 0){
				// let houseSecCoin:number = houseDownArr[this.elementViews[l].grade-1].coin_num * Math.pow(10,houseDownArr[this.elementViews[l].grade-1].coin_Base);
				let houseSecCoin:string = GameData.houseDownArr[this.elementViews[l].grade-1].coin_num ;				
				// secTotalcoin = CommonFuction.jia(secTotalcoin,CommonFuction.cheng(this.elementViews[l].grade.toString(),houseSecCoin));
				secTotalcoin = CommonFuction.jia(secTotalcoin,houseSecCoin);
			}
		}
		// //console.log("每秒增加金币："+secTotalcoin );
		// if (CommonFuction.compareMax(secTotalcoin,GameData.secCoin)){
		// 	GameData.secCoin = secTotalcoin
		// }
		// //console.log("每秒增加金币返回值："+GameData.secCoin );
		return secTotalcoin;
	}

	/**
	 * 飘字,每1000毫秒计算一次
	 */
	private plusIndex:number  = 5;
	private floatCoin():void{
		for(let l:number = 0;l < this.elementViews.length; l++){
			if(this.elementViews[l].time != 0 && this.elementViews[l].grade > 0){
				// //console.log("飘字 : ");
				// //console.log(this.elementViews[l].grade-1);
				let houseSecCoin:string = GameData.houseDownArr[this.elementViews[l].grade-1].coin_num ;
				// let houseSecCoin:number = houseDownArr[this.elementViews[l].grade-1].coin_num * Math.pow(10,houseDownArr[this.elementViews[l].grade-1].coin_Base);
				let curretTime = new Date().getTime();
				let timeDiffrent = Math.floor((curretTime - this.elementViews[l].time)/1000);
				// //console.log("curretTime : "+ curretTime );
				// //console.log("thisTime : "+ this.elementViews[l].time);
				// //console.log("timeDiffrent : "+ timeDiffrent );
				// //console.log(houseDownArr[this.elementViews[l].grade-1].coin_time);
				// //console.log("求余 : ");
				// //console.log(Number(timeDiffrent) % Number(houseDownArr[this.elementViews[l].grade-1].coin_time*2) );
				let speed:number;
				let index:number = 1;
				if(GameBackGround.hTimerStatus){
					speed = 160;
					index = 5;
				}else{
					speed = 800;
					index = 1
					this.plusIndex = 1;
				}
				if ( Number(timeDiffrent) % Number(GameData.houseDownArr[this.elementViews[l].grade-1].coin_time*2) == 0 && this._isDeleteOver){
					// console.log("飘出金币")
					
					this.plusIndex--;
					// console.log(this.plusIndex);
					if (this.plusIndex == 0){
						this.elementViews[l].playScale();
						SoundUtils.instance().playHouseCoinSound();
						this.plusIndex = index;
					}
					this.floatCoinText(this.numZero2(houseSecCoin),this.elementViews[l].targetX() -15,this.elementViews[l].targetY()-15,speed);
				}
			}
		}
	}
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
	private dragContainer = new egret.Sprite();
	showSynthesisGird(id:number,grade:number){
		let gbg= new GameBackGround();
		for(let l:number = 0;l < this.elementViews.length; l++){
			if(this.elementViews[l].grade ==grade && this.elementViews[l].grade > 0 && this.elementViews[l].id != id){
				//console.log(this.elementViews[l].location);
				let i = Math.floor( this.elementViews[l].location /GameData.MaxColumn);
				let t = this.elementViews[l].location % GameData.MaxColumn;
				let gird:egret.Bitmap = new egret.Bitmap();
				gird.width =GameData.girdWidth;
				gird.height =GameData.girdWidth*0.6;
				gird.x =20+GameData.girdWidth/5+(GameData.girdWidth+GameData.girdWidth/5)*t;
				gird.y =GameData.startY+20+GameData.girdWidth*i;
				if(GameData.mapData[i][t]!=-1){	
					gird.texture = RES.getRes("drag_synthesis_small_png");//载入地块
				}

				this._layer.addChildAt(this.dragContainer,0);
				this.dragContainer.addChild(gird);
			}
		}
	}

	private _movein:boolean = false;
	addMoveinSetGird(id:number){
		this.moveinSetGrid = new egret.Bitmap();
		let i = Math.floor( this.elementViews[id].location /GameData.MaxColumn);
		let t = this.elementViews[id].location % GameData.MaxColumn;
		this.moveinSetGrid.width =GameData.girdWidth;
		this.moveinSetGrid.height =GameData.girdWidth*0.6;
		this.moveinSetGrid.x =20+GameData.girdWidth/5+(GameData.girdWidth+GameData.girdWidth/5)*t;
		this.moveinSetGrid.y =GameData.startY+20+GameData.girdWidth*i;
		this.moveinSetGrid.texture = RES.getRes("drag_moveinset_small_png");//载入地块
		this.dragContainer.addChild(this.moveinSetGrid);
		this._movein = true;
	}

	clearSynthesisGird(){
		while(this.dragContainer.numChildren){
            this.dragContainer.removeChildAt(0);
        }
	}

	/*-----------------------------播放 删除动画--------------------------------------*/
		
	/**
	 * isBack = true
	 * 可以交换，但是交换后没有发生位置移动
	 * 移除焦点
	 * 播放一个交换的动画，然后两个位置再换回来
	 * isBack=false
	 * 播放 删除动画-
	*/
	public changeLocationWithScaleOrBack(id1:number,id2:number,isBack:boolean)
    {
		//从 e1id 交换到 e2id
		let  e1id=id1;//有焦点的元素
		let  e2id=id2;
		if(this.elementViews[id2].focus){
			e1id =id2;
			e2id =id1;
		}
		let temp:number  = this.elementViews[e1id].location;
		this.elementViews[e1id].location  = this.elementViews[e2id].location;
		this.elementViews[e2id].location  = temp;
		GameData.elements[e1id].location = this.elementViews[e1id].location;
		GameData.elements[e2id].location = this.elementViews[e2id].location;

		// this.elementViews[e1id].setFocus(false);
		if(this._layer.getChildIndex(this.elementViews[e1id])<this._layer.getChildIndex(this.elementViews[e2id])){
			this._layer.swapChildren(this.elementViews[e1id],this.elementViews[e2id]);
		}


		
		if(isBack)//播放交互动画，交换后再返回-
		{
			var xx:number = this.elementViews[e1id].targetX();
			var yy:number = this.elementViews[e1id].targetY();
			
			var x:number = this.elementViews[e2id].targetX();
			var y:number = this.elementViews[e2id].targetY();
			this.elementViews[e1id].moveTo(xx,yy);
			this.elementViews[e2id].moveTo(x,y);
			// this.elementViews[e1id].moveAndBack(this.elementViews[e2id].location,true);
			// this.elementViews[e2id].moveAndBack(this.elementViews[e1id].location);
		}
		else//播放 删除动画
		{
			this.elementViews[e1id].moveAndScale(this.elementViews[e2id].location,true);
			this.elementViews[e2id].moveAndScale(this.elementViews[e1id].location);
	
		}
		
		this._currentTapID = -1;
	}

	
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

	/*-----------------------------动画播放控制--------------------------------------*/
    private moveEleNum:number=0;
	private _isDeleteOver:boolean = true;
	/**
	 * 播放曲线动画，此类型动画用于可消除过关条件得情况
	 */

	public playReqRemoveAn(id:number,tx:number,ty:number)
	{
        this.moveEleNum++;
        var el:ElementView = this.elementViews[id];
        if(el.parent)
        {
            this._layer.setChildIndex(el, this._layer.numChildren);
        }
        el.playCurveMove(tx,ty);
    }
	/**
	 * 播放放大动画，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
	 */
	public playRemoveAni(id:number){
		// this.moveEleNum++;
		let el:ElementView =this.elementViews[id];
		if(el.parent){
			this._layer.setChildIndex(el,this._layer.numChildren);
		}
		el.playRemoveAni();
	}

	/**
	 * scale控制播放放大动画，默认放大，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
	 */
	public playRecycleAni(id:number,x:number,y:number,scale:boolean=true){
		// this.moveEleNum++;
		let el:ElementView =this.elementViews[id];
		if(el.parent){
			this._layer.setChildIndex(el,this._layer.numChildren);
		}
		if(scale){
			el.playRecycleAni(x,y);
		}else{
			el.playRemoveAniNoScale(x,y);
		}
	}
	/**
	 * 删除完毕重新开始计时
	 */
	public delOver(evt:ElementViewManageEvent){
			if(evt){
				// //console.log("删除完毕");
				this._isDeleteOver = true;
			}
	}


   /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
   
      //删除动画完成，现在更新地图元素
    public updateMap(evt:ElementViewManageEvent)
    {
        this.moveEleNum--;
        if(this.moveEleNum==0)//不会多次触发 事件
        {
            this.dispatchEvent(evt);
        }
    }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
		 	
	/**
	 * 合并操作过关经验值增加
	 * author:bigfootzq
	 * date:2018/08/20
	 */
	private tempExp:number = 0;
	public addLevelExp(grade:number){
		let levelExp:number = 0;
		if (grade >= 1){
			levelExp = GameData.houseDownArr[grade - 1].down_exp;
		}

		GameData.levelExp += Number(levelExp);
		this._levelExpLabel.text = GameData.levelExp.toString() +"/"+GameData.levelReqExp.toString();
		this.barMask =  new egret.Rectangle(0, 0, GameData.levelExp/GameData.levelReqExp*this._expBar.width, this._expBar.height);
		this._expBar.mask = this.barMask;
		this.tempExp += Number(levelExp);
		if(this.tempExp >= 80){
			//console.log("将总资产上传到云");
			let score:string = CommonFuction.jia(GameData.coin,GameData.cost);
			platform.setUserCloudStorage([{key:"score",value:this.numZero(score)+""}]);//将总资产上传到云
			this.tempExp = 0;
		}
		if(GameData.levelExp >= GameData.levelReqExp && !GameData.newHouse){
			let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.LEVEL_EXP_UP);
			this.levelExpUp(evt);
		}
		
	}
	/**
	 * 
	 */
	private starHandler(x:number,y:number):void {
		//console.log("经验值黄星");
		
		let star1 = ResourceUtils.createBitmapByName("star_png");
		star1.width = GameData.girdWidth*0.44;
		star1.height = GameData.girdWidth*0.53;
		star1.x = x -star1.width/2;
		star1.y = y -star1.height/2;;
		this._layer.addChild(star1);

		let star2 = ResourceUtils.createBitmapByName("star_png");
		star2.width = GameData.girdWidth*0.44*0.8;
		star2.height = GameData.girdWidth*0.53*0.8;
		star2.x = x -star2.width/2;
		star2.y = y -star2.height/2;;
		this._layer.addChild(star2);

		let star3 = ResourceUtils.createBitmapByName("star_png");
		star3.width = GameData.girdWidth*0.44*0.4;
		star3.height = GameData.girdWidth*0.53*0.4;
		star3.x = x -star3.width/2;
		star3.y = y -star3.height/2;;
		this._layer.addChild(star3);

		var tw1:egret.Tween = egret.Tween.get(star1);
		var tw2:egret.Tween = egret.Tween.get(star2);
		var tw3:egret.Tween = egret.Tween.get(star3);
		tw1.to({x:20,y:30},1000, egret.Ease.cubicInOut)
		tw2.wait(250).to({scaleX:0.8,scaleY:0.8,x:29,y:39},750, egret.Ease.cubicInOut)
		tw3.wait(500).to({scaleX:0.4,scaleY:0.4,x:48,y:58},500, egret.Ease.cubicInOut).call(function(){
			this._layer.removeChild(star1);
			this._layer.removeChild(star2);
			this._layer.removeChild(star3);
			;},this);
		
	}
	/**
	 * 粒子特效，发现不好用，暂时不加
	 */
	// private _starEndParticle:particle.GravityParticleSystem;
	// private starHandler2(x:number,y:number):void {
	// 	egret.log("粒子特效")
    //     // if (this._starEndParticle == null) {
    //         var texture = RES.getRes("star_png");
    //         var config = RES.getRes("star_json");
    //         this._starEndParticle = new particle.GravityParticleSystem(texture, config);
    //         this._layer.addChild(this._starEndParticle);
    //     // }
        
    //     this._starEndParticle.start(1000);
	// 	this._starEndParticle.emitterX = x;
	// 	this._starEndParticle.emitterY= y;
	// 	var angle:number = 0;
	// 	egret.startTick(function (timeStamp:number):boolean {
	// 		angle += -0.1;
			
	// 		this._starEndParticle.emitterX = angle * 200;
	// 		this._starEndParticle.emitterY = angle * 200 / 2;
			
	// 		return false;
	// 	}, this);
    //     // this._starEndParticle.emitterX = x;
    //     // this._starEndParticle.emitterY = y;
    //     // this._starEndParticle.x= 0;
    //     // this._starEndParticle.y= 0;
    // }
	private levelUpPanel:LevelUpPanel;
	/**
	 * 经验值超过过关经验值的时候发出消息
	 * author:bigfootzq
	 * date:2018/09/01
	 */
	public levelExpUp(evt:ElementViewManageEvent){	
		if(GameData.levelExp >= GameData.levelReqExp){
			// //console.log("levelExpup函数"+GameData.coin)
			// //console.log("levelExpup函数"+GameData.levelCoin)
			// GameData.coin +=  Number(GameData.levelCoin);//通关加奖励金币
			this.timer.stop();//这一关结束了，暂停计时器
			this.coinTimer.stop();
			this.floatCoinTimer.stop();
			SoundUtils.instance().stopBg();
			
			// //console.log("免费ICON的布尔值："+this._addReward.toString())
			egret.localStorage.setItem("rewardIconStatus",this._addReward.toString()); 
			this.dispatchEvent(evt);
			let userGameData =  egret.localStorage.getItem("userGameData");
			if(userGameData){
				//console.log("读取旧数据成功")
				let oldData = JSON.parse(userGameData);
				//console.log(oldData);
				if(CommonFuction.compareMax(oldData.cost,GameData.cost))
				{
					GameData.cost = oldData.cost;
				}
			}else{
				//console.log("没有旧数据");        
			}
			let score:string = CommonFuction.jia(GameData.coin,GameData.cost);
			platform.setUserCloudStorage([{key:"score",value:this.numZero(score)+""}]);//将总资产上传到云
		}
	}
	/**--------------------------升级弹窗----------------------------------------------------------------------------- */
	private _levelUpPanel:egret.Sprite  = new egret.Sprite();
	private getLevelUpPanel(){
		this.timer.stop();
		this._layer.addChild(this._levelUpPanel);
		let levelUpMask = new egret.Shape();
        levelUpMask.graphics.beginFill(0x000000, 0.8);
        levelUpMask.graphics.drawRect(0, 0,GameData.stageW,GameData.stageH);
        levelUpMask.graphics.endFill();
        levelUpMask.alpha = 0.8;
	}

	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
	

	/**-------------------------------------------------------房子回收--------------------------------------------------------------------------------- */
	
	private recycle:egret.Shape = new egret.Shape();
	private createRecycle(){
		//console.log("添加回收站");
		this.recycle.width = GameData.girdWidth*0.6 + 5;
		this.recycle.height = GameData.girdWidth*0.708 + 5;
		let x = GameData.stageW - 10 -this.recycle.width*3/2 -5;
		let y = GameData.stageH - this.recycle.height -GameData.girdWidth*1.21 -15;
		this.recycle.graphics.beginFill(0x000000, 0);
       	// this.recycle.graphics.drawRect(this.recycle.x,this.recycle.y,this.recycle.width,this.recycle.height);
       	this.recycle.graphics.drawRect(x,y,this.recycle.width,this.recycle.height);
      	this.recycle.graphics.endFill();
		this._layer.addChild(this.recycle);
	}

	/**
	 * 打开确认删除面板
	 */
	private _confirmRecycleContainer:egret.Sprite = new egret.Sprite();
	private _confirmBtn:egret.Bitmap = new egret.Bitmap();
	private _reclaimCheck:egret.Bitmap = ResourceUtils.createBitmapByName("reclaim_check_png");
	private _isDelete:boolean = false;
	private _isDisableConfirm:boolean = false;//是否禁止弹出回收面板
	private openConfirmRecycle(){
		this.timer.stop();
		this.floatCoinTimer.stop();
        SoundUtils.instance().playClickSound();
		this._layer.addChild(this._confirmRecycleContainer);
        
        let confirmBase:egret.Bitmap = ResourceUtils.createBitmapByName("reclaim_base_png");
        confirmBase.x =  GameData.stageW/2 - confirmBase.width/2;
        confirmBase.y =  GameData.stageH/2 - confirmBase.height/2;

        let confirmMask = new egret.Shape();
        confirmMask.graphics.beginFill(0x000000, 0.8);
        confirmMask.graphics.drawRect(0,0,GameData.stageW,GameData.stageH);
        confirmMask.graphics.endFill();
        confirmMask.alpha = 0.8;
        this._confirmRecycleContainer.addChild(confirmMask);
        this._confirmRecycleContainer.addChild(confirmBase);

		let grade = this._hitEv.grade;
		let newHouse:egret.Bitmap = ResourceUtils.createBitmapByName("house#houses_a_"+this.addPreZero(grade)+"_big" )
		newHouse.x = confirmBase.x + confirmBase.width/2 - newHouse.width/2;
		newHouse.y = confirmBase.y + GameData.stageW/10;
		 //房子等级
		let houseLevelLabel:egret.TextField =new egret.TextField();
		houseLevelLabel.text = "LV " + grade.toString();
		houseLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
		houseLevelLabel.fontFamily = "黑体";
		houseLevelLabel.size = 20;
		houseLevelLabel.textColor = 0X7D3705;
		houseLevelLabel.width =  newHouse.width;
		houseLevelLabel.x = newHouse.x;
		houseLevelLabel.y = newHouse.y + newHouse.height + 15;

		this._confirmRecycleContainer.addChild(newHouse);
		this._confirmRecycleContainer.addChild(houseLevelLabel);
		//房子价格
		let newHouseCoin:egret.Bitmap  = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
		newHouseCoin.x = confirmBase.x + confirmBase.width/4 + 18;
		newHouseCoin.y = houseLevelLabel.y + houseLevelLabel.height + 25;
		let housePriceLabel:egret.TextField =new egret.TextField();
		// let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade-1].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade-1].coinBase);
		// let housePrice:number =  Number(this._buyHouseConfigArray[this._hitEv.grade-1].coinNum);
		let housePrice:string =  GameData.buyHouseConfigArray[this._hitEv.grade-1].coinNum;

		housePriceLabel.text = this.numZero(housePrice);
		housePriceLabel.textAlign = egret.HorizontalAlign.CENTER;
		housePriceLabel.size = 20;
		housePriceLabel.fontFamily = "黑体";
		housePriceLabel.width =  newHouse.width;
		housePriceLabel.height = newHouseCoin.height
		housePriceLabel.x = houseLevelLabel.x ;
		housePriceLabel.y = newHouseCoin.y + 4;

		this._confirmRecycleContainer.addChild(newHouseCoin);
		this._confirmRecycleContainer.addChild(housePriceLabel);


        this._confirmBtn = ResourceUtils.createBitmapByName("reclaim_sure_png");
        this._confirmBtn.touchEnabled = true;
		this._confirmBtn.x = confirmBase.x + (confirmBase.width/2-this._confirmBtn.width)/2;
        this._confirmBtn.y = confirmBase.y + confirmBase.height*3/4 - 20;

		let closeBtn = ResourceUtils.createBitmapByName("reclaim_cancel_png");
        closeBtn.touchEnabled = true;
		closeBtn.x = confirmBase.x + confirmBase.width/2 + (confirmBase.width/2-closeBtn.width)/2;
        closeBtn.y = confirmBase.y + confirmBase.height*3/4 - 20;

        this._confirmRecycleContainer.addChild(this._confirmBtn);
        this._confirmRecycleContainer.addChild(closeBtn);
		this._confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.confirm,this);
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeConfirmRecycle,this);

		let disableConfirm = new egret.Shape();
        disableConfirm.graphics.beginFill(0x000000, 0);
        disableConfirm.graphics.drawRect(confirmBase.x + confirmBase.width/5,confirmBase.y + confirmBase.height*0.85 ,60,25);
        disableConfirm.graphics.endFill();
		disableConfirm.touchEnabled = true;
		disableConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP,this.disableConfirm,this);
		this._confirmRecycleContainer.addChild(disableConfirm);

		this._reclaimCheck.x = confirmBase.x + confirmBase.width/5 + 5;
		this._reclaimCheck.y = confirmBase.y + confirmBase.height*0.85;
	}

	/**
	 * 关闭确认删除面板
	 */
	private closeConfirmRecycle(){
		//console.log("关闭删除面板");
		this.timer.start();
		this.floatCoinTimer.start();
        SoundUtils.instance().playCloseSound();
		while(this._confirmRecycleContainer.numChildren){
            this._confirmRecycleContainer.removeChildAt(0);
        }
        this._layer.removeChild(this._confirmRecycleContainer);
		this._hitEv.back();
	}
	
	private confirm(){
		//console.log("确认删除")
		let x = GameData.stageW - 10 -this.recycle.width -5;
		let y = GameData.stageH - this.recycle.height/2 -GameData.girdWidth*1.21 -15;
		this.deleteElement(this._hitEv.id,x,y);
		let housePrice:string =  GameData.buyHouseConfigArray[this._hitEv.grade].coinNum;
		// let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade].coinBase);
		// GameData.coin += Number(housePrice);
		GameData.coin = CommonFuction.jia(GameData.coin.toString,housePrice);
		this._coinLabel.text = this.numZero(GameData.coin);
		this.closeConfirmRecycle();
	}
	
	private disableConfirm(){
		if(!this._isDisableConfirm){
			this._confirmRecycleContainer.addChild(this._reclaimCheck);
			this._isDisableConfirm = true;
		}else{
			if(this._reclaimCheck.parent){
				this._reclaimCheck.parent.removeChild(this._reclaimCheck);
				this._isDisableConfirm = false;
			}
		}
	}
	private _hitEv  = new ElementView(this._layer);
	/***
	 * 删除房子
	 * author:bigfootzq
	 * date:2018/11/22
	 */
	private recycleHouse(evt:egret.TouchEvent){
		this._hitEv = <ElementView>evt.currentTarget;
		let isHit:boolean = this.recycle.hitTestPoint(evt.stageX,evt.stageY);
		//console.log("删除碰撞检测"+isHit);
		if(isHit){
			//console.log("删除元素");
			if(this._isDisableConfirm){
				//console.log("直接删除元素");
				this.deleteElement(this._hitEv.id,evt.stageX,evt.stageY);
				// let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade].coinBase);
				let housePrice:string =  GameData.buyHouseConfigArray[this._hitEv.grade].coinNum;
				GameData.coin = CommonFuction.jia(GameData.coin,housePrice);
				this._coinLabel.text = this.numZero(GameData.coin);
			}else{
				this.openConfirmRecycle();
				let x = GameData.stageW - 10 -this.recycle.width -5;
				let y = GameData.stageH - this.recycle.height/2 -GameData.girdWidth*1.21 -15;
				this._hitEv.moveTo(x,y);
			}

		}else{
			this._hitEv.back();
		}
	}

	/***
	 * 新版删除房子
	 * author:bigfootzq
	 * date:2018/12/24
	 */
	private delHouse(ev:ElementView){
		this._hitEv = ev;
		let x = GameData.stageW/2 - GameData.girdWidth*1.3/2;;
        let y= GameData.stageH - GameData.girdWidth*1.64;
		let rectA:egret.Rectangle = this._hitEv.getBounds();
		let rectB:egret.Rectangle =	new egret.Rectangle(x,y,GameData.girdWidth*1.3,GameData.girdWidth*1.44); ;
	
		//必须加上方块所在的x，y
		rectA.x += this._hitEv.x;
		rectA.y += this._hitEv.y;
		// rectB.x += x;
		// rectB.y += y;
		// let isHit:boolean = ev1.hitTestPoint(ev2.targetX(),ev2.targetY());
		let isHit:boolean = rectA.intersects(rectB)
		//console.log("删除碰撞检测"+isHit);
		if(isHit){			
			//console.log("直接删除元素");
			// console.log(this._hitEv);
			// console.log(this._hitEv.id);
			// console.log(GameData.elements[this._hitEv.id].grade);
			// let housePrice:number =  this._buyHouseConfigArray[this._hitEv.grade].coinNum * Math.pow(10, this._buyHouseConfigArray[this._hitEv.grade].coinBase);
			let housePrice:string =  GameData.buyHouseConfigArray[this._hitEv.grade-1].sellcoefficient;
			GameData.coin = CommonFuction.jia(GameData.coin,housePrice);
			this.delfloatCoinText(this._hitEv.x,this._hitEv.y,this._hitEv.grade);
			this._coinLabel.text = this.numZero(GameData.coin);
			this.deleteElement(this._hitEv.id,this._hitEv.x,this._hitEv.y);
		}else{
			this._hitEv.back();
		}
	}

	/**
	 * 直接删除元素
	 * author:bigfootzq
	 * date:2018/11/18
	 */
	private deleteElement(id:number,x:number,y:number){
			let i = Math.floor(this.elementViews[id].location /GameData.MaxColumn);
			let t = this.elementViews[id].location % GameData.MaxColumn;	
			if(GameData.elements[id].type !== 'b0' || GameData.elements[id].type !== 'b1' ){
					this._isDeleteOver = false;
					this.playRecycleAni(id,x,y);				
			}
			this.elementViews[id].grade = GameData.elements[id].grade = 0;
			this.elementViews[id].time = GameData.elements[id].time = 0;
			if(GameData.availableMapId.length == 0){
				this.timer.start();
				//console.log(GameData.availableMapId.length);
				GameData.mapData[i][t] = -2 //删除元素后把这块格子置为-2,表示无元素
				GameData.availableMapId.push(id);//将空白地块加入可用地图数组
				if(!this.helpHandleTimer.running){
					this.helpHandleTimer.reset();
					this.helpHandleTimer.start();
				}
				
			}
			else{
				GameData.mapData[i][t] = -2 //删除元素后把这块格子置为-2,表示无元素
				GameData.availableMapId.push(id);//将空白地块加入可用地图数组
			}
	}

	/**
	 * 回收房屋金币飘字
	 */
	private delfloatCoinText(x:number,y:number,grade:number){
		// console.log("删除房屋金币飘字");
		let housePrice:string =  GameData.buyHouseConfigArray[grade-1].sellcoefficient;	
		let coinView = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
		coinView.x = x;
		coinView.y = y;
		var txtView: egret.TextField = new egret.TextField;
		// txtView.textColor = 0xDC143C;
		txtView.textColor = 0xFFFFFF;
		txtView.text = this.numZero(housePrice);
		txtView.bold = true;
		txtView.size = 30;
		txtView.x = coinView.x +coinView.width;
		txtView.y = coinView.y;
		this._layer.addChild(coinView);
		this._layer.addChild(txtView);

		var twn: egret.Tween = egret.Tween.get(coinView);
		twn.wait(200).to({ "alpha": 1,x:20,y:GameData.girdWidth -10,scaleX:1.2,scaleY:1.2}, 1000,egret.Ease.sineInOut).to({scaleX:1,scaleY:1}).call(function () {
			this._layer.removeChild(coinView);
		}, this);

		var twn: egret.Tween = egret.Tween.get(txtView);
		twn.wait(200).to({ "alpha": 1 ,x:20+GameData.girdWidth/3,y:GameData.girdWidth -10,scaleX:1.2,scaleY:1.2}, 1000,egret.Ease.sineInOut).to({scaleX:1,scaleY:1}).call(function () {
			this._layer.removeChild(txtView);
		}, this);
	}
		
	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */

	/*********************************房屋商城****************************************************************************************************** */
	private _shopContainer:egret.Sprite = new egret.Sprite();
    private _cardScrollView:egret.ScrollView = null;
    private _cards:egret.DisplayObjectContainer = null;
	private _openScrollX:number = 0;
    private openShop(){
        //console.log('打开商店');
		this.timer.stop();
		this.rewardTimer.stop();
        SoundUtils.instance().playClickSound();
        this._layer.parent.addChild(this._shopContainer);
        
        let shopBase:egret.Bitmap = ResourceUtils.createBitmapByName("shop#shop_base_png");
        shopBase.width = GameData.stageW;
        shopBase.height =   shopBase.width * 0.618;
        shopBase.x =  0;
        shopBase.y =  GameData.stageH-shopBase.height;
        let shopMask = new egret.Shape();
		shopMask.graphics.beginFill(0x000000, 0.8);
        shopMask.graphics.drawRect(shopBase.x,shopBase.y + GameData.stageW/16,shopBase.width,shopBase.height);
        shopMask.graphics.endFill();
        shopMask.alpha = 0.8;
        this._shopContainer.addChild(shopMask);
        this._shopContainer.addChild(shopBase);

        let closeShopBtn = ResourceUtils.createBitmapByName("shop#shop_close_png");
        closeShopBtn.touchEnabled = true;
        closeShopBtn.x = GameData.stageW - closeShopBtn.width;
        closeShopBtn.y = GameData.stageH - shopBase.height;
        this._shopContainer.addChild(closeShopBtn);
        closeShopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeShop,this);

        //创建内容，
        this._cards = this.createCards();
		// this._cards.cacheAsBitmap = true;
        // this._cards.touchEnabled = true;
        // //创建ScrollView
        this._cardScrollView= new egret.ScrollView();
        this._cardScrollView.setContent(this._cards);
        this._cardScrollView.width = shopBase.width ;
        this._cardScrollView.height = shopBase.height;
        this._cardScrollView.x = shopBase.width/2;
        this._cardScrollView.y = GameData.stageH-shopBase.height/2;
        this._cardScrollView.anchorOffsetX = this._cardScrollView.width / 2;
        this._cardScrollView.anchorOffsetY = this._cardScrollView.height / 2;
		this._cardScrollView.setScrollLeft(this._openScrollX);
        //垂直滚动设置为 on 
        this._cardScrollView.verticalScrollPolicy = "off";
        //水平滚动设置为 auto
        this._cardScrollView.horizontalScrollPolicy = "on";
        // //console.log(this._cards);
        this._shopContainer.addChild(this._cardScrollView);

		
    }

    private closeShop(){
        //console.log("关闭商店");
		this.timer.start();
		this.rewardTimer.start();
        SoundUtils.instance().playCloseSound();
		 while(this._shopContainer.numChildren){
                this._shopContainer.removeChildAt(0);
		}
        this._layer.parent.removeChild(this._shopContainer);
    }
    private _shopCardArr:ShopCardView[];
	private _housePriceLabelArr:any[];
	private _buyBtnArr:any[];
	private _newIcon:egret.Bitmap;
	private _rewardShare:egret.Bitmap = new egret.Bitmap();
	private _housePriceLabel:egret.TextField;
	private availableHouseLevel:number;
	
	private buyBtnView:ShopCardView;
    private createCards(level:number=0){
        let cards = new egret.Sprite();
        this._shopCardArr = new Array();
		this._housePriceLabelArr = new Array();
		this._buyBtnArr = new Array();
        cards.height = GameData.stageW*0.375;
		// cards.cacheAsBitmap = true;
        // cards.width = GameData.stageW*2.5;//不定义滚动卡片的宽度
        this.availableHouseLevel = GameData.availableBuyHouseArr[GameData.maxHouseGrade-1].availableLevel;
        // //console.log( this._buyHouseConfigArray);
        // //console.log(availableHouseLevel);
        // //console.log(GameData.maxHouseGrade);

        for (let i = 0 ; i <= GameData.elementTypes.length; i++){
            //房卡底图
            let shopCard:egret.Bitmap = ResourceUtils.createBitmapByName("shop#shop_card_png");
            let houseNameLabel:egret.TextField =new egret.TextField();
            let houseLevel = i + 1;
            let shopHouse:egret.Bitmap = null;
            let houseLevelLabel:egret.TextField =new egret.TextField();
           	this._housePriceLabel = new egret.TextField();
			// let housePrice:number =   this._buyHouseConfigArray[i].coinNum * Math.pow(10, this._buyHouseConfigArray[i].coinBase) * (1+ this._buyHouseConfigArray[i].buff*GameData.houseBuyNumber[i]/10000); 
			let housePrice:string = '0';
			if (GameData.houseBuyNumber[i] < GameData.buyHouseConfigArray[i].additionmax){
				//  housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].addition * GameData.houseBuyNumber[i];
				 housePrice = CommonFuction.jia(GameData.buyHouseConfigArray[i].coinNum, CommonFuction.cheng(GameData.buyHouseConfigArray[i].addition , GameData.houseBuyNumber[i].toString()));
			}else{
				// housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].additionmax * GameData.houseBuyNumber[i];	
				housePrice = CommonFuction.jia(GameData.buyHouseConfigArray[i].coinNum, CommonFuction.cheng(GameData.buyHouseConfigArray[i].addition , GameData.buyHouseConfigArray[i].additionmax));
							
			}
          	//  //console.log(housePrice);
		    let buyBtn:egret.Bitmap = ResourceUtils.createBitmapByName("shop#shop_buy_02_png");
            let buyBtnCoin:egret.Bitmap = ResourceUtils.createBitmapByName("shop#shop_money_02_png");
            let shopBuyLock:egret.Bitmap = ResourceUtils.createBitmapByName("shop#shop_buy_lock_png");
           	this.buyBtnView = new ShopCardView(houseLevel);
            this.buyBtnView.houseLevel = houseLevel;
            this.buyBtnView.housePrcice = housePrice;
            // this._shopCardArr.push(buyBtnView);
            if( houseLevel <= this.availableHouseLevel){
                shopHouse = ResourceUtils.createBitmapByName("house#houses_a_"+this.addPreZero(houseLevel)+"_big" );
				houseNameLabel.text = GameData.availableBuyHouseArr[i].housename;
				if (CommonFuction.compareMax(GameData.coin,housePrice)){ 			
                    // buyBtn = ResourceUtils.createBitmapByName("shop_buy_01_png");
                    this.buyBtnView.bitmap.texture = RES.getRes("shop#shop_buy_01_png");
                    this.buyBtnView.addEventListener(egret.TouchEvent.TOUCH_TAP,this.buyHouse,this);
                    buyBtnCoin =  ResourceUtils.createBitmapByName("shop#shop_money_01_png");
                    this._housePriceLabel.textColor = 0X681B00;
					this._openScrollX = 20 + (10+shopCard.width)*i - 10 - shopCard.width/2;
                }else{
                    buyBtn = ResourceUtils.createBitmapByName("shop#shop_buy_02_png");
                    buyBtnCoin =  ResourceUtils.createBitmapByName("shop#shop_money_02_png");
                    this._housePriceLabel.textColor = 0X333333;
                }
            }else{
                shopHouse = ResourceUtils.createBitmapByName("house#houses_a_"+this.addPreZero(houseLevel)+"_black" ); 
                buyBtn = ResourceUtils.createBitmapByName("shop#shop_buy_02_png");
                houseNameLabel.text = "???";
            }
            
            shopCard.width = GameData.stageW/4;
            shopCard.height = GameData.stageW*0.375
            shopCard.y = shopCard.height/2;
            shopCard.x += 20 + (10+shopCard.width)*i;
            //房子名称
            houseNameLabel.textAlign = egret.HorizontalAlign.CENTER;
            houseNameLabel.size = 18;
            houseNameLabel.textColor = 0XFFFFFF;
            houseNameLabel.width =  shopCard.width*0.8;
            houseNameLabel.x = shopCard.x + shopCard.width/10;
            houseNameLabel.y = shopCard.y + 24;
            //房子
            shopHouse.x = shopCard.x + shopCard.width/2 - shopHouse.width/2;
            shopHouse.y = shopCard.y + shopCard.height/2 - shopHouse.height/2;

            //购买按钮
            this.buyBtnView.x = buyBtn.x = shopCard.x + (shopCard.width-buyBtn.width)/2;
            this.buyBtnView.y = buyBtn.y = shopCard.y + shopCard.height - buyBtn.height/2;
            
            shopBuyLock.x =  buyBtn.x + buyBtn.width/2 - shopBuyLock.width/2;
            shopBuyLock.y =  buyBtn.y + (buyBtn.height- shopBuyLock.height)/2;
            //房子等级
            houseLevelLabel.text = "LV " + houseLevel.toString();
            houseLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
            houseLevelLabel.fontFamily = "黑体";
            houseLevelLabel.bold = true;
            houseLevelLabel.size = 18;
            houseLevelLabel.textColor = 0X7D3705;
            houseLevelLabel.width =  shopCard.width*0.8;
            houseLevelLabel.x = shopCard.x + shopCard.width/10;
            houseLevelLabel.y = buyBtn.y - houseLevelLabel.height -8;
            
            
            //购买按钮金币
            buyBtnCoin.x = buyBtn.x  + 8;
            buyBtnCoin.y = buyBtn.y +(buyBtn.height-buyBtnCoin.height)/2 -3;

            //房子价格
			this._housePriceLabel.text = this.numZero(housePrice);
            this._housePriceLabel.textAlign = egret.HorizontalAlign.CENTER;
            this._housePriceLabel.size = 20;
            this._housePriceLabel.width =  buyBtn.width - buyBtnCoin.width;
            this._housePriceLabel.height = buyBtn.height
            this._housePriceLabel.x = buyBtnCoin.x +buyBtnCoin.width;
            this._housePriceLabel.y = buyBtnCoin.y + 5;
			// //console.log(this.numZero(housePrice));
			this._housePriceLabelArr.push(this._housePriceLabel);
			this._buyBtnArr.push(buyBtnCoin);
            cards.addChild(shopCard);
            cards.addChild(houseNameLabel);
            cards.addChild(shopHouse);
            cards.addChild(houseLevelLabel);
			if ((houseLevel == this.availableHouseLevel) && GameData.houseBuyNumber[houseLevel-1] == 0){
				this._newIcon = ResourceUtils.createBitmapByName("shop#shop_new_png");
				this._newIcon.x = 20 + (10+shopCard.width)*(this.availableHouseLevel-1) +shopCard.width/2 -this._newIcon.width/2;
				this._newIcon.y = houseNameLabel.y + houseNameLabel.height + 10;
				cards.addChild(this._newIcon);
			}

            if( houseLevel <= this.availableHouseLevel){
                
                if (CommonFuction.compareMax(GameData.coin,housePrice)){ 
                    cards.addChild(this.buyBtnView);
                }else{
                    cards.addChild(buyBtn);
                }
                cards.addChild(buyBtnCoin);
                cards.addChild(this._housePriceLabel);
            }else{
                cards.addChild(buyBtn);
                cards.addChild(shopBuyLock);
            }

            // if ( this.availableHouseLevel >= 2 && i == this.availableHouseLevel-1 && this._addReward){
            //     this._rewardShare = ResourceUtils.createBitmapByName("shop#shop_reward_share_png");
            //     this._rewardShare.touchEnabled = true;
            //     // this._rewardShare.width = shopCard.width*3/5;
            //     this._rewardShare.width = buyBtn.width
            //     // this._rewardShare.x = 20+ (10+shopCard.width)*(this.availableHouseLevel-2) + (shopCard.width - this._rewardShare.width)/2;
            //   	// this._rewardShare.y = shopCard.y - this._rewardShare.height/2;
            //   	this._rewardShare.x = buyBtn.x;
            //   	this._rewardShare.y = buyBtn.y;
            //     cards.addChildAt(this._rewardShare,cards.numChildren); 
            //     this._rewardShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rewardShare,this);
            // }
			
			
            if ( this.availableHouseLevel >= 1 && i == this.availableHouseLevel-1 &&this._addReward){
				console.log("免费视频图标");
				console.log(i);
				console.log(this._rewardShare);
				
				if(GameData.getVideoAd){
					this._rewardShare.texture =  RES.getRes("shop#shop_reward_video_png");
					this._rewardShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rewardVideo,this);
				}else{
					this._rewardShare.texture =  RES.getRes("shop#shop_reward_share_png");
					this._rewardShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rewardShare,this);
				}
                this._rewardShare.touchEnabled = true;
                // this._rewardShare.width = shopCard.width*3/5;
                this._rewardShare.width = buyBtn.width
                // this._rewardShare.x = 20+ (10+shopCard.width)*(this.availableHouseLevel-2) + (shopCard.width - this._rewardShare.width)/2;
              	// this._rewardShare.y = shopCard.y - this._rewardShare.height/2;
              	this._rewardShare.x = buyBtn.x;
              	this._rewardShare.y = buyBtn.y;
                cards.addChildAt(this._rewardShare,cards.numChildren); 
                
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
    }

    private buyHouse(evt:egret.TouchEvent){
        //console.log("购买房屋");     
        let newHouse = <ShopCardView>evt.currentTarget;
		let housePrice:string = '0';
		if (GameData.houseBuyNumber[newHouse.houseLevel-1] < GameData.buyHouseConfigArray[newHouse.houseLevel-1].additionmax){
			//  housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].addition * GameData.houseBuyNumber[i];
			housePrice = CommonFuction.jia(GameData.buyHouseConfigArray[newHouse.houseLevel-1].coinNum, CommonFuction.cheng(GameData.buyHouseConfigArray[newHouse.houseLevel-1].addition , GameData.houseBuyNumber[newHouse.houseLevel-1].toString()));
		}else{
			// housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].additionmax * GameData.houseBuyNumber[i];	
			housePrice = CommonFuction.jia(GameData.buyHouseConfigArray[newHouse.houseLevel-1].coinNum, CommonFuction.cheng(GameData.buyHouseConfigArray[newHouse.houseLevel-1].addition , GameData.buyHouseConfigArray[newHouse.houseLevel-1].additionmax));				
		}
		if( CommonFuction.compareMax(GameData.coin,housePrice) ){
			for(let l:number = 0;l<GameData.availableMapId.length;l++){
				let id:number = GameData.availableMapId[l];
				let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
				let t = GameData.elements[id].location % GameData.MaxColumn;
				if(GameData.mapData[i][t] != -2 ){
					GameData.availableMapId.splice(l,1);
				}
			}
			if (GameData.availableMapId.length == 0 ){
				//console.log("没有多余空地,无法购买")
				this.removeHelpHandle();
				this.helpHandleTimer.stop();//没有多余空地时候不显示指示助手
				this.floatText("没有多余空地啦",0,GameData.stageH-GameData.stageW*0.618-100,1000);
			}else{

				let l = Math.floor(Math.random()*GameData.availableMapId.length);
				let id = GameData.availableMapId[l];//随机从可以使用的MapId里面抽取一个
				let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
				let t = GameData.elements[id].location % GameData.MaxColumn;
				let ele:ElementView = this.elementViews[id];
				GameData.mapData[i][t] = id;
				ele.grade = 0;
				GameData.elements[id].grade = newHouse.houseLevel;
				ele.location = GameData.elements[id].location;
				GameData.elements[id].type = "b1";
				ele.setTexture( "ui_box_gift_png" );
				ele.x = ele.targetX();
				ele.y = GameData.startY - ele.width;
				ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50,-7);
				SoundUtils.instance().playBoxDownSound()//播放箱子掉落音效
				GameData.availableMapId.splice(l,1);//将使用过的MapId从可用数组里面删除
				// console.log("剩余空地:");
				// console.log(GameData.availableMapId.length);
				// console.log(GameData.availableMapId);
				if ( newHouse.houseLevel == this.availableHouseLevel && GameData.houseBuyNumber[newHouse.houseLevel-1] == 0){	
					let cards = this._newIcon.parent;
					if(cards){
						cards.removeChild(this._newIcon);
					}
				}
				GameData.houseBuyNumber[newHouse.houseLevel-1] += 1;	
				// let housePrice:number =   this._buyHouseConfigArray[newHouse.houseLevel-1].coinNum * Math.pow(10, this._buyHouseConfigArray[newHouse.houseLevel-1].coinBase) * (1+ this._buyHouseConfigArray[newHouse.houseLevel-1].buff*GameData.houseBuyNumber[newHouse.houseLevel-1]/10000);	
				// let housePrice:number = 0;
				// if (GameData.houseBuyNumber[newHouse.houseLevel-1] < this._buyHouseConfigArray[newHouse.houseLevel-1].additionmax){
				// 	housePrice  =   Number(this._buyHouseConfigArray[newHouse.houseLevel-1].coinNum  + this._buyHouseConfigArray[newHouse.houseLevel-1].addition * GameData.houseBuyNumber[newHouse.houseLevel-1]);
				// }else{
				// 	housePrice =  Number(this._buyHouseConfigArray[newHouse.houseLevel-1].coinNum  + this._buyHouseConfigArray[newHouse.houseLevel-1].additionmax * GameData.houseBuyNumber[newHouse.houseLevel-1]);				
				// }
				if (GameData.houseBuyNumber[newHouse.houseLevel-1] <GameData.buyHouseConfigArray[newHouse.houseLevel-1].additionmax){
					//  housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].addition * GameData.houseBuyNumber[i];
					housePrice = CommonFuction.jia(GameData.buyHouseConfigArray[newHouse.houseLevel-1].coinNum, CommonFuction.cheng(GameData.buyHouseConfigArray[newHouse.houseLevel-1].addition , GameData.houseBuyNumber[newHouse.houseLevel-1].toString()));
				}else{
					// housePrice =  Number(this._buyHouseConfigArray[i].coinNum)  + this._buyHouseConfigArray[i].additionmax * GameData.houseBuyNumber[i];	
					housePrice = CommonFuction.jia(GameData.buyHouseConfigArray[newHouse.houseLevel-1].coinNum, CommonFuction.cheng(GameData.buyHouseConfigArray[newHouse.houseLevel-1].addition , GameData.buyHouseConfigArray[newHouse.houseLevel-1].additionmax));				
				}
				// //console.log("购买房屋:"+ housePrice);
				this._housePriceLabelArr[newHouse.houseLevel-1].text = this.numZero(housePrice);
				// GameData.coin -= Number(newHouse.housePrcice);
				GameData.coin =   CommonFuction.jian(GameData.coin,newHouse.housePrcice);
				this._coinLabel.text = this.numZero(GameData.coin);
				// GameData.cost += Number(newHouse.housePrcice);//购买房屋的总花费
				GameData.cost = CommonFuction.jia(GameData.cost,newHouse.housePrcice);
			}	
		}else{
			// //console.log(this.buyBtnView.parent);
			// this._cards.removeChild(this.buyBtnView);
			// this.buyBtnView.bitmap.texture = RES.getRes("shop_money_02_png");
			// this._cards.addChild(this.buyBtnView);
			this.floatText("没有足够的金币",0,GameData.stageH-GameData.stageW*0.618-100,1000);
		}
        
    }
    private rewardShare(){
		// console.log("rewardShare");	
		if (!GameLogic.closeShare && typeof(GameLogic.closeShare) != "undefined"){
			let shareResult = platform.share("key=reward");
			egret.localStorage.setItem("fhTime",new Date().getTime().toString());	
			// //console.log(shareResult);	
		}else{
			this.rewardHouse();
		}

    }
	private getVideoAd(){
		console.log("拉取视频广告");
		this.rewardedVideoAd = platform.createRewardedVideoAd();
		this.rewardedVideoAd.onLoad(() => {
			console.log("拉取成功");
			GameData.getVideoAd = true;
		})
		this.rewardedVideoAd.onError(err => {
			console.log(err)
			GameData.getVideoAd = false;
		})	
	}
	private rewardedVideoAd:any;
    private rewardVideo(){
		console.log("rewardVedio");	
		if (GameData.availableMapId.length == 0 ){
			//console.log("没有多余空地,无法获得免费房屋")
			this.removeHelpHandle();
			this.helpHandleTimer.stop();//没有多余空地时候不显示指示助手
			this.floatText("没有多余空地啦",0,GameData.stageH-GameData.stageW*0.618-100,1000);
		}else{
			this.rewardedVideoAd.load().then(() =>this.rewardedVideoAd.show()).catch(err => console.log(err.errMsg));
			this.rewardedVideoAd.onClose(
			res => {
			if(!this.rewardedVideoAd) return
			this.rewardedVideoAd.offClose()
			if (res && res.isEnded || res === undefined) {

				this.rewardHouse();
			}
			else {
				this.floatText("只有看完广告才能领取奖励哦！", 0, GameData.stageH - GameData.stageW * 0.618 - 100, 1000);
			}
			});

		}
		
    }

	//免费获得房屋
	public rewardHouse(){
		// console.log("获得免费房屋")
		for(let l:number = 0;l<GameData.availableMapId.length;l++){
			let id:number = GameData.availableMapId[l];
			let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
			let t = GameData.elements[id].location % GameData.MaxColumn;
			if(GameData.mapData[i][t] != -2 ){
				GameData.availableMapId.splice(l,1);
			}
		}
		if (GameData.availableMapId.length == 0 ){
			//console.log("没有多余空地,无法获得免费房屋")
			this.removeHelpHandle();
			this.helpHandleTimer.stop();//没有多余空地时候不显示指示助手
			this.floatText("没有多余空地啦",0,GameData.stageH-GameData.stageW*0.618-100,1000);
		}else{
           
			let l = Math.floor(Math.random()*GameData.availableMapId.length);
			let id = GameData.availableMapId[l];//随机从可以使用的MapId里面抽取一个
			let i = Math.floor( GameData.elements[id].location /GameData.MaxColumn);
			let t = GameData.elements[id].location % GameData.MaxColumn;
			let ele:ElementView = this.elementViews[id];
			GameData.mapData[i][t] = id;
			ele.grade = 0;
			GameData.elements[id].grade = GameData.availableBuyHouseArr[GameData.maxHouseGrade-1].availableLevel;
            ele.location = GameData.elements[id].location;
            GameData.elements[id].type = "b1";
            ele.setTexture( "ui_box_gift_png" );
			ele.x = ele.targetX();
			ele.y = GameData.startY - ele.width;
			ele.showBox((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+t)*50,-7);
			// ele.showBox(3000);
			SoundUtils.instance().playBoxDownSound()//播放箱子掉落音效
			GameData.availableMapId.splice(l,1);//将使用过的MapId从可用数组里面删除
			// console.log("剩余空地:");
			// console.log(GameData.availableMapId.length);
			// console.log(GameData.availableMapId);
			// console.log("标志位"+this._addReward);
			//获得免费房屋后移除里外两个标志
			if(this._addReward){
				// console.log("移除里外两个标志");
				this._rewardShare.parent && this._rewardShare.parent.removeChild(this._rewardShare);
				this._rewardIconSprite.removeChildren();
				this._rewardIconSprite.parent && this._rewardIconSprite.parent.removeChild(this._rewardIconSprite)	
				// console.log(this._rewardShareIcon.parent);
				this._addReward = false;//标志位置为false
				// console.log(this._addReward);
				this.rewardTimer.reset();//计时器重置
				this.rewardTimer.start();//计时器重置
				// console.log(this.rewardTimer.running);
				
			}
		}	
		SoundUtils.instance().playBg();
	}

	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */


	/**-----------------------------------------------飘字动画------------------------------------------------------------------------------------------------- */
	private floatText(text:string,x:number,y:number,speed:number){
		var txtView: egret.TextField = new egret.TextField;
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
		this._layer.parent?this._layer.parent.addChild(txtView):this._layer.addChild(txtView);

		var twn: egret.Tween = egret.Tween.get(txtView);
		twn.wait(speed).to({ "alpha": 0.1 ,y:y-40,scaleX:1,scaleY:1}, 500).wait(500).call(function () {
			this._layer.parent?this._layer.parent.removeChild(txtView):this._layer.addChild(txtView);
		}, this);
	}

	private floatCoinText(text:string,x:number,y:number,speed:number){
		
		var txtView: egret.TextField = new egret.TextField;
		// txtView.textColor = 0xDC143C;
		txtView.textColor = 0xFFFFFF;
		txtView.fontFamily = "黑体";
		txtView.text = text;
		txtView.bold = true;
		txtView.size = 30;
		txtView.width = GameData.girdWidth*2/3;
		txtView.textAlign = egret.HorizontalAlign.LEFT;
		txtView.x = x;
		txtView.y = y;
		let coinView = ResourceUtils.createBitmapByName("shop#shop_money_01_png");
		coinView.x = x - coinView.width;
		coinView.y = y
		this._layer.addChild(coinView);
		this._layer.addChild(txtView);

		var twn: egret.Tween = egret.Tween.get(coinView);
		twn.wait(100).to({ "alpha": 0.1 ,y:y-30,scaleX:1,scaleY:1}, 800,egret.Ease.sineInOut).call(function () {
			this._layer.removeChild(coinView);
		}, this);

		
		var twn: egret.Tween = egret.Tween.get(txtView);
		twn.wait(100).to({ "alpha": 0.1 ,y:y-30,scaleX:1,scaleY:1}, 800,egret.Ease.sineInOut).call(function () {
			this._layer.removeChild(txtView);
		}, this);
	}
	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
		/**------------------------------------开箱子特效------------------------------------------------------------------- */
	public openBoxEffect(id:number){
		//console.log("开箱子加特效")
		let type = GameData.elements[id].type;
		let mcData = RES.getRes("openbox_json");
        let mcTexture = RES.getRes("openbox_png");
        //创建动画工厂
        let mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        
		if(type == "b0"){
			let mc1:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("openbox"));
			mc1.width = this.elementViews[id].width;
			mc1.height = this.elementViews[id].height;
			mc1.x = this.elementViews[id].targetX() - GameData.girdWidth*4/5 -7;
			mc1.y = this.elementViews[id].targetY() - GameData.girdWidth*4/5 -15;
			// //console.log(mc1.x);
			// //console.log(mc1.y);
			this._layer.addChild(mc1);
			mc1.gotoAndPlay(1);
			mc1.addEventListener(egret.Event.COMPLETE, function (){
				// egret.log("1,COMPLETE");
				this._layer.removeChild(mc1);
			}, this);
		}else if(type == "b1"){
			let mc2:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("opengift"));
			mc2.width = this.elementViews[id].width;
			mc2.height = this.elementViews[id].height;
			mc2.x = this.elementViews[id].targetX() - GameData.girdWidth*4/5 -7;
			mc2.y = this.elementViews[id].targetY() - GameData.girdWidth*4/5 -7;
			this._layer.addChild(mc2);
			mc2.gotoAndPlay(1);
			mc2.addEventListener(egret.Event.COMPLETE, function (){
				// egret.log("1,COMPLETE");
				this._layer.removeChild(mc2);
			}, this);
		}else{
			//console.log("合成房子特效")
			let mc3:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("synthesis"));
			mc3.width = this.elementViews[id].width;
			mc3.height = this.elementViews[id].height;
			mc3.x = this.elementViews[id].targetX() - GameData.girdWidth*4/5 -7;
			mc3.y = this.elementViews[id].targetY() - GameData.girdWidth*4/5;
			this._layer.addChild(mc3);
			mc3.gotoAndPlay(1);
			mc3.addEventListener(egret.Event.COMPLETE, function (){
				// egret.log("1,COMPLETE");
				this._layer.removeChild(mc3);
			}, this);
		}

	}
	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */

	/**--------------------------------------------------------切换场景----------------------------------------------------------------------------------- */
	private changeScene(){
		//console.log("打开切换场景");
		let event:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.OPEN_SCENES);
        this.dispatchEvent(event);
		//console.log(event);
		
			// let changeScenePanel = new ChangeScenePanel()
		// 	this._layer.parent.addChild(changeScenePanel);
		// 	changeScenePanel.show();
	}
	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
	
	 /*-----------------------------更新整个地图中元素位置--------------------------------------*/
    public updateMapData()
    {
        //console.log("重新布局");
        var len:number = this.elementViews.length;
        //this.moveLocElementNum = 0;
        for(var i:number=0;i<len;i++)
        {
            this.elementViews[i].location=GameData.elements[i].location;
            this.elementViews[i].setTexture( "e"+GameData.elements[i].type+"_png" );
            this.elementViews[i].moveNewLocation();		
        }
    }
    private moveLocElementNum:number = 0;
    public moveNewLocationOver(event:ElementViewManageEvent)//新位置掉落结束
    {
        this.moveLocElementNum++;
		
        if(this.moveLocElementNum==(GameData.MaxColumn*GameData.MaxRow))//不会多次触发 事件
        {
            var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
            this.dispatchEvent(evt);
			this.moveLocElementNum =0;//重置
        }

    }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/


}