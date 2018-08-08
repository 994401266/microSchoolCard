//index.js
//获取应用实例
const app = getApp()
const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')
var that
var qrcodeImgUrl = ''

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: {},
    openSettingModal: false
  },
  //事件处理函数
  showCard() {
    wx.navigateTo({
      url: '../../pages/card/card',
    });
  },
  toPoster() {
    wx.navigateTo({
      url: '../../pages/poster/poster',
    });
  },
  saveCode: function(){
    var that = this;
    
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        console.log('授权成功')
        wx.downloadFile({
          url: qrcodeImgUrl,
          success: function (res) {
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
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
    })
  },
  onLoad: function () {
    that = this
    var userInfo = wx.getStorageSync('CONST_WX_USER_INFO')
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    var url = CONFIG.URL_CARD_INFO
    UTILS.Net.request(UTILS.App.addToken(url), "GET", { wxappId: wxappId}, function (json) {
      if (json.status == "success") {
        if (!!json.data) {
          qrcodeImgUrl = CONFIG.SERVER +  json.data.qrcodeUrl
          that.setData({
            user: {
              id: json.data.id,
              name: json.data.name,
              phone: json.data.mobile,
              avatarUrl: json.data.imgUrl,
              qrcodeUrl: qrcodeImgUrl,
              company: json.data.company
            }
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
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
