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
var GameElement = (function (_super) {
    __extends(GameElement, _super);
    function GameElement() {
        //游戏元素，用于标记当前舞台种出现的元素数据
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 0; //唯一ID，代表当前舞台上得元素,这个ID要和view中得元素ID对应
        _this.location = 0; //位置坐标，使用0-64来进行记录
        _this.grade = 0; //元素的等级
        _this.time = 0; //创建时间
        return _this;
        // public type:string = "";//元素的类型 
    }
    return GameElement;
}(BaseElement));
__reflect(GameElement.prototype, "GameElement");
//# sourceMappingURL=GameElement.js.map