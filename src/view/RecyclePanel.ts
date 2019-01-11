class RecyclePanel  extends egret.Sprite
{
    public constructor(){
        super();
    }

    private recyclePanel:egret.Shape;
    private deletePanel:egret.Shape;
    private mc1:egret.MovieClip;
    public show(){
        //console.log("显示回收面板");
        this.recyclePanel = new egret.Shape();
        this.deletePanel = new egret.Shape();
        
        this.recyclePanel.width = GameData.stageW;
        this.recyclePanel.height = this.recyclePanel.width * 0.4;
        this.recyclePanel.x = 0;
        this.recyclePanel.y = GameData.stageH - this.recyclePanel.height;
     

        this.deletePanel.graphics.beginFill(0xFF5A49)
        this.deletePanel.graphics.drawRect(0, this.recyclePanel.y, this.recyclePanel.width, this.recyclePanel.height);
        this.deletePanel.graphics.endFill();
        
        this.recyclePanel.graphics.lineStyle(1, 0x666666, 1);
        this.recyclePanel.graphics.beginFill(0xFF9B26);
        this.recyclePanel.graphics.drawRect(0, 0, this.recyclePanel.width, this.recyclePanel.height);
        this.recyclePanel.graphics.endFill();

        
        // this.addChild(this.recyclePanel);
        // this.addChild(this.deletePanel);
        this.recyclePanel.mask = this.deletePanel;
        let recycleIcon = ResourceUtils.createBitmapByName("ui_recycle_new_png");
        recycleIcon.x = (this.recyclePanel.width - recycleIcon.width)/2;
        recycleIcon.y = this.recyclePanel.y + this.recyclePanel.height/2 -recycleIcon.height/2;
        // this.addChild(recycleIcon);

        let mcData = RES.getRes("hitbox_json");
        let mcTexture = RES.getRes("hitbox_png");
        //创建动画工厂
        var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        this.mc1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("del"));
        let delBox = new egret.Bitmap();
        delBox.texture = RES.getRes("ui_bigbox_hit_01_png");
        this.mc1.x = GameData.stageW/2 - delBox.width/2;;
        this.mc1.y = GameData.stageH - delBox.height;
        this.addChild(this.mc1);
        this.mc1.gotoAndPlay(1);
    }   

    public setMask(set:boolean=true){
        if (set){
            //console.log("显示回收面板遮罩");    
            this.recyclePanel.mask =  this.deletePanel;
        }else{
            //console.log("撤销回收面板遮罩");                
            this.recyclePanel.mask = null;
        }
        
    }
    public clear(){
        //console.log("清空回收面板");            
         while(this.numChildren){
            this.removeChildAt(0);
        }
    }

}