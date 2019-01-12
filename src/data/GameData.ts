class GameData {
	
    public static closeMusic:Boolean = false;
    public static closeBgMusic:Boolean = false;	
    public static isClickBtn:Boolean;
    public static scentWidth:number;
    public static scentHeight:number;

	public static unmapnum:number = 0;//空白地图块数量
	public static mapData:number[][]; //游戏地图,-1表示块地图不能使用，－2表示，此地图没有元素
	// public static stepNum:number = 0;//玩家剩余步数
	// public static levelStepNum:number =0;//当前关卡步数
	public static elementTypes:number[]=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];//当前关卡出现的元素类型
	public static unusedElements:number[];//游戏中未使用得元素，仅记录元素ID
	public static levelBackgroundImageName = ""; //当前关卡背景图资源名
	public static levelFrontBackgroundImageName = ""; //当前关卡前置背景图资源名
	public static setSceneData:boolean = false;//是否已经设定场景
	public static setSceneId:number;//设定的场景ID
	public static bgMusic = "";//当前关卡背景音乐
	public static girdImageName = ""; //当前关卡地块背景图资源名
	public static girdLockImageName = ""; //当前关卡锁定地块背景图资源名

	public static MaxRow:number = 5;//最大的行
	public static MaxColumn:number = 4;//最大的列
	public static currentElementNum:number = 0;//当前关卡游戏中地图可用元素数量
	public static girdBg: egret.Bitmap[] = new Array();//游戏中地图格子数组
	public static coin:string = '0';//游戏中获得的金币
	public static secCoin:string = '0';//游戏秒产金币数值

	
	public static elements:GameElement[];//游戏中出现得元素数据池，最多为20个，因为5*4
	public static oldElements:GameElement[] = new Array();//用于保存上一关剩下的元素，切换新关卡时候添加
	public static elementTypeFirstShow:boolean[] = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,
	false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,
	false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];//元素是否第一次出现，0~51,用于第一次出现时弹出提示
	public static maxHouseGrade:number = 1;//当前房子最高等级
	public static houseBuyNumber:number[] = new Array();	//房子购买次数
	public static newHouse:boolean =false;//是否合成新房子,
	public static cost:string = '0';//购买房屋总花费
	public static currentLevel:number = 1;//当前关卡
	public static levelExp:number = 0;//当前关卡获得的经验值,
	public static levelReqExp:number = 0;//当前关卡过关需要的经验值,
	public static levelCoin:string = '0';//当前关卡过关奖励的金币,
	public static boxDownWeight:number = 0;//当前关卡箱子掉落权重
	public static ordinaryBoxHouseGrade:number = 1;//当前关卡普通箱打开房子等级
	public static giftBoxHouseGrade:number = 2;//当前关卡礼物箱打开房子等级
	public static availableMapId:number[];//当前关卡可以使用的mapid,
	public static getVideoAd:boolean;//获取视频广告是否成功,

	 //舞台宽高，此封装为了方便调用
    public static stageW:number = 0;
    public static stageH:number = 0;
	public static girdWidth:number = 0;
	public static startY:number = 0;

	//配置文件
	public static zeroConfigArr:any;
	public static houseDownArr:any;
	public static buyHouseConfigArray;
	public static availableBuyHouseArr:any;

	//初始化游戏数据，仅仅创建空对象
	public static initData()
	{
		//console.log("GameData初始化")
		GameData.mapData = new Array();
		for(let i=0;i<GameData.MaxRow;i++){
			let arr:Array<number> = new Array();
			GameData.mapData.push(arr);
			for(let t=0;t<GameData.MaxColumn;t++){
				GameData.mapData[i].push(-1);
				// GameData.mapData[i][t] = -2;
			}
		}	
		
		// //console.log(GameData.mapData)
		for (let i = 0 ; i < GameData.elementTypes.length; i++){
			// //console.log("购买次数"+this._houseBuyNubmer[i]);
			if( !GameData.houseBuyNumber[i]){
				GameData.houseBuyNumber[i] = 0;//所有房子购买次数为0
			}
		}
		GameData.levelExp = 0;
		GameData.availableMapId = new Array();
		GameData.elements = new  Array();
		GameData.unusedElements = new Array();
		let len:number = GameData.MaxRow *  GameData.MaxColumn;
		let element:GameElement;
		for(let i=0;i<len;i++){
			element = new GameElement();
			element.id = i;
			GameData.elements.push(element);
			GameData.unusedElements.push(i);
		}

		GameData.stageW = egret.MainContext.instance.stage.stageWidth;
		GameData.stageH = egret.MainContext.instance.stage.stageHeight;
		GameData.girdWidth = (GameData.stageW  -40)/GameData.MaxRow;
		GameData.startY = GameData.girdWidth*2;
		// //console.log("舞台宽度"+GameData.stageW);
		// //console.log("舞台高度"+GameData.stageH);
		GameData.zeroConfigArr= RES.getRes("zero_config_json");
		GameData.houseDownArr = RES.getRes("housedown_config_json");
		GameData.buyHouseConfigArray = RES.getRes("buy_house_config_json");
		GameData.availableBuyHouseArr = RES.getRes("available_buy_house_json");
	}
}
