class WelcomeRetrunPanel  extends egret.Sprite
{
    public constructor(){
        super();
    }

	private profitNum:string;
	public show(secCoin:string,due:any){
		//  console.log("显示欢迎回来面板")
		let panelBase = ResourceUtils.createBitmapByName("profit_base_png");
		panelBase.width = GameData.stageW*3/4;
		panelBase.height = panelBase.width*1.464;
		panelBase.x = GameData.stageW/8;
		panelBase.y = (GameData.stageH - panelBase.height)/2;
		this.addChild(panelBase);

		let currentTime = new Date().getTime();
		let timeDiffrent =  Math.floor((currentTime - due)/1000);//计算离线时间，单位秒
		if (timeDiffrent >= 8*60*60){
			timeDiffrent = 8*60*60;//最多计算8小时的收益
		}
		if(GameBackGround.hTimerStatus){
			secCoin = CommonFuction.chu(secCoin,5)
		}
		this.profitNum = CommonFuction.cheng(secCoin,timeDiffrent.toString());
		let profit = CommonFuction.numZero(this.profitNum);
		let profitLabel = new egret.TextField();
		profitLabel.text = profit;
		profitLabel.width = panelBase.width/3 + panelBase.width/10;
		profitLabel.x = panelBase.x + panelBase.width/4;
		profitLabel.y = panelBase.y + panelBase.width -3;
		profitLabel.fontFamily  = "黑体";
		profitLabel.size = 50;
		profitLabel.textColor = 0xFFD7B7;
		profitLabel.textAlign = egret.HorizontalAlign.LEFT;
		this.addChild(profitLabel);

		
		let profitMultipLabel = new egret.TextField();
		profitMultipLabel.text = "X10";
		profitMultipLabel.width = panelBase.width/5;
		profitMultipLabel.x = profitLabel.x + profitLabel.width + 5;
		profitMultipLabel.y = profitLabel.y;
		profitMultipLabel.fontFamily  = "黑体";
		profitMultipLabel.size = 50;
		profitMultipLabel.textColor = 0xFFD83C;
		profitMultipLabel.textAlign = egret.HorizontalAlign.CENTER;
		this.addChild(profitMultipLabel);

		let getBtn = ResourceUtils.createBitmapByName("profit_receive_png");
		getBtn.width = panelBase.width/2;
		getBtn.height = getBtn.width*0.3125;
		getBtn.x =  panelBase.x + (panelBase.width - getBtn.width)/2;
		getBtn.y = panelBase.y + panelBase.height - getBtn.height*3/2;
		getBtn.touchEnabled = true;
		getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.getProfit,this);
		if(!GameLogic.closeShare){
            this.addChild(getBtn)
        }

		let closeBtn = ResourceUtils.createBitmapByName("ranking_close_png");
		closeBtn.x =  panelBase.x + panelBase.width - closeBtn.width -4;
		closeBtn.y = panelBase.y +4;
		closeBtn.touchEnabled = true;
		closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closePanel,this);
		this.addChild(closeBtn)
	}

	private getProfit(){
		// console.log("获取收益");
		let shareResult = platform.share("key=welcome");
		egret.localStorage.setItem("wrpTime",new Date().getTime().toString());	
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

	}

	public closePanel(){
		// console.log("关闭欢迎回来面板");
		while(this.numChildren){
            this.removeChildAt(0);
        }
		egret.localStorage.removeItem("wrpTime");
	}
	public addProfit(){
		// console.log("增加收益")
		let profitNumString = CommonFuction.cheng(this.profitNum,'10');
		GameData.coin = CommonFuction.jia(GameData.coin,CommonFuction.cheng(this.profitNum,'10')) ;
		
	}

	public getProfitNum(){
		return CommonFuction.cheng(this.profitNum,'10');
	}
	/**	
	 * 数字去零计算
	 
	private numZero(num:any):string{
		// console.log("数字去0计算"+num);
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
	*/
}