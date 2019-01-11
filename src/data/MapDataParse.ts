class MapDataParse {
	/**
	 * 根据外部加载的数据来创建地图数据,数组中存放着无法放置内容得区域，该区域数值均为-1
	 */
	public static createMapData(val:Array<number>):void{
		let len:number = val.length;
		GameData.unmapnum = len;
		let index:number = 0;
		// console.log(val);
		// console.log(len);
		
		for(let i=0;i<len;i++){
			index = val[i];
			let m = Math.floor(index/GameData.MaxColumn);
			let n = index % GameData.MaxColumn;
			// console.log(index);
			// console.log( m+ "  "+ n);
			GameData.mapData[m][n] = -2;
			// GameData.availableMapId.push(index);//将可以使用的位置存入数组。
		}
		// console.log("地图数据解析："+GameData.mapData);

		GameData.currentElementNum = GameData.MaxColumn * GameData.MaxRow -len;
	}


}