// pages/content/login.js
var api = require('../../utils/api.js');
var mdk = require('../../utils/md55.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index: 0,
    telephonenum: '',
    password: '',
    shopsArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //登陆
  loginAction: function () {
    const shops = this.data.shopsArr;
    const indx = this.data.index;
    const tel = this.data.telephonenum;
    const pwd = this.data.password;
    console.log('密码是：'+pwd);
    var password = mdk.hexMD5(pwd).toUpperCase();
    var shopnum = '';
    if (shops.length > 0) {
      shopnum = shops[indx].shop_no;
    }
    api.Cpic_fetchPost(api.LOGIN, { "shop_no": shopnum, "phone_num": tel, "passwd": password }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data_user);
      if(err !='00'){
        wx.showModal({
          title: '登陆失败',
          content: res.ReturnMsg,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
      const userdata = res.data_user;
      if (userdata == null) {
        console.log('data is null');
      } else {
        const shopnum = userdata.shop_no;
        app.globalData.shoopnum = shopnum;
        app.globalData.shopName = userdata.shop_name;
        app.globalData.merchno = userdata.merchant_no;
        if (userdata.certfy_flag == '1') {  //是老板
          wx.navigateTo({
            url: '/pages/content/tindex?telphone='+tel,
          })
        } else {
          if (userdata.user_position) {   //岗位权限 
          }
        }
      }
    })


  },
  bindPickerChange: function (e) {
    const value = e.detail.value;
    this.setData({
      index: value,
    })
  },
  //输入密码
  bindpasswordInput: function (e) {
    const vale= e.detail.value;
    this.setData({
      password: vale,
    })
  },
  //输入手机号
  bindNameInput: function (e) {
    const inputValue = e.detail.value;
    if (inputValue == ''||inputValue.length<11) {
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
          telephonenum: inputValue,
          shopsArr: reqarr
        })
      }
    })
  },

  //忘记密码
  forgetPwd: function () {
    wx.navigateTo({
      url: '../content/fogetpwd',
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