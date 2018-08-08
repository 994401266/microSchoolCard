/*
creator: ZHK
powerBy: www.mzywx.com
*/
/*
  日期相关工具类
*/

//当前日期格式化
function getTimeString(fmt){
  var _this = new Date();
  var o = {
    "M+": _this.getMonth() + 1, //月份 
    "d+": _this.getDate(), //日 
    "h+": _this.getHours(), //小时 
    "m+": _this.getMinutes(), //分 
    "s+": _this.getSeconds(), //秒 
    "q+": Math.floor((_this.getMonth() + 3) / 3), //季度 
    "S": _this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//短时间
function shortTime(timeStr) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;

  var now = new Date().getTime();
  //字符串转成时间戳
  timeStr = timeStr.replace(/-/g, '/');
  var date = new Date(timeStr);
  var dateTimeStamp = date.getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    //若日期不符则弹出窗口告之
    //alert("结束日期不能小于开始日期！");
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var result = "";
  if (monthC >= 1) {
    result = parseInt(monthC) + "个月前";
  }
  else if (weekC >= 1) {
    result = parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = parseInt(minC) + "分钟前";
  }
  else {
    result = "刚刚";
  }
  return result;
}

//时间戳转日期
function timestamp2DateString(str) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(str);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();

  if (Add0(h) == "00" && Add0(mm) == "00" && Add0(s) == "00") {
    return y + '-' + Add0(m) + '-' + Add0(d);
  } else {
    return y + '-' + Add0(m) + '-' + Add0(d) + ' ' + Add0(h) + ':' + Add0(mm) + ':' + Add0(s);
  }
}

function Add0(m) { return m < 10 ? '0' + m : m }

//日期字符串转时间戳
function dateString2Timestamp(dateString) {
  dateString = dateString+"";
  dateString = dateString.substring(0, 19);
  dateString = dateString.replace(/-/g, '/');
  var timestamp = new Date(dateString).getTime();
  return timestamp;
}

//小时转秒
function hour2Second(h) {
  return h * 1 * 3600;
}

//秒数转天、时、分、秒
function second2TimeJson(second) {
  var second = parseInt(second)
  if (second < 0) {
    second = second * -1
  }
  var result = { "h": "", "m": "", "s": "" };
  var theTime = second;// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  // alert(theTime);
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    // alert(theTime1+"-"+theTime);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  // var result = "" + parseInt(theTime) + "秒";
  result["s"] = parseInt(theTime);
  if (parseInt(theTime) < 10) {
    result["s"] = "0" + parseInt(theTime);
  }
  if (theTime1 > 0) {
    // result = "" + parseInt(theTime1) + "分" + result;
    result["m"] = parseInt(theTime1);
    if (parseInt(theTime1) < 10) {
      result["m"] = "0" + parseInt(theTime1);
    }
  } else {
    result["m"] = "00";
  }
  if (theTime2 > 0) {
    // result = "" + parseInt(theTime2) + "小时" + result;
    result["h"] = parseInt(theTime2);
  }
  result["h"] = parseInt(theTime2);
  // console.log(result)
  if (second < 0) {
    result["h"] = "-" + parseInt(theTime2);
  }
  return result;
}


//设置
module.exports = {  
  getTimeString: getTimeString,
  shortTime: shortTime,
  timestamp2DateString: timestamp2DateString,
  dateString2Timestamp: dateString2Timestamp,
  hour2Second: hour2Second,
  second2TimeJson: second2TimeJson
}