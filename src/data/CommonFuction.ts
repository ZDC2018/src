class CommonFuction{
    	//加法
public static jia(a, b) {
        // //console.log("加法:"+ a);
        // //console.log("加法:"+ b);
		//把a,b放进zong数组
		let  zong = new Array();
        zong = [String(a), String(b)];
		//创建fen数组
		var fen = [];
		//把a,b较大的放在前面
		zong = this.getMax(zong[0], zong[1]);
		//把zong数组里面的元素分成单个数字
		zong[0] = zong[0].split('');
		zong[1] = zong[1].split('');
		//创建加0变量
		var jialing;
		//判断两个参数是否相同长度
		if(!(zong[0].length == zong[1].length)) {
			//创建0
			jialing = new Array(zong[0].length-zong[1].length+1).join('0');
			//把0放进zong[1]前面
			zong[1] = jialing.split('').concat(zong[1]);
		}
		//创建补充上一位的数字
		var next = 0;
		//从个位数起对应单个计算
		for(var i=(zong[0].length-1); i>=0; i--) {
			//求和
			var he = Number(zong[0][i]) + Number(zong[1][i]) + next;
			//把求和的个位数先放进数组
			fen.unshift(he%10);
			//把求和的十位数放进补充上一位的数字，留在下一次循环使用
			next = Math.floor(he/10);
			//判断最后一次如果求和的结果为两位数则把求和的十位数加在最前面
			if(i == 0 && !(next==0)) {
				fen.unshift(next);										
			}						
		}
		//把最后的结果转化成字符串
		var result = fen.join('');
		//返回字符串
        // //console.log("加法:"+ result);        
		return result;
	}
 
	//减法
	public static  jian(a, b) {
        // //console.log("减法:"+ a);
        // //console.log("减法:"+ b);
		let zong = new Array();
        zong = [String(a), String(b)];
		var fen = [];
		zong = this.getMax(zong[0], zong[1]);
		if(zong.length == 3) {
			// return false;
		}
		zong[0] = zong[0].split('');
		zong[1] = zong[1].split('');
		var jialing;
		if(!(zong[0].length == zong[1].length)) {
			jialing = new Array(zong[0].length-zong[1].length+1).join('0');
			zong[1] = jialing.split('').concat(zong[1]);
		}
		var next = 0;
		for(var i=(zong[0].length-1); i>=0; i--) {
			var cha = Number(zong[0][i]) - Number(zong[1][i]) - next;
			next = 0;
			if(cha<0) {
				cha = cha + 10;
				next = 1;
			}
			fen.unshift(cha%10);					
		}
		var result = fen.join('');
		if(result[0] == '0') {
            result = this.shanchuling(result).join('');
		}
        // //console.log("减法:"+ result);
		return result;	
	}
 
	//乘法
    public static cheng(a, b):string {
        let zong = new Array();
        zong = [String(a), String(b)];
		var fen = [];
		zong = this.getMax(zong[0], zong[1]);
 
		zong[0] = zong[0].split('');
		zong[1] = zong[1].split('');
		//获取b的长度,处理乘法分配率的乘法
		for(var j=(zong[1].length-1); j>=0; j--) {
			var next = 0;
			var fentemp = []; 
			var jialing = '';
			//获取a的长度处理乘法
			for(var i=(zong[0].length-1); i>=0; i--) {
				var ji = Number(zong[0][i]) * Number(zong[1][j]) + next;
				fentemp.unshift(ji%10);
				next = Math.floor(ji/10);
				if(i == 0 && !(next==0)) {
					fentemp.unshift(next);										
				}
			}
			//后面添加0
			jialing = new Array((zong[1].length-(j+1))+1).join('0');
			fentemp.push(jialing);			
			fen[j] = fentemp.join('');				
		}
		//处理乘法后的求和
		var cishu = fen.length;
		for(var k=1; k<cishu; k++) {
			var hebing = this.jia(fen[0], fen[1]);
			fen.splice(0,2,hebing);
		}
		
		var result = fen.join('');
		if(result[0] == '0') {
			result = this.shanchuling(result);
		}	
        // //console.log("乘法:"+ result);
		return result;
	}
	
	/**
	 * 除法
	 */
	public static chu(a,b){
		var alen=a.length,blen=b.toString().length;
		var quotient=0,remainder=0;
		var result=[],temp=0 ;
		for(var i=0;i<alen;i++){
			temp=remainder*10+parseInt(a[i]);
			if(temp<b){
				remainder=temp;
				result.push(0);
			}else{
				quotient=Math.floor(temp/b);
				remainder=temp%b;
				result.push(quotient);
			}
			
		}
		// return [result.join("").replace(/\b(0+)/gi,""),remainder];//结果返回[商，余数]
		return result.join("").replace(/\b(0+)/gi,"");//结果返回商
	}

	//获取最大值
	public static getMax(a, b) {
		var result = [a, b];
		//如果a长度小于b长度
		if(a.length<b.length)
		{
			//b放前面
			result[0] = b;
			result[1] = a;
			//返回result长度为3，为了减法的不够减而准备
			result[2] = 'not';
			//返回最终数组
			return result;
		}
		//如果a长度等于b长度
		if(a.length == b.length) {
			//循环对比a,b里面的单个元素
			for(var i=0; i<a.length; i++) {
				if(result[0][i]>result[1][i]) {
					result[0] = a;
					result[1] = b;
					return result;
				}
				if(result[0][i]<result[1][i]) {
					result[0] = b;
					result[1] = a;
					result[2] = 'not';
					return result;					
				}
				//假如全部相等，当最后一个元素，以上条件都不执行，则执行默认的返回结果
				if(i == a.length-1) {
					return result;
				}				
			}
		}
		if(a.length>b.length) {
			return result;				
		}
	}
    /**
     * a与b比大小
     * a<b返回false
     * 其余返回true
     */

    public static compareMax(a:any,b:any):boolean{
		// //console.log("比较:"+ a);
		// //console.log("比较:"+ b);
		// //console.log(typeof(b));
		a = String(a).split('');
		b = String(b).split('');
        let result=[a,b];
        let res:boolean;
		//如果a长度小于b长度
		if(a.length<b.length)
		{
			return false;
		}
		//如果a长度等于b长度
		if(a.length == b.length) {
			
			//循环对比a,b里面的单个元素
			for(var i=0; i<a.length; i++) {
				if(result[0][i]>result[1][i]) {
					result[0] = a;
					result[1] = b;
					return true;
				}
				if(result[0][i]<result[1][i]) {
					result[0] = b;
					result[1] = a;
					result[2] = 'not';
					return false;					
				}
				//假如全部相等，当最后一个元素，以上条件都不执行，则执行默认的返回结果
				if(i == a.length-1) {
					res = true;
				}				
			}
		}
		if(a.length>b.length) {
			return true;				
		}
        // //console.log(res);
        return res;
    }
 
	//删除字符串前面多余的0
	public static shanchuling(result) {
		//首先判断是否全部都是0，是的话直接返回一个0
		if(result == 0) {
			result = '0';
			//返回最终字符串
			return result;
		}
		//把字符串分割成数组
		result = result.split('');	
		//获取数组长度
		var hebing = result.length;
		for(var j=0; j<hebing; j++) {
			//判断数组首位是否为0
			if(result[0] == 0) {
				//把数组首位删掉
				result.splice(0,1);
			}
			else {
				//删除完了就跳出循环
				break;
			}
		}
		//返回最终字符串
		return result;		
	}

	/**	
	 * 数字去零计算
	 */
	public static numZero(num:any):string{
		console.log("数字去0计算"+num);
		let numString:string;
		if(typeof(num) == "number"){
			numString = Math.floor(num).toString();
		}else{
			// numString = num.split(".")[0];
			numString = num;
		}
		let numLength:number = numString.length;
		
		let zeroNumber:number = Math.floor( (numLength-1) / 3);
		if (zeroNumber > 0){
				numString = numString.slice(0,-1*zeroNumber*3) + "."+numString.slice(numLength-zeroNumber*3,numLength-zeroNumber*3+2)+ GameData.zeroConfigArr[zeroNumber - 1].company;		
		}else{
			numString = num.toString();
		}
		return numString;
	}

	public static compareVersion(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		var len = Math.max(v1.length, v2.length)
		
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		
		for (var i = 0; i < len; i++) {
			var num1 = parseInt(v1[i])
			var num2 = parseInt(v2[i])
		
			if (num1 > num2) {
			return 1
			} else if (num1 < num2) {
			return -1
			}
		}
		return 0
	}
	
}