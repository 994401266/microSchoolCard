//index.js

//获取应用实例
var that
const app = getApp()
const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasCard: false,
    cardList: []
    },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showCard(e){
    var cardId = e.currentTarget.dataset.cardid
    var cardHolderId = e.currentTarget.dataset.cardholderid
    wx.navigateTo({
      url: '../../pages/card/card?cardId=' + cardId + "&cardHolderId=" + cardHolderId
    });
  },
  toCode(){
    wx.navigateTo({
      url: '../code/code',
    })
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  copy(e){
    var data = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data
    })
  },
  showMore(e){
    var index = e.currentTarget.dataset.index;
    this.data.cardList[index].showFlag = !this.data.cardList[index].showFlag;
    this.setData(this.data);
  },
  onLoad: function () {
    var start = new Date();
    that = this
    var userInfo = wx.getStorageSync('getStorageSync')
    that.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    app.appInit(function (json){
      that.getData()
    })
    var end = new Date();
    var timeCost = end.getTime()-start.getTime();
    console.log("耗时:"+timeCost);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var reload = wx.getStorageSync(CONFIG.CONST_RELOAD_INDEX)
    if (reload){
      that.getData()
      wx.setStorageSync(CONFIG.CONST_RELOAD_INDEX, false)
    }
  },
  getData: function (){
    var userInfo = wx.getStorageSync('CONST_WX_USER_INFO')
    that.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    if (!!wx.getStorageSync('CONST_HASCARD')){
      that.setData({
        hasCard: wx.getStorageSync('CONST_HASCARD')
      })
    }
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_LIST), "GET", { wxappId: wxappId }, function (json) {
      if (json.status == "success") {
        var _data = json.data;
        if (!!_data) {
          for (var obj of _data) {
            var imgUrl = obj.imgUrl
            if (!!imgUrl && imgUrl.indexOf("http") < 0) {
              imgUrl = CONFIG.SERVER + imgUrl
              obj.imgUrl = imgUrl
            }
          }
          that.setData({
            cardList: _data
          })
        } else {
          that.setData({
            cardList:[]
          })
        }
      } else {
        wx.showModal({
          title: "错误",
          content: json.message,
          showCancel: false,
          success: function (res) {
          }
        })
        wx.hideToast()
      }
      wx.stopPullDownRefresh() //停止下拉刷新
    })
  },
  onUnload(){
    // wx.removeStorage({
    //   key: CONFIG.CONST_UESR_LOGIN_COOKIE,
    //   success: function(res) {
    //     console.log('当退出时删除storage的user_login_cookie');
    //   },
    // })
  },
  onPullDownRefresh: function(){
    that.getData()
  },
  
})
