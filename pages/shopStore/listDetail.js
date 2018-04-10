// pages/shopStore/listDetail.js
var app = getApp();
var api = require('../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bill:{},
    goodlist:[], 
    billNum:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jstr = options.jsonstr;
    var jsn = JSON.parse(jstr);
    
    this.setData({
      bill:jsn,
      billNum: jsn.bill_no,
    })
    this.reqestBillDetail(jsn.bill_no);
  },
  //请求详情数据
  reqestBillDetail:function(e){
    var billnum = e;
  
    const shopnum = app.globalData.shoopnum;
    api.Cpic_fetchPost(api.CHECKDETAIL, { "shop_no": shopnum, "bill_no": billnum}, (err, res) => {
      if (err == "00") {
        this.setData({
          goodlist: res.data_detail,
        })
      }else{
        wx.showToast({
          title: '请求失败',
          duration:3000
        })
      }
    })
  },
  //审核
  shAction:function(){
    const bill = this.data.billNum;
   
    const shopnum = app.globalData.shoopnum;
    api.Cpic_fetchPost(api.UPDATEDETAIL, { "shop_no": shopnum, "bill_no": bill, "audit_state": '1', remark:''}, (err, res) => {
      if (err == "00") {
          wx.showModal({
            title: '提示',
            content: '成功',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateBack({
                  delta: 1,
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
        })
      } else {
        wx.showToast({
          title: '请求失败',
          duration: 3000
        })
      }
    })


  },
  backAction:function(){
    wx.navigateBack({
      delta: 1,
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