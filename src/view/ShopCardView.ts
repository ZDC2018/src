class ShopCardView extends egret.Sprite {
	public constructor(grade:number) {
		super();
		this.init();
		this.houseLevel = grade;
	}

	public houseLevel:number = 0;
	public housePrcice:string = '0';

	public bitmap:egret.Bitmap; //当前元素中的位图数据
	private init(){
		this.touchEnabled = true;
		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
	}
}