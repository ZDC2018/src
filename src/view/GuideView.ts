class GuideView extends egret.Sprite{

    public constructor(){
        super();
    }

    private maskIcon:egret.Shape = new egret.Shape();
    private maskIcon2:egret.Shape = new egret.Shape();
    private txtView: egret.TextField = new egret.TextField;
    private guide:two.Guide = new two.Guide();
    private helpHandle:egret.Bitmap;
    private guideBubble:egret.Bitmap;
    public guideFirst(){
        //----------------------镂空一个圆----------------------------0------------
        
        this.maskIcon.graphics.beginFill(0x000000,1);
        this.maskIcon.graphics.drawCircle(0, 0, 60);
        this.maskIcon.graphics.endFill();
        this.maskIcon.x = 20 + GameData.girdWidth/5 + (GameData.girdWidth +GameData.girdWidth/5) *(5%GameData.MaxColumn)+GameData.girdWidth/2;;
        this.maskIcon.y = GameData.startY + GameData.girdWidth*(Math.floor(5/GameData.MaxColumn))+GameData.girdWidth/2 -20;
        // maskIcon.scaleY = 0.6;
        //-------------------------------------------------------------------------
        this.guide.init(this.maskIcon, GameData.stageW, GameData.stageH);
        this.guide.touchEnabled = true;
        this.addChild(this.guide);

        this.guideBubble = new egret.Bitmap();
		this.guideBubble.texture= RES.getRes("guide_bubble_png");
		this.guideBubble.x = this.maskIcon.x - this.guideBubble.width/2
		this.guideBubble.y = this.maskIcon.y - this.maskIcon.height/2  -this.guideBubble.height -10;

		// txtView.textColor = 0xDC143C;
		this.txtView.textColor = 0x21344D;
		this.txtView.fontFamily = "黑体";
		this.txtView.text = "老板，点这里哦";
		// this.txtView.bold = true;
		this.txtView.size = 26;
		this.txtView.width = this.guideBubble.width;
		this.txtView.textAlign = egret.HorizontalAlign.CENTER;
		this.txtView.x = this.guideBubble.x;
		this.txtView.y = this.guideBubble.y +18;
        this.addChild(this.guideBubble);
        this.addChild(this.txtView);
        
        this.helpHandle = new egret.Bitmap();
		this.helpHandle.texture= RES.getRes("ui_help_png");
		this.helpHandle.x = this.maskIcon.x
		this.helpHandle.y = this.maskIcon.y
        this.addChild(this.txtView);

        
		var tw:egret.Tween = egret.Tween.get(this.helpHandle,{loop:true});
		tw.to({scaleX:1,scaleY:1},300, egret.Ease.cubicInOut).to({scaleX:0.8,scaleY:0.8},300, egret.Ease.cubicInOut);
        this.addChild(this.helpHandle);
    }

    public guideTwo(){
        this.guide.clear();
        this.maskIcon.x = 20 + GameData.girdWidth/5 + (GameData.girdWidth +GameData.girdWidth/5) *(6%GameData.MaxColumn)+GameData.girdWidth/2;;
        this.maskIcon.y = GameData.startY + GameData.girdWidth*(Math.floor(6/GameData.MaxColumn))+GameData.girdWidth/2 -20;
        this.guide.init(this.maskIcon, GameData.stageW, GameData.stageH);
        this.guide.touchEnabled = true;
        this.addChild(this.guide);

        this.guideBubble.x = this.maskIcon.x - this.guideBubble.width/2
		this.guideBubble.y = this.maskIcon.y - this.maskIcon.height/2  -this.guideBubble.height -10;
        this.txtView.text = "好棒，再点一个哦";
        this.txtView.x = this.guideBubble.x;
		this.txtView.y = this.guideBubble.y +18;
        this.addChild(this.guideBubble);
        this.addChild(this.txtView);

        this.helpHandle.x = this.maskIcon.x;
		this.helpHandle.y = this.maskIcon.y;
		var tw:egret.Tween = egret.Tween.get(this.helpHandle,{loop:true});
		tw.to({scaleX:1,scaleY:1},300, egret.Ease.cubicInOut).to({scaleX:0.8,scaleY:0.8},300, egret.Ease.cubicInOut);
        this.addChild(this.helpHandle);

    }

    public guideThree(){
        this.guide.clear();
        this.maskIcon2.graphics.beginFill(0x000000,1);
        this.maskIcon2.graphics.drawCircle(0, 0, 140);
        this.maskIcon2.graphics.endFill();
        this.maskIcon2.scaleY = 0.6;
        this.maskIcon2.x = 20 + GameData.girdWidth/5 + (GameData.girdWidth +GameData.girdWidth/5) *1.5+GameData.girdWidth/2;
        this.maskIcon2.y = GameData.startY + GameData.girdWidth*(Math.floor(6/GameData.MaxColumn))+GameData.girdWidth/2 -20;
        this.guide.init(this.maskIcon2, GameData.stageW, GameData.stageH);
        this.guide.touchEnabled = true;
        this.addChild(this.guide);

        this.guideBubble.x = this.maskIcon2.x - this.maskIcon2.width/2;
		this.guideBubble.y = this.maskIcon2.y  - this.maskIcon2.height/2 - this.txtView.height;

        this.txtView.text = "拖动合成高级房子";
        this.txtView.x = this.guideBubble.x;
		this.txtView.y = this.guideBubble.y+18;
        this.addChild(this.guideBubble);
        this.addChild(this.txtView);

        this.helpHandle.x = 20 + GameData.girdWidth/5 + (GameData.girdWidth +GameData.girdWidth/5)+GameData.girdWidth/2;
		this.helpHandle.y = GameData.startY + GameData.girdWidth*(Math.floor(6/GameData.MaxColumn))+GameData.girdWidth/2 -20;
        let newX = 20 + GameData.girdWidth/5 + (GameData.girdWidth +GameData.girdWidth/5)*2+GameData.girdWidth/2;
        egret.Tween.removeTweens(this.helpHandle);
		var tw:egret.Tween = egret.Tween.get(this.helpHandle,{loop:true});
		tw.to({x:newX,y:this.helpHandle.y,scaleX:1,scaleY:1 },2500, egret.Ease.sineIn);
        this.addChild(this.helpHandle);

    }

    public clear(){
        this.guide.clear();
        while(this.numChildren){
            this.removeChildAt(0);
        }
    }
}