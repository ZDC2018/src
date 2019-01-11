class PropView extends egret.Sprite {
	public constructor(type:number) {
		super();
		this._type = type;
		this.init();
	}
	//道具元素界面
	// private _view_box:egret.Bitmap;//道具盒子
	private _view_active:egret.Bitmap;//激活道具图像
	private _numText:egret.BitmapText;//数字文本
	private _type:number = 0;            //道具类型
	public id:number=-1;
	
	public get proptype():number
    {
        return this._type;
    }

	private init(){
		this.createView();
		this.addChild(this._view_active);
		this.setFocus(true);
	}

	private mc1:egret.MovieClip;
	private mc2:egret.MovieClip;

	private createView(){
		this.touchEnabled = true;
		let _interval:number =15;
		let _width:number =(GameData.stageW -_interval*6)/5;
		let girdWidth:number =  (GameData.stageW - 40)/GameData.MaxRow;
		if(!this._view_active){
			let grow = new egret.GlowFilter(0xffffff, 1, 10, 10, 10);	
			this._view_active = new egret.Bitmap();
			this._view_active.texture = RES.getRes(this.getActivateTexture(this._type));			
			switch(this._type){
			case 0:
				this._view_active.width = girdWidth;
				this._view_active.height = girdWidth;
				// this._view_active.filters = [grow];		
				this._view_active.x = 20;
				this._view_active.y = GameData.stageH -this._view_active.height  -10;
				const userInfo = platform.getUserInfo(20,GameData.stageH-GameData.girdWidth-10,GameData.girdWidth,GameData.girdWidth);
            	// console.log(userInfo);
				break;
				case 1:
				this._view_active.width = girdWidth*0.6;
				this._view_active.height = girdWidth*0.6;
				// this._view_active.x = 20 +this._view_active.width/2 -5;
				// this._view_active.filters = [grow];	
				this._view_active.x = 20;
				this._view_active.y = GameData.stageH - this._view_active.height - girdWidth - 30;
				break;
			case 2:
				// this._view_active.width = girdWidth*1.575;
				// this._view_active.height = girdWidth*1.575;
				this._view_active.x = GameData.stageW/2 - this._view_active.width/2;
				this._view_active.y = GameData.stageH - this._view_active.height;
				let mcData = RES.getRes("hitbox_json");
				let mcTexture = RES.getRes("hitbox_png");
				//创建动画工厂
				var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
				//创建 MovieClip，将工厂生成的 MovieClipData 传入参数
				this.mc1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("hitbox_a"));
				this.mc2= new egret.MovieClip(mcDataFactory.generateMovieClipData("hitbox_b"));
				this.mc2.x = this.mc1.x = GameData.stageW/2 - this._view_active.width/2;;
				this.mc2.y = this.mc1.y = GameData.stageH - this._view_active.height;
				
				//添加播放完成事件
				this.mc1.addEventListener(egret.Event.COMPLETE, function (){
						// egret.log("1,COMPLETE");
						this.removeChild(this.mc1);
						this.addChild(this.mc2);
						this.mc2.gotoAndPlay(1);
					}, this);
					
					
				break;
			case 3:
				this._view_active.width = girdWidth*0.93;
				this._view_active.height = girdWidth*0.966;
				this._view_active.x = GameData.stageW - 20 - this._view_active.width;
				this._view_active.y = GameData.stageH - this._view_active.height -10;
				
				break;
			case 4:
				this._view_active.width = girdWidth*0.758;
				this._view_active.height = girdWidth*0.766;
				this._view_active.x=GameData.stageW - 20 -this._view_active.width;
				this._view_active.y=GameData.stageH - this._view_active.height - girdWidth*0.966 -20;
				break;
			}
		}
		// console.log(this._view_active.x);
		// console.log(this._view_active.y);


	}

	private getActivateTexture(type:number):string{
		let textureName:string ="";
		switch(type){
			case 0:
			textureName = "ui_ranking_png";
			break;
			case 1:
                textureName = "ui_sound_open_png";
                break;
            case 2:
                textureName = "ui_bigbox_hit_01_png";
                break;
            case 3:
                textureName = "ui_shop_png";
                break;
            case 4:
                textureName = "ui_map_png";
                break;
		}
		return textureName;
	}

	public setFocus(val:boolean){
		if(val){
			this._view_active.texture = RES.getRes(this.getActivateTexture(this._type));
		}else{
			// this._view_active.texture = RES.getRes(this.getDisableTexture(this._type));
			if(this._type == 1){
				this._view_active.texture = RES.getRes("ui_sound_close_png");
				
			}
		}

	}

	public setPlayTime(playTimes:number){
		if(this._type == 2){
				this.addChild(this.mc1);
				// console.log(this.mc1.frameRate);
				if(!this.mc1.isPlaying){
					this.mc1.gotoAndPlay(2,playTimes);
				}else{
					this.mc1.frameRate++;
					
				}
			}
	}

	public ResetMcFrameRate(){
		// egret.log("重置mc1的播放速度");
		this.mc1.frameRate = 18;
	}



}