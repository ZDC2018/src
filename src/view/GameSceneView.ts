/**
 * Created by Channing on 2014/9/17.
 */
class GameSceneView extends egret.Sprite{

    public static game:GameSceneView;
    private _startScene:GameStartView;
    // private _gameScene:GameingSceneView;
    private gameContainer:egret.Sprite;
    // private _gameOverScene:GameOverView;
    constructor(){
        super();
        GameSceneView.game = this;
        this.initView();
    }

    private initView():void
    {
        this.gameContainer = new egret.Sprite();
        this.addChild(this.gameContainer);

        this.showHome();
    }

    private clear():void{
        while(this.gameContainer.numChildren){
            this.gameContainer.removeChildAt(0);
        }
    }

    private _gl:GameLogic;
    public start():void
    {
        this.clear();     
        let gameLayer:egret.Sprite=new egret.Sprite();
        this.gameContainer.addChild(gameLayer);
        this._gl =new GameLogic(gameLayer);
      

    }
    public gameOver():void
    {
        // this.clear();
        // this._gameOverScene = new GameOverView();
        // this.gameContainer.addChild(this._gameOverScene);
    }
    public showHome():void
    {
        this.clear();
        this._startScene = new GameStartView();
        this.gameContainer.addChild(this._startScene);
    }
}