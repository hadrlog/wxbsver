// pages/content/fogetpwd.js
var api = require('../../utils/api.js');
var Timers = null;
var mdk = require('../../utils/md55.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    index:0,
    telephone:'',
    validcode:'',  //验证码
    shopArr:[],  //门店
    newpsw:'',  //新密码  

    verification: '',
    showtime: '重新发送(60)',
    showverification: true,
    showt: false,
    count: 60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindPickerChange: function (e) {
    const value = e.detail.value;
    this.setData({
      index: value,
    })
  },
  //输入手机号
  bindNameInput: function (e) {
    const inputValue = e.detail.value;
    if (inputValue==''){
      return;
    }
    api.Cpic_fetchPost(api.SHOPCHECK, { "phone_num": inputValue }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (res.data == null) {
        console.log('data is null');
      } else {
        var shops = [];
        const reqarr = res.data;
        for (var i = 0; i < reqarr.length; i++) {
          shops.push(reqarr[i].shop_name)
        }
        this.setData({
          array: shops,
          telephone: inputValue,
          shopArr: reqarr,
        })
      }
    })
  },
  // 启动倒计时
  beginTimer() {
    var Timers = null;
    this.setData({
      showt: true,
      showverification: false,
      count: 60,
      Timers: null,
      showtime: '重新发送(60)'
    })
    var that = this;
    //如果定时器已经器动了
    if (!Timers) {
      Timers = setInterval(function () {
        var count = that.data.count - 1;
        that.setData({
          showtime: "重新发送(" + count + ")",
          Timers: Timers,
          count: count
        })
        if (count <= 0) {
          clearInterval(Timers)
          that.setData({
            count: 60,
            showt: false,
            showverification: true
          })
        }
      }, 1000);
    }
  },
  //获取验证码
  yanzhenm:function(){
    const phone = this.data.telephone;
    if (phone==''){
      wx.showToast({
        title: '系统异常，稍后再试',
      })
    }else{
      api.Cpic_fetchPost(api.VALIADCODE, {
        "phone_num": phone}, (err, res) => {
        console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
        if (res.data == null) {
          console.log('data is null');
        } else { 
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
    this.beginTimer();
  },
  bindValidInput:function(e){
    this.data.validcode = e.detail.value;
  },
  bindPasswordInput:function(e){
    this.data.newpsw = e.detail.value;
  },
//提交
  submitTs:function(){
    const tel = this.data.telephone;
    const rcode = this.data.validcode;
    const whi = this.data.index;
    const shup = this.data.shopArr;
    if (shup==''){
      wx.showToast({
        title: '请选择门店',
      })
      return;
    }
    const shopcode = shup[whi].shop_no;
    const nps = this.data.newpsw;
    var password = mdk.hexMD5(nps).toUpperCase();
    api.Cpic_fetchPost(api.RESETPWD, {
      "shop_no": shopcode, "phone_num": tel, "identitying_code": rcode, "new_passwd": password}, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (res.data == null) {
        console.log('data is null');
      } else {
        wx.showModal({
          title: '成功',
          content: '密码修改成功，是否跳转到登陆界面',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
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