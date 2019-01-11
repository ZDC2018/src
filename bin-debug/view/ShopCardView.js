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
var ShopCardView = (function (_super) {
    __extends(ShopCardView, _super);
    function ShopCardView(grade) {
        var _this = _super.call(this) || this;
        _this.houseLevel = 0;
        _this.housePrcice = '0';
        _this.init();
        _this.houseLevel = grade;
        return _this;
    }
    ShopCardView.prototype.init = function () {
        this.touchEnabled = true;
        this.bitmap = new egret.Bitmap();
        this.addChild(this.bitmap);
    };
    return ShopCardView;
}(egret.Sprite));
__reflect(ShopCardView.prototype, "ShopCardView");
//# sourceMappingURL=ShopCardView.js.map