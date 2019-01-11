/**
 * Created by Channing on 2014/9/17.
 * Edited by bigfootzq on 2018/09/18
 */
class GameStartView extends egret.Sprite{

    private thisContainer:egret.Sprite;
    constructor(){
        super();
        this.initView()
    }
    private userInfoButton:any;
    private initView():void {
        //console.log("GameStartView初始化");
        var bg:egret.Bitmap = ResourceUtils.createBitmapByName("loading_base_png");
        bg.width =  GameData.scentWidth;
        bg.height = GameData.scentHeight;

        
        var bgLogo:egret.Bitmap = ResourceUtils.createBitmapByName("loading_logo_png");
        bgLogo.width =  GameData.scentWidth*0.95;
        bgLogo.height = bgLogo.width*1.167;

        bgLogo.x = (GameData.scentWidth - bgLogo.width)/2;
        bgLogo.y = bgLogo.x*2;
        
        this.addChild(bg);
        this.addChild(bgLogo);
        var start_btn:MyButtonForGame = new MyButtonForGame("loading_start_png","loading_start_png");
        this.addChild(start_btn);
        var _swidth:number =   GameData.scentWidth/2- start_btn.width/2;
        var _sheight:number =  GameData.scentHeight*3/4 -start_btn.height;

        start_btn.x = _swidth;
        start_btn.y = _sheight;  
        // //console.log(start_btn.y);
        this.userInfoButton = platform.createUserInfoButton();    
        //console.log(this.userInfoButton);           
        start_btn.setClick(this.showStartView.bind(this));
        this.thisContainer = new egret.Sprite();
        this.addChild(this.thisContainer);
        
        // this.onShow().then(oldData =>{
		// 	GameData.closeMusic = oldData.closeMusic?oldData.closeBgMusic:false;
		// 	GameData.closeBgMusic = oldData.closeBgMusic?oldData.closeBgMusic:false;
		// 	GameData.curretLevel = 3;
		// 	GameData.levelExp = oldData.levelExp;
		// 	GameData.coin = Number(oldData.coin)?Number(oldData.coin):0;
		// 	let secCoin = Number(oldData.secCoin);
		// 	let due = oldData.due;
        //     GameData.oldElements = JSON.parse(oldData.inMap);
		// 	GameData.maxHouseGrade = oldData.maxHouseGrade?oldData.maxHouseGrade:1;
		// 	GameData.houseBuyNumber = oldData.buyHouseNumber;
		// 	//console.log("获取旧数据后的关卡："+GameData.curretLevel);
		// 	//console.log("获取旧数据后的关卡："+GameData.oldElements);
		// });
    }

    private showStartView():void {
        if(this.parent) this.parent.removeChild(this);
        GameSceneView.game.start();
        this.userInfoButton.hide();
    }

    private async onShow(){
		//console.log("进入游戏");
			let wxData = platform.getLaunchOptionsSync();
		if(wxData){
			//console.log(wxData);
			let userGameData = await platform.getGameData("userGameData");
			//console.log("获取旧数据");
			
			let oldData = userGameData[0];
            //console.log(oldData);
			return oldData;
		}
	}


    private showOtherView():void {
        //EgretShare.moreGame();
    }
}