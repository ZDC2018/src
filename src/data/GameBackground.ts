class GameBackGround  extends egret.Sprite{
	public constructor() {
		super();
	}

	public changeBackground():void{
		this.cacheAsBitmap = false;
		this.removeChildren();
		this.createBackGroundImage();
		this.createMapBg();
		this.createPlayerLevelBg();
		this.createCoinBg();
		this.createCoinOutputBg();
		// console.log("背景图share加载:"+GameLogic.closeShare);
		if(!GameLogic.closeShare &&  typeof(GameLogic.closeShare) != "undefined"){
			this.createShareBg();
		}
		this.cacheAsBitmap = true;
	}

	// private _levelExpLabel:egret.TextField =new egret.TextField();
	private dragContainer:egret.Sprite;
	private bgImage: egret.Bitmap;
	public static girdLockArr:any = [];
	private _setSceneData:boolean = false;

	//创建背景图
	private createBackGroundImage(){
		this.dragContainer = new egret.Sprite();
		if (!this.bgImage){
			this.bgImage = new egret.Bitmap();
		}
		this.bgImage.texture = RES.getRes(GameData.levelBackgroundImageName);
		this.bgImage.width = GameData.stageW;
		this.bgImage.height = GameData.stageH;
		this.addChild(this.bgImage);

		//前置背景图
		// //console.log(GameData.levelFrontBackgroundImageName);		
		var frontbg: egret.Bitmap = new egret.Bitmap();
		frontbg.texture = RES.getRes(GameData.levelFrontBackgroundImageName);
		frontbg.width = GameData.stageW;
		frontbg.height = GameData.stageH * 0.37;
		frontbg.y = GameData.stageH - frontbg.height;//居底对齐
		this.addChild(frontbg);
	}



	//创建格子地图

	private createMapBg(){
		// //console.log('创建格子地图');
		// let startY:number = (GameData.stageH - (GameData.stageW - 30)/6 - 60)-girdWidth*GameData.MaxColumn;
		// SoundUtils.instance().playOpenGirdSound();
		GameBackGround.girdLockArr[GameData.currentLevel-1] = new Array();
		var mapbg: egret.Bitmap = new egret.Bitmap();//添加地图阴影背景
		mapbg.texture = RES.getRes("ui_blackbase_png");
		mapbg.width = GameData.stageW-40;
		mapbg.height = GameData.girdWidth*GameData.MaxRow;
		mapbg.x = 20;
		mapbg.y = GameData.startY;
		this.addChild(mapbg);
		let mapDataArray =  RES.getRes("map_data_json");
		let mapAddData:any;
		if (GameData.currentLevel < 9 ){
			mapAddData = [].concat(mapDataArray[GameData.currentLevel].addmap);
		}else{
			mapAddData = [].concat(mapDataArray[0].addmap);
		}
		

		let gird:egret.Bitmap;
		for (let i = 0; i < GameData.MaxRow; i++) {
			for (let t = 0; t < GameData.MaxColumn; t++) {
			
				// if(GameData.mapData[i][t]!=-1){				
				if(GameData.girdBg.length<=(i*GameData.MaxRow+t)){
					gird=new egret.Bitmap();
					GameData.girdBg.push(gird);
				}else{
					gird=GameData.girdBg[i*GameData.MaxRow+t];
				}
				gird.width =GameData.girdWidth;
				gird.height =GameData.girdWidth*0.6;
				gird.x =20+GameData.girdWidth/5+(GameData.girdWidth+GameData.girdWidth/5)*t;
				gird.y =GameData.startY+20+GameData.girdWidth*i;
				if(GameData.mapData[i][t]!=-1){	
					gird.texture = RES.getRes(GameData.girdImageName);//载入地块
				}else{
					gird.texture = RES.getRes(GameData.girdLockImageName);//载入锁定地块						
				}
				// }
				this.addChild(gird);
	
				if (i*(GameData.MaxRow-1)+t == mapAddData[0]){
					//console.log(i);
					//console.log(t);
					let girdLock =  ResourceUtils.createBitmapByName("scenebox_lock_text_png");
					girdLock.x = gird.x + GameData.girdWidth/6;
					girdLock.y = gird.y;
					this.addChild(girdLock);
					let girdLockLabel:egret.TextField = new egret.TextField(); 
					girdLockLabel.text = (GameData.currentLevel+1).toString()+"级解锁"; 
					girdLockLabel.size = 15;
					girdLockLabel.textColor = 0xFFFFFF;
					girdLockLabel.fontFamily = "黑体";
					girdLockLabel.width =  GameData.girdWidth;
					girdLockLabel.textAlign = egret.HorizontalAlign.CENTER;
					girdLockLabel.x = gird.x;
					girdLockLabel.y = gird.y +3;
					this.addChild( girdLockLabel );
					let girdLockIcon = ResourceUtils.createBitmapByName("shop_buy_lock_png");
					girdLockIcon.x = gird.x + GameData.girdWidth/2 - girdLockIcon.width/2;
					girdLockIcon.y = gird.y + GameData.girdWidth/2 - girdLockIcon.height;
					this.addChild(girdLockIcon);
					mapAddData.shift();

					GameBackGround.girdLockArr[GameData.currentLevel-1].push({x:gird.x,y:gird.y});
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

	}

	/**
	 * 创建等级显示区域背景图
	 * author:bigfoot
	 * date:2018/08/18
	 */
	private createPlayerLevelBg(){
		let bg:egret.Bitmap = new egret.Bitmap();
		bg.texture= RES.getRes("ui_level_png");
		bg.width = GameData.girdWidth*0.44;
		bg.height = GameData.girdWidth*0.53;
		bg.x=20;
		bg.y=30;
		// this.addChild(bg);

		let expBg:egret.Bitmap = new egret.Bitmap();
		expBg.texture= RES.getRes("ui_base_count_png");
		expBg.width = GameData.girdWidth*3;
		expBg.height = GameData.girdWidth/3;
		expBg.x=10+bg.width;
		expBg.y= GameData.girdWidth*0.375;
		// //console.log("等级显示背景图片"+bg.y)
		this.addChild(expBg);
		
	}


	/**
	 * 创建金币显示区域背景图
	 * author:bigfoot
	 * date:2018/08/18
	 */
	private createCoinBg(){
		let bg:egret.Bitmap = new egret.Bitmap();
		bg.texture= RES.getRes("ui_money_total_png");
		bg.width = GameData.girdWidth/3;
		bg.height = GameData.girdWidth/3;
		bg.x=20;
		bg.y=GameData.girdWidth -10;
		this.addChild(bg);

		let coinBg:egret.Bitmap = new egret.Bitmap();
		coinBg.texture= RES.getRes("ui_base_count_png");
		coinBg.width = GameData.girdWidth*1.5;
		coinBg.height = GameData.girdWidth/3;
		coinBg.x=20+GameData.girdWidth/3;
		coinBg.y=bg.y;
		this.addChild(coinBg);
		// let label:egret.TextField = new egret.TextField(); 
		// label.text = "9999"; 
		// label.width =  3*GameData.girdWidth;
		// label.x = 90;
		// label.y = bg.y;
		// this.addChild( label );
	}
	/**
	 * 创建秒产显示区域
	 * author:bigfoot
	 * date:2018/08/18
	 */
	private createCoinOutputBg(){
		let bg:egret.Bitmap = new egret.Bitmap();
		bg.texture= RES.getRes("ui_money_sec_png");
		bg.width = GameData.girdWidth/3+5;
		bg.height = GameData.girdWidth/3;
		bg.x= 25+GameData.girdWidth/3+GameData.girdWidth*1.5;
		bg.y= GameData.girdWidth -10;
		this.addChild(bg);

		let secBg:egret.Bitmap = new egret.Bitmap();
		secBg.texture= RES.getRes("ui_base_count_png");
		secBg.width = GameData.girdWidth*1.5;
		secBg.height = GameData.girdWidth/3;
		secBg.x=30+GameData.girdWidth*1.5+2*GameData.girdWidth/3;
		secBg.y=bg.y;
		this.addChild(secBg);

		// let label:egret.TextField = new egret.TextField(); 
		// label.text = "9999"; 
		// label.x = 50+GameData.girdWidth*1.5+2*GameData.girdWidth/3;
		// label.y = 50+ GameData.girdWidth/2;
		// this.addChild( label );
	}
	private share5x:egret.Bitmap;
	private share5xOn:egret.Bitmap;
	private hint:egret.Bitmap;
	private htimeBase:egret.Bitmap;
	private htimeText:egret.TextField;
	public htimer: egret.Timer = new egret.Timer(1000, 0);
	/**
	 * 创建分享两倍金币背景图
	 * author:bigfoot
	 * date:2018/08/18
	 */
	private createShareBg(){
		this.share5x = new egret.Bitmap();
		this.share5x.texture = RES.getRes("ui_share_5x_01_a_png");
		this.share5x.width = GameData.girdWidth*1.05;
		this.share5x.height = GameData.girdWidth*0.46;
		this.share5x.x = GameData.stageW - GameData.girdWidth*1.3;
		this.share5x.y = GameData.girdWidth*0.875;
		this.addChild(this.share5x);
		this.hint = ResourceUtils.createBitmapByName("ui_share_hint_png");
		this.hint.x = this.share5x.x + this.share5x.width - this.hint.width/2;
		this.hint.y = this.share5x.y;
		this.addChild(this.hint);
		this.share5x.touchEnabled = true;
		this.share5x.addEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);
		// this.share5x.addEventListener(egret.TouchEvent.TOUCH_TAP, this.x5profit, this);
	}

	private share(){
		//console.log("5倍分享:");
		let shareResult = platform.share("key=backgroud");
		egret.localStorage.setItem("x5Time",new Date().getTime().toString());	
	
		
        // this.htimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);	
		// GameData.secCoin = CommonFuction.cheng(GameData.secCoin,'5');//秒产5
	}

	public x5profit(){
		this.share5x.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);
		this.share5xOn= new egret.Bitmap();
		this.share5xOn.texture = RES.getRes("ui_share_5x_01_b_png");
		this.share5xOn.width = GameData.girdWidth*1.05;
		this.share5xOn.height = GameData.girdWidth*0.46;
		this.share5xOn.x = GameData.stageW - GameData.girdWidth*1.3;
		this.share5xOn.y = GameData.girdWidth*0.875;
		this.removeChild(this.share5x)
		this.addChild(this.share5xOn );
		this.htimeBase = ResourceUtils.createBitmapByName("ui_share_5x_timebase_png");
		this.htimeBase.x = this.share5xOn.x + (this.share5xOn.width -this.htimeBase.width)/2;
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
		if(!this.htimer.running){
			this.htimer.reset();
			this.htimer.start();
			this.cacheAsBitmap = false;
			//console.log("5倍分享:"+this.htimer.running);
		}
		GameBackGround.hTimerStatus = true;
		this.htimer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this);

	}

	public shareContinue(){
		//console.log("继续5倍秒产:");
		this.share5xOn= new egret.Bitmap();
		this.share5xOn.texture = RES.getRes("ui_share_5x_01_b_png");
		this.share5xOn.width = GameData.girdWidth*1.05;
		this.share5xOn.height = GameData.girdWidth*0.46;
		this.share5xOn.x = GameData.stageW - GameData.girdWidth*1.3;
		this.share5xOn.y = GameData.girdWidth*0.875;
		this.removeChild(this.share5x)
		this.addChild(this.share5xOn );
		this.htimeBase = ResourceUtils.createBitmapByName("ui_share_5x_timebase_png");
		this.htimeBase.x = this.share5xOn.x + (this.share5xOn.width -this.htimeBase.width)/2;
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
		if(!this.htimer.running){
			this.htimer.reset();
			this.htimer.start();
			this.cacheAsBitmap = false;
			// //console.log(this.htimer.running);
		}
		GameBackGround.hTimerStatus = true;
		this.htimer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this);

	}

	private _second:number = 60;
	private _minute:number = 2;

	public get second(){
		return this._second;
	}

	public set second(second:number){
		this._second = second;
	}

	public get minute(){
		return this._minute;
	}

	public set minute(minute:number){
		this._minute = minute;
	}

	public static hTimerStatus:boolean = false;
	/**
	 * 显示倒计时
	 */
	private timerFunc(){
		// //console.log("5x分享倒计时器"+ this.htimer.running);
		if(this.second == 1 && this.minute ==0){
			this.htimer.reset();
			GameBackGround.hTimerStatus = false;
			this.timerComFunc();
		}
		this._second--;
		if(this.second == 0){
			if(this._minute >0){
				this._minute--;
				this._second = 59;
			}
			
			
        }
		this.htimeText.text = this._minute.toString() +":"+('0'+this._second.toString()).slice(-2);
	}
	/**
	 * 倒计时结束，秒产恢复
	 */
	private timerComFunc(){
		this.removeChild(this.share5xOn);
		this.removeChild(this.htimeText);
		this.removeChild(this.htimeBase);
		this.createShareBg();
		GameData.secCoin = CommonFuction.chu(GameData.secCoin,5);
		this._second = 61;
		this._minute = 2;
		this.cacheAsBitmap = true;
	}

	public addDragGird(girdLocation:number){
		//console.log("显示可以合并的地块")
		let i = Math.floor( girdLocation /GameData.MaxColumn);
		let t = girdLocation % GameData.MaxColumn;
		let gird:egret.Bitmap = new egret.Bitmap();
		gird.width =GameData.girdWidth;
		gird.height =GameData.girdWidth*0.6;
		gird.x =20+GameData.girdWidth/5+(GameData.girdWidth+GameData.girdWidth/5)*t;
		gird.y =GameData.startY+20+GameData.girdWidth*i;
		if(GameData.mapData[i][t]!=-1){	
			gird.texture = RES.getRes("drag_synthesis_small_png");//载入地块
		}

		this.addChild(gird);
		// this.dragContainer.addChild(gird); 
	}

	public clear(){
		//console.log("清除背景");
		this.cacheAsBitmap = false;
		this.removeChildren();
		this.cacheAsBitmap = true;
	}

	public setSceneData(i:number){
		GameData.bgMusic = "sound_bg0"+i+".mp3"
		GameData.levelBackgroundImageName = "scene_0"+i+"_back_png";
		GameData.levelFrontBackgroundImageName = "scene_0"+i+"_front_png";
		GameData.girdImageName = "scene_0"+i+"_base_small_png";
		GameData.girdLockImageName = "scene_0"+i+"_base_small_lock_png";
		GameData.setSceneData = true;
	}

}