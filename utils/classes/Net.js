/*
creator: ZHK
powerBy: www.mzywx.com
*/
/*
  网络相关工具类
*/

const CONFIG = require('../../config')
const String = require('String')

//ajax request
function request(rurl, rMethod, rdata, callback) {
  // 加载提示
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: rurl,
    data: rdata,
    method: rMethod,
    header: {
      'clientType': 'wxLittleApps',
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': wx.getStorageSync(CONFIG.CONST_USER_LOGIN_COOKIE)
    },
    success: function (json) {
      if (String.isNull(callback.success)){
        callback(json.data)
      } else {
        callback["success"](json.data)
      }
    },
    fail: function (json) {
      if (callback["fail"] != undefined) {
        callback["fail"](json)
      }
    },
    complete: function (json) {
      setTimeout(function () {
        wx.hideLoading()// 停止加载提示
      }, 100)
      if (callback["complete"] != undefined) {
        callback["complete"](json)
      }
      // if (json.data.statusCode == "relogin") {  //会话超时
      //   getApp().resetLoginFlag()
      // }
    }
  })
}

//ajax form
function form(rurl, rdata, callback) {
  // 加载提示
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: rurl,
    data: rdata,
    method: "POST",
    header: {
      'clientType': 'wxLittleApps',
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': wx.getStorageSync(CONFIG.CONST_USER_LOGIN_COOKIE)
    },
    success: function (json) {
      if (String.isNull(callback.success)) {
        callback(json.data)
      } else {
        callback["success"](json.data)
      }
    },
    fail: function (json) {
      if (callback["fail"] != undefined) {
        callback["fail"](json)
      }
    },
    complete: function (json) {
      setTimeout(function () {
        wx.hideLoading()// 停止加载提示
      }, 100)
      if (callback["complete"] != undefined) {
        callback["complete"](json)
      }
      // if (json.data.statusCode == "relogin") {  //会话超时
        
      // }
    }
  })
}

//ajax upload
function upload(rurl, rfilePath, rname, rdata, callback) {
  // 加载提示
  wx.showLoading({
    title: '上传中',
  })
  wx.uploadFile({
    url: rurl,
    filePath: rfilePath,
    name: rname,
    formData: rdata,
    header: {
      'clientType': 'wxLittleApps',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': wx.getStorageSync(CONFIG.CONST_USER_LOGIN_COOKIE)
    },
    success: function (json) {
      if (String.isNull(callback.success)) {
        callback(JSON.parse(json.data))
      } else {
        callback["success"](JSON.parse(json.data))
      }
    },
    fail: function (json) {
      if (callback["fail"] != undefined) {
        callback["fail"](json)
      }
    },
    complete: function (json) {
      setTimeout(function () {
        wx.hideLoading()// 停止加载提示
      }, 100)
      if (callback["complete"] != undefined) {
        callback["complete"](json)
      }
      // if (json.data.statusCode == "relogin") {  //会话超时
        
      // }
    }
  })
}

//ajax download
function download(rurl, callback) {
  // 加载提示
  wx.showLoading({
    title: '下载中',
  })
  wx.downloadFile({
    url: rurl,
    header: {
      'Cookie': wx.getStorageSync(CONFIG.CONST_USER_LOGIN_COOKIE)
    },
    success: function (json) {
      if (String.isNull(callback.success)) {
        callback(json.data)
      } else {
        callback["success"](json.data)
      }
    },
    fail: function (json) {
      if (callback["fail"] != undefined) {
        callback["fail"](json)
      }
    },
    complete: function (json) {
      setTimeout(function () {
        wx.hideLoading()// 停止加载提示
      }, 100)
      if (callback["complete"] != undefined) {
        callback["complete"](json)
      }
      // if (json.data.statusCode == "relogin") {  //会话超时
        
      // }
    }
  })
}


//设置
module.exports = {
  request: request,
  form: form,
  upload: upload,
  download: download,
}