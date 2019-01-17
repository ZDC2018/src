class PropViewManage {
	private _layer:egret.Sprite;

	public constructor(root:egret.Sprite) {
		this._layer =root;
		this.init();
	}

	private _props:PropView[];
	private init(){
		this._props = new Array();
        // this.testdata();
        this.createData()
        // this.createTimerBg();
	}

    /**
     * 生成道具栏
     */
    private createData(){
        for(var i:number=0;i<5;i++){
            var prop:PropView = new PropView(i);
            if (i == 0 || i == 1){
               this._layer.addChild(prop);
            }
            this._props.push(prop);   
            prop.id = i;
            prop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
           
        }
    }

    private createRank(){
        let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;
        let rank:egret.Bitmap = new egret.Bitmap();
        rank.texture= RES.getRes("ui_ranking_png");
		rank.width = girdWidth;
		rank.height = girdWidth;
		rank.x=20;
		rank.y=GameData.stageH - rank.height -10;
		this._layer.addChild(rank);
        rank.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
    }
    
    private createVoice(){
        let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;        
        let voice:egret.Bitmap = new egret.Bitmap();
        voice.texture= RES.getRes("ui_sound_open_png");
		voice.width = girdWidth*0.6;
		voice.height = girdWidth*0.6;
		voice.x= 20 +voice.width/2 -5;
		voice.y=GameData.stageH - voice.height - girdWidth - 30;
		this._layer.addChild(voice);
        voice.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
    }
    private createBox(){
        //console.log("添加底部箱子：")
        let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;                
        let box:egret.Bitmap = new egret.Bitmap();
        box.texture= RES.getRes("ui_bigbox_hit_png");
		box.width = girdWidth*1.575;
		box.height = girdWidth*1.575;
		box.x=  GameData.stageW/2 - box.width/2;
		box.y=GameData.stageH - box.height;

		this._layer.addChild(box);
        box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
    }

        
    private createShop(){
        let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;                        
        let shop:egret.Bitmap = new egret.Bitmap();
        shop.texture= RES.getRes("ui_shop_png");
		shop.width = girdWidth*0.93;
		shop.height = girdWidth*0.966;
		shop.x= GameData.stageW - 20 - shop.width;
		shop.y= GameData.stageH - shop.height -10;
		this._layer.addChild(shop);
        shop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
    }

            
    private createRecycle(){
        let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;                        
        let recycle:egret.Bitmap = new egret.Bitmap();
        recycle.texture= RES.getRes("ui_recycle_png");
		recycle.width = girdWidth*0.6;
		recycle.height = girdWidth*0.708;
		recycle.x=GameData.stageW - 10 -recycle.width*3/2;
		recycle.y=GameData.stageH - recycle.height -girdWidth*1.21;
		this._layer.addChild(recycle);
        recycle.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
    }

   
    private createTimerBg(){
        let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;
        let timerBg:egret.Bitmap = new egret.Bitmap();
		timerBg.texture= RES.getRes("ui_time_base_png");
		timerBg.width = girdWidth/3;
		timerBg.height = girdWidth/3;
		timerBg.x=110*3 + 15;
		timerBg.y=GameData.stageH - 110 -20;
		this._layer.addChild(timerBg);
    }


    private _currentID:number = -1;
    private _voice:boolean = true;
    /**
     * 处理道具被点击事件
     */
    private click(evt:egret.TouchEvent) {
        console.log(this._currentID);
        console.log(evt.currentTarget.id);
        // //console.log(this._voice );
        // if(this._currentID!=-1){
        //     if(this._currentID ==(<PropView>evt.currentTarget).id && this._currentID != 1){
        //         this._currentID=-1;
        //         PropViewManage.propType=-1;                
        //     } else{
        //         SoundUtils.instance().playClickSound();
        //         this._currentID =(<PropView>evt.currentTarget).id;
        //         if(this._currentID == 1){
        //                 if (this._voice == true){
        //                 this._voice  = false;
        //                 this._props[1].setFocus(false);
        //                 GameData.closeBgMusic = true;
        //                 GameData.closeMusic = true;
        //             }else{
        //                 this._voice  = true;                  
        //                 this._props[1].setFocus(true);
        //                 GameData.closeBgMusic = false;
        //                 GameData.closeMusic = false;                
        //                 SoundUtils.instance().playCloseSound();  
        //             }
        //         }
                
        //         PropViewManage.propType = this._props[this._currentID].proptype;
        //         if(PropViewManage.propType == 0){
        //             this.openRanking();
        //         }else{                        
        //             let pl:PropLogic = new PropLogic();
        //             pl.useProp(PropViewManage.propType);//操作数据
        //         }
                
        //     }
        //     this._currentID=-1;
        // }else{
            let pl:PropLogic = new PropLogic();
            SoundUtils.instance().playClickSound();
            this._currentID =(<PropView>evt.currentTarget).id;
            if(this._currentID == 1){
                if (this._voice == true ){
                    this._voice  = false;
                    this._props[1].setFocus(false);
                    GameData.closeBgMusic = true;
                    GameData.closeMusic = true;
                }else{
                    this._voice  = true;                  
                    this._props[1].setFocus(true);
                    GameData.closeBgMusic = false;
                    GameData.closeMusic = false;                
                    SoundUtils.instance().playCloseSound();  
                }
            }
            
            PropViewManage.propType = this._props[this._currentID].proptype;
            if(PropViewManage.propType == 0){
                this.openRanking();
            }else{                        
                
                pl.useProp(PropViewManage.propType);//操作数据
            }
        // }
    }
	public static propType:number = -1;  //道具类型

    private ranking: egret.Bitmap;
    private isdisplay = false;

    /**
     * 排行榜遮罩，为了避免点击开放数据域影响到主域，在主域中建立一个遮罩层级来屏蔽点击事件.</br>
     * 根据自己的需求来设置遮罩的 alpha 值 0~1.</br>
     * 
     */
    private rankingContainer:egret.Sprite;
    private rankingListMask: egret.Shape;
    private rankingBase:egret.Bitmap;
    private bitmap:egret.Bitmap;
    // private closeBtn:egret.Bitmap;
    private closeBtn:egret.Shape;

    private openRanking() {
		//console.log("点击排行榜");
        SoundUtils.instance().playClickSound();
        // let openDataContext = wx.getOpenDataContext();
        let platform: any = window.platform;
        let score:string = CommonFuction.jia(GameData.coin,GameData.cost);
        platform.setUserCloudStorage([{key:"score",value:CommonFuction.numZero(score)+""}]);//将总资产上传到云
        this.rankingContainer= new egret.Sprite();
        this.rankingContainer.width = GameData.stageW*0.98;
        this.rankingContainer.height = this.rankingContainer.width*1.5;
        // rankingContainer.x = GameData.stageW*0.1;
        // rankingContainer.y = (GameData.stageH - GameData.stageW*1.5)/2;
        //console.log("打开排行榜");
        //处理遮罩，避免开放数据域事件影响主域。
        this.rankingListMask = new egret.Shape();
        this.rankingListMask.graphics.beginFill(0x000000, 1);
        this.rankingListMask.graphics.drawRect(0, 0,GameData.stageW,GameData.stageH);
        this.rankingListMask.graphics.endFill();
        this.rankingListMask.alpha = 0.5;
        this.rankingListMask.touchEnabled = true;
        this._layer.stage.addChild(this.rankingContainer);
        this.rankingContainer.addChild(this.rankingListMask);

        // this.rankingBase = new egret.Bitmap();
        // this.rankingBase = ResourceUtils.createBitmapByName("ranking_base_png");
        // this.rankingBase.width =  GameData.stageW*0.98;
        // this.rankingBase.height = this.rankingBase.width*1.5;
        // this.rankingBase.x = (GameData.stageW-this.rankingBase.width)/2;
        // this.rankingBase.y = (GameData.stageH-this.rankingBase.height)/2;
        // this.rankingContainer.addChild(this.rankingBase);

        // this.closeBtn = ResourceUtils.createBitmapByName("ranking_close_png");
        // this.closeBtn.touchEnabled = true;
        // this.closeBtn.x = GameData.stageW - this.closeBtn.width*2 -5;
        // this.closeBtn.y = (1136 - GameData.stageW*1.5) + GameData.stageW*1.5*0.038 +5;
        this.closeBtn = new egret.Shape();
        this.closeBtn.width = GameData.girdWidth;
        this.closeBtn.height = GameData.girdWidth *1.2;
        this.closeBtn.graphics.beginFill(0x000000, 0);
        let x = GameData.stageW -GameData.stageW*0.01 - this.closeBtn.width -5;
        let y = (1136 - GameData.stageW*1.5) + GameData.stageW*1.5*0.038 -15;
       	this.closeBtn.graphics.drawRect(x,y,this.closeBtn.width,this.closeBtn.height);
      	this.closeBtn.graphics.endFill();
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeRanking,this);
        
        // this.ranking = platform.openDataContext.createDisplayObject(null, GameData.stageW,GameData.stageH);
        // this.rankingContainer.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
        // this.rankingContainer.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this);
        // this.rankingContainer.addChild(this.ranking);

        var bitmapdata_1 = new egret.BitmapData(window["sharedCanvas"]);
		bitmapdata_1.$deleteSource = false;
		var texture = new egret.Texture();
		texture._setBitmapData(bitmapdata_1);
		this.bitmap = new egret.Bitmap(texture);
		this.bitmap.width = GameData.stageW;
		this.bitmap.height = GameData.stageH;
		// this._layer.stage.addChild(this.bitmap);
		// this._layer.stage.addChild(this.closeBtn);
        this.rankingContainer.addChild(this.bitmap);        
        this.rankingContainer.addChild(this.closeBtn);        
        //主域向子域发送自定义消息
            
        this.isdisplay = true;
        platform.openDataContext.postMessage({
            isDisplay: this.isdisplay,
            text: 'hello',
            year: (new Date()).getFullYear(),
            command: "open"
        });
        //主要示例代码结束        
        
    }
    
    private closeRanking(){
        //console.log("关闭排行榜");
        SoundUtils.instance().playCloseSound();
        let platform: any = window.platform;
        if (this.isdisplay) {
            // this.ranking.parent && this.ranking.parent.removeChild(this.ranking);
            // this.rankingListMask.parent && this.rankingListMask.parent.removeChild(this.rankingListMask);
            // this.rankingBase.parent && this.rankingBase.parent.removeChild(this.rankingBase);
            this.closeBtn.parent && this.closeBtn.parent.removeChild(this.closeBtn);
			this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);
            while(this.rankingContainer.numChildren){
                this.rankingContainer.removeChildAt(0);
            }
            this._layer.stage.removeChild(this.rankingContainer);
            this.isdisplay = false;
            platform.openDataContext.postMessage({
                isDisplay: this.isdisplay,
                text: 'hello',
                year: (new Date()).getFullYear(),
                command: "close"
            });
        }
    }
    private startDeltaY:number;
    onTouchBegin(event:egret.TouchEvent){
        //console.log("触摸排行榜");
        this.startDeltaY =event.stageY
         //console.log("rank touchbegin:", this.startDeltaY );
    }

    private lastDeltaY:number;
    onTouchMove(event:egret.TouchEvent){
        //console.log("滑动排行榜");
        let deltaY:number = event.stageY;
        if(this.lastDeltaY == deltaY)
        {
            return;
        }
        this.lastDeltaY =   deltaY - this.startDeltaY;//大于0往下，小于0往上
        // if(this.lastDeltaY >= 0){//往下滑动
        //     this.lastDeltaY = this.lastDeltaY;
        // }else{//往上滑动
        //     this.lastDeltaY = -1*this.lastDeltaY;
        // }
        //console.log("rank touchmove startDeltaY:", this.startDeltaY);
        //console.log("rank touchmove nowDeltalY:", deltaY);
        //console.log("rank touchmove:",  this.lastDeltaY);
        let platform: any = window.platform;
        platform.openDataContext.postMessage({
            isDisplay: this.isdisplay,
            moveY: this.lastDeltaY,
            year: (new Date()).getFullYear(),
            command: "paging"
        });
    }
   
}