// pages/storer/bouter.js
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goodsArr:[],
      inputValue:'', //输入框内容
      totalNum:0
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
  minusAction:function(e){
    const index = e.currentTarget.dataset.info;
    var arr = this.data.goodsArr;
    var tempdic = arr[index];
    var valu = parseInt(tempdic.amount)-1;
    if(valu ==0)return;
    tempdic.amount = valu;
    arr.splice(index, 1, tempdic);
    this.setData({
      goodsArr: arr,
    }) 
  },
  //修改数据 
  bindManual:function(e){
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
  plusAction:function(e){
    const index = e.currentTarget.dataset.info;
    var arr = this.data.goodsArr;
    var tempdic = arr[index];
    var valu = parseInt(tempdic.amount) +1;
    if (valu == 0) return;
    tempdic.amount = valu;
    arr.splice(index, 1, tempdic);
    this.setData({
      goodsArr: arr,
    }) 
  },
  //删除某一列
  deleCellAction:function(e){
    var tempArr = this.data.goodsArr;
    const vale = e.currentTarget.dataset.info;
    console.log(vale);
    tempArr.splice(vale, 1);
    this.setData({
      goodsArr: tempArr,
      totalNum:tempArr.length,
    })
  },
  //输入框输入
  bindRcodeInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  //扫描
  scanAction:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        this.requestGoodsDetail(res.result);
      }
    })
  },
  //搜索
  searchAction:function(){
    const vale = this.data.inputValue;
    this.requestGoodsDetail(vale);
  },
  //查询商品
  requestGoodsDetail:function(e){
    const shopnum = app.globalData.shoopnum;
    // api.Cpic_fetchPost(api.KCCX, {
    //   "shop_no": shopnum, "order_by": ody, "remember_code": '', "product_name": inputvalue, "product_code": '', "display_number": '10', "display_page": pagenumber
    // }, (err, res) => {
    //   console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
    // });

    var gooArr = this.data.goodsArr;
    var tempArr = {name:'水果',gnum:e,price:'0.01',amount:1000};
    gooArr.splice(0, 0, tempArr); 
    var total = gooArr.length;
    this.setData({
      goodsArr: gooArr,
      totalNum:total,
    })
  },
  //重置价格
  resetPrice:function(e){
      console.log("price:"+e);
      const index = e.currentTarget.dataset.index;
      const value = e.detail.value;
      var goar = this.data.goodsArr;
      var tempdic = goar[index];
      tempdic.price = value;
      goar.splice(index, 1, tempdic);
      this.setData({
        goodsArr: goar,
      }) 
  }
})