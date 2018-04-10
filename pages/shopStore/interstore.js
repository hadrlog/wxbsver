// pages/storer/bouter.js
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsArr: [],
    inputValue: '', //输入框内容
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShareAppMessage: function () {

  },
  //减少-1
  minusAction: function (e) {
    const index = e.currentTarget.dataset.info;
    var arr = this.data.goodsArr;
    var tempdic = arr[index];
    var valu = parseInt(tempdic.amount) - 1;
    if (valu < 0) return;
    tempdic.amount = valu;
    arr.splice(index, 1, tempdic);
    this.setData({
      goodsArr: arr,
    })
  },
  //修改数据 
  bindManual: function (e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    var goar = this.data.goodsArr;
    var tempdic = goar[index];
    tempdic.amount = value;
    goar.splice(index, 1, tempdic);
    this.setData({
      goodsArr: goar,
    })
  },

  //加+1
  plusAction: function (e) {
    const index = e.currentTarget.dataset.info;
    var arr = this.data.goodsArr;
    var tempdic = arr[index];
    var valu = parseInt(tempdic.amount) + 1;
    tempdic.amount = valu;
    arr.splice(index, 1, tempdic);
    this.setData({
      goodsArr: arr,
    })
  },
  //删除某一列
  deleCellAction: function (e) {
    var tempArr = this.data.goodsArr;
    const vale = e.currentTarget.dataset.info;
    tempArr.splice(vale, 1);
    this.setData({
      goodsArr: tempArr,
      totalNum: tempArr.length,
    })
  },
  //输入框输入
  bindRcodeInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //扫描
  scanAction: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        this.requestGoodsDetail(res.result);
      }
    })
  },
  //搜索
  searchAction: function () {
    const vale = this.data.inputValue;
    this.requestGoodsDetail(vale);
  },
  
  //查询商品
  requestGoodsDetail: function (e) {
    const shopnum = app.globalData.shoopnum;
    // const shopnum = "99953112900000100001";

    api.Cpic_fetchPost(api.KCCX, {
      "shop_no": shopnum, "order_by": '01', "remember_code": '', "product_name": '', "product_code": e, "display_number": '10', "display_page": '1'
    }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (err == "00") {
        var rdata = res.data_detail;
        if (rdata == 0) {
          wx.showToast({
            title: '未查询到该商品',
            icon: 'fail',
            duration: 5000
          })
        } else {
          var good_detail = rdata[0];
          var gooArr = this.data.goodsArr;
          var cprice = (parseInt(good_detail.sell_price) * 0.01).toFixed(2);
          var tempArr = { name: good_detail.product_name, gnum: e, price: cprice, amount: 0, samount: good_detail.store_count };
          gooArr.splice(0, 0, tempArr);
          var total = gooArr.length;
          this.setData({
            goodsArr: gooArr,
            totalNum: total,
          })
        }
      } else {
        wx.showToast({
          title: err,
          icon: 'fail',
          duration: 5000
        })
      }
    });
  },
  //重置价格
  resetPrice: function (e) {
    console.log("price:" + e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    var goar = this.data.goodsArr;
    var tempdic = goar[index];
    tempdic.price = value;
    goar.splice(index, 1, tempdic);
    this.setData({
      goodsArr: goar,
    })
  },
  getCurrentTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var m = date.getMonth() + 1;
    var month = m < 10 ? '0' + m : m;
    var day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
  },
  //入库操作
  innerAction:function(){
    var gd = this.data.goodsArr;
    if (gd.length == 0) return;
    var ctime = this.getCurrentTime();
    var handle_user = app.globalData.shopName;
    const shopnum = app.globalData.shoopnum;
    var outArr = [];
    // { name: good_detail.product_name, gnum: e, price: cprice, amount: good_detail.store_count, samount: good_detail.store_count };
    for (var i = 0; i < gd.length; i++) {
      var temp = gd[i];
      var pcode = temp.gnum;
      var num = temp.amount;
      var cost = (parseFloat(temp.price) * 100).toFixed(0);
      var dic = { "product_code": pcode, "product_num": num, "product_price": cost, "remark": "" };
      outArr.push(dic);
    }
    api.Cpic_fetchPost(api.INSERTSTORE, { "bussiness_date": ctime, "hander_user": handle_user, "supplier_no": '', "shop_no": shopnum, "bill_no": '', "other_price": '0', "remark": '', 'check_data': outArr }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      var taxt='';
      if (err == "00") {
        taxt ='成功';
      } else {
        taxt = res.ReturnMsg;
      }
      wx.showModal({
        title: '提示',
        content: taxt,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    });
  }
})