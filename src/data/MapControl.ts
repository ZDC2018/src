class MapControl {
	public constructor() {
	}

	/** 
	 * 创建全地图元素
	*/
	public createElementAllMap(){
		this.createAllMap2();
	}
	/**
	 * 创建一个空地图
	 * 游戏开始时调用
	 * Date:2018/08/11
	 * author:bigfoot
	*/
	public createAllMap2(){
		let len:number = GameData.MaxColumn * GameData.MaxRow;
		let type:string = "b";
		let id:number =0;
		let mapDataArray =  RES.getRes("map_data_json");
		let mapData:any;
		if (GameData.currentLevel < 10 ){
			mapData = mapDataArray[GameData.currentLevel-1];
		}else{
			mapData = mapDataArray[0];
		}
		let mapNumber:number = mapData.map.length;
		let mapArr:Array<number> = mapData.addmap;
		// console.log("创建空地图:");
		for (let i = 0; i < GameData.MaxRow; i++) {
			for (let t = 0; t < GameData.MaxColumn; t++) {
				if(GameData.mapData[i][t]!=-1){
					if(GameData.oldElements.length != 0){
						// console.log("创建空地图"+GameData.oldElements[0].id);					
						// console.log("创建空地图"+GameData.oldElements[0].location);					
						// console.log("创建空地图"+GameData.oldElements[0].type);					
						// console.log(GameData.oldElements[0]);					
						// id = GameData.unusedElements[0];
						id = GameData.oldElements[0].id;
						GameData.elements[id].type = "b0";
						GameData.elements[id].type =  GameData.oldElements[0].type;
						// GameData.elements[id].location = i*GameData.MaxRow+t;
						if(GameData.oldElements[0].location != 0){
							GameData.elements[id].location = GameData.oldElements[0].location;
							GameData.elements[id].grade = GameData.oldElements[0].grade;
							GameData.elements[id].time = GameData.oldElements[0].time;
							// console.log("创建空地图old不等于0"+GameData.oldElements[0].location);
							// console.log("创建空地图id"+id);
							// console.log("创建空地图i:"+i);
							// console.log("创建空地图t:"+t);
							// console.log("创建空地图location:"+GameData.elements[id].location);	
						}else if( (GameData.oldElements[0].location == 0) && (GameData.oldElements[0].type.length !== 0)){
							GameData.elements[id].location = GameData.oldElements[0].location;
							GameData.elements[id].grade = GameData.oldElements[0].grade;
							GameData.elements[id].time = GameData.oldElements[0].time;							
							// console.log("创建空地图old等于0"+GameData.oldElements[0].location);
							// console.log("创建空地图id"+id);
							// console.log("创建空地图i:"+i);
							// console.log("创建空地图t:"+t);
							// console.log("创建空地图location:"+GameData.elements[id].location);	
						}else{
							GameData.elements[id].location = mapArr[0];
							GameData.elements[id].type = "b";
							mapArr.shift();
							// console.log("创建空地图新增id"+id);
							// console.log("创建空地图i:"+i);
							// console.log("创建空地图t:"+t);
							// console.log("创建空地图location:"+GameData.elements[id].location);	
						}
						
						GameData.oldElements.shift();
					}else{
						id = GameData.unusedElements[0];
						GameData.elements[id].type = "b";
						GameData.elements[id].location = i*GameData.MaxColumn+t;//修改为4*5以后计算方式改变了，发现不对改回去
						GameData.unusedElements.shift();
					}
					
					// console.log("创建空地图map:"+GameData.mapData[i][t]);
					GameData.mapData[i][t]= -2;
					if (GameData.elements[id].type != "b0" && GameData.elements[id].grade == 0){
							GameData.availableMapId.push(id);//将可以使用的位置存入数组。
					}
					// console.log("创建空地图availableMapId:"+GameData.availableMapId);					
				}else{
					GameData.mapData[i][t]= -1;
				}
			}
		}
		// console.log("创建空地图map:"+GameData.mapData);
	}


	/**
	 * 随机创建一个类型元素
	 */
	private createType():string{		
		return GameData.elementTypes[Math.floor(Math.random()*GameData.elementTypes.length)].toString();
	}

	/**
 	 * 针对某一个数据元素更新它得类型 
	 */
    public changeTypeByID(id:number)
    {
        GameData.elements[id].type = this.createType();
    }
	/**
	 * 根据当前删除得地图元素，刷新所有元素得位置
	 */
	public updateMapLocation()
	{

		

	}
}