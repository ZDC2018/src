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
// TypeScript file
/**
 * 道具逻辑
 */
var PropLogic = (function (_super) {
    __extends(PropLogic, _super);
    function PropLogic() {
        var _this = _super.call(this) || this;
        _this.isdisplay = false;
        return _this;
    }
    //道具编号以及说明
    // 0  排行榜
    // 1  声音控制
    // 2  箱子   每10秒生成一个一级元素
    // 3  删除
    // 4  道具商店
    PropLogic.prototype.useProp = function (propType) {
        switch (propType) {
            case 0:
                // this.rank();
                break;
            case 1:
                this.voice();
                break;
            case 2:
                // this.box();
                break;
            case 3:
                // this.shop();
                break;
            case 4:
                this.recycle();
                break;
        }
    };
    PropLogic.prototype.rank = function () {
        // console.log("点击排行榜");
    };
    PropLogic.prototype.voice = function () {
        // console.log('voice:');
        if (GameData.closeBgMusic) {
            SoundUtils.instance().stopBg();
        }
        else {
            GameData.closeBgMusic = false;
            SoundUtils.instance().playBg();
        }
        console.log(GameData.closeBgMusic);
    };
    PropLogic.prototype.box = function () {
        //    console.log('box_in');
    };
    PropLogic.prototype.shop = function () {
    };
    PropLogic.prototype.recycle = function () {
        // console.log('recycle');        
    };
    return PropLogic;
}(egret.Sprite));
__reflect(PropLogic.prototype, "PropLogic");
//# sourceMappingURL=PropLogic.js.map