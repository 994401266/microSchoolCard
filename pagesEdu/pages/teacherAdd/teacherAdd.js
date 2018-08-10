// pagesEdu/pages/addTeacher/addTeacher.js
//获取应用实例
const app = getApp()
const CONFIG = require('../../../config')
const UTILS = require('../../../utils/utils')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '../../image/avatar.jpg',
    pic: '',
    teacherInfo: {},
    teacherId: ''
  },
  formSubmit: function (e) {
    var datas = {};
    datas = e.detail.value;
    datas.pic = this.data.pic;
    console.log(datas);
    if (datas.onsale) {
      datas.onsale = 1;
    } else {
      datas.onsale = 0;
    }
    if(!!that.teacherId){
      datas.id = that.teacherId;
    }
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_TEACHER_ADD), "POST", datas, function (json) {
      if (json.status == "success") {
        wx.showToast({
          title: "提交成功！",
          duration: 2000
        })
        //2秒后返回列表
        setTimeout(function () {
          wx.navigateTo({
            url: '../teacherSet/teacherSet'
          })
        }, 2000)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("card页面onload参数options:", options)
    that=this;
    var teacherId = options.teacherId || '';
    if(!!teacherId){
      UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_TEACHER_UPDATE_PRE),'GET',{id: teacherId},function(json){
        if(json.status == 'success'){
          if(!!json.data){
            var imgUrl = json.data.pic;
            if (!!imgUrl && imgUrl.indexOf("http") < 0) {
              imgUrl = CONFIG.SERVER + imgUrl
              json.data.pic = imgUrl;
            }
            if(!!imgUrl){
            }else{
              json.data.pic = '../../../image/carema.png';
            }
            if(json.data.onsale == 1){
              json.data.onsale = true;
            }else{
              json.data.onsale = false;
            }
            that.setData({
              teacherInfo: json.data,
              teacherId: json.data.id
            })
            that.teacherId = teacherId;
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
    }
  },
  deleteTeacher(e){
    var currentId = e.currentTarget.dataset.teacherid;
    if(!!currentId){
      UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_TEACHER_DEL), "get", {id: currentId}, function (json) {
        if (json.status == "success") {
          wx.showToast({
            title: "删除成功！",
            duration: 2000
          })
          //2秒后返回列表
          setTimeout(function () {
            wx.navigateTo({
              url: '../teacherSet/teacherSet'
            })
          }, 2000)
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
    }
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
    that = this;
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

  },
  // 修改头像
  changeAvatar() {
    this.chooseImages(this, "avatar")
  },
  chooseImages(event, imgType) {
    that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFilePath = tempFilePaths[0]
        //先获取图片信息
        wx.getImageInfo({
          src: tempFilePath,
          success: function (res) {
            that.uploadImage(tempFilePath, imgType)
          }
        })
        if (!!imgType && "avatar" == imgType) {
          that.setData({
            avatar: tempFilePath
          })
        }
        // this.setData({
        //   //user: that.data.user
        // });
      }
    })
  },
  uploadImage: function (tempFilePaths, imgType) {
    UTILS.Net.upload(UTILS.App.addToken(CONFIG.URL_UPLOAD_FILE), tempFilePaths, "filePath", {},
      function (json) {
        if (json.status == 'success') {
          if ("avatar" == imgType) {
            that.setData({
              pic: json.data[0].path
            })
          }
        } else {
          wx.showModal({
            title: "错误",
            content: "上传图片失败",
            showCancel: true,
            confirmText: "重试",
            success: function (res) {
              if (res.confirm) {
                //重试
                // that.bindUploadCarCert()
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          })
        }
      })
  },
  imageLoad(event) {
    let index = event.target.dataset.index;
    let newHeight = 710 * event.detail.height / event.detail.width + 'rpx';
    this.data.user.heightList[index] = newHeight;
    this.setData({
      user: this.data.user
    });
  },
})