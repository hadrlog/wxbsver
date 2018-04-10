
var mdk = require('./md55.js');
// var HOST = "https://kmzgws.bitbonds.cn";  //开发地址
// var HOST = "https://kmzgws.bestyicai.com"; //生产地址
var HOST = "http://shsandbox.etonepay.com/kmzgw"

var md5key = ""

//查询
const SHOPCHECK = HOST +"/mini_program/business_statistics/searchShopUser"
//获取验证码
const VALIADCODE = HOST +"/mini_program/business_statistics/getIdentifyingCode"
//重制密码
const RESETPWD = HOST +"/mini_program/business_statistics/resetShopUserPassword"
//登陆
const LOGIN = HOST +"/mini_program/business_statistics/login"
//门店应收、实收、毛利率统计
const GROSSPROFIT = HOST +"/mini_program/business_statistics/getGrossProfit"
//门店收款构成统计
const PAYCONSIST = HOST + "/mini_program/business_statistics/payConsistOf"
//门店销售统计
const SHOPGROSSPROFIT = HOST +"/mini_program/business_statistics/getShopGrossProfit"
//商品类别排行查询
const GOODSCATERY = HOST +"/business_statistics/mini_program/storeSalesClassfiyRankingsPage"
//商品销售排行查询
const GOODSELLQUERY = HOST +"/business_statistics/mini_program/storeSalesRankingsPage"
//门店销售日报统计
const DAILYQUERY = HOST +"/business_statistics/mini_program/salesDailyReport"
//客流量查询
const KELL = HOST +"/business_statistics/mini_program/passengerFlowReport"
//库存查询
const KCCX = HOST +"/business_statistics/mini_program/getShopStorePage"
//门店销售排行
const SHOPRACE = HOST +"/business_statistics/mini_program/merchantShopSalesRankings"
//查询门店商品类别列表
const checkClassify = HOST +"/mini_program/ShopStore/shopProductClassify"
//门店添加商品类别
const addClassify = HOST +"/mini_program/ShopStore/addShopProductClassify"
//添加门店商品
const ADDSHOPGOODS = HOST +"/mini_program/ShopStore/addShopProduct"
//出库
const OUTERSTORE = HOST +"/mini_program/ShopStore/addProductOutStore"
//入库
const INSERTSTORE = HOST +"/mini_program/ShopStore/addProductInStore"
//盘点
const TOTALCACULATE = HOST +"/mini_program/ShopStore/addStoreCheck"
//单据列表
const CHECKLIST = HOST +"/mini_program/ShopStore/selectShopStoreBill"
//单据详情
const CHECKDETAIL = HOST +"/mini_program/ShopStore/shopStoreBillDetail"
//更新库存订单状态
const UPDATEDETAIL = HOST +"/mini_program/ShopStore/updateStoreOrderStatus"
//查询供应商
const SERVERMER = HOST +"/mini_program/ShopStore/selectShopSupplier"
//添加供应商
const ADDSERVER = HOST +"/mini_program/ShopStore/addShopSupplier"

var WXPAYCODE = HOST +"/mini_program/wxPay"  //查询paycode


var UNITCODE = 'unitCode';

var SelectedBankInfo = 'SelectedBankInfo';
var LOGINSUCCESS = 'loginsuccess';


//get请求
function Cpic_fetchGet(url, callback) {
  wx.request({
    url: url,
    header: { 'Content-type': 'application/json' },
    success(res) {
      callback(null, res.data)
    },
    fail(e) {
      console.log(e)
      callback(e)
    }
  })
}

function NCpic_fetchPost(url, jsonParm,njsonParm, callback){
  var tempstr = '';
  var dic = jsonParm;
  var sdic = Object.keys(dic).sort();
  for (var ki in sdic) {
    if(sdic[ki] == njsonParm ){
      continue;
    }
    console.log(sdic[ki] + ":" + dic[sdic[ki]] + ",");
    tempstr += sdic[ki] + "=" + dic[sdic[ki]];
  }
  tempstr += md5key;
  tempstr = tempstr.replace(/\s+/g, "");
  var password = mdk.hexMD5(tempstr);
  password = password.toUpperCase()
  console.log("mdk:" + password);
  jsonParm["Md5Sign"] = password;
  console.log('发送post请求 url=' + url + '|' + 'jsonParm=' + JSON.stringify(jsonParm));
  // jsonParm.channel = "zzckapplet";

  wx.request({
    method: 'post',
    url: url,
    header: { 'Content-type': 'application/x-www-form-urlencoded' },
    data: JSON.stringify(jsonParm),
    success(res) {
      // wx.hideToast();
      var response_code = res.data.ReturnCode;
      var response_msg = res.data.ReturnMsg;
      //下面的showtoast 有问题 show 不出来
      if (response_msg === "" || response_code === "") {
        wx.showToast({
          title: "网络请求异常",
          icon: 'loading',
          mask: true,
          duration: 3000
        })
      } else if (response_code !== "00") {
        wx.showToast({
          title: response_msg.toString(),
          icon: 'loading',
          mask: true,
          duration: 3000
        })
        callback(response_code, res.data);
      } else {
        callback(response_code, res.data);
      }

      // console.log('接口地址=' + url + "返回为=" + JSON.stringify(res.data))
    },
    fail(e) {
      wx.hideToast();
      console.log(e)
      callback(e)
    },
    complete: function () {
      // complete
      wx.hideToast();
    }
  })
}
function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (str.indexOf('{') > -1) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
}
//post请求
function Cpic_fetchPost(url, jsonParm, callback) {
  var tempstr = '';
  var dic = jsonParm;
  var sdic = Object.keys(dic).sort();
  for (var ki in sdic) {
    var temp = dic[sdic[ki]];
    var jsons = '';
    if (Array.isArray(temp)) {
      jsons =   JSON.stringify(temp);
      // var dicarr ='';
      // for(var dic in temp){
      //   var jtem = JSON.stringify(temp[dic]);
      //   if (isJSON(jtem)) {
      //    console.log('objec temp');
      //   }
      // }
      tempstr += sdic[ki] + "=" + jsons;
    }else{
      tempstr += sdic[ki] + "=" + temp;
    }
    
  }
  tempstr += md5key;
  // tempstr = tempstr.replace(/\s+/g, ""); 
  var password = mdk.hexMD5(tempstr);
  password = password.toUpperCase()
  console.log("mdk:" + password);
  jsonParm["Md5Sign"] = password;
  console.log('发送post请求 url=' + url + '|' + 'jsonParm=' + JSON.stringify(jsonParm));
  // jsonParm.channel = "zzckapplet";
  
  wx.request({
    method: 'post',
    url: url,
    header: { 'Content-type': 'application/x-www-form-urlencoded' },
    data: JSON.stringify(jsonParm),
    success(res) {
      // wx.hideToast();
      var response_code = res.data.ReturnCode;
      var response_msg = res.data.ReturnMsg;
      //下面的showtoast 有问题 show 不出来
      if (response_msg === "" || response_code === "") {
        wx.showToast({
          title: "网络请求异常",
          icon: 'loading',
          mask: true,
          duration: 3000
        })
      } else if (response_code !== "00" && response_msg !=null){
        wx.showToast({
          title: response_msg.toString(),
          icon: 'loading',
          mask: true,
          duration: 3000
        })
        callback(response_code, res.data);
      }else {
        callback(response_code, res.data);
      }
    },
    fail(e) {
      wx.hideToast();
      console.log(e)
      callback(e)
    },
    complete: function () {
    	// complete
    	wx.hideToast();
    }
  })
}


//上传图片请求
function Cpic_FetchPicturePost(url, file, formData, name, callback) {
  formData.channel = "zzckapplet";
  console.log('上传图片请求 url=' + url + 'formData=' + JSON.stringify(formData) + '图片名字=' + name);
  wx.uploadFile({
    url: url,
    filePath: file,
    formData: formData,
    name: name,
    success: function (res) {
      var data = res.data
      var status = res.statusCode
      console.log("success_data", data);
      console.log("success_status", status);
      console.log("==上传图片请求返回成功==" + res);
      callback(res.data);
    },
    complete: function () {
      console.log("upload complete");
    },
    fail: function (res) {
      console.log("==上传图片请求失败==", res);
    }
  })
}

//写入数据存储
function SetCpic_localStorage(storage_key, storage_data) {
  try {
    wx.setStorageSync(storage_key, storage_data);
    console.log("存储成功" + storage_key + "===" + storage_data)
  } catch (e) {
  }
}

//读取存储数据
function getCpic_localStorage(storage_key, callback) {
  try {
    var value = wx.getStorageSync(storage_key);
    if (value) {
      callback(value);
    }
  } catch (e) {
    // Do something when catch error
    console.log(e);
  }
}

//清除数据存储
function ClearCpic_localStorage() {
  wx.clearStorage();
}

//移除数据存储
function RemoveCpic_localStorage(storage_key) {
  wx.removeStorage({
    key: storage_key
  })
}

function CheckLoginStatus(callback) {
  getCpic_localStorage(LOGINSUCCESS, function (res) {
    if (res !== '1') {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    else {
      callback();
    }
  });
}

//存储log  url--当前页面  content--日志内容
function SaveLogs(url, content) {
  var caseNo = "";
  this.getCpic_localStorage(this.LOCALCASENO, function (res) {
    caseNo = res;
  });
  this.Cpic_fetchPost(this.WEBLOGS, { "url": url, "type": "0", "content": content, "caseNo": caseNo }, (err, res) => {
    console.log("存储日志成功" + res);
  })
}

//支付签名
function PaypackSign(jsonParm, callback) {
  var tempstr = '';
  var dic = jsonParm;
  var sdic = Object.keys(dic).sort();
  for (var ki in sdic) {
    console.log(sdic[ki] + ":" + dic[sdic[ki]] + ",");
    tempstr += sdic[ki] + "=" + dic[sdic[ki]];
  }
  tempstr = tempstr.replace(/\s+/g, "");
  var password = mdk.hexMD5(tempstr);
  password = password.toUpperCase();
  callback(password);
  // return password;
}

module.exports = {
  Cpic_fetchPost: Cpic_fetchPost,
  NCpic_fetchPost: NCpic_fetchPost,
  PaypackSign: PaypackSign,
  SHOPCHECK: SHOPCHECK,
  VALIADCODE: VALIADCODE,
  RESETPWD: RESETPWD,
  LOGIN: LOGIN,
  GROSSPROFIT: GROSSPROFIT,
  PAYCONSIST: PAYCONSIST,
  GOODSCATERY:GOODSCATERY,
  GOODSELLQUERY: GOODSELLQUERY,
  DAILYQUERY: DAILYQUERY,
  KELL: KELL,
  KCCX: KCCX,
  SHOPRACE: SHOPRACE,
  checkClassify: checkClassify,
  addClassify: addClassify,
  ADDSHOPGOODS: ADDSHOPGOODS,
  OUTERSTORE: OUTERSTORE,
  INSERTSTORE: INSERTSTORE,
  TOTALCACULATE: TOTALCACULATE,
  CHECKLIST: CHECKLIST,
  CHECKDETAIL: CHECKDETAIL,
  UPDATEDETAIL: UPDATEDETAIL,
  SERVERMER: SERVERMER,
  ADDSERVER: ADDSERVER,
}
