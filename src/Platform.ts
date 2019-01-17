/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    getUserInfo(x:number,y:number,width:number,heigth:number): Promise<any>;

    login(): Promise<any>

    showShareMenu(): Promise<any>;
    share(query:string): Promise<any>;
    updateShareMenu(withticket): Promise<any>
    //带标志发送
    shareApp(title:string,imgurl:string,query:string): Promise<any>


    createUserInfoButton():Promise<any>;
    destroyUserInfoButton():Promise<any>;

    //广告
    createRewardedVideoAd(id:string):Promise<any>; 
    rewardedVideoAdOnClose(rvad:any):Promise<any>; 
    showBannerAD(left:number,top:number,width:number,id:string):Promise<any>; 

    //存储排行数据
    setUserCloudStorage(kvobj:any):void;

    onShow(callback: Function, obj: Object):void; 
    onHide(callback: Function, obj: Object):void; 
    getLaunchOptionsSync(callback: Function, obj: Object):void; 
    postGameData(dbname:string,userGameData:Object)
    getGameData(dbname:string)
    //音频
    createInnerAudioContext(bgMusic:string):Promise<any>; 

    getUserCloudStorage();
    exitGame();
}

class DebugPlatform implements Platform {
    async getUserInfo(x:number,y:number,width:number,heigth:number) {
        // return { nickName: "username" }
    }
    async login() {

    }
    async showShareMenu() {

    }
    async share(query:string) {
        // console.log("打开share");
    }
    async shareApp(title:string,imgurl:string,query:string): Promise<any>{}

    async updateShareMenu(withticket): Promise<any>{}
    
    async createUserInfoButton(){
       
    }
    async createRewardedVideoAd(id:string){
       
    }
    async rewardedVideoAdOnClose(){
       
    }
    async destroyUserInfoButton(){

    }
    async showBannerAD(left:number,top:number,width:number,id:string){
    }

    async setUserCloudStorage(kvobj:any){
        
    }
    async onShow(callback: Function, obj: Object){
        // console.log("打开onShow");
    }

    async onHide(callback: Function, obj: Object){
    }
    async getLaunchOptionsSync(callback: Function, obj: Object){

    }
    async postGameData(dbname:string,userGameData:Object){

    }
    async getGameData(dbname:string){

    }
    
    async createInnerAudioContext(bgMusic:string):Promise<any>{

    }
    async getUserCloudStorage(){
        
    }
    async exitGame(){

    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}



declare let platform: Platform;

declare interface Window {

    platform: Platform
}





