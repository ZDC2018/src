class ElementView extends egret.Sprite {
	private thisParent:egret.Sprite;
	//游戏中的元素
	public constructor(tParent:egret.Sprite) {
		super();
		this.thisParent=tParent;
		this.init();
	}
	public location:number = 0;//位置编号，用于提供移动使用
	public grade:number = 0;//房屋等级
	public time:number = 0;//创建时间

	/*-----------------------------ID 编号相关，携带测试信息-----------------------------------*/
	public _id:number =-1; //ID编号，对应GameData.elements中的数据ID，与数据下标相同

	public get id() : number {
		return this._id;
	}

	public set id(v : number) {
		this._id = v;
	}
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

	 /*----------------------------元素位图 初始化相关功能-----------------------------------*/
    private bitmap:egret.Bitmap; //当前元素中的位图数据

    /**
	 * 初始化所有数据	
	 */
	private init(){
		this.touchEnabled =true;
		this.touchChildren =false;
		this.bitmap = new egret.Bitmap();
		let bitWidth:number = GameData.girdWidth*0.83;
		// let bitWidth:number =(GameData.stageW - 40)/GameData.MaxColumn*0.8;
		// this.bitmap.width =bitWidth-10;
		// this.bitmap.height=bitWidth-10;
		this.bitmap.x = -1*bitWidth/2;
		this.bitmap.y= -1*bitWidth/2;
		this.addChild(this.bitmap);
	}


	/**
	 * 设置贴图
	 */
	public setTexture(val:string)
    {
        this.bitmap.texture = RES.getRes(val);
    }

	
	/**
	 * 设置贴图
	 */
	public setWidth(val:number)
    {
        this.bitmap.width = this.bitmap.height = val;
    }
	/*-------------------------------------焦点管理相关----------------------------------------*/
	private _focus:boolean=false;
	public get focus():boolean{
		return this._focus;
	}
   
	//private _focusImg:egret.Bitmap;
	//设置选中状态的焦点样式
	public setFocus(val:boolean){
		if(val!=this.focus){
			this._focus = val;		

			if(val){
				this.setTexture("e"+GameData.elements[this.id].grade+"focus_png" );
			}else{						
				this.setTexture("e"+GameData.elements[this.id].grade+"_png" );
			}
		}
	}
	//点击开箱子
	public openBox(){
		// console.log("开箱子"+this.id);
		let evt2:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GUIDE_STEP_TWO);
		let evt3:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GUIDE_STEP_THREE);

		if( GameData.elements[this.id].type == "b0"){
			GameData.elements[this.id].grade = 1;	
			SoundUtils.instance().playOpenBoxSound();
		}else if (GameData.elements[this.id].type == "b1"){
			if(GameData.elements[this.id].grade == 0){
				GameData.elements[this.id].grade = GameData.giftBoxHouseGrade;
			}
			SoundUtils.instance().playOpenGiftBoxSound();
		}
		GameData.elements[this.id].type = "0";				
		this.setTexture("house#houses_a_"+this.addPreZero(GameData.elements[this.id].grade)+"_big" );
		GameData.elements[this.id].time = new Date().getTime();//创建时间
		if(GameLogic.guide &&  GameData.currentLevel == 1 &&this.id == 0 ){
			this.evm.dispatchEvent(evt2);
			// console.log('guideStepTwo监听发送');
			// console.log(evt2);
		}
		if(GameLogic.guide &&  GameData.currentLevel == 1 && this.id == 1){
			this.evm.dispatchEvent(evt3);
		}
	}

	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

	/*-----------------------------------移动到新位置，乱序操作使用-----------------------------------------*/
    public speed:number = 700;
    //移动到新位置,使用cubicInOut算法移动，直线运动
    public move()
    {
        //console.log("乱序移动开始！",this.id,this.location,this.targetX(),this.targetY(),this.x,this.y);
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.cubicInOut);
    }

	
    public moveTo(x:number,y:number)
    {
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:x,y:y},this.speed, egret.Ease.sineInOut);
    }
    public moveTo2(x:number,y:number)
    {
        this.x = x;
		this.y = y;
    }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

	
  	/*-------------------------------------显示元素，从上方掉落----------------------------------------*/
    /*-------------------------------------掉落后添加到父级别显示列表-----------------------------------*/
    public show(wait:number){
		// console.log(wait);
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(wait,false);
		tw.call(this.addThisToParent,this);
		tw.to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.bounceOut);
	}

	public showBox(wait:number,y=0){
		// console.log(wait);
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(wait,false);
		tw.call(this.addThisToParent,this);
		tw.to({x:this.targetX()+10,y:this.targetY()+28+y},this.speed, egret.Ease.bounceOut);
	}

	public addThisToParent() //添加到父级显示对象
	{
		if(!this.parent)
		{
			// console.log("元素掉落id:"+this.id);
			// console.log("元素掉落location:"+this.location);
			// console.log("元素掉落:"+this.x);
			// console.log("元素掉落:"+this.y);
			this.thisParent.addChild(this);
		}
	}

	public targetX():number{
        let xx:number = 20 + GameData.girdWidth/5 + (GameData.girdWidth +GameData.girdWidth/5) *(this.location%GameData.MaxColumn)+GameData.girdWidth/2;
        return xx; 
	}
	public targetY():number //目标Y轴位置
    {
		var yy:number = GameData.startY + GameData.girdWidth*(Math.floor(this.location/GameData.MaxColumn))+GameData.girdWidth/2-GameData.girdWidth/4 -10;//改为5*4后使用新定义
        return yy;
    }
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  	/*--------------------------------------移动并且返回-------------------------------------*/
    /*----------------------用于用户交换两个对象，但未找到能够连接消除的时候使用------------------------*/
    //移动到另外一个位置，然后再移动回来
    public moveAndBack(location:number,isScale:boolean=false)
    {
        var xx:number = 20 + GameData.girdWidth*(location%GameData.MaxColumn)+GameData.girdWidth/2+5;
		var yy:number = GameData.startY + GameData.girdWidth*(Math.floor(this.location/GameData.MaxColumn))+GameData.girdWidth/2-15;//改为5*4后使用新定义
        //移动时候，不仅会移动位置，还会放到或者缩小，移动回来时，scale都设置为1
        var tw:egret.Tween = egret.Tween.get(this);      
        if(isScale)
        {
            tw.to({x:xx,y:yy,scaleX:1.2,scaleY:1.2},300, egret.Ease.sineInOut).call(this.back,this);;
        }
        else
        {
            tw.to({x:xx,y:yy,scaleX:0.8,scaleY:0.8},300, egret.Ease.sineInOut).call(this.back,this);;
        }
    }
   	public back()
    {
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:this.targetX(),y:this.targetY(),scaleX:1,scaleY:1},300, egret.Ease.sineInOut);
    }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/


	public evm:ElementViewManage;

 	/*-----------------------------此动画用于移动元素，然后消除--------------------------------------*/
	 
    //移动到另外一个位置，然后再返回原始的scale
	public moveAndScale(location:number,isScale:boolean=false){
		let xx:number =20+GameData.girdWidth*(location%GameData.MaxColumn)+GameData.girdWidth/2+5;
		var yy:number = GameData.startY + GameData.girdWidth*(Math.floor(this.location/GameData.MaxColumn))+GameData.girdWidth/2-15;//改为5*4后使用新定义

		let tw:egret.Tween = egret.Tween.get(this);
		if(isScale){
			tw.to({x:xx,y:yy,scaleX:1.4,scaleY:1.4},300,egret.Ease.cubicInOut).call(this.backScaleNoCall,this);
		}
		else{
			tw.to({x:xx,y:yy,scaleX:0.6,scaleY:0.6},300,egret.Ease.cubicInOut).call(this.backScale,this);
		}
	}

	private backScale(){
		let tw:egret.Tween = egret.Tween.get(this); 
		tw.to({scaleX:1,scaleY:1},300, egret.Ease.backOut)
		.call(this.canRemove,this);	
	}
	private backScaleNoCall(){
		let tw:egret.Tween = egret.Tween.get(this); 
		tw.to({scaleX:1,scaleY:1},300, egret.Ease.backOut);	
	}
	public   canRemove(){
		//console.log("回调");
		let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.REMOVE_ANIMATION_OVER);
   		this.evm.dispatchEvent(evt);
	}

	
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

	/*-------------------------------------------------------------------------------------------------------*/
	//播放动画,自己放大，然后缩回到原有大小
    public playScale(){
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({scaleX:1.2,scaleY:1.2},300, egret.Ease.cubicInOut).to({scaleX:1,scaleY:1},300, egret.Ease.cubicInOut);
		
    }

	public playSmall(){
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({scaleX:1.2,scaleY:1.2},300, egret.Ease.cubicInOut).to({scaleX:0.8,scaleY:0.8},300, egret.Ease.cubicInOut);
		
    }

    /*-------------------------删除元素，当元素不属于关卡条件时，执行此动画---------------------------------*/
    //播放直接消除动画,自己放大，然后缩回到原有大小，然后删除
    public playRemoveAni()
    {
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({scaleX:1.4,scaleY:1.4},300, egret.Ease.cubicInOut).to({scaleX:1,scaleY:1},300, egret.Ease.cubicInOut).call(this.removeAniCall,this);
		
    }   
	public playRemoveAniNoScale(x:number,y:number)
    {
       	var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:x,y:y},100,egret.Ease.cubicInOut).call(this.removeAniCall,this);
		
    }

	 //回收删除，先移动到回收站位置，再播放直接消除动画,自己放大，然后缩回到原有大小，然后删除
    public playRecycleAni(x:number,y:number)
    {
		// console.log("回收删除调用");
		// console.log("x:"+x);
		// console.log("y:"+y);
        var tw:egret.Tween = egret.Tween.get(this);
        tw.to({x:x,y:y,scaleX:1,scaleY:1},300, egret.Ease.cubicInOut).call(this.removeAniCall,this);
        // tw.to({scaleX:1.4,scaleY:1.4},300, egret.Ease.cubicInOut).to({x:x,y:y,scaleX:1,scaleY:1},300, egret.Ease.cubicInOut).call(this.removeAniCall,this);
		
    }
    public removeAniCall()
    {
        if(this.parent)
        {			
            this.parent.removeChild(this);
        }
	// 	var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
    //    this.evm.dispatchEvent(evt);
	//    this.evm.updateMap(evt);
	   let eover:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.DELETE_ELEMENT_OVER);
	   this.evm.delOver(eover);

    }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/


	/*-------------------------移动到新位置，方块被消除后重新生成下落使用---------------------------------*/

	/**
	 * 播放曲线动画
	 */
	public playCurveMove(tx:number,ty:number)
	{
		let tw:egret.Tween =  egret.Tween.get(this);
		tw.to({x:tx,y:ty},700,egret.Ease.quadOut).call(this.overCurveMove,this);
	}
	
	private overCurveMove(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
		this.evm.updateMap(evt);
	}
	/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    //根据列编号，重新计算元素X轴位置，从其实Y轴开始播放下落动画
    public moveNewLocation()
    {
		
		//console.log(this.id,this.parent);
		if(!this.parent)
		{
			// let GameData.startY:number = (GameData.stageH - (GameData.stageW - 30)/6 - 60 )-GameData.girdWidth*GameData.MaxColumn;
			
			this.y = GameData.startY - this.width;
			this.scaleX = 1;
			this.scaleY = 1;
			this.x = this.targetX();			
			//被删除的元素要重新加入
			this.thisParent.addChild(this);
		}
	
 		
        egret.Tween.get(this).to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.bounceOut).call(this.moveNewLocationOver,this);
    }
    private moveNewLocationOver()
    {
       	let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
        //this.evm.dispatchEvent(evt);
		this.evm.moveNewLocationOver(evt);
    }
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

	/**
	 * 数字补零
	 */
	private  addPreZero(num){
		return ('00'+num).slice(-3);
	}

}