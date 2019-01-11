class ChooseSceneView extends egret.Sprite {
	public constructor(sceneId:number) {
		super();
		this.init();
		this.sceneId = sceneId;
	}

	public sceneId:number = 0;

	public bitmap:egret.Bitmap; //当前元素中的位图数据
	private init(){
		this.touchEnabled = true;
		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
	}
}