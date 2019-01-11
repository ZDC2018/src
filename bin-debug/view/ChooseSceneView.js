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
var ChooseSceneView = (function (_super) {
    __extends(ChooseSceneView, _super);
    function ChooseSceneView(sceneId) {
        var _this = _super.call(this) || this;
        _this.sceneId = 0;
        _this.init();
        _this.sceneId = sceneId;
        return _this;
    }
    ChooseSceneView.prototype.init = function () {
        this.touchEnabled = true;
        this.bitmap = new egret.Bitmap();
        this.addChild(this.bitmap);
    };
    return ChooseSceneView;
}(egret.Sprite));
__reflect(ChooseSceneView.prototype, "ChooseSceneView");
//# sourceMappingURL=ChooseSceneView.js.map