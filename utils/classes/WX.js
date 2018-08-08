/*
creator: ZHK
powerBy: www.mzywx.com
*/
/*
  微信相关工具类
*/
const CONFIG = require('../../config')
const App = require('../App')

//常量
const CONST_WX_USER_INFO = "CONST_WX_USER_INFO"
const CONST_WX_DEVICE_INFO = "CONST_WX_DEVICE_INFO"

//微信用户授权
function wxGetUserInfo(callback) {
  //获取是否授权
  wx.getUserInfo({
    complete: res1 => {
      if (res1.errMsg == "getUserInfo:ok") {
        wx.setStorageSync(CONST_WX_USER_INFO, res1.userInfo)
        wxLogin(res1, callback)
      } else {
        wx.redirectTo({
          url: '/pages/getUserInfo/getUserInfo',
        })
      }
    }
  })
}

//微信+系统登录
function wxLogin(res, callback) {
  wx.showLoading({ 
    title: "登录中",
    mask: true 
  })
  // 可以将 res 发送给后台解码出 unionId
  var parm = res.userInfo
  callback(parm)
}

//获取位置信息授权
function wxGetLocation(callback) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      callback(res)
    },
    fail: function (res) {
      wx.showModal({
        title: '权限提示',
        showCancel: false,
        content: "需要获取你的地理信息，请确认授权，否则地图功能无法使用！",
        success: function (res) {
          wx.openSetting({
            success: (res) => {
              // console.log(res)
            }
          })
        }
      })
    }
  })
}

//获取微信用户信息
function getWxUserInfo() {
  return wx.getStorageSync(CONST_WX_USER_INFO)
}

//设置设备信息
function setDeviceInfo() {
  wx.getSystemInfo({
    success: function (res) {
      wx.setStorageSync(CONST_WX_DEVICE_INFO, res)
    }
  })  
}

//获取设备信息
function getDeviceInfo() {
  return wx.getStorageSync(CONST_WX_DEVICE_INFO)
}

//设置
module.exports = {
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxGetLocation: wxGetLocation,
  getWxUserInfo: getWxUserInfo,
}