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
var ChangeScenePanel = (function (_super) {
    __extends(ChangeScenePanel, _super);
    function ChangeScenePanel(elementLayer) {
        var _this = _super.call(this) || this;
        _this._sceneContainer = new egret.Sprite();
        _this._sceneScrollView = null;
        _this._scenes = null;
        _this._openScrollX = 0;
        _this.sceneChooseCheck = ResourceUtils.createBitmapByName("scene#scene_choose_check_png");
        _this._layer = elementLayer;
        return _this;
    }
    ChangeScenePanel.prototype.show = function () {
        var changeSceneMask = new egret.Shape();
        changeSceneMask.graphics.beginFill(0x000000, 0.8);
        changeSceneMask.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        changeSceneMask.graphics.endFill();
        changeSceneMask.alpha = 0.8;
        changeSceneMask.touchEnabled = true;
        SoundUtils.instance().playClickSound();
        this._layer.addChild(this._sceneContainer);
        var changeSceneBase = ResourceUtils.createBitmapByName("scene#scene_choose_base_png");
        changeSceneBase.width = GameData.stageW * 0.965;
        changeSceneBase.height = changeSceneBase.width * 1.5;
        changeSceneBase.x = (GameData.stageW - changeSceneBase.width) / 2;
        changeSceneBase.y = (GameData.stageH - changeSceneBase.height) / 2;
        this._sceneContainer.addChild(changeSceneMask);
        this._sceneContainer.addChild(changeSceneBase);
        this._scenes = this.createScenes();
        //创建ScrollView
        this._sceneScrollView = new egret.ScrollView();
        this._sceneScrollView.setContent(this._scenes);
        this._sceneScrollView.width = GameData.stageW * 0.8;
        this._sceneScrollView.height = GameData.stageW * 1.25;
        this._sceneScrollView.x = (GameData.stageW - this._sceneScrollView.width) / 2;
        this._sceneScrollView.y = (GameData.stageH - this._sceneScrollView.height) / 2;
        this._sceneScrollView.anchorOffsetX = 0;
        this._sceneScrollView.anchorOffsetY = 0;
        this._sceneScrollView.setScrollLeft(this._openScrollX);
        //垂直滚动设置为 on 
        this._sceneScrollView.verticalScrollPolicy = "on";
        //水平滚动设置为 off
        this._sceneScrollView.horizontalScrollPolicy = "off";
        // //console.log(this._cards);
        this._sceneContainer.addChild(this._sceneScrollView);
        // let closeBtn = ResourceUtils.createBitmapByName("ranking_close_png");
        // closeBtn.x =  GameData.stageW - closeBtn.width*2 -changeSceneBase.x;
        // closeBtn.y = changeSceneBase.y +30;
        // closeBtn.touchEnabled = true;
        // closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closePanel,this);
        this.closeBtn = new egret.Shape();
        this.closeBtn.width = GameData.girdWidth;
        this.closeBtn.height = GameData.girdWidth;
        this.closeBtn.graphics.beginFill(0x000000, 0);
        var x = GameData.stageW - this.closeBtn.width - changeSceneBase.x - 10;
        var y = changeSceneBase.y - 5;
        this.closeBtn.graphics.drawRect(x, y, this.closeBtn.width, this.closeBtn.height);
        this.closeBtn.graphics.endFill();
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
        this._layer.addChild(this.closeBtn);
    };
    ChangeScenePanel.prototype.createScenes = function () {
        //console.log("场景解锁:");        
        var scenes = new egret.Sprite();
        var sceneName = ["海岸绿野", "黄金农场", "塞北雪乡", "缤纷小镇", "不夜之城"];
        var unlockedLevel = [1, 5, 12, 20, 31];
        scenes.width = GameData.stageW * 0.965;
        var n = 0;
        if (GameData.setSceneId > 0) {
            n = GameData.setSceneId - 1;
        }
        else {
            for (var index = 0; index < unlockedLevel.length; index++) {
                if (GameData.currentLevel >= unlockedLevel[index]) {
                    n = index;
                }
            }
        }
        // console.log("场景选择"+n);
        for (var i = 0; i < 5; i++) {
            var sceneCard = ResourceUtils.createBitmapByName("scene#scene_choose_paper_png");
            var senceChoose = ResourceUtils.createBitmapByName("scene#scene_choose_no0" + (i + 1) + "_png");
            var changeSceneBtn = new ChooseSceneView(i + 1);
            changeSceneBtn.bitmap.texture = RES.getRes("scene#scene_choose_label_png");
            sceneCard.width = GameData.stageW * 0.79;
            sceneCard.height = sceneCard.width * 0.276;
            sceneCard.x = 0;
            sceneCard.y = 55 + (sceneCard.height + 5) * i;
            scenes.addChild(sceneCard);
            var sceneCardBlack = ResourceUtils.createBitmapByName("scene#scene_choose_black_png");
            sceneCardBlack.width = GameData.stageW * 0.79;
            sceneCardBlack.height = sceneCardBlack.width * 0.276;
            sceneCardBlack.x = 0;
            sceneCardBlack.y = 55 + (sceneCard.height + 5) * i;
            senceChoose.x = sceneCard.x + 10;
            senceChoose.y = sceneCard.y + 4;
            scenes.addChild(senceChoose);
            changeSceneBtn.y = sceneCard.y + sceneCard.height / 2 - changeSceneBtn.height / 2;
            changeSceneBtn.x = senceChoose.x + senceChoose.width + (sceneCard.width - senceChoose.width) / 2 - changeSceneBtn.width / 2;
            changeSceneBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeScene, this);
            //场景名称
            this.senceNameLabel = new egret.TextField();
            this.senceNameLabel.text = sceneName[i];
            this.senceNameLabel.textAlign = egret.HorizontalAlign.CENTER;
            this.senceNameLabel.size = 18;
            this.senceNameLabel.fontFamily = "黑体";
            this.senceNameLabel.width = sceneCard.width - senceChoose.width;
            this.senceNameLabel.x = senceChoose.x + senceChoose.width;
            this.senceNameLabel.y = changeSceneBtn.y + changeSceneBtn.height + 5;
            //场景解锁条件
            var senceUnlockedLabel = new egret.TextField();
            senceUnlockedLabel.text = GameData.currentLevel.toString() + "/" + unlockedLevel[i] + "级解锁";
            senceUnlockedLabel.textColor = 0XFFFFFF;
            senceUnlockedLabel.textAlign = egret.HorizontalAlign.CENTER;
            senceUnlockedLabel.size = 18;
            senceUnlockedLabel.fontFamily = "黑体";
            senceUnlockedLabel.width = senceChoose.width;
            senceUnlockedLabel.x = senceChoose.x;
            senceUnlockedLabel.y = this.senceNameLabel.y;
            if (GameData.currentLevel < Number(unlockedLevel[i])) {
                this.senceNameLabel.textColor = 0XD9D9D9;
                scenes.addChild(sceneCardBlack);
                changeSceneBtn.bitmap.texture = RES.getRes("scene#scene_choose_lock_png");
                changeSceneBtn.touchEnabled = false;
                scenes.addChild(this.senceNameLabel);
                scenes.addChild(senceUnlockedLabel);
            }
            else {
                changeSceneBtn.touchEnabled = true;
                this.senceNameLabel.textColor = 0X67686D;
                if (i == n) {
                    this.senceNameLabel.textColor = 0X4ABE33;
                }
                scenes.addChild(this.senceNameLabel);
            }
            scenes.addChild(changeSceneBtn);
            this.sceneChooseCheck.x = changeSceneBtn.x - 5;
            this.sceneChooseCheck.y = 50 + (sceneCard.height + 5) * n + sceneCard.height / 2 - this.sceneChooseCheck.height / 2;
            scenes.addChild(this.sceneChooseCheck);
        }
        return scenes;
    };
    ChangeScenePanel.prototype.changeScene = function (evt) {
        //console.log("切换场景");
        var scene = evt.currentTarget;
        var event = new ElementViewManageEvent(ElementViewManageEvent.CHANGE_SCENE);
        event.sceneId = scene.sceneId;
        GameData.setSceneId = scene.sceneId;
        this._scenes.removeChild(this.sceneChooseCheck);
        this.sceneChooseCheck.y = 50 + (GameData.stageW * 0.79 * 0.276 + 5) * (GameData.setSceneId - 1) + GameData.stageW * 0.79 * 0.276 / 2 - this.sceneChooseCheck.height / 2;
        this._scenes.addChild(this.sceneChooseCheck);
        this.dispatchEvent(event);
        // //console.log(event);
    };
    ChangeScenePanel.prototype.closePanel = function () {
        //console.log("关闭切换场景面板");
        while (this._sceneContainer.numChildren) {
            this._sceneContainer.removeChildAt(0);
        }
        this._layer.removeChildren();
    };
    return ChangeScenePanel;
}(egret.EventDispatcher));
__reflect(ChangeScenePanel.prototype, "ChangeScenePanel");
//# sourceMappingURL=ChangeScenePanel.js.map