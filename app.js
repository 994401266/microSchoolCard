
var that
const CONFIG = require('config')
const UTILS = require('utils/utils')
var fundebug = require('utils/classes/fundebug.0.6.1.min.js');
fundebug.init(
  {
    apikey: '483be5605415e3038fbb1869573ae865e1a2acd7a3ff2d2aa03d260995af037e'
  })
//app.js
App({
  onLaunch: function (event,param) {
    that = this
    // 登录
    // that.appInit()
  },
  appInit: function (calllback) {
    //获取微信用户信息
    UTILS.WX.wxGetUserInfo(function (json) {
      UTILS.App.login(json, function (res) {
        if (calllback != undefined){
          calllback(res)
        }
      })
    })
  },
  globalData: {
    userInfo: null
  }
})
