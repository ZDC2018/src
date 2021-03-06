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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this._stageWidth = egret.MainContext.instance.stage.stageWidth;
        _this._stageHeight = egret.MainContext.instance.stage.stageHeight;
        _this._loadingBackGround = new egret.Bitmap();
        _this._loadingLogo = new egret.Bitmap();
        _this._loadingBar = new egret.Bitmap();
        _this._loadingBarBase = new egret.Bitmap();
        _this._loadingBarCar = new egret.Bitmap();
        _this.loadImage();
        return _this;
    }
    LoadingUI.prototype.loadImage = function () {
        var imageLoader = new egret.ImageLoader();
        imageLoader.addEventListener(egret.Event.COMPLETE, this.createView, this);
        imageLoader.load("resource/res/ui/loading_base.png");
    };
    LoadingUI.prototype.createView = function (evt) {
        //console.log("Loading背景图")
        //背景图
        var imageLoader = evt.currentTarget;
        var texture = new egret.Texture();
        texture._setBitmapData(imageLoader.data);
        this._loadingBackGround = new egret.Bitmap(texture);
        // //console.log(imageLoader.data);
        this._loadingBackGround.width = this._stageWidth;
        this._loadingBackGround.height = this._stageHeight;
        this.addChild(this._loadingBackGround);
        var image0Loader = new egret.ImageLoader();
        image0Loader.addEventListener(egret.Event.COMPLETE, this.createView1, this);
        image0Loader.load("resource/res/ui/loading_logo.png");
        this.addTextField();
    };
    LoadingUI.prototype.createView1 = function (evt) {
        //console.log("Loading_logo图")
        //背景图
        var image0Loader = evt.currentTarget;
        var texture = new egret.Texture();
        texture._setBitmapData(image0Loader.data);
        // //console.log(image0Loader.data);
        this._loadingLogo = new egret.Bitmap(texture);
        // this._loadingLogo.width =  GameData.stageW*0.95;
        // this._loadingLogo.height = this._loadingLogo.width*1.167;
        // this._loadingLogo.x = (GameData.stageW-this._loadingLogo.width)/2;
        // this._loadingLogo.y = this._loadingLogo.x*2;
        this.addChild(this._loadingLogo);
        var image1Loader = new egret.ImageLoader();
        image1Loader.addEventListener(egret.Event.COMPLETE, this.createView2, this);
        image1Loader.load("resource/res/ui/loading_march_01.png");
    };
    LoadingUI.prototype.createView2 = function (evt) {
        //进度条背景
        var image1Loader = evt.currentTarget;
        var texture1 = new egret.Texture();
        texture1._setBitmapData(image1Loader.data);
        this._loadingBarBase = new egret.Bitmap(texture1);
        this._loadingBarBase.width = this._stageWidth * 0.61;
        this._loadingBarBase.height = this._stageWidth * 0.073;
        this._loadingBarBase.x = (this._stageWidth - this._loadingBarBase.width) / 2;
        this._loadingBarBase.y = this._stageHeight * 3 / 4 - this._loadingBarBase.height;
        this.addChild(this._loadingBarBase);
        var image2Loader = new egret.ImageLoader();
        image2Loader.addEventListener(egret.Event.COMPLETE, this.createView3, this);
        image2Loader.load("resource/res/ui/loading_march_02.png");
    };
    LoadingUI.prototype.createView3 = function (evt) {
        //进度条
        var image2Loader = evt.currentTarget;
        var texture2 = new egret.Texture();
        texture2._setBitmapData(image2Loader.data);
        this._loadingBar = new egret.Bitmap(texture2);
        this._loadingBar.width = this._stageWidth * 0.61;
        this._loadingBar.height = this._stageWidth * 0.073;
        this._loadingBar.x = (this._stageWidth - this._loadingBar.width) / 2;
        this._loadingBar.y = this._stageHeight * 3 / 4 - this._loadingBar.height;
        this.addChild(this._loadingBar);
        var image3Loader = new egret.ImageLoader();
        image3Loader.addEventListener(egret.Event.COMPLETE, this.createView4, this);
        image3Loader.load("resource/res/ui/loading_march_03.png");
    };
    LoadingUI.prototype.createView4 = function (evt) {
        //进度条卡车
        var image3Loader = evt.currentTarget;
        var texture3 = new egret.Texture();
        texture3._setBitmapData(image3Loader.data);
        this._loadingBarCar = new egret.Bitmap(texture3);
        this._loadingBarCar.x = (this._stageWidth - this._loadingBar.width) / 2;
        this._loadingBarCar.y = this._stageHeight * 3 / 4 - this._loadingBar.height * 1.78;
        var barMask = new egret.Rectangle(0, 0, 0, this._loadingBar.height);
        this._loadingBar.mask = barMask;
        this.addChild(this._loadingBarCar);
    };
    LoadingUI.prototype.addTextField = function () {
        //载入百分比
        this.textField = new egret.TextField();
        this.textField.x = 0;
        this.textField.y = this._stageHeight * 3 / 4 + this.textField.height + 50;
        this.textField.width = this._stageWidth;
        this.textField.height = 100;
        this.textField.textAlign = egret.HorizontalAlign.CENTER;
        this.textField.fontFamily = "黑体";
        this.textField.size = 30;
        this.textField.text = "";
        this.addChild(this.textField);
        //健康游戏忠告
        var adviceText = new egret.TextField();
        adviceText.x = 0;
        adviceText.y = this._stageHeight - this._stageWidth / 4;
        adviceText.width = this._stageWidth;
        adviceText.textAlign = egret.HorizontalAlign.CENTER;
        adviceText.fontFamily = "黑体";
        adviceText.size = 20;
        adviceText.text = "抵制不良游戏，拒绝盗版游戏。\n注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。\n合理安排时间，享受健康生活。";
        this.addChild(adviceText);
    };
    LoadingUI.prototype.setProgress = function (current, total) {
        // //console.log("载入进度条");
        var barMask = new egret.Rectangle(0, 0, current / total * this._loadingBar.width, this._loadingBar.height);
        this._loadingBar.mask = barMask;
        this._loadingBarCar.x = this._loadingBar.x + current / total * this._loadingBar.width - this._loadingBarCar.width / 2;
        this.textField.text = "\u52A0\u8F7D\u4E2D..." + Math.floor((current / total) * 100) + '%';
        // this.textField.text = `加载中...`;
        // this.textField.text = `加载中...${current}/${total}`;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI");
//# sourceMappingURL=LoadingUI.js.map