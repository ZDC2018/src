var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Administrator on 2014/10/16.
 */
var SoundUtils = (function () {
    function SoundUtils() {
        if (SoundUtils._instance != null)
            throw new Error("singleton");
    }
    SoundUtils.instance = function () {
        return this._instance == null ? this._instance = new SoundUtils() : this._instance;
    };
    SoundUtils.prototype.initSound = function () {
        this.bgSound = new SoundBase(GameData.bgMusic);
        this.levelUpSound = new SoundBase("sound_level_up_mp3");
        this.newLandSound = new SoundBase("sound_land_new_mp3");
        this.clickSound = new SoundBase("sound_click_mp3");
        this.newHouseSound = new SoundBase("sound_house_new_mp3");
        this.houseCoinSound = new SoundBase("sound_house_coin_mp3");
        this.closeSound = new SoundBase("sound_close_mp3");
        this.mergeSound = new SoundBase("sound_house_merge_mp3");
        this.boxDownSound = new SoundBase("sound_box_down_mp3");
        this.openBoxSound = new SoundBase("sound_openbox_mp3");
        this.openGiftBoxSound = new SoundBase("sound_opengiftbox_mp3");
    };
    SoundUtils.prototype.initBgSound = function () {
        this.bgSound = new SoundBase(GameData.bgMusic);
    };
    SoundUtils.prototype.playBg = function () {
        //console.log("播放背景音乐")
        if (GameData.closeBgMusic) {
            this.bgSound.pause();
            return;
        }
        this.bgSound.play();
        this.bgSound.setLoop(-1);
    };
    SoundUtils.prototype.stopBg = function () {
        this.bgSound.pause();
    };
    SoundUtils.prototype.playLevelUpSound = function () {
        if (GameData.closeMusic)
            return;
        this.levelUpSound.play();
    };
    SoundUtils.prototype.playNewLandSound = function () {
        if (GameData.closeMusic)
            return;
        this.newLandSound.play();
    };
    SoundUtils.prototype.playClickSound = function () {
        if (GameData.closeMusic)
            return;
        this.clickSound.play();
    };
    SoundUtils.prototype.playNewHouseSound = function () {
        if (GameData.closeMusic)
            return;
        this.newHouseSound.play();
    };
    SoundUtils.prototype.playHouseCoinSound = function () {
        if (GameData.closeMusic)
            return;
        this.houseCoinSound.play();
    };
    SoundUtils.prototype.playCloseSound = function () {
        if (GameData.closeMusic)
            return;
        this.closeSound.play();
    };
    SoundUtils.prototype.playMergeSound = function () {
        if (GameData.closeMusic)
            return;
        this.mergeSound.play();
    };
    SoundUtils.prototype.playBoxDownSound = function () {
        if (GameData.closeMusic)
            return;
        this.boxDownSound.play();
    };
    SoundUtils.prototype.playHitBoxSound = function () {
        if (GameData.closeMusic)
            return;
        this.clickSound.play();
    };
    SoundUtils.prototype.playOpenBoxSound = function () {
        if (GameData.closeMusic)
            return;
        this.openBoxSound.play();
    };
    SoundUtils.prototype.playOpenGiftBoxSound = function () {
        if (GameData.closeMusic)
            return;
        this.openGiftBoxSound.play();
    };
    return SoundUtils;
}());
__reflect(SoundUtils.prototype, "SoundUtils");
//# sourceMappingURL=SoundUtils.js.map