//index.js
//获取应用实例
var api = require('../../utils/api.js');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    contentImage: [{ tittle: '收款构成', image: "/pages/images/shouk.png" }, { tittle: '销售日报', image: "/pages/images/ribao.png" }, { tittle: '销售排行', image: "/pages/images/xiaoshou.png" }, { tittle: '客流量', image: "/pages/images/keliul.png" }, { tittle: '库存管理', image: "/pages/images/kucun.png" }, { tittle: '门店销售排行', image: "/pages/images/paihang.png" },],

    ramount: '--', //今日应收
    namount: '--', //实收 
    grate: '--', //毛利
    prate: '--', //毛利率
    telphone:'',
    shopname:'',
  },
  //事件处理函数   
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    const tet = options.telphone;
    var dst = tet.substring(0, 3) + "****" + tet.substring(7);
    var sh = app.globalData.shopName ;

    this.setData({
      telphone: dst,
      shopname:sh,
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,

      })
    }else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.postgetGrossProfit();
  },
  //获取应收，实收，毛利率统计
  postgetGrossProfit: function () {
    const shopnum = app.globalData.shoopnum;
    const datetemp = this.formatDate(new Date());

    console.log('当前日期：' + datetemp);
    api.Cpic_fetchPost(api.GROSSPROFIT, { "shop_no": shopnum, "trade_date": datetemp }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (res.data) {
        const receivable_amount = res.data.receivable_amount;  //应收 单位分
        const net_receipts_amount = res.data.net_receipts_amount; //实收 单位分
        const gross_profit_rate = res.data.gross_profit_rate; //毛利率 单位分

        var reciver = (parseInt(receivable_amount) * 0.01).toFixed(2);
        var net_receipts = (parseInt(net_receipts_amount) * 0.01).toFixed(2);
        var gross_profit = (parseInt(gross_profit_rate) * 0.01).toFixed(2);
        var pd = '';
        if (net_receipts_amount == 0) {
          pd = '0.00';
        } else {
          pd = (parseInt(gross_profit_rate) / parseInt(net_receipts_amount) * 100).toFixed(2);
        }
        this.setData({
          ramount: reciver,
          namount: net_receipts,
          grate: gross_profit,
          prate: pd,
        })
      }
    })
  },

  //格式化日期：yyyy-MM-dd
  formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumplogin: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  nexshow: function (e) {
    console.log(e);
    var cindex = e.currentTarget.dataset.idx;
    switch (cindex) {
      case 0:
        wx.navigateTo({
          url: '/pages/content/paydetial',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) {},
        })

        break;
      case 1:
        console.log('++');
        wx.navigateTo({
          url: '/pages/content/datesale',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/content/kell',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/shopStore/main',
          // url:'/pages/content/kucun',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/content/paihan',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/content/xiaoshou',
        })
        break;
    }
  }
})
