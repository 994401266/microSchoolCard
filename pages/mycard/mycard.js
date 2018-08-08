//index.js
//获取应用实例
const app = getApp()
const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')
const CITYINFO = require('../../utils/classes/city.js')
let privenceList = [];
for (var p in CITYINFO){
  privenceList.push(p);
}
var that
var cardId = ''
var pictureUrl = ''

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: {},
    multiIndex: [0, 0],
    multiArray: [privenceList, CITYINFO[privenceList[0]]]
  },
  imgError(e){
    console.log(e)
  },
  getPhoneNumber: function (e) {
    if ("getPhoneNumber:ok" == e.detail.errMsg) {
      var datas = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_GET_MOBILE), "GET", datas, function (json) {
        if (json.status == "success") {
          if (!!json.data) {
            var mobile = json.data.purePhoneNumber
            that.data.user.phone = mobile
            that.mobile = mobile
            that.setData(that.data)
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
  bindMultiPickerChange: function (e) {
    let pIndex = e.detail.value[0];
    let cIndex = e.detail.value[1]
    this.city = CITYINFO[privenceList[pIndex]][cIndex];
    this.setData({
      multiIndex: e.detail.value
    });
  },
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    this.data.multiArray[1] = CITYINFO[privenceList[e.detail.value]];
    this.setData({
      multiArray: this.data.multiArray
    });
  },
  //删除介绍的图片
  deleteImage(e){
    let index = e.currentTarget.dataset.img;
    this.data.user.introImage.splice(index,1)
    this.data.user.heightList.splice(index, 1)
    this.setData(this.data);
    var imgs = pictureUrl.split(",");
    imgs.splice(index, 1)
    pictureUrl = imgs.join(",")
  },
  // 姓名
  changeName: function(e) {
    that.name = e.detail.value
    that.data.userName = that.name
  },
  //联系电话input
  changeMobile: function (e) {
    that.mobile = e.detail.value
    that.data.user.phone = e.detail.value
  },
  // 公司名称
  changeCompany: function (e) {
    that.company = e.detail.value
    that.data.user.company = that.company
  },
  // 职务
  changePost: function (e) {
    that.post = e.detail.value
    that.data.user.job = that.post
  },
  // 微信号
  changeWechat: function (e) {
    that.wechat = e.detail.value
    that.data.user.wxId = that.wechat
  },
  // 邮箱
  changeEmail: function (e) {
    that.email = e.detail.value
    that.data.user.mail = that.email
  },
  // 城市
  changeCity: function (e) {
    that.city = e.detail.value
    that.data.user.city = that.city
  },
  // 地址
  changeAddress: function (e) {
    that.address = e.detail.value
    that.data.user.place = that.address
  },
  // 描述
  changeRemark: function (e) {
    that.remark = e.detail.value
    that.data.user.remark = that.remark
  },
  // 修改头像
  changeAvatar(){
    this.chooseImages(this, "avatar")
  },
  chooseImages(event, imgType) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
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
          that.data.user.avatar = tempFilePath
        } else {
          if (!('introImage' in that.data.user)) {
            that.data.user.introImage = []
            that.data.user.heightList = []
            that.setData({
              user: that.data.user
            })
          }
          that.data.user.introImage.push(...tempFilePaths)
        }
        that.setData({
          user: that.data.user
        });
      }
    })
  },
  uploadImage: function (tempFilePaths, imgType) {
    UTILS.Net.upload(UTILS.App.addToken(CONFIG.URL_UPLOAD_FILE), tempFilePaths, "filePath", {},
      function (json) {
        if (json.status == 'success') {
          if ("avatar" == imgType) {
            that.imgUrl = json.data[0].path
          } else {
            pictureUrl += json.data[0].path + ','
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
  imageLoad(event){
    let index = event.target.dataset.index;
    let newHeight = 710 * event.detail.height / event.detail.width + 'rpx';
    this.data.user.heightList[index] = newHeight;
    this.setData({
      user: this.data.user
    });
  },
  showCard(){
    wx.navigateTo({
      url: '../../pages/card/card',
    });
  },
  saveCard() {
    var datas = {
      id: cardId,
      wxappId: wx.getStorageSync('CONST_WXAPPID'),
      name: that.name,
      mobile: that.mobile,
      company: that.company,
      post: that.post,
      wechat: that.wechat,
      email: that.email,
      city: that.city,
      address: that.address,
      remark: that.remark,
      imgUrl: that.imgUrl,
      pictureUrl: pictureUrl
    }
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_SAVE_CARD), "GET", datas, function (json) {
      if (json.status == "success") {
        // 更新首页数据标识
        wx.setStorageSync(CONFIG.CONST_RELOAD_INDEX, true)
        // 是否已创建名片标识
        wx.setStorageSync("CONST_HASCARD", true)
        wx.showToast({
          title: "提交成功！",
          duration: 2000
        })
        //2秒后返回上一页
        setTimeout(function () {
          wx.navigateBack()
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
  setCity(str){
    var that = this;
    if (str){
      privenceList.forEach(function(item,index){
        if(CITYINFO[item].indexOf(str) != -1){
          that.data.multiArray[1] = CITYINFO[item];
          that.setData({
            multiIndex: [index, CITYINFO[item].indexOf(str)],
            multiArray: that.data.multiArray
          });
        }
      });
    }else{
      this.setData({
        multiIndex: [0,0]
      });
    }
  },
  onLoad: function () {
    that = this;
    that.getDatas();
  },
  getDatas(){
    that = this
    cardId = ''
    var userInfo = wx.getStorageSync('CONST_WX_USER_INFO')
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    that.name = userInfo.nickName
    that.imgUrl = userInfo.avatarUrl
    that.mobile = ''
    that.company = ''
    that.post = ''
    that.wechat = ''
    that.email = ''
    that.city = ''
    that.address = ''
    that.remark = ''
    var wxappId = wx.getStorageSync('CONST_WXAPPID')
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_INFO), "GET", { wxappId: wxappId }, function (json) {
      if (json.status == "success") {
        if (!!json.data) {
          cardId = json.data.id
          that.name = json.data.name
          that.imgUrl = json.data.imgUrl
          that.mobile = json.data.mobile
          that.company = json.data.company
          that.post = json.data.post
          that.wechat = json.data.wechat
          that.email = json.data.email
          that.city = json.data.city
          that.address = json.data.address
          that.remark = json.data.remark
          that.setCity(that.city)
          var imgList = new Array()
          var heightList = new Array()
          pictureUrl = ''
          if (!!json.data.pictures) {
            for (var i = 0; i < json.data.pictures.length; i++) {
              pictureUrl += json.data.pictures[i].url + ","
              imgList[i] = CONFIG.SERVER + json.data.pictures[i].url
              heightList[i] = 0
            }
          }
          var imgUrl = json.data.imgUrl
          if (!!imgUrl && imgUrl.indexOf("http") < 0) {
            imgUrl = CONFIG.SERVER + imgUrl
          }
          that.setData({
            user: {
              id: json.data.id,
              userName: json.data.name,
              phone: json.data.mobile,
              avatar: imgUrl,
              company: json.data.company,
              job: json.data.post,
              mail: json.data.email,
              wxId: json.data.wechat,
              city: json.data.city,
              place: json.data.address,
              remark: json.data.remark,
              introImage: imgList,
              heightList: heightList
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
  }
})
