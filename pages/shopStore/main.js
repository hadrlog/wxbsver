//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    contentImage: [{ tittle: '库存查询', image: "/pages/images/shouk.png" }, { tittle: '出库', image: "/pages/images/ribao.png" }, { tittle: '入库', image: "/pages/images/xiaoshou.png" }, { tittle: '库存盘点', image: "/pages/images/keliul.png" }, { tittle: '单据审核', image: "/pages/images/keliul.png" }, { tittle: '供应商', image: "/pages/images/keliul.png" }, { tittle: '添加商品', image: "/pages/images/keliul.png" }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
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
      url: '/pages/content/login',
    })
  },
  nexshow: function (e) {
    console.log(e);
    var cindex = e.currentTarget.dataset.idx;
    switch (cindex) {
      case 0:
        console.log('---');

        wx.navigateTo({
          url: '/pages/content/kucun',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

        break;
      case 1:
        wx.navigateTo({
          // url: '/pages/storer/goods',
          url: '/pages/shopStore/bouter',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/shopStore/checkStore',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/shopStore/auditList',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/shopStore/interstore',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/storer/smerchant',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/pages/shopStore/goodsEdit',
        })
        break;
    }
  }
})
