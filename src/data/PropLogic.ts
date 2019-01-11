// TypeScript file
/**
 * 道具逻辑
 */
class PropLogic extends egret.Sprite
{
    constructor(){
        super();
    }
    //道具编号以及说明
    // 0  排行榜
    // 1  声音控制
    // 2  箱子   每10秒生成一个一级元素
    // 3  删除
    // 4  道具商店
    public  useProp(propType:number){
        switch(propType)
        {
            case 0:
                // this.rank();
                break;
            case 1:
                this.voice();
                break;
            case 2:
                // this.box();
                break;
            case 3:
                // this.shop();
                break;
            case 4:
                this.recycle();
                break;
        }
    }
    
    private bitmap: egret.Bitmap;
    private isdisplay = false;

    /**
     * 排行榜遮罩，为了避免点击开放数据域影响到主域，在主域中建立一个遮罩层级来屏蔽点击事件.</br>
     * 根据自己的需求来设置遮罩的 alpha 值 0~1.</br>
     * 
     */
    private rankingListMask: egret.Shape;

    private rank() {
		// console.log("点击排行榜");
       
    }

    private  voice(){
        // console.log('voice:');
        if (GameData.closeBgMusic){
            SoundUtils.instance().stopBg();
        }else{
            GameData.closeBgMusic = false;
            SoundUtils.instance().playBg();
        }
        console.log(GameData.closeBgMusic);        
    }


    private  box(){
    //    console.log('box_in');
    }

    private shop(){
       
    }

    private recycle(){
        // console.log('recycle');        
    }

}