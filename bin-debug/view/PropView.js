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
var PropView = (function (_super) {
    __extends(PropView, _super);
    function PropView(type) {
        var _this = _super.call(this) || this;
        _this._type = 0; //道具类型
        _this.id = -1;
        _this._type = type;
        _this.init();
        return _this;
    }
    Object.defineProperty(PropView.prototype, "proptype", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.init = function () {
        this.createView();
        this.addChild(this._view_active);
        this.setFocus(true);
    };
    PropView.prototype.createView = function () {
        this.touchEnabled = true;
        var _interval = 15;
        var _width = (GameData.stageW - _interval * 6) / 5;
        var girdWidth = (GameData.stageW - 40) / GameData.MaxRow;
        if (!this._view_active) {
            var grow = new egret.GlowFilter(0xffffff, 1, 10, 10, 10);
            this._view_active = new egret.Bitmap();
            this._view_active.texture = RES.getRes(this.getActivateTexture(this._type));
            switch (this._type) {
                case 0:
                    this._view_active.width = girdWidth;
                    this._view_active.height = girdWidth;
                    // this._view_active.filters = [grow];		
                    this._view_active.x = 20;
                    this._view_active.y = GameData.stageH - this._view_active.height - 10;
                    var userInfo = platform.getUserInfo(20, GameData.stageH - GameData.girdWidth - 10, GameData.girdWidth, GameData.girdWidth);
                    // console.log(userInfo);
                    break;
                case 1:
                    this._view_active.width = girdWidth * 0.6;
                    this._view_active.height = girdWidth * 0.6;
                    // this._view_active.x = 20 +this._view_active.width/2 -5;
                    // this._view_active.filters = [grow];	
                    this._view_active.x = 20;
                    this._view_active.y = GameData.stageH - this._view_active.height - girdWidth - 30;
                    break;
                case 2:
                    // this._view_active.width = girdWidth*1.575;
                    // this._view_active.height = girdWidth*1.575;
                    this._view_active.x = GameData.stageW / 2 - this._view_active.width / 2;
                    this._view_active.y = GameData.stageH - this._view_active.height;
                    var mcData = RES.getRes("hitbox_json");
                    var mcTexture = RES.getRes("hitbox_png");
                    //创建动画工厂
                    var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
                    //创建 MovieClip，将工厂生成的 MovieClipData 传入参数
                    this.mc1 = new egret.MovieClip(mcDataFactory.generateMovieClipData("hitbox_a"));
                    this.mc2 = new egret.MovieClip(mcDataFactory.generateMovieClipData("hitbox_b"));
                    this.mc2.x = this.mc1.x = GameData.stageW / 2 - this._view_active.width / 2;
                    ;
                    this.mc2.y = this.mc1.y = GameData.stageH - this._view_active.height;
                    //添加播放完成事件
                    this.mc1.addEventListener(egret.Event.COMPLETE, function () {
                        // egret.log("1,COMPLETE");
                        this.removeChild(this.mc1);
                        this.addChild(this.mc2);
                        this.mc2.gotoAndPlay(1);
                    }, this);
                    break;
                case 3:
                    this._view_active.width = girdWidth * 0.93;
                    this._view_active.height = girdWidth * 0.966;
                    this._view_active.x = GameData.stageW - 20 - this._view_active.width;
                    this._view_active.y = GameData.stageH - this._view_active.height - 10;
                    break;
                case 4:
                    this._view_active.width = girdWidth * 0.758;
                    this._view_active.height = girdWidth * 0.766;
                    this._view_active.x = GameData.stageW - 20 - this._view_active.width;
                    this._view_active.y = GameData.stageH - this._view_active.height - girdWidth * 0.966 - 20;
                    break;
            }
        }
        // console.log(this._view_active.x);
        // console.log(this._view_active.y);
    };
    PropView.prototype.getActivateTexture = function (type) {
        var textureName = "";
        switch (type) {
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
    };
    PropView.prototype.setFocus = function (val) {
        if (val) {
            this._view_active.texture = RES.getRes(this.getActivateTexture(this._type));
        }
        else {
            // this._view_active.texture = RES.getRes(this.getDisableTexture(this._type));
            if (this._type == 1) {
                this._view_active.texture = RES.getRes("ui_sound_close_png");
            }
        }
    };
    PropView.prototype.setPlayTime = function (playTimes) {
        if (this._type == 2) {
            this.addChild(this.mc1);
            // console.log(this.mc1.frameRate);
            if (!this.mc1.isPlaying) {
                this.mc1.gotoAndPlay(2, playTimes);
            }
            else {
                this.mc1.frameRate++;
            }
        }
    };
    PropView.prototype.ResetMcFrameRate = function () {
        // egret.log("重置mc1的播放速度");
        this.mc1.frameRate = 18;
    };
    return PropView;
}(egret.Sprite));
__reflect(PropView.prototype, "PropView");
//# sourceMappingURL=PropView.js.map