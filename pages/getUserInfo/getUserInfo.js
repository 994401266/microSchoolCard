// pages/getUserInfo/getUserInfo.js
/*
creator: ZHK
powerBy: www.mzywx.com
*/

var that
var APP = getApp()

const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    appName: CONFIG.APP_NAME
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 回调获取到用户信息
   */
  bindGetUserInfo: function (res){
    var errMsg = res.detail.errMsg
    if (errMsg == "getUserInfo:ok"){
      APP.onLaunch(this, "power")
      wx.switchTab({
        url: CONFIG.APP_HOME_PAGE,
      })
    } else {
      // wx.redirectTo({
      //   url: CONFIG.APP_HOME_PAGE,
      // })
    }
  }
})