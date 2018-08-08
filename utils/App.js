/*
creator: ZHK
powerBy: www.mzywx.com
*/
/*
  系统相关工具类
*/
const APP = getApp()
const CONFIG = require('../config')
const Net = require('classes/Net')
const String = require('classes/String')

//系统登录
function login(parm, callback) {
  //微信登录
  wx.login({
    success: function (res) {
      var _parm = {
        code: res.code,
        avatarUrl: parm.avatarUrl,
        nickname: parm.nickName
      }
      if (res.code) {
        //登录系统
        Net.form(CONFIG.URL_LOGIN, _parm, {
          success: function (json) {
            if (json.status == 'success') {
              //保存Cookie
              wx.setStorageSync(CONFIG.CONST_USER_LOGIN_COOKIE, "SHAREJSESSIONID="+json.data.sessionId)
              //保存Springrain Token
              wx.setStorageSync(CONFIG.CONST_SPRINGRAIN_TOKEN, json.data.springraintoken)
              // 保存wxappId
              wx.setStorageSync("CONST_WXAPPID", json.data.wxappId)
              // 是否已创建名片标识
              wx.setStorageSync("CONST_HASCARD", json.data.hasCard)
              //保存绑定手机号
              var mobile = String.isNull(json.data.mobile) ? "" : json.data.mobile
              wx.setStorageSync(CONFIG.CONST_USER_MOBILE, mobile)
            } else {  //错误
              // login(function () {
              //   wx.navigateTo({
              //     url: CONFIG.URL_HOME_PAGE
              //   })
              // })
            }
            //执行func回调
            callback(json)
          },
          complete: function (json){
            wx.hideLoading()
          }
        })
      } else {
        wx.showModal({
          title: "微信登录失败",
          content: res.errMsg,
          showCancel: true,
          confirmText: "重试",
          success: function (res) {
            if (res.confirm) {
              //重试
              login(parm, function () {
                wx.navigateTo({
                  url: CONFIG.URL_HOME_PAGE
                })
              })
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    }
  })
}

//请求添加token
function addToken(url, arg){
  var parm = String.isNull(arg) ? [] : arg  
  parm.unshift(wx.getStorageSync(CONFIG.CONST_SPRINGRAIN_TOKEN))
  return String.format(url, parm)
}

//设置
module.exports = {
  login: login,
  addToken: addToken
}