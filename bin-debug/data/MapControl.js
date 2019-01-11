var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MapControl = (function () {
    function MapControl() {
    }
    /**
     * 创建全地图元素
    */
    MapControl.prototype.createElementAllMap = function () {
        this.createAllMap2();
    };
    /**
     * 创建一个空地图
     * 游戏开始时调用
     * Date:2018/08/11
     * author:bigfoot
    */
    MapControl.prototype.createAllMap2 = function () {
        var len = GameData.MaxColumn * GameData.MaxRow;
        var type = "b";
        var id = 0;
        var mapDataArray = RES.getRes("map_data_json");
        var mapData;
        if (GameData.currentLevel < 10) {
            mapData = mapDataArray[GameData.currentLevel - 1];
        }
        else {
            mapData = mapDataArray[0];
        }
        var mapNumber = mapData.map.length;
        var mapArr = mapData.addmap;
        // console.log("创建空地图:");
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                if (GameData.mapData[i][t] != -1) {
                    if (GameData.oldElements.length != 0) {
                        // console.log("创建空地图"+GameData.oldElements[0].id);					
                        // console.log("创建空地图"+GameData.oldElements[0].location);					
                        // console.log("创建空地图"+GameData.oldElements[0].type);					
                        // console.log(GameData.oldElements[0]);					
                        // id = GameData.unusedElements[0];
                        id = GameData.oldElements[0].id;
                        GameData.elements[id].type = "b0";
                        GameData.elements[id].type = GameData.oldElements[0].type;
                        // GameData.elements[id].location = i*GameData.MaxRow+t;
                        if (GameData.oldElements[0].location != 0) {
                            GameData.elements[id].location = GameData.oldElements[0].location;
                            GameData.elements[id].grade = GameData.oldElements[0].grade;
                            GameData.elements[id].time = GameData.oldElements[0].time;
                            // console.log("创建空地图old不等于0"+GameData.oldElements[0].location);
                            // console.log("创建空地图id"+id);
                            // console.log("创建空地图i:"+i);
                            // console.log("创建空地图t:"+t);
                            // console.log("创建空地图location:"+GameData.elements[id].location);	
                        }
                        else if ((GameData.oldElements[0].location == 0) && (GameData.oldElements[0].type.length !== 0)) {
                            GameData.elements[id].location = GameData.oldElements[0].location;
                            GameData.elements[id].grade = GameData.oldElements[0].grade;
                            GameData.elements[id].time = GameData.oldElements[0].time;
                            // console.log("创建空地图old等于0"+GameData.oldElements[0].location);
                            // console.log("创建空地图id"+id);
                            // console.log("创建空地图i:"+i);
                            // console.log("创建空地图t:"+t);
                            // console.log("创建空地图location:"+GameData.elements[id].location);	
                        }
                        else {
                            GameData.elements[id].location = mapArr[0];
                            GameData.elements[id].type = "b";
                            mapArr.shift();
                            // console.log("创建空地图新增id"+id);
                            // console.log("创建空地图i:"+i);
                            // console.log("创建空地图t:"+t);
                            // console.log("创建空地图location:"+GameData.elements[id].location);	
                        }
                        GameData.oldElements.shift();
                    }
                    else {
                        id = GameData.unusedElements[0];
                        GameData.elements[id].type = "b";
                        GameData.elements[id].location = i * GameData.MaxColumn + t; //修改为4*5以后计算方式改变了，发现不对改回去
                        GameData.unusedElements.shift();
                    }
                    // console.log("创建空地图map:"+GameData.mapData[i][t]);
                    GameData.mapData[i][t] = -2;
                    if (GameData.elements[id].type != "b0" && GameData.elements[id].grade == 0) {
                        GameData.availableMapId.push(id); //将可以使用的位置存入数组。
                    }
                    // console.log("创建空地图availableMapId:"+GameData.availableMapId);					
                }
                else {
                    GameData.mapData[i][t] = -1;
                }
            }
        }
        // console.log("创建空地图map:"+GameData.mapData);
    };
    /**
     * 随机创建一个类型元素
     */
    MapControl.prototype.createType = function () {
        return GameData.elementTypes[Math.floor(Math.random() * GameData.elementTypes.length)].toString();
    };
    /**
     * 针对某一个数据元素更新它得类型
     */
    MapControl.prototype.changeTypeByID = function (id) {
        GameData.elements[id].type = this.createType();
    };
    /**
     * 根据当前删除得地图元素，刷新所有元素得位置
     */
    MapControl.prototype.updateMapLocation = function () {
    };
    return MapControl;
}());
__reflect(MapControl.prototype, "MapControl");
//# sourceMappingURL=MapControl.js.map