// pages/storer/goodcategaryadd.js
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{ classify_id: '', classify_name: '--可选填--'}],
    index:0,
    aname:'',
    textArea:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkHightClassify();
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
  //分类名称
  className:function(e){
    this.setData({
      aname: e.detail.value,
    })
  },
  //查询一级商品类目
  checkHightClassify: function () {
    const shopnum = app.globalData.shoopnum;
    api.Cpic_fetchPost(api.checkClassify, {
      "shop_no": shopnum, "parent_id": ''
    }, (err, res) => {
      var topc = this.data.array;
      if (err == "00") {
       var  c= topc.concat(res.data);
        this.setData({
          array: c,
        })
      } else {

      }
    });  
  },
//新增分类
  makesure:function(){
    const shopnum = app.globalData.shoopnum;
    const cvalue = this.data.aname;
    const detav = this.data.textArea
    const parray = this.data.array;
    const pindex = this.data.index;

    var currentid = parray[pindex].classify_id;  

    api.Cpic_fetchPost(api.addClassify, {
      "shop_no": shopnum, "classify_name": cvalue, "parent_id": currentid, "remark": detav
    }, (err, res) => {
      if (err == "00") {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: err,
          icon: 'fail',
          duration: 2000
        })
      }
    });

  },
  bindTextAreaBlur:function(e){
    this.setData({
      textArea:e.detail.value
    })

  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
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