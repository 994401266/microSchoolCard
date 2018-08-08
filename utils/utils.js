/*
creator: ZHK
powerBy: www.mzywx.com
*/

//工具类对象统一引入
const App = require('App') //系统相关工具类
const Net = require('classes/Net') //网络相关工具类
const String = require('classes/String') //字符串相关工具类
const WX = require('classes/WX') //微信相关工具类


//设置
module.exports = {
  Net: Net,
  String: String,
  App: App,
  WX: WX
}

