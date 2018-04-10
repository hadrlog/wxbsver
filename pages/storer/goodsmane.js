// pages/salepart/goodsinfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    catagary: ['水果', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车', '家具', '轿车'],
    curIndex: 0,
    detail: [{ pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }, { pic_little: '/pages/images/goods.png', product_name: '小商品小商品小商品小商品小商品小商品小商品小商品', market_price: 1000 }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scancode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },
  switchTab: function (e) {
    const cudx = e.currentTarget.dataset.index;
    this.setData({
      curIndex: cudx,
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