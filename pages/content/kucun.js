// pages/content/kucun.js
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: {
      searchValue: '',
      showClearBtn: false
    },
    selectpaix: 0,
    inputValue: '',
    money: 0,
    goods_amount: 0,
    goodArr: [],
    noword: false,
    pageNum:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.responseServer();
  },
  searchAction: function () {
    this.setData({
      goodArr:[],
      pageNum:1,
    })
    this.responseServer();
  },
  //向库存查询
  responseServer: function () {
    const shopnum = app.globalData.shoopnum;
    const dtype = this.data.selectpaix;
    const pagenumber = this.data.pageNum;
    var ody = '01';
    switch (dtype) {
      case 0:
        ody = '01';
        break;
      case '1':
        ody = '02';
        break;
    }
    const inputvalue = this.data.inputValue;

    api.Cpic_fetchPost(api.KCCX, {
      "shop_no": shopnum, "order_by": ody, "remember_code": '', "product_name": inputvalue, "product_code": '', "display_number": '10', "display_page": pagenumber
    }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (err == '00') {
        var kucn = res.data.sum_shop_store_count;
        var tmony = (parseInt(res.data.sum_amount_shop_store) * 0.01).toFixed(2);
        var goary = res.data_detail;
        var flag = false;
        var garr = this.data.goodArr;
        var mltArr = [];
        if (goary.length > 0) {
          flag = true;
          for (var i = 0; i < goary.length; i++) {
            var temg = goary[i];
            var pstyle = temg.pro_style;
            var productName = '';
            var content = '';
            if (pstyle) {
              content = pstyle + '/';
            }
            if (temg.pro_color) {
              content = content + temg.pro_color + '色/';
            }
            if (temg.pro_size) {
              content = content + temg.pro_size + '/';
            }

            if (temg.net_content) {
              content = content + temg.net_content + temg.base_unit + '/';
            }
            if (temg.pro_edition) {
              content = content + 'v' + temg.pro_edition + '/';
            }
            if (temg.pro_menu) {
              content = content + temg.pro_menu + '/';
            }
            if (temg.pro_packing) {
              content = content + temg.pro_packing + '/';
            }
            if (temg.pro_series) {
              content = content + temg.pro_series + '/';
            }
            if (temg.pro_flavor) {
              content = content + temg.pro_flavor + '/';
            }
            if (temg.pro_place) {
              content = content + temg.pro_place + '/';
            }
            if (content != '') {
              productName = temg.product_name + '(' + content + ')';
              productName = productName.substring(0, productName.length - 2);
              productName = productName + ')';

            } else {
              productName = temg.product_name;
            }

            var productAmount = temg.store_count;
            var salePrice = parseInt(temg.sell_price) * 0.01;
            var sprice = (salePrice * parseInt(productAmount)).toFixed(2);
            var temdic = { pname: productName, pamount: productAmount, price: sprice };
            mltArr.push(temdic);
          }
          garr = garr.concat(mltArr);
        } else {
          flag = false;
        }
        this.setData({
          money: tmony,
          goods_amount: kucn,
          noword: flag,
          goodArr: garr,
        })
      } else {
        wx.showToast({
          title: err,
          icon: 'fail',
          duration: 2000
        })
      }

    })
  },
  //上拉
  // 下拉刷新  
  onPullDownRefresh: function () {
    // // 显示导航栏loading  
    // wx.showNavigationBarLoading();
    // // 调用接口加载数据  
    // this.loadData();
    // // 隐藏导航栏loading  
    // wx.hideNavigationBarLoading();
    // // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();
  },
  // 上拉加载  
  onReachBottom(e) {
    let  that = this;
    if (that.data.noword) {
      that.setData({
        pageNum: that.data.pageNum + 1,  // 每次触发上拉事件，把pageNum+1  
      });

      that.responseServer();
    }
  },

  tvpaction: function (e) {
    const kc = e.currentTarget.dataset.info;
    this.setData({
      selectpaix: kc,
      pageNum: 1,  // 每次触发上拉事件，把pageNum+1  
      goodArr:[],
    })
    this.responseServer();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //输入内容时
  searchActiveChangeinput: function (e) {
    const val = e.detail.value;
    this.setData({
      'search.showClearBtn': val != '' ? true : false,
      'search.searchValue': val
    })
  },
  //点击清除搜索内容
  searchActiveChangeclear: function (e) {
    this.setData({
      'search.showClearBtn': false,
      'search.searchValue': ''
    })
  },
  //点击聚集时
  focusSearch: function () {
    if (this.data.search.searchValue) {
      this.setData({
        'search.showClearBtn': true
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})