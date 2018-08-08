// pages/card/card.js

const app = getApp()
const CONFIG = require('../../config')
const UTILS = require('../../utils/utils')
var vcardId = ''
var cardHolderId = ''
var that
var sourceWxappId = ''
var wxappId = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    cardHolderId: '',
    isMyCard: false,
    hasDelBtn: true,
    hasCard: true
  },
  imageLoad(event){
    let index = event.target.dataset.index;
    let newHeight = 710 * event.detail.height / event.detail.width + 'rpx';
    this.data.user.heightList[index] = newHeight;
    this.setData({
      user: this.data.user
    });
  },
  
  /**
   * 保存手机通讯录
   */
  saveCard() {
    var obj = this.data.user
    wx.addPhoneContact({
      firstName: obj.name,
      mobilePhoneNumber: obj.phone,
      weChatNumber: obj.wxId,
      email: obj.mail,
      organization: obj.company,//公司
      addressCity: obj.city,
      title: obj.job,
      success(){
        console.log('成功保存到通讯录');
      }
    })
  },
  toIndex() {
    wx.switchTab({
      url: '../../pages/index/index',
    })
  },
  toMyCard(){
    app.appInit(function (json) {
      if (json.status == 'success') {
        wx.navigateTo({
          url: '../../pages/mycard/mycard',
        })
      }
    });
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  copy(e) {
    var data = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data
    })
  },
  showMore(){
    this.setData({
      showFlag: !this.data.showFlag
    })
  },
  prevImage(e){
    var urls = this.data.user.introImage;
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  bindGetUserInfo(res){
    var that = this;
    var errMsg = res.detail.errMsg;
    if(errMsg=='getUserInfo:ok'){
      app.appInit(function (json) {
        if(json.status == 'success'){
          var wxappId = json.data.wxappId;
          var datas = {
            wxappId: json.data.wxappId,
            way: 1,
            cardId: that.data.cardId,
            source: that.data.source
          }
          that.saveCardHolder(that, datas);
          if (res.currentTarget.dataset.to == 'mycard') {
            wx.navigateTo({
              url: '../../pages/mycard/mycard',
            })
          } else {
            wx.switchTab({
              url: '../../pages/index/index',
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("card页面onload参数options:",options)
    wx.setStorageSync(CONFIG.CONST_RELOAD_INDEX, false)
    //读取storage的hascard字段 判断是否有名片 对于不存在的值 会返回空
    if(!wx.getStorageSync(CONFIG.CONST_HASCARD)){
      this.setData({
        hasCard: false
      });
    }
    that = this
    var cardId = options.cardId || '';
    var way = options.way
    if (!!options.scene) {
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      cardId = decodeURIComponent(options.scene)
      console.log("scene：" + cardId)
      way = 2
    }
    that.setData({cardId:cardId})
    cardHolderId = options.cardHolderId || ''
    that.setData({ cardHolderId: cardHolderId})
    wxappId = wx.getStorageSync('CONST_WXAPPID')
    var url = CONFIG.URL_CARD_INFO
    if (!!cardId) {
      url = CONFIG.URL_CARD_LOOK
    }
	  UTILS.Net.request(UTILS.App.addToken(url), "GET", { wxappId: wxappId , id:cardId}, function (json) {
      if (json.status == "success") {
        if (!!json.data) {
          vcardId = json.data.id
          var imgList = new Array()
          var heightList = new Array()
          if (!!json.data.pictures) {
            for (var i = 0; i < json.data.pictures.length; i++) {
              imgList[i] = CONFIG.SERVER + json.data.pictures[i].url
              heightList[i] =0
            }
          }
          if (wxappId != json.data.wxappId) {
            that.setData({
              isMyCard: true
            })
          }
          var imgUrl = json.data.imgUrl
          if (!!imgUrl && imgUrl.indexOf("http") < 0) {
            imgUrl = CONFIG.SERVER + imgUrl
          }
          sourceWxappId = json.data.wxappId
          that.setData({ source: sourceWxappId})
          that.setData({
            user: {
              id: json.data.id,
              name: json.data.name,
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
        if (!!way) {
          that.setData({
            hasDelBtn : false
          })
          // 领取名片
          var datas = {
            wxappId: wxappId,
            way: way,
            cardId: cardId,
            source: sourceWxappId
          }
          that.saveCardHolder(this, datas)
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
  /**
   * 保存名片夹领取记录
   */
  saveCardHolder(event, datas) {
    var that = this;
    console.log("saveCardHolder方法参数:",datas)
    if (!!datas.cardId && !!datas.wxappId && !!datas.source){
      // 领取名片
      UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_HOLDER_SAVE), "GET", datas, function (json) {
        console.log("saveCardHolder方法返回json:",json)
        if (json.status == "success" || json.message == '已领取过该名片!') {
          cardHolderId = json.data.id || '';
          that.setData({ cardHolderId: cardHolderId})
        } else{
          console.log(json.message);
        }
      })
    }
  },
  /**
   * 删除名片夹记录
   */
  deleteCard() {
    UTILS.Net.request(UTILS.App.addToken(CONFIG.URL_CARD_HOLDER_DELETE), "POST", { id: cardHolderId }, function (json) {
      if (json.status == "success") {
        wx.showToast({
          title: json.message,
          duration: 2000
        })
        //2秒后返回上一页
        wx.setStorageSync(CONFIG.CONST_RELOAD_INDEX, true)
        setTimeout(function () {
          if (getCurrentPages().length==1){
            // 从"转发/扫码"进入card也, 没有上一页
           wx.switchTab({
             url: '../../pages/index/index',
           })
          }else{
           wx.navigateBack()
          }
        }, 1000)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorageSync('CONST_WXAPPID')
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    that = this
    // 名称
    var name = that.data.user.name
    var title = "您好，这是" + name + "的微校名片，请惠存。"
    return {
      title: title,
      path: 'pages/card/card?cardId=' + vcardId + "&way=1&source=" + wx.getStorageSync('CONST_WXAPPID')
    }
  },

  removeSto: function(e){
    wx.removeStorageSync('CONST_WXAPPID');
    wx.removeStorageSync('CONST_HASCARD');
  }
})
