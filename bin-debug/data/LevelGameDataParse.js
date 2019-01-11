var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LevelGameDataParse = (function () {
    function LevelGameDataParse() {
    }
    /**
     * 针对当前关卡JSON数据，进行解析
     */
    LevelGameDataParse.parseLevelGameData = function (val) {
        // GameData.elementTypes = [0,1,2,3,4,5,6,7,8];
        if (!GameData.setSceneData) {
            if (val.city_map >= 5) {
                val.city_map = 5;
            }
            GameData.bgMusic = "sound_bg0" + val.city_map + "_mp3";
            GameData.levelBackgroundImageName = "scene_0" + val.city_map + "_back_png";
            GameData.levelFrontBackgroundImageName = "scene_0" + val.city_map + "_front_png";
            GameData.girdImageName = "scene_0" + val.city_map + "_base_small_png";
            GameData.girdLockImageName = "scene_0" + val.city_map + "_base_small_lock_png";
        }
        GameData.levelReqExp = val.up_exp;
        GameData.boxDownWeight = Number(val.down_weight);
        GameData.giftBoxHouseGrade = Number(val.seniorbox_lv);
    };
    return LevelGameDataParse;
}());
__reflect(LevelGameDataParse.prototype, "LevelGameDataParse");
//# sourceMappingURL=LevelGameDataParse.js.map