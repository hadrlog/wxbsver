// pages/storer/addmerchant.js
var app = getApp();
var api = require('../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */

  data: {
    merchantName:'',
    merchantCode:'',
    userName:'',
    telephone:'',
    remark:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //提交
  reServeAction:function(){
    const sname = this.data.merchantName;
    const scode = this.data.merchantCode;
    const uname = this.data.userName;
    const phone = this.data.telephone;

    const shopnum = app.globalData.shoopnum;
    api.Cpic_fetchPost(api.ADDSERVER, {
      "supplier_name": sname, "supplier_no": scode, "shop_no": shopnum, "link_man": uname,"link_phone":phone
    }, (err, res) => {
      var titl='';
      if (res.ReturnCode == "00"){
        titl = "成功";
      }else{
        titl = err;
      }

      wx.showModal({
        title: '提示',
        content: titl,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  reqAction:function(e){
    var index = Number(e.currentTarget.dataset.info);
    var value = e.detail.value;
    console.log('index:' + index + 'value:' + value);
 
    switch (index){
     case 1:
      this.setData({
        merchantName: value,
      })
     break;
     case 2:
        this.setData({
          merchantCode: value,
        })
     break;
     case 3:
        this.setData({
          userName: value,
        })
     break;
     case 4:
        this.setData({
          telephone: value,
        })
     break;
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