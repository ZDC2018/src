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
var ElementViewManageEvent = (function (_super) {
    __extends(ElementViewManageEvent, _super);
    // public propToElementLocation:number = 0; //携带道具点击的元素位置,这个暂时不需要了
    // public ele1:number=0;//第一个点击的元素
    // public ele2:number=0;//第二个点击的元素
    function ElementViewManageEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this.sceneId = 1;
        _this.grade = 1;
        return _this;
    }
    ElementViewManageEvent.TAP_TWO_ELEMENT = "tap_two_element";
    ElementViewManageEvent.REMOVE_ANIMATION_OVER = "remove_animation_over";
    ElementViewManageEvent.UPDATE_MAP = "update_map";
    ElementViewManageEvent.UPDATE_VIEW_OVER = "update_view_over";
    ElementViewManageEvent.LEVEL_EXP_UP = "level_exp_up"; //升级
    ElementViewManageEvent.CLOSE_LEVEL_UP_PANEL = "close_level_up_panel"; //升级
    ElementViewManageEvent.OPEN_NEW_HOUSE_PANEL = "open_new_house_panel"; //打开新房子面板
    ElementViewManageEvent.CLOSE_NEW_HOUSE_PANEL = "close_new_house_panel"; //关闭新房子面板
    ElementViewManageEvent.CHANGE_SCENE = "change_scene"; //切换场景
    ElementViewManageEvent.OPEN_SCENES = "open_scenes"; //打开切换场景
    ElementViewManageEvent.BUY_NEW_HOUSE = "buy_new_house"; //购买新房屋
    ElementViewManageEvent.GET_PROFIT = "get_profit"; //获取离线收益
    ElementViewManageEvent.X5_PROFIT = "x5_profit"; //获取5倍秒产
    ElementViewManageEvent.REWARD_HOUSE = "reward_house"; //获取5倍秒产
    ElementViewManageEvent.DELETE_ELEMENT_OVER = "delete_element_over"; //元素删除完毕
    ElementViewManageEvent.GAME_OVER = "game_over"; //游戏结束
    ElementViewManageEvent.USE_PROP_CLICK = "use_prop_click";
    ElementViewManageEvent.GUIDE_STEP_TWO = "guide_step_two"; //新手引导第二步
    ElementViewManageEvent.GUIDE_STEP_THREE = "guide_step_three"; //新手引导第三步
    ElementViewManageEvent.GUIDE_RESET = "guide_reset"; //新手引导被打断，重新开始
    return ElementViewManageEvent;
}(egret.Event));
__reflect(ElementViewManageEvent.prototype, "ElementViewManageEvent");
//# sourceMappingURL=ElementViewManageEvent.js.map