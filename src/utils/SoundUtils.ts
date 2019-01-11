/**
 * Created by Administrator on 2014/10/16.
 */
class SoundUtils{

    private static _instance:SoundUtils;
    private bgSound:any;//背景音乐
    private levelUpSound:SoundBase;//城市升级音效
    private newLandSound:SoundBase;//获得新地块
    private clickSound:SoundBase;//点击音效
    private newHouseSound:SoundBase;
    private houseCoinSound:SoundBase;
    private closeSound:SoundBase;
    private mergeSound:SoundBase;
    private boxDownSound:SoundBase;
    private hitBoxSound:SoundBase;
    private openBoxSound:SoundBase;
    private openGiftBoxSound:SoundBase;

    public static instance():SoundUtils
    {
        return this._instance == null ? this._instance = new SoundUtils() : this._instance;
    }

    constructor()
    {
        if(SoundUtils._instance != null)
            throw new Error("singleton");
    }

    public initSound():void
    {
        // this.bgSound = new SoundBase(GameData.bgMusic);
        this.bgSound = platform.createInnerAudioContext(GameData.bgMusic);
        this.levelUpSound = new SoundBase("sound_level_up_mp3");
        this.newLandSound = new SoundBase("sound_land_new_mp3");
        this.clickSound  = new SoundBase("sound_click_mp3");
        this.newHouseSound = new SoundBase("sound_house_new_mp3");
        this.houseCoinSound = new SoundBase("sound_house_coin_mp3");
        this.closeSound = new SoundBase("sound_close_mp3");
        this.mergeSound = new SoundBase("sound_house_merge_mp3");
        this.boxDownSound = new SoundBase("sound_box_down_mp3");
        this.openBoxSound = new SoundBase("sound_openbox_mp3");
        this.openGiftBoxSound = new SoundBase("sound_opengiftbox_mp3");
    }

    public initBgSound():void{
        // this.bgSound = new SoundBase(GameData.bgMusic);
        this.bgSound = platform.createInnerAudioContext(GameData.bgMusic);
    }

    public playBg():void
    {
		//console.log("播放背景音乐")
        if(GameData.closeBgMusic){
            this.bgSound.pause();
            return;
        }
        this.bgSound.loop = true;
        this.bgSound.play();
		// this.bgSound.setLoop(-1);
    }
    public stopBg():void
    {
        this.bgSound.pause();
    }

    public playLevelUpSound():void{
        if(GameData.closeMusic) return;
        this.levelUpSound.play();
    }
    public playNewLandSound():void{
        if(GameData.closeMusic) return;
        this.newLandSound.play();
    }
    public playClickSound():void{
        if(GameData.closeMusic) return;
        this.clickSound.play();
    }
    public playNewHouseSound():void{
        if(GameData.closeMusic) return;
        this.newHouseSound.play();
    }
    public playHouseCoinSound():void{
        if(GameData.closeMusic) return;
        this.houseCoinSound.play();
    }
    public playCloseSound():void{
        if(GameData.closeMusic) return;
        this.closeSound.play();
    }
    public playMergeSound():void{
        if(GameData.closeMusic) return;
        this.mergeSound.play();
    }
    public playBoxDownSound():void{
        if(GameData.closeMusic) return;
        this.boxDownSound.play();
    }
    public playHitBoxSound():void{
        if(GameData.closeMusic) return;
        this.clickSound.play();
    }
    public playOpenBoxSound():void{
        if(GameData.closeMusic) return;
        this.openBoxSound.play();
    }
    public playOpenGiftBoxSound():void{
        if(GameData.closeMusic) return;
        this.openGiftBoxSound.play();
    }
    
  
    
}