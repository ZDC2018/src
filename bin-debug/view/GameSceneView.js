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
var GameSceneView = (function (_super) {
    __extends(GameSceneView, _super);
    // private _gameOverScene:GameOverView;
    function GameSceneView() {
        var _this = _super.call(this) || this;
        GameSceneView.game = _this;
        _this.initView();
        return _this;
    }
    GameSceneView.prototype.initView = function () {
        this.gameContainer = new egret.Sprite();
        this.addChild(this.gameContainer);
        this.showHome();
    };
    GameSceneView.prototype.clear = function () {
        while (this.gameContainer.numChildren) {
            this.gameContainer.removeChildAt(0);
        }
    };
    GameSceneView.prototype.start = function () {
        this.clear();
        var gameLayer = new egret.Sprite();
        this.gameContainer.addChild(gameLayer);
        this._gl = new GameLogic(gameLayer);
    };
    GameSceneView.prototype.gameOver = function () {
        // this.clear();
        // this._gameOverScene = new GameOverView();
        // this.gameContainer.addChild(this._gameOverScene);
    };
    GameSceneView.prototype.showHome = function () {
        this.clear();
        this._startScene = new GameStartView();
        this.gameContainer.addChild(this._startScene);
    };
    return GameSceneView;
}(egret.Sprite));
__reflect(GameSceneView.prototype, "GameSceneView");
//# sourceMappingURL=GameSceneView.js.map