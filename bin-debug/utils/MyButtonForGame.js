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
/**
 * Created by Channing on 2014/9/17.
 */
var MyButtonForGame = (function (_super) {
    __extends(MyButtonForGame, _super);
    function MyButtonForGame(bgName, titleName) {
        var _this = 
        // console.log(bgName);
        // console.log(titleName);
        _super.call(this) || this;
        _this.sp = new egret.Sprite();
        _this.addChild(_this.sp);
        _this.bg = ResourceUtils.createBitmapByName(bgName);
        _this.sp.addChild(_this.bg);
        _this.title = ResourceUtils.createBitmapByName(titleName);
        if (_this.title.texture == null) {
            _this.title.texture = RES.getRes(titleName);
        }
        _this.title.x = (_this.bg.width - _this.title.width) >> 1;
        _this.title.y = (_this.bg.height - _this.title.height) >> 1;
        _this.sp.addChild(_this.title);
        _this.noScaleX = _this.sp.x;
        _this.noScaleY = _this.sp.y;
        return _this;
    }
    MyButtonForGame.prototype.setClick = function (func) {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEvent, this);
        this.onClick = func;
    };
    MyButtonForGame.prototype.onClickEvent = function () {
        if (GameData.isClickBtn)
            return;
        var scaleX = (this.sp.width - this.sp.width * 0.8) / 2;
        var scaleY = (this.sp.height - this.sp.height * 0.8) / 2;
        this.tw = egret.Tween.get(this.sp);
        this.tw.to({ "scaleX": 0.7, "scaleY": 0.7, "x": scaleX, "y": scaleY }, 40).to({ "scaleX": 1, "scaleY": 1, "x": this.noScaleX, "y": this.noScaleY }, 40).call(this.onClickHandler, this);
    };
    MyButtonForGame.prototype.onClickHandler = function () {
        this.onClick();
    };
    return MyButtonForGame;
}(egret.Sprite));
__reflect(MyButtonForGame.prototype, "MyButtonForGame");
//# sourceMappingURL=MyButtonForGame.js.map