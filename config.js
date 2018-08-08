
/*
creator: ZHK
powerBy: www.mzywx.com
*/
/**
 * 小程序配置文件
 */


//杨
// var protocol = "http"
// var ip = "10.0.200.86"
// var port = ""
// var path1 = "school"
// var path2 = "school"
// var host = protocol + "://" + ip + ":" + port + "/" + path1
// var server = protocol + "://" + ip + ":" + port + "/" + path2

//刘
// var protocol = "http"
// var ip = "10.0.200.89"
// var path1 = "school"
// var path2 = "school"
// var host = protocol + "://" + ip + "/" + path1
// var server = protocol + "://" + ip + "/" + path2

//测试
// var protocol = "https"
// var ip = "zhixue.it371.cn"
// var path1 = "school"
// var path2 = "school"
// var host = protocol + "://" + ip + "/" + path1
// var server = protocol + "://" + ip + "/" + path2

//高
var protocol = "http"
var ip = "10.0.200.25"
var path1 = "card"
var path2 = "card"
var host = protocol + "://" + ip + "/" + path1
var server = protocol + "://" + ip + "/" + path2

//正式
// var protocol = "https"
// var ip = "zhixue.mzywx.com"
// var path1 = "card"
// var path2 = "card"
// var host = protocol + "://" + ip + "/" + path1
// var server = protocol + "://" + ip + "/" + path2

var config = {
  //版本号
  VERSION: `v1.0 build 2018`,
  /*
  V1.0
  全新发布；
  */

  APP_NAME: "微校名片",
  APP_HOME_PAGE:"../../pages/index/index",

  host,
  server,
  /*URL*/
  //HOST
  HOST: `${host}`,
  //SERVER
  SERVER: `${server}`,
  // 小程序登录接口post {code 小程序api拿到的code}
  URL_LOGIN: `${server}/f/wxapp/autologin/login`,

  // 获取名片夹列表
  URL_CARD_LIST: `${server}/f/wxapp/cardholder/dataList/json?springraintoken={0}`,
  // 保存名片
  URL_SAVE_CARD: `${server}/f/wxapp/visitingcard/update?springraintoken={0}`,
  // 获取个人名片
  URL_CARD_INFO: `${server}/f/wxapp/visitingcard/lookInfo/json?springraintoken={0}`,
  // 查看名片
  URL_CARD_LOOK: `${server}/f/wxapp/visitingcard/look/json?springraintoken={0}`,
  // 获取名片领取记录列表
  URL_CARD_RCORD_LIST: `${server}/f/wxapp/cardholder/dataRecordList/json?springraintoken={0}`,
  // 删除名片
  URL_CARD_DELETE: `${server}/f/wxapp/visitingcard/delete?springraintoken={0}`,
  // 上传文件
  URL_UPLOAD_FILE: `${server}/f/wxapp/visitingcard/upload?springraintoken={0}`,
  // 保存名片夹
  URL_CARD_HOLDER_SAVE: `${server}/f/wxapp/cardholder/update?springraintoken={0}`,
  // 删除名片夹记录
  URL_CARD_HOLDER_DELETE: `${server}/f/wxapp/cardholder/delete?springraintoken={0}`,
  // 获取手机号
  URL_GET_MOBILE: `${server}/f/wxapp/visitingcard/getPhoneNumber?springraintoken={0}`,

  /*用户常量*/
  //Cookie信息
  CONST_USER_LOGIN_COOKIE: `CONST_USER_LOGIN_COOKIE`,
  //Springrain Token
  CONST_SPRINGRAIN_TOKEN: `CONST_SPRINGRAIN_TOKEN`,
  //用户手机号
  CONST_USER_MOBILE: `CONST_USER_MOBILE`,
  //是否刷新首页
  CONST_RELOAD_INDEX: `CONST_RELOAD_INDEX`,
  //是否有名片
  CONST_HASCARD: `CONST_HASCARD`,
 
};

module.exports = config
