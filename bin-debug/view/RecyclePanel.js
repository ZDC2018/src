var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var RecyclePanel = (function (_super) {
    __extends(RecyclePanel, _super);
    function RecyclePanel() {
        return _super.call(this) || this;
    }
    RecyclePanel.prototype.show = function () {
        //console.log("显示回收面板");
        this.recyclePanel = new egret.Shape();
        this.deletePanel = new egret.Shape();
        this.recyclePanel.width = GameData.stageW;
        this.recyclePanel.height = this.recyclePanel.width * 0.4;
        this.recyclePanel.x = 0;
        this.recyclePanel.y = GameData.stageH - this.recyclePanel.height;
        this.deletePanel.graphics.beginFill(0xFF5A49);
        this.deletePanel.graphics.drawRect(0, this.recyclePanel.y, this.recyclePanel.width, this.recyclePanel.height);
        this.deletePanel.graphics.endFill();
        this.recyclePanel.graphics.lineStyle(1, 0x666666, 1);
        this.recyclePanel.graphics.beginFill(0xFF9B26);
        this.recyclePanel.graphics.drawRect(0, 0, this.recyclePanel.width, this.recyclePanel.height);
        this.recyclePanel.graphics.endFill();
        // this.addChild(this.recyclePanel);
        // this.addChild(this.deletePanel);
        this.recyclePanel.mask = this.deletePanel;
        var recycleIcon = ResourceUtils.createBitmapByName("ui_recycle_new_png");
        recycleIcon.x = (this.recyclePanel.width - recycleIcon.width) / 2;
        recycleIcon.y = this.recyclePanel.y + this.recyclePanel.height / 2 - recycleIcon.height / 2;
        // this.addChild(recycleIcon);
        var mcData = RES.getRes("hitbox_json");
        var mcTexture = RES.getRes("hitbox_png");
        //创建动画工厂
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
        this.mc1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("del"));
        var delBox = new egret.Bitmap();
        delBox.texture = RES.getRes("ui_bigbox_hit_01_png");
        this.mc1.x = GameData.stageW / 2 - delBox.width / 2;
        ;
        this.mc1.y = GameData.stageH - delBox.height;
        this.addChild(this.mc1);
        this.mc1.gotoAndPlay(1);
    };
    RecyclePanel.prototype.setMask = function (set) {
        if (set === void 0) { set = true; }
        if (set) {
            //console.log("显示回收面板遮罩");    
            this.recyclePanel.mask = this.deletePanel;
        }
        else {
            //console.log("撤销回收面板遮罩");                
            this.recyclePanel.mask = null;
        }
    };
    RecyclePanel.prototype.clear = function () {
        //console.log("清空回收面板");            
        while (this.numChildren) {
            this.removeChildAt(0);
        }
    };
    return RecyclePanel;
}(egret.Sprite));
__reflect(RecyclePanel.prototype, "RecyclePanel");
//# sourceMappingURL=RecyclePanel.js.map