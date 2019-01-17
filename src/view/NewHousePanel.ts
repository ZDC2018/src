class NewHousePanel  extends egret.EventDispatcher {
	private _layer:egret.Sprite; //元素存在的容器
	public constructor(elementLayer:egret.Sprite) {
        super();
        this._layer = elementLayer;
    }

    /**--------------------------新房子弹窗-------------------------------------------------------- */
	private _newHousePanel:egret.Sprite = new egret.Sprite();
    private _idTimeout:number;
	private housePrice:number;
	private bannerAd:any;
	public getNewHosuePanel(grade:number){
		// console.log("打开新房子面板");
		
		this.bannerAd =  platform.showBannerAD(20/GameData.stageW,(GameData.stageH - GameData.girdWidth*1.6 -20)/GameData.stageH,0.9375,"adunit-155e6e7e9650473b")
		this._layer.addChild(this._newHousePanel);
		let newHouseBase:egret.Bitmap = ResourceUtils.createBitmapByName("newhouses_base_png");
        newHouseBase.x =  GameData.stageW/2 - newHouseBase.width/2;
        newHouseBase.y =  GameData.startY - newHouseBase.height/2;


        let newHouseMask = new egret.Shape();
        newHouseMask.graphics.beginFill(0x000000, 0.8);
        newHouseMask.graphics.drawRect(0, 0,GameData.stageW,GameData.stageH);
        newHouseMask.graphics.endFill();
        newHouseMask.alpha = 0.8;
        newHouseMask.touchEnabled = true;

		let houseNameLabel:egret.TextField =new egret.TextField();
		try{
			houseNameLabel.text = GameData.availableBuyHouseArr[grade-1].housename;
		}catch(e){
			console.log(e);
		}
		houseNameLabel.textAlign = egret.HorizontalAlign.CENTER;		
		houseNameLabel.fontFamily = "黑体";
		houseNameLabel.size = 30;
		houseNameLabel.textColor = 0XFFFFFF;
		houseNameLabel.width =  200;
		houseNameLabel.x = GameData.stageW/2 - houseNameLabel.width/2;
		houseNameLabel.y = newHouseBase.y + newHouseBase.height*0.6;

		let mcData = RES.getRes("newhouse_json");
        let mcTexture = RES.getRes("newhouse_png");
        //创建动画工厂
        var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        var mc:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("newhouse"));
        mc.x = GameData.stageW/2 - 200;
		mc.y = GameData.stageH/2 - 300;
        

		let newHouse:egret.Bitmap = ResourceUtils.createBitmapByName("house#houses_a_"+this.addPreZero(grade)+"_big" )
		newHouse.width = newHouse.height = 200;
		newHouse.x = GameData.stageW/2 - newHouse.width/2;
		newHouse.y = mc.y + mc.height/2 -newHouse.height/2 - 40;

		 //房子等级
		let houseLevelLabel:egret.TextField =new egret.TextField();
		houseLevelLabel.text = "LV " + grade.toString();
		houseLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
		houseLevelLabel.fontFamily = "黑体";
		houseLevelLabel.size = 30;
		houseLevelLabel.textColor = 0Xffffff;
		houseLevelLabel.width =  newHouse.width;
		houseLevelLabel.x = newHouse.x;
		houseLevelLabel.y = newHouse.y + newHouse.height + 5;

		let shareBtn:egret.Bitmap = ResourceUtils.createBitmapByName("lvup_obtain_png")
		shareBtn.x = GameData.stageW/2 - shareBtn.width/2;
		shareBtn.y = GameData.stageH - GameData.girdWidth*1.575*1.8  -shareBtn.height;
		shareBtn.touchEnabled = true;
		shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.share,this);
		
		let newHouseCoin:egret.Bitmap  = ResourceUtils.createBitmapByName("ui_money_total_png");
		newHouseCoin.x = shareBtn.x - newHouseCoin.width/2;
		newHouseCoin.y = shareBtn.y  - newHouseCoin.height -50;
		try{
			this.housePrice=  GameData.houseDownArr[GameData.maxHouseGrade].first_synthesis;
		}catch(e){
			console.log(e);
		}
		
		let newHouseCoinLabel:egret.TextField =new egret.TextField();
		newHouseCoinLabel.text = "X"+CommonFuction.numZero(this.housePrice);
		newHouseCoinLabel.textAlign = egret.HorizontalAlign.LEFT;
		newHouseCoinLabel.fontFamily = "黑体";
		newHouseCoinLabel.size = 48;
		newHouseCoinLabel.textColor = 0Xffffff;
		newHouseCoinLabel.x = newHouseCoin.x +newHouseCoin.width +10;
		newHouseCoinLabel.y = newHouseCoin.y ;

		let closeBtn:egret.TextField =new egret.TextField();
		closeBtn.width = shareBtn.width;
		// closeBtn.text = "跳过";
		closeBtn.textAlign = egret.HorizontalAlign.CENTER;
		closeBtn.fontFamily = "黑体";
		closeBtn.size = 36;
		closeBtn.textColor = 0Xffffff;
		closeBtn.x = shareBtn.x;
		closeBtn.textFlow = <Array<egret.ITextElement>>[{text:"跳过",style: {"underline": true}}]
		
		closeBtn.touchEnabled = true;
		closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeNewHousePanel,this);
        this._newHousePanel.addChild(newHouseMask);
        this._newHousePanel.addChild(newHouseBase);
        this._newHousePanel.addChild(houseNameLabel);
		this._newHousePanel.addChild(mc);
		mc.gotoAndPlay(1,-1);
		this._newHousePanel.addChild(newHouse);
		this._newHousePanel.addChild(houseLevelLabel);
		let waitTime:number = 0;
        if(!GameLogic.closeShare){
           	this._newHousePanel.addChild(shareBtn);
			closeBtn.y = shareBtn.y + shareBtn.height + 60;
            waitTime = 3000;
        }else{
            waitTime = 300;
			closeBtn.y = newHouseCoin.y +newHouseCoin.height + 10;
        }
		this._newHousePanel.addChild(newHouseCoin);
		this._newHousePanel.addChild(newHouseCoinLabel);
		this._idTimeout = egret.setTimeout(function(){
			this._newHousePanel.addChild(closeBtn);
		},this,waitTime);
	}
	private evm:ElementViewManage;
	private closeNewHousePanel(){
		// console.log("关闭新房子面板")
        SoundUtils.instance().playCloseSound();
		egret.clearTimeout(this._idTimeout);
		while(this._newHousePanel.numChildren){
            this._newHousePanel.removeChildAt(0);
        }
        this._layer.removeChild(this._newHousePanel);
		GameData.newHouse = false;
		let event:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.CLOSE_NEW_HOUSE_PANEL);
		let res = this.dispatchEvent(event);
		// console.log(res);
		// console.log(event);
		try{
         this.bannerAd && this.bannerAd.destroy();
         if(!this.bannerAd)
            throw "bannerAd undifined";
        }catch(e){
            console.log(e);
        }
	}

	private share(){
		//console.log("新房子分享")
		platform.share("key=house");
		egret.localStorage.setItem("nhTime",new Date().getTime().toString());	
	}

	public addProfit(){
		// console.log("新房子获取收益");
		// console.log(this.housePrice);		
		GameData.coin  = CommonFuction.jia(this.housePrice,GameData.coin.toString());
		this.closeNewHousePanel();
		// SoundUtils.instance().playCloseSound();
		// egret.clearTimeout(this._idTimeout);
		// while(this._newHousePanel.numChildren){
        //     this._newHousePanel.removeChildAt(0);
        // }
        // this.removeChild(this._newHousePanel);
		egret.localStorage.removeItem("nhTime");

	}

	public getProfitNum(){
		return this.housePrice;
	}

	/**
	 * 数字补零
	 */
	private  addPreZero(num){
		return ('00'+num).slice(-3);
	}
	/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
}