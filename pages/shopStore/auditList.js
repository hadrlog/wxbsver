// pages/shopStore/auditList.js
var displayNum = 6;
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */

 
  data: {
    array: [{ id: '00', typeName: '盘亏' }, { id: '01', typeName: '普通入库' }, { id: '11', typeName: '普通出库' }, { id: '02', typeName: '盘盈' }, { id: '04', typeName: '盘平' }, { id: '05', typeName: '采购入库' }, { id: '06', typeName: '调货入库' }, { id: '07', typeName: '调货出库' }, { id: '08', typeName: '采购退货出库' }, { id: '09', typeName: '采购单' }, { id: '10', typeName: '调货单' }, { id: '12', typeName: '采购退货' }, { id: '13', typeName: '调价单' }],
    index:0,
    dayArr:['当天','本周','本月','最近三个月','最近半年'],
    dindex:0,

    listDate:[], //订单数据
    displayPage:1,  //页面
    reqNomore:false, //加载不了更多数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  //显示详情
  showDetail:function(e){
    var listdata = this.data.listDate;
    const dex = e.currentTarget.dataset.info;
    var lsdt = listdata[dex];
    var jsn = JSON.stringify(lsdt);
    wx.navigateTo({
      url: "/pages/shopStore/listDetail?jsonstr=" + jsn
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
    this.CheckData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  this.setData({
    listDate: [], //订单数据
    displayPage: 1,  //页面
    reqNomore: false, //加载不了更多数据了
  })
  },
  datePickerChange:function(e){
    this.setData({
      dindex: e.detail.value,
      listDate:[],
      displayPage:1,
      reqNomore:false,
    })
    this.CheckData();
  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value,
      listDate:[],
      displayPage:1,
      reqNomore:false,
    })
    this.CheckData();
  },
  //查询数据
  CheckData:function(){
  
    const shopnum = app.globalData.shoopnum;
    const cateIndex = Number(this.data.index);  //类别
    const dayIndex = Number(this.data.dindex);
    const cateArr = this.data.array;
    const dpage = this.data.displayPage;
    var nomore = this.data.reqNomore;
    var dsarr = this.data.listDate;

    var starttime = ''; //开始时间
    var endtime = ''; //结束时间
  
    switch (dayIndex){
      case 0:
        var day = this.showToDay();
        starttime = day+' 00:00:00';
        endtime = day + ' 23:59:59';
      break;
      case 1:
        var start = this.showWeekFirstDay();
        starttime = start+' 00:00:00';
        var end = this.showWeekLastDay();
        endtime = end+" 24:00:00";
      break;
      case 2:
        var start = this.showMonthFirstDay();
        starttime = start+' 00:00:00';
        var end = this.showMonthLastDay();
        endtime = end+' 24:00:00';
      break;

      case 3:
    
        starttime = this.shwoNearThreeMonth();
    
        endtime = this.getCurrentTime();
      break;
      case 4:
        var stat = this.shwoNearSixMonth();
      
        endtime = this.getCurrentTime();

      break;
    }

    var cindex = cateArr[cateIndex].id;
    cindex = cindex+',';
    api.Cpic_fetchPost(api.CHECKLIST, { "shop_no": shopnum, "bill_type": cindex, "bill_no": '', "start_time": starttime, "end_time": endtime, "audit_state": '', "display_number": displayNum, 'display_page': dpage }, (err, res) => {
      if(err =="00"){
        var reda = res.data;
        if(reda.length>0){
          var nds =  dsarr.concat(reda);
          var curtotal = (dpage - 1) * displayNum+nds.length;  //现有的数据个数
          var serverNum = Number(res.data_total);
          if (curtotal >= serverNum){
            nomore = true;
          }else{
            nomore = false;
          }
          this.setData({
            listDate: nds,
            reqNomore:nomore,
          })
        }
      }
    })
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
    const nomore = this.data.reqNomore;
    if(nomore) return;
    var displaypage = this.data.displayPage;
    displaypage++;
    this.setData({
      displayPage: displaypage,
    })
    this.CheckData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //最近半年数据
  shwoNearSixMonth:function(){
    var nowday = new Date();
    var mont = nowday.getMonth() + 1;
    var y = nowday.getFullYear();
    var tempm = mont - 6+1;
    if (tempm <= 0) {
      mont = 12 + tempm;
      y--;
    } else {
      mont = tempm;
    }
   var smont = mont < 10 ? '0' + mont : mont;
    return y + '-'+smont +'-'+'01'+' 00:00:00';
  },
  //最近三个月
shwoNearThreeMonth:function(){
  var nowday = new Date();
  var mont = nowday.getMonth()+1;
  var y = nowday.getFullYear();
  var tempm = mont-2;
  if(tempm<=0){
    mont = 12+tempm;
    y--;
  }else{
    mont = tempm;
  }
  var  smont = mont<10?'0'+mont:mont;
  return y+'-'+smont+'-'+'01'+' 00:00:00';
},

//当天
showToDay:function()     
{     
    var Nowdate= new Date();     
    var  M=Number(Nowdate.getMonth()) + 1;
    var month = M<10?('0'+M):M;
    var day = Nowdate.getDate() < 10 ? ('0' + Nowdate.getDate()) : Nowdate.getDate();
    return Nowdate.getFullYear() + "-" + month + "-" + day;     
  },
  //本周第一天
   showWeekFirstDay:function()     
{     
    var nowdate= new Date();     
    var weekFirstDay = new Date(nowdate - (nowdate.getDay() - 1) * 86400000);     
    var M = Number(weekFirstDay.getMonth()) + 1;  
    var month = M<10?('0'+M):M;
    var day = weekFirstDay.getDate() < 10 ? ('0' + weekFirstDay.getDate()) : weekFirstDay.getDate();
    return weekFirstDay.getFullYear() + "-" + month + "-" +day;     
  },
  //本周最后一天
    showWeekLastDay:function()     
{     
      var nowdate= new Date();     
      var weekFirstDay = new Date(nowdate - (nowdate.getDay() - 1) * 86400000);     
      var WeekLastDay = new Date((weekFirstDay / 1000 + 6 * 86400) * 1000);     
    var   M=Number(WeekLastDay.getMonth()) + 1 ;
    var month = M < 10 ? ('0' + M) : M;
    var day = WeekLastDay.getDate() < 10 ? ('0' + WeekLastDay.getDate()) : WeekLastDay.getDate();
    return WeekLastDay.getFullYear() + "-" + month + "-" + day;     
  },
  //本月第一天
   showMonthFirstDay:function()     
{     
    var nowdate= new Date();     
    var MonthFirstDay = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);     
   var  M=Number(MonthFirstDay.getMonth()) + 1;  
   var month = M < 10 ? ('0' + M) : M;
   
   return MonthFirstDay.getFullYear() + "-" + month + "-" + '01';     
  },
  //本月最后一天
   showMonthLastDay: function()     
{     
     var nowdate= new Date();     
     var MonthNextFirstDay = new Date(nowdate.getFullYear(), nowdate.getMonth() + 1, 1);     
    var MonthLastDay= new Date(MonthNextFirstDay - 86400000);     
   var  M=Number(MonthLastDay.getMonth()) + 1;
   var month = M < 10 ? ('0' + M) : M;
   var day = MonthLastDay.getDate() < 10 ? ('0' + MonthLastDay.getDate()) : MonthLastDay.getDate();
   return MonthLastDay.getFullYear() + "-" + month + "-" + day;     
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
  
})