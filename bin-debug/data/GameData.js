var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameData = (function () {
    function GameData() {
    }
    //初始化游戏数据，仅仅创建空对象
    GameData.initData = function () {
        //console.log("GameData初始化")
        GameData.mapData = new Array();
        for (var i = 0; i < GameData.MaxRow; i++) {
            var arr = new Array();
            GameData.mapData.push(arr);
            for (var t = 0; t < GameData.MaxColumn; t++) {
                GameData.mapData[i].push(-1);
                // GameData.mapData[i][t] = -2;
            }
        }
        // //console.log(GameData.mapData)
        for (var i = 0; i < GameData.elementTypes.length; i++) {
            // //console.log("购买次数"+this._houseBuyNubmer[i]);
            if (!GameData.houseBuyNumber[i]) {
                GameData.houseBuyNumber[i] = 0; //所有房子购买次数为0
            }
        }
        GameData.levelExp = 0;
        GameData.availableMapId = new Array();
        GameData.elements = new Array();
        GameData.unusedElements = new Array();
        var len = GameData.MaxRow * GameData.MaxColumn;
        var element;
        for (var i = 0; i < len; i++) {
            element = new GameElement();
            element.id = i;
            GameData.elements.push(element);
            GameData.unusedElements.push(i);
        }
        GameData.stageW = egret.MainContext.instance.stage.stageWidth;
        GameData.stageH = egret.MainContext.instance.stage.stageHeight;
        GameData.girdWidth = (GameData.stageW - 40) / GameData.MaxRow;
        GameData.startY = GameData.girdWidth * 2;
        // //console.log("舞台宽度"+GameData.stageW);
        // //console.log("舞台高度"+GameData.stageH);
    };
    GameData.closeMusic = false;
    GameData.closeBgMusic = false;
    GameData.unmapnum = 0; //空白地图块数量
    // public static stepNum:number = 0;//玩家剩余步数
    // public static levelStepNum:number =0;//当前关卡步数
    GameData.elementTypes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]; //当前关卡出现的元素类型
    GameData.levelBackgroundImageName = ""; //当前关卡背景图资源名
    GameData.levelFrontBackgroundImageName = ""; //当前关卡前置背景图资源名
    GameData.setSceneData = false; //是否已经设定场景
    GameData.bgMusic = ""; //当前关卡背景音乐
    GameData.girdImageName = ""; //当前关卡地块背景图资源名
    GameData.girdLockImageName = ""; //当前关卡锁定地块背景图资源名
    GameData.MaxRow = 5; //最大的行
    GameData.MaxColumn = 4; //最大的列
    GameData.currentElementNum = 0; //当前关卡游戏中地图可用元素数量
    GameData.girdBg = new Array(); //游戏中地图格子数组
    GameData.coin = '0'; //游戏中获得的金币
    GameData.secCoin = '0'; //游戏秒产金币数值
    GameData.oldElements = new Array(); //用于保存上一关剩下的元素，切换新关卡时候添加
    GameData.elementTypeFirstShow = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; //元素是否第一次出现，0~51,用于第一次出现时弹出提示
    GameData.maxHouseGrade = 1; //当前房子最高等级
    GameData.houseBuyNumber = new Array(); //房子购买次数
    GameData.cost = '0'; //购买房屋总花费
    GameData.currentLevel = 1; //当前关卡
    GameData.levelExp = 0; //当前关卡获得的经验值,
    GameData.levelReqExp = 0; //当前关卡过关需要的经验值,
    GameData.levelCoin = '0'; //当前关卡过关奖励的金币,
    GameData.boxDownWeight = 0; //当前关卡箱子掉落权重
    GameData.giftBoxHouseGrade = 2; //当前关卡礼物箱打开房子等级
    //舞台宽高，此封装为了方便调用
    GameData.stageW = 0;
    GameData.stageH = 0;
    GameData.girdWidth = 0;
    GameData.startY = 0;
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map