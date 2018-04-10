// pages/storer/smerchant.js
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchans:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkServers();
  },
  //查询供应商
  checkServers:function(){
    const shopnum = app.globalData.shoopnum;
    api.Cpic_fetchPost(api.SERVERMER, {
      "shop_no": shopnum}, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      this.setData({
        merchans:res.data
      })
    });
  },
  //添加供应商
  addmerchant:function(){
    wx.navigateTo({
      url: '/pages/storer/addmerchant',
    })
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
  
  }
})