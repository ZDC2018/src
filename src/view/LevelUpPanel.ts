class LevelUpPanel  extends egret.Sprite
{
    public constructor(){
        super();
    }

    private _mcData:any;
    private _mcTexture:egret.Texture;
    private _idTimeout:number;
    private levelUpProfit:string;
    private bannerAd:any;
	public show(){
        //console.log("显示城市升级面板")
        this.bannerAd = platform.showBannerAD(20/GameData.stageW,(GameData.stageH - GameData.girdWidth*1.6 -30)/GameData.stageH,0.9375,"adunit-42c00de5dda2948e")
        let LevelUpMask = new egret.Shape();
        LevelUpMask.graphics.beginFill(0x000000, 0.8);
        LevelUpMask.graphics.drawRect(0, 0,GameData.stageW,GameData.stageH);
        LevelUpMask.graphics.endFill();
        LevelUpMask.alpha = 0.8;
        LevelUpMask.touchEnabled = true;

        let LevelUpEffect:egret.Bitmap = ResourceUtils.createBitmapByName("effect_lvup_b_08_png" )
		LevelUpEffect.x= GameData.stageW/2 - LevelUpEffect.width/2;
        LevelUpEffect.y= GameData.girdWidth + 20;
        this.addChild(LevelUpMask);

        this._mcData = RES.getRes("effect_lvup_json");
        this._mcTexture = RES.getRes("effect_lvup_png");
        //创建动画工厂
        var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(this._mcData, this._mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        var mc1:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("level_up_a"));
        var mc2:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("level_up_b"));
        mc1.x = mc2.x= GameData.stageW/2 - LevelUpEffect.width/2;
		mc1.y = mc2.y= GameData.girdWidth + 20;
        this.addChild(mc2);//a上层，b下层
        this.addChild(mc1);
        
        //添加播放完成事件
        mc1.addEventListener(egret.Event.COMPLETE, function (){
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
        mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL,(e:egret.MovieClipEvent)=>{
            // //console.log(e.type,e.frameLabel, mc1.currentFrame);//frame_label @fall 6
            mc2.gotoAndPlay(1);
        },this);
        // mc1.play();
       
        

        let currentLevelLabel = new egret.TextField();
        currentLevelLabel.text = GameData.currentLevel.toString();
		currentLevelLabel.width = GameData.girdWidth*3/4;
		currentLevelLabel.x = LevelUpEffect.x + LevelUpEffect.width/2 -currentLevelLabel.width/2;
		currentLevelLabel.y = LevelUpEffect.y + LevelUpEffect.height*0.44 -currentLevelLabel.height/2;
		currentLevelLabel.fontFamily  = "黑体";
        if (GameData.currentLevel <= 100){
            currentLevelLabel.size = 40;
        }else{
            currentLevelLabel.size = 32;
        }
		currentLevelLabel.textColor = 0x2F8ED1;
		currentLevelLabel.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(currentLevelLabel);

        let newMap:string = "";
        let str:string = "";
		if (GameData.currentLevel < 10 ){
            switch(GameData.currentLevel){
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
            str = "解锁：                \n\n1，第"+newMap+"地块\n";
		}else{
            if (GameData.currentLevel == 11 ){
                 str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁黄金农场背景";
            }else if (GameData.currentLevel == 21){
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁塞北雪乡背景";
            }else if (GameData.currentLevel == 31){
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁缤纷小镇背景";
            }else if (GameData.currentLevel == 41){
                str = "解锁：\n\n1，所有地块都已经解锁\n2，解锁不夜之城背景";
            }
            else{
                str = "解锁：\n\n1，所有地块都已经解锁\n";
            }
		}
        
		
		let LevelUpLabel = new egret.TextField();
		LevelUpLabel.text = str;
		LevelUpLabel.width = GameData.stageW/2;
		LevelUpLabel.x = GameData.stageW /2 - LevelUpLabel.width/2;
		LevelUpLabel.y = LevelUpEffect.y + LevelUpEffect.height*3/4;
		LevelUpLabel.fontFamily  = "黑体";
		LevelUpLabel.size = 30;
		LevelUpLabel.textColor = 0xFFFFFF;
		LevelUpLabel.textAlign = egret.HorizontalAlign.CENTER;
		// this.addChild(LevelUpLabel);//不加了


		let getBtn = ResourceUtils.createBitmapByName("lvup_obtain_png");
		getBtn.x =  GameData.stageW/2 -getBtn.width/2;
		getBtn.y = GameData.stageH - GameData.girdWidth*1.575*1.8 -getBtn.height;
		getBtn.touchEnabled = true;
		getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.share,this);

        let LevelUpProfitTextLabel = new egret.TextField();
        LevelUpProfitTextLabel.text = "升级福利";
		LevelUpProfitTextLabel.width = GameData.girdWidth*5/4;
        LevelUpProfitTextLabel.height = GameData.girdWidth/3;
		LevelUpProfitTextLabel.x = GameData.stageW /2 - LevelUpLabel.width/2;
		LevelUpProfitTextLabel.y = getBtn.y -LevelUpProfitTextLabel.height - 30;
		LevelUpProfitTextLabel.fontFamily  = "黑体";
		LevelUpProfitTextLabel.size = 35;
		LevelUpProfitTextLabel.textColor = 0xFFE974;
		LevelUpProfitTextLabel.textAlign = egret.HorizontalAlign.LEFT;
		// this.addChild(LevelUpProfitTextLabel);

        let LevelUpCoin:egret.Bitmap  = ResourceUtils.createBitmapByName("ui_money_total_png");
		LevelUpCoin.x = LevelUpProfitTextLabel.x + LevelUpProfitTextLabel.width +20;
		LevelUpCoin.x = getBtn.x;
        LevelUpCoin.y = getBtn.y -LevelUpCoin.height - 50;
        // LevelUpCoin.width = LevelUpCoin.height =  LevelUpProfitTextLabel.height;
        this.addChild(LevelUpCoin);

        //奖励玩家当前可购买最大的房子金币*2
        let availableBuyHouseGrade:number = 1;
        if(GameData.maxHouseGrade >=4){
           availableBuyHouseGrade = GameData.maxHouseGrade-2;
        }else{
            availableBuyHouseGrade = 1;
        }
        this.levelUpProfit =  CommonFuction.cheng(GameData.buyHouseConfigArray[availableBuyHouseGrade-1].coinNum,2);
        let LevelUpProfitLabel = new egret.TextField();
        LevelUpProfitLabel.text =  CommonFuction.numZero(this.levelUpProfit);
		LevelUpProfitLabel.width = GameData.girdWidth*2;
        // LevelUpProfitLabel.height = GameData.girdWidth/3;
		LevelUpProfitLabel.x = LevelUpCoin.x +LevelUpCoin.width +20;
		LevelUpProfitLabel.y = LevelUpCoin.y;
		LevelUpProfitLabel.fontFamily  = "黑体";
		LevelUpProfitLabel.size = 48;
		// LevelUpProfitLabel.textColor = 0xFFE974;
		LevelUpProfitLabel.textColor = 0xFFFFFF;
		LevelUpProfitLabel.textAlign = egret.HorizontalAlign.LEFT;
        this.addChild(LevelUpProfitLabel);
        let closeBtn:egret.TextField =new egret.TextField();
        let waitTime:number = 0;
        if(!GameLogic.closeShare){
            this.addChild(getBtn)
            closeBtn.y = getBtn.y + getBtn.height + 60;
            waitTime = 3000;
        }else{
            waitTime = 300;
            closeBtn.y = LevelUpCoin.y +LevelUpCoin.height + 10;
        }

		
		closeBtn.width = getBtn.width;
		// closeBtn.text = "跳过";
		closeBtn.textAlign = egret.HorizontalAlign.CENTER;
		closeBtn.fontFamily = "黑体";
		closeBtn.size = 36;
		closeBtn.textColor = 0Xffffff;
		closeBtn.x = getBtn.x;
		closeBtn.textFlow = <Array<egret.ITextElement>>[{text:"跳过",style: {"underline": true}}]
		
		closeBtn.touchEnabled = true;
		closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closePanel,this);
        this._idTimeout = egret.setTimeout(function(){
			this.addChild(closeBtn);
		},this,waitTime);

	}

    private share(){
        platform.share("key=welcome");
        egret.localStorage.setItem("luTime",new Date().getTime().toString());	
    }

	public getLevelUpProfit(){
		// console.log("获取升级金币");
		this.closePanel();
        // console.log(this.levelUpProfit);
        GameData.coin  = CommonFuction.jia(this.levelUpProfit,GameData.coin.toString());
        egret.localStorage.removeItem("luTime");
        
	}

    public getProfitNum(){
		return this.levelUpProfit;
	}

	private closePanel(){
		//console.log("关闭城市升级面板");
        SoundUtils.instance().playCloseSound();
        egret.clearTimeout(this._idTimeout);
		while(this.numChildren){
            this.removeChildAt(0);
        }
        try{
         this.bannerAd && this.bannerAd.destroy();
         if(!this.bannerAd)
            throw "bannerAd undifined";
        }catch(e){
            console.log(e);
        }
	}	

}