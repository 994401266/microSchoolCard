/*
creator: ZHK
powerBy: www.mzywx.com
*/
/*
  字符串相关工具类
*/

//将字符串转成Array
function string2Array(str) {
  //将String转成Arr
  var arr = []
  for (var i in str) {
    arr.push(str.charAt(i))
  }
  return arr
}

//将Array转成字符串
function array2String(arr) {
  var str = ""
  for (var i in arr) {
    str += arr[i]
  }
  return str
}

/**
 * 判断非空的方法
 */
function isNull(str) {
  if (null == str || '' == str || typeof str == undefined || 'undefined' == str) {
    return true;
  } else {
    return false;
  }
}
/**不为空*/
function isNotNull(str) {
  return !isNull(str);
}

//重构String
function format(src, de) {
  var s = src;
  var i = de.length;
  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), de[i]);
  }
  return s;
}

//url获取参数
function getQueryString(url, name) {
  url = url.substring(url.indexOf("?") + 1)
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}



//设置
module.exports = {
  string2Array: string2Array,
  array2String: array2String,
  isNull: isNull,
  isNotNull: isNotNull,
  format: format,
  getQueryString: getQueryString
}