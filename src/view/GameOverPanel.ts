class GameOverPanel extends egret.Sprite
{
    public constructor()
    {
        super();
    }

    private _view:egret.Bitmap;
    private _isSuccess:boolean = false;
    private _btn:egret.Shape;
    private _btnLabel:egret.TextField;
    public show(isSuccess:boolean)
    {
        this._isSuccess = isSuccess;
        
        this._view = new egret.Bitmap();
        this._view.texture = RES.getRes("scene_01_back_png");
        this._view.width = GameData.stageW;
        this._view.height = GameData.stageH;    
        this.addChild(this._view);
       
        this.scaleX = 0.1;
        this.scaleY = 0.1;
        egret.Tween.get(this).to({scaleX:1,scaleY:1},700,egret.Ease.bounceOut).call(this.playStarAni,this);
        this.playStarAni();
        this.initBtn();
    }
  
    private playStarAni()
    {
        var gameover:egret.Bitmap = new egret.Bitmap();
        gameover.texture = RES.getRes("gameovertitle_png");
        gameover.width = this._view.width/2;
        gameover.height = 60;
        gameover.x = this._view.x + (this._view.width-gameover.width)/2;
        gameover.y = GameData.stageH/2;
        gameover.scaleX=0;
        gameover.scaleY = 0;
        this.addChild(gameover);
        egret.Tween.get(gameover).to({scaleX:1,scaleY:1},700,egret.Ease.bounceOut);

        console.log("播放动画");
        /*
        console.log(this._isSuccess);
        if(this._isSuccess)
        {
            //成功动画
            let success:egret.Bitmap = new egret.Bitmap();
            success.texture = RES.getRes("success_png");
            success.width = (this._view.width-50)/3;
            success.height = success.width;
            success.x = (GameData.stageW-success.width*2)/3 +this._view.x;
            success.y = 150+this._view.y;
            success.scaleX = 1.5;
            success.scaleY = 1.5;
            success.alpha = 0;
            this.addChild(success);
            egret.Tween.get(success).to({scaleX:1,scaleY:1,alpha:1},700,egret.Ease.circIn);
          
    

        }
        else
        {
            //失败动画
            let fail:egret.Bitmap = new egret.Bitmap();
            fail.texture = RES.getRes("fail_png");
            fail.width = (this._view.width-50)/3;
            fail.height = fail.width;
            fail.x = (GameData.stageW-fail.width*2)/3 +this._view.x;
            fail.y = 150+this._view.y;
            fail.scaleX = 1.5;
            fail.scaleY = 1.5;
            fail.alpha = 0;
            this.addChild(fail);
            egret.Tween.get(fail).to({scaleX:1,scaleY:1,alpha:1},700,egret.Ease.circIn);

        

        }
        */
    }
      private initBtn():void{
        this._btn = new egret.Shape();
        this._btn.graphics.lineStyle(1, 0x666666, 1);
        this._btn.graphics.beginFill(0xffffff);
        this._btn.graphics.drawRect(0, 0, 160, 80);
        this._btn.graphics.endFill();
        this._btn.width = 160;
        this._btn.height = 80;
        this._btn.x = GameData.stageW/2 - this._btn.width/2
        this._btn.y = GameData.stageH/2 + 100;
        this._btn.touchEnabled = true;
        this._btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.reset, this);
        this.addChild(this._btn);

        this._btnLabel = new egret.TextField();
        this._btnLabel.size = 20;
        this._btnLabel.textColor = 0x333333;
        this._btnLabel.text = "再来一次";
        this._btnLabel.width = 160;
        this._btnLabel.height = 80;
        this._btnLabel.bold = true;
        this._btnLabel.x = this._btn.x;
        this._btnLabel.y = this._btn.y;
        this._btnLabel.textAlign = "center";
        this._btnLabel.verticalAlign = "middle";
        this.addChild(this._btnLabel);

    }
    private reset(){
        let egameover:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.GAME_OVER);
        this.dispatchEvent(egameover);
    }
    private clear(){
         while(this.numChildren){
            this.removeChildAt(0);
        }
    }
  
}