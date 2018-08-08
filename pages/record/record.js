//index.js
//获取应用实例
const app = getApp()
const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    recordList:[]
  },
  toCard(e){
    console.log(e.currentTarget)
    if (e.currentTarget.dataset.hascard){
      if (e.currentTarget.dataset.hascollect){
        wx.navigateTo({
          url: '../../pages/card/card?cardId=' + e.currentTarget.dataset.id + "&cardHolderId=" + e.currentTarget.dataset.cardholderid
        });
      }else{
        wx.navigateTo({
          url: '../../pages/card/card?way=4&cardId=' + e.currentTarget.dataset.id + "&cardHolderId=" + e.currentTarget.dataset.cardholderid
        });
      }
    }
  },
  sendCard(e){
    if (wx.getStorageSync(CONFIG.CONST_HASCARD)){
      wx.navigateTo({
        url: '../../pages/card/card',
      })
    }else{
      wx.navigateTo({
        url: '../../pages/mycard/mycard',
      })
    }
  },
  onLoad: function () {
    var userInfo = wx.getStorageSync('CONST_WX_USER_INFO')
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    var that = this
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_RCORD_LIST), "GET", { wxappId: wxappId }, function (json) {
      if (json.status == "success") {
        if (!!json.data) {
          var _data = json.data;
          for (var obj of _data) {
            var imgUrl = obj.imgUrl
            if (!!imgUrl && imgUrl.indexOf("http") < 0) {
              imgUrl = CONFIG.SERVER + imgUrl
              obj.imgUrl = imgUrl
            }
          }
          that.setData({
            recordList: _data
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
    })
  },
  onShow(){
    this.onLoad();
  }
})
