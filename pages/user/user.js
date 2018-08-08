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
    hasCard: false
  },
  toRecordPage() {
    wx.navigateTo({
      url: '../../pages/record/record',
    })
  },
  toBugger(){
    wx.navigateTo({
      url: '../../pages/bugger/bugger',
    })
  },
  onLoad: function () {
    var that = this;
    var userInfo = wx.getStorageSync('CONST_WX_USER_INFO')
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_INFO), "GET", { wxappId: wxappId }, function (json) {
      if (json.status == "success") {
        if (!!json.data) {
          that.setData({
            company: json.data.company
          });
        }
      }
    })
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
  },
  onShow: function() {
    if (!!wx.getStorageSync('CONST_HASCARD')) {
      this.setData({
        hasCard: wx.getStorageSync('CONST_HASCARD')
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
