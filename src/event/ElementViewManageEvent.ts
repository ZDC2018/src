class ElementViewManageEvent extends egret.Event {
	
    public static TAP_TWO_ELEMENT:string = "tap_two_element";
    public static REMOVE_ANIMATION_OVER:string = "remove_animation_over";
    public static UPDATE_MAP:string = "update_map";
    public static UPDATE_VIEW_OVER:string = "update_view_over";
    public static LEVEL_EXP_UP:string = "level_exp_up";//升级
    public static CLOSE_LEVEL_UP_PANEL:string = "close_level_up_panel";//升级
    public static OPEN_NEW_HOUSE_PANEL:string = "open_new_house_panel";//打开新房子面板
    public static GET_NEW_HOUSE_PROFIT:string = "get_new_house_profit";//获取收益
    public static CLOSE_NEW_HOUSE_PANEL:string = "close_new_house_panel";//关闭新房子面板
    public static CHANGE_SCENE:string = "change_scene";//切换场景
    public static OPEN_SCENES:string = "open_scenes";//打开切换场景
    public static BUY_NEW_HOUSE:string = "buy_new_house";//购买新房屋
    public static GET_PROFIT:string = "get_profit";//获取离线收益
    public static X5_PROFIT:string = "x5_profit";//获取5倍秒产
    public static REWARD_HOUSE:string = "reward_house";//获取5倍秒产
    public static DELETE_ELEMENT_OVER:string = "delete_element_over";//元素删除完毕
    public static GAME_OVER:string = "game_over";//游戏结束
    public static USE_PROP_CLICK:string = "use_prop_click";
    public static GUIDE_STEP_TWO:string = "guide_step_two";//新手引导第二步
    public static GUIDE_STEP_THREE:string = "guide_step_three";//新手引导第三步
    public static GUIDE_RESET:string = "guide_reset";//新手引导被打断，重新开始

    public sceneId:number = 1;
    public grade:number = 1;

    // public propToElementLocation:number = 0; //携带道具点击的元素位置,这个暂时不需要了
    // public ele1:number=0;//第一个点击的元素
    // public ele2:number=0;//第二个点击的元素
    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
    {
        super(type,bubbles,cancelable);
    }
}