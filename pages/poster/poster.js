// pages/poster/poster.js
const app = getApp()
const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    canvasId: ['posters','poster'],
    canvasLeft: ['0', '0'],
    canvasIndex: 0,
    touchX: 0,
    openSettingModal: false
  },
  start(e){
    this.setData({
      touchX: e.changedTouches[0].x
    });
  },
  end(e) {
    var that = this;
    var dx = e.changedTouches[0].x - this.data.touchX;
    if(Math.abs(dx) < 20){
      this.setData({
        touchX: 0
      });
      return;
    }
    var indexChange = dx > 0? -1: 1;
    var newIndex = this.data.canvasIndex + indexChange;
    if (newIndex >= 0 && newIndex < this.data.canvasId.length){
      var systemInfo = wx.getSystemInfoSync();
      this.data.canvasLeft.forEach(function(item,index){
        that.data.canvasLeft[index] = (systemInfo.screenWidth - 280) / 2 + 280 * (index - newIndex) + 'px';
      })
      this.setData({
        canvasIndex: newIndex,
        canvasLeft: this.data.canvasLeft,
        touchX: 0
      });
    }
  },
  chooseBG(){
    const that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var ctx = wx.createCanvasContext('poster');
        var data = Object.assign({}, that.data.userInfo, { backgroundUrl: res.tempFilePaths[0]})
        that.setPosts(data,that)
      },
    })
  },
  savePoster(){
    var that = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        console.log('授权成功')
        var id = that.data.canvasId[that.data.canvasIndex];
        wx.canvasToTempFilePath({
          canvasId: id,
          success: function (ret) {
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: ret.tempFilePath,
              success: function (data) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (err) {
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                  console.log("当初用户拒绝，再次发起授权")
                  that.setData({
                    openSettingModal: true
                  })
                }
               
              }
            })
          }
        });
      },
      fail(){
        that.setData({
          openSettingModal: true
        })
      }
    })
  }, 
  onCancel(){
    this.setData({
      openSettingModal: false
    });
    const that = this;
    var systemInfo = wx.getSystemInfoSync();
    this.data.canvasLeft.forEach(function(item,index){
      that.data.canvasLeft[index] = (systemInfo.screenWidth - 280) / 2 + 280 * index + 'px';
    });
    this.setData(this.data);
    this.getCardInfo();
    this.setPostBg();
  },
  lookPost(e){
    var that = this;
    var px = e.changedTouches[0].clientX;
    var systemInfo = wx.getSystemInfoSync();
    if ((px >= (systemInfo.screenWidth - 280) / 2) && (px <= (systemInfo.screenWidth + 280) / 2)){
      var id = this.data.canvasId[this.data.canvasIndex];
      wx.canvasToTempFilePath({
        canvasId: id,
        success: function (res) {
          wx.previewImage({
            urls: [res.tempFilePath]
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var systemInfo = wx.getSystemInfoSync();
    this.data.canvasLeft.forEach(function(item,index){
      that.data.canvasLeft[index] = (systemInfo.screenWidth - 280) / 2 + 280 * index + 'px';
    });
    this.setData(this.data);
    this.getCardInfo();
    this.setPostBg();
  },
  onShow(){
  },
  setPostBg(){
    var systemInfo = wx.getSystemInfoSync();
    var ctx = wx.createCanvasContext('cover');
    ctx.beginPath();
    ctx.setFillStyle('#f1f3f5');
    ctx.rect(0, 0, systemInfo.screenWidth + 1, 1000);
    ctx.fill();
    ctx.clearRect((systemInfo.screenWidth - 280) / 2, 0, 280, 574)
    
    ctx.draw();
  },
  getCardInfo() {
    const that = this;
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_INFO), "GET", { wxappId: wxappId }, function (json) {
      if (json.status == "success") {
        if (!!json.data) {
          that.setData({
            codeUrl: CONFIG.SERVER + json.data.qrcodeUrl,
            userInfo: json.data
          });
          that.setPost(json.data, that);
          that.setPosts(json.data, that);
        }
      } else {
        wx.showModal({
          title: "错误",
          content: json.message || ' ',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    })
  },
  setPost(obj = {},that){
    let backgroundUrl = '../../image/poetryWay.jpg';
    if (obj.imgUrl.indexOf('http') == -1) {
      var avatarUrl = CONFIG.SERVER + obj.imgUrl;
    }else{
      var avatarUrl = obj.imgUrl;
    }
    let name = obj.name || '无';
    let post = obj.post || '无';
    let mobile = obj.mobile || '无';
    let company = obj.company || '无';
    let email = obj.email || false;
    let address = (obj.city + obj.address) || '无';
    obj.qrcodeUrl = obj.qrcodeUrl || '';
    if (obj.qrcodeUrl.indexOf('http') == -1){
      var codeUrl = CONFIG.SERVER + obj.qrcodeUrl;
    }else{
      var codeUrl = obj.qrcodeUrl;
    }
    // 使用 wx.createContext 获取绘图上下文 context
    
    var ctx = wx.createCanvasContext('poster');
    ctx.clearRect(0, 0, 280, 480);
    //设置海报背景

    //画小东西
    ctx.beginPath();
    ctx.rect(0, 0, 280, 480);
    ctx.setFillStyle('#fff');
    ctx.fill();
    ctx.drawImage(backgroundUrl, 10, 10, 260, 200)
    //写字体
    ctx.setFontSize(35)
    ctx.setFillStyle('rgba(255,255,255,.9)');
    //字体 日
    let dates = new Date().getDate();
    dates =  dates < 10 ? '0' + dates : dates;
    ctx.fillText(dates, 20, 55);
    //字体 月
    ctx.setFontSize(15)
    let monthFontList = ['壹', '贰', '叄', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '拾壹', '拾贰'];
    let months = monthFontList[new Date().getMonth()] + '月';
    ctx.fillText(months, 70, 40);
    //字体  星期
    ctx.setFontSize(14)
    let weeks = '星期' + '日一二三四五六'.charAt(new Date().getDay());
    ctx.fillText(weeks, 70, 55);

    //字体 二维码提示
    ctx.setFontSize(12)
    ctx.fillText('生活不止眼前的苟且', 20, 90);
    ctx.setFontSize(17)
    ctx.fillText('还有诗和远方', 45, 115);

    //画名片边框
    ctx.beginPath();
    ctx.rect(10, 210, 260, 140);
    ctx.setFillStyle('rgba(0,0,0,.15)');
    ctx.fill();
    ctx.beginPath();
    ctx.rect(11, 211, 258, 138);
    ctx.setFillStyle('#fff');
    ctx.fill();
    //字体名字
    ctx.setFontSize(16)
    ctx.setFillStyle('#000');
    ctx.fillText(name, 30, 245);
    //字体 职位
    ctx.setFontSize(11)
    ctx.setFillStyle('#666');
    ctx.fillText(post, 16 * name.length + 40, 245);
    ctx.setFillStyle('#333');
    ctx.fillText(company, 30, 270);
    //字体 电话
    ctx.fillText('电话: ' + mobile, 30, 308);
    //字体公司
    if (address.length < 18) {
      ctx.fillText('地址: ' + address, 30, 328);
    } else {
      ctx.fillText('地址: ' + address.slice(0, 18), 30, 328);
      ctx.fillText(address.slice(18), 55, 343);
    }

    //字体名字2
    ctx.setFontSize(16)
    ctx.setFillStyle('#359eff');
    ctx.fillText(name + ' 专属', 120, 388);
    ctx.setFontSize(12)
    ctx.setFillStyle('#333');
    ctx.fillText('小程序名片码', 120, 410);
    ctx.fillText('识别小程序码保存名片', 120, 432);
    ctx.setFillStyle('#999');
    ctx.fillText('由【微校名片】小程序生成', 120, 454);

    wx.getImageInfo({
      src: avatarUrl,
      success(res){
        //为什么要套着写而不是分开写
        //发现分开写有时 会有二维码显示一半的情况 发现drawImage 是一个需要时间的同步函数
        //可能有一种情况 加载图片信息 头像比二维码快 （服务器不一样） 但画图时间头像长
        //头像加载完毕并绘图结束后  二维码只进行了一部分  然后头像下面的ctx.draw执行  阻断了二维码的绘图 
        wx.getImageInfo({
          src: codeUrl,
          success(re) {
            //画头像
            ctx.drawImage(res.path, 190, 225, 60, 60);
            //放二维码
            ctx.drawImage(re.path, 25, 380, 70, 70);
            ctx.draw(true);
          }
        });
      }
    });
    
    ctx.draw();
  },
  setPosts(obj = {}, that) {
   
    let name = obj.name || '无';
    let post = obj.post || '无';
    let mobile = obj.mobile || '无';
    let company = obj.company || '无';
    let address = (obj.city + obj.address) || '无';

    let backgroundUrl = obj.backgroundUrl || '../../image/poster.png';
    

    if (obj.qrcodeUrl.indexOf('http') == -1) {
      var codeUrl = CONFIG.SERVER + obj.qrcodeUrl;
    } else {
      var codeUrl = obj.qrcodeUrl;
    }
    wx.getImageInfo({
      src: backgroundUrl,
      success(res) {
        var width = res.width;
        var height = res.height;
        // 使用 wx.createContext 获取绘图上下文 context
        var ctx = wx.createCanvasContext('posters');
        ctx.clearRect(0, 0, 280, 480);
        //设置海报背景

        //画小东西
        ctx.beginPath();
        ctx.rect(0, 0, 325, 578);
        ctx.setFillStyle('#fff');
        ctx.fill();
        ctx.drawImage(backgroundUrl, 0, 0, 280, 280 * height / width);

        //画名片边框
        ctx.beginPath();
        ctx.rect(10, 363, 260, 140);
        ctx.setFillStyle('rgba(0,0,0,.15)');
        ctx.fill();
        ctx.beginPath();
        ctx.rect(11, 364, 258, 138);
        ctx.setFillStyle('#fff');
        ctx.fill();

        //字体名字
        ctx.setFontSize(16)
        ctx.setFillStyle('#000');
        ctx.fillText(obj.name, 30, 398);
        //字体 职位
        ctx.setFontSize(10)
        ctx.setFillStyle('#666');
        ctx.fillText(obj.post, 16 * obj.name.length + 40, 398);
        ctx.fillText(obj.company, 30, 416);
        //字体 电话
        ctx.fillText('电话: ' + obj.mobile, 30, 448);
        //字体公司
        if (address.length < 20){
          ctx.fillText('地址: ' + address, 30, 463);
        }else{
          ctx.fillText('地址: ' + address.slice(0,20), 30, 463);
          ctx.fillText(address.slice(20), 55, 475);
        }
        //放二维码
        wx.getImageInfo({
          src: codeUrl,
          success(res) {
            ctx.drawImage(res.path, 190, 373, 60, 60);
            ctx.draw(true);
          }
        })
        ctx.draw();
      }
    })
  },
  onPullDownRefresh(){
    console.log(1)
  }
})