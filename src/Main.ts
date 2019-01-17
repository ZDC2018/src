//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;
    private _scene:GameSceneView;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        GameData.scentWidth = this.stage.stageWidth;
        GameData.scentHeight = this.stage.stageHeight;
        if (GameData.currentLevel <= 5){
			this.sendGetRequest();
		}else{
            GameLogic.closeShare = false;
        }
        // //console.log(GameData.scentWidth);
        // //console.log(GameData.scentHeight);
        //初始化Resource资源加载库
        //initiate Resource loading library
        
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载game资源组。
     * configuration file loading is completed, start to pre-load the game resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
        this.loadingView.addTextField();
        // 加载开放域资源
        const platform:any = window.platform;
        platform.openDataContext.postMessage({
            command:'loadRes'
        });

        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
        //     //console.log('输出主域点击事件');
        // }, this)
    }

    /**
     * game资源组加载完成
     * game resource group is loaded
     */
    private async onResourceLoadComplete(event:RES.ResourceEvent) {
        //console.log("资源加载完成")
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.setMaxLoadingThread(1)
            await  RES.loadGroup("sound",1);
            this.createGameScene();
            await platform.login();
            await platform.showShareMenu();
            // const userInfo = await platform.getUserInfo(20,GameData.stageH-GameData.girdWidth-10,GameData.girdWidth,GameData.girdWidth);
            // //console.log(userInfo);
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        //console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        //console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     *  资源组加载进度
     * Loading process of game resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

        /**
     * 创建游戏场景
     */
    // private createGameScene():void{
        
		
    //     var maskRect:egret.Rectangle=new egret.Rectangle();
    //     maskRect.width = this.stage.stageWidth;
    //     maskRect.height = this.stage.stageHeight;
    //     maskRect.y = 0;

    //     this._scene = new GameSceneView();
    //     this._scene.y = 0;
    //     this._scene.width = this.stage.stageWidth;
    //     this._scene.height = this.stage.stageHeight;
    //     this._scene.mask = maskRect;
    //     this.addChild(this._scene);
    // }

    /**-------------------------------------------------------------------------------------------------------------- */
    private _timeout:number;
    private sendGetRequest():void {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("https://wxgame.fscy.net.cn/shareController.php",egret.HttpMethod.GET);
        request.send();
        this._timeout = egret.setTimeout(function(){
            request.abort();
            GameLogic.closeShare = true;
        },this,30000)
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }
    private onGetComplete(event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data : ",request.response);
        egret.clearTimeout(this._timeout);
		if( CommonFuction.compareVersion(GameLogic.version,request.response) == 0){
			GameLogic.closeShare = true;
		}else{
			GameLogic.closeShare = false;
		}
		//  console.log("get data : ",GameLogic.closeShare);
    }
    private onGetIOError(event:egret.IOErrorEvent):void {
        // console.log("get error : ");
        // console.log( event);
        GameLogic.closeShare = true;
    }
    private onGetProgress(event:egret.ProgressEvent):void {
        // console.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
    }
    private _gl:GameLogic;


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        let gameLayer:egret.Sprite=new egret.Sprite();
        this.addChild(gameLayer);
        this._gl =new GameLogic(gameLayer);
    }

  
}


