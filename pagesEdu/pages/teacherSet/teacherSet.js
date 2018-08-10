// pagesEdu/pages/teacherSet/teacherSet.js
const app = getApp()
const CONFIG = require('../../../config')
const UTILS = require('../../../utils/utils')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherList: [],
    totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that= this;
    app.appInit(function (json) {
      that.getData()
    })
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
    var reload = wx.getStorageSync(CONFIG.CONST_RELOAD_INDEX)
    if (reload) {
      that.getData()
      wx.setStorageSync(CONFIG.CONST_RELOAD_INDEX, false)
    }
  },
  getData: function () {
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_TEACHER_LIST), "GET",'', function (json) {
      if (json.status == "success") {
        var _data = json.data;
        if (!!_data) {
          for (var obj of _data) {
            var imgUrl = obj.pic
            if (!!imgUrl && imgUrl.indexOf("http") < 0) {
              imgUrl = CONFIG.SERVER + imgUrl
              obj.pic = imgUrl
            }
          }
          that.setData({
            teacherList: _data,
            totalCount: json.page.totalCount
          })
        } else {
          that.setData({
            teacherList: []
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
  showAdd() {
    wx.navigateTo({
      url: '../teacherAdd/teacherAdd',
    });
  },
  updatePreTeacher(e){
    var teacherId = e.currentTarget.dataset.teacherid;
    wx.navigateTo({
      url: '../teacherAdd/teacherAdd?teacherId='+teacherId,
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})