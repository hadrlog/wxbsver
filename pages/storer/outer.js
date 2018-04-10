// pages/storer/outer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCenterDialog:true,
    qcodenum:'',   //商品编号
    goodname:'', //商品名称
    goodnum:0,  //商品数量
    goodprice:0.00, //商品价格

    googsArr: [],  //添加商品列表
    edit:false, //编辑
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
  //商品编号
  bindCodeInput: function (e) {
    this.setData({
      qcodenum: e.detail.value
    })
  },
  //数量
  bindNumInput:function(e){
    this.setData({
      goodnum: e.detail.value
    })
  },
  //单价
  bindPriceInput:function(e){
    this.setData({
      goodprice: e.detail.value
    })
  },
  //编辑
  bianjiAction:function(){
    const status = this.data.edit;
    this.setData({
      edit:!status,
    })
  },
  //删除某一列
  deleCellAction:function(e){

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
  /*
  添加商品
  */
  addGoods:function(){
    const status = this.data.showCenterDialog;
    this.setData(
      {
        showCenterDialog:!status,
      }
    )
  },
  onClickdiaCenterView:function(){
    const status = this.data.showCenterDialog;
    this.setData(
      {
        showCenterDialog: !status,
      }
    )
    this.clearInputValue();
  },
  scanAction:function(){
    wx.scanCode({ 
      success: (res) => {
        console.log(res.result);
        this.checkGoodsExit();
        this.setData({
          qcodenum:res.result
        })
      }

    })
  },
  //通过商品条码查询商品
  checkGoodsExit:function(){

  },
  //确定
  onclickOn:function(){

    // qcodenum: '',   //商品编号
    //   goodname:'', //商品名称
    //     goodnum:0,  //商品数量
    //       goodprice:0.00, //商品价格

    //         googsArr: [],  //添加商品列表
    // const 
  },
  clearInputValue:function(){
    this.setData({
      qcodenum: '',   //商品编号
      goodname: '', //商品名称
      goodnum: 0,  //商品数量
      goodprice: 0.00, //商品价格
    })
  }
  
})