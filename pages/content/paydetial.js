var wxCharts = require('/../../utils/wxcharts.js');
var api = require('../../utils/api.js');
var app = getApp();
var columnChart = null;
var chartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 100, 37, 19,12],
    categories: ['现金', '会员卡', '微信', '支付宝', '银行卡','代金券']
  }
};
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    selctype: 0,
    cyear: 2017,
    cmonth: 12,
    cday: 1,
    col: '#89D951',
    week: '',
    pretap:0,  //点击向前-1 ，向后+1
    currentcategaty: ['现金', '会员卡', '微信', '支付宝', '银行卡','代金券'],
    data:[0,0,0,0,0,0],
    vipcont:0,
    vipamount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var date = new Date();
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ?  (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ?  date.getDate() : date.getDate();  
    this.setData({
      cyear:Y,
      cmonth: M,
      cday:D,
    })
    this.checkpayConsistOf();
  },
  //查询收款构成统计
  checkpayConsistOf:function(){
    const shopnum = app.globalData.shoopnum;
    const chetyp = this.data.selctype;
    const week = this.data.week;
    var str_before = '';
    var str_after = '';

    var currentypt = '';
    var rmouth ='';


    var day = '';
    switch (chetyp){
      case 0:
        currentypt = "01";
        const cday =this.data.cday;
        var cd = parseInt(cday)<10?('0'+cday):cday;
        const cmotn = this.data.cmonth;
        var cm = parseInt(cmotn)<10?('0'+cmotn):cmotn;
         day = this.data.cyear + '-' + cm + '-' + cd;

      break;
      case 1:
        currentypt = "02";
        str_before = week.split('~')[0];
        str_after = week.split("~")[1];

      break;
      case 2:
        currentypt = "03";
        const mnth = this.data.cmonth;
        var cmt = parseInt(mnth) < 10 ? ('0' + mnth) : mnth;
        rmouth = this.data.cyear + '-' + mnth;
      break;
    }
    api.Cpic_fetchPost(api.PAYCONSIST, { "shop_no": shopnum, "type": currentypt, "day_time": day, "week_start_date": str_before, "week_end_date": str_after, "month_date": rmouth}, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      const cash_amt = res.data.cash_amt; 
      const card_amt = res.data.card_amt;
      const wechat_amt = res.data.wechat_amt;
      const alipay_amt = res.data.alipay_amt;
      const bank_card_amt = res.data.bank_card_amt;
      const coupon_amt = res.data.coupon_amt;
      const charge_cont = res.data.charge_count;  //充值次数
      const charge_amont = res.data.charge_amount;  //充值金额

      var trcash_amt = (parseInt(cash_amt) * 0.01).toFixed(2);
      var trcard_amt = (parseInt(card_amt) * 0.01).toFixed(2);
      var trwechat_amt = (parseInt(wechat_amt) * 0.01).toFixed(2);
      var tralipay_amt = (parseInt(alipay_amt) * 0.01).toFixed(2);
      var trbank_card_amt = (parseInt(bank_card_amt) * 0.01).toFixed(2);
      var trcoupon_amt = (parseInt(coupon_amt) * 0.01).toFixed(2);
      var vipamt = (parseInt(charge_amont) * 0.01).toFixed(2);
    
      this.setData({
        data: [trcash_amt, trcard_amt, trwechat_amt, tralipay_amt, trbank_card_amt, trcoupon_amt],
        charge_amont:charge_cont,
        vipamount: vipamt

      })
      this.updateData();
    })
  },
  createSimulationData: function () {
    var categories = ['现金', '会员卡', '微信', '支付宝', '银行卡','代金券'];
    // var data = [];
    // for (var i = 0; i < 6; i++) {
        
    //   data.push(Math.random() * (20 - 10) + 10);
    // }
    return {
      categories: categories,
      data: this.data.data,  
    }
  },
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      // format: function (val, name) {
      //   return val.toFixed(2);
      // }
    }];
    columnChart.updateData({
      categories: simulationData.categories,
      // categories: chartData.main.categories,
      series: series
    });
  },
  datePickerChangeEvent: function (e) {
    const date = new Date(Date.parse(e.detail.value));
    var newYear = date.getFullYear();
    var newMonth = date.getMonth() + 1;
    var todayIndex = date.getDate();
    this.setData({
      cyear: newYear,
      cmonth: newMonth,
      cday: todayIndex,
      selctype:0,
    })
    this.checkpayConsistOf();
  },
  datePickerChangeEvent2:function(e){

    const date = new Date(Date.parse(e.detail.value));
    var newYear = date.getFullYear();
    var newMonth = date.getMonth() + 1;
    var todayIndex = date.getDate();
    this.setData({
      cyear: newYear,
      cmonth: newMonth,
      selctype:2,
    })
    this.checkpayConsistOf();
  },
  onReady: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,
      series: [{
        name: '1成交',
        // data: chartData.main.data,
        data:this.data.data,
        format: function (val, name) {
          return val.toFixed(2);
        },
        // color: '#1a96fe',
      }],
      yAxis: {
        // format: function (val) {
        //   return val + '万';
        // },
        title: '单位:(元)',
        min: 0,
        disabled: false,
        gridColor: 'lightgray',
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration',
      },
      width: windowWidth,
      height: 200,
    });
  },
  handleCalendar(e) {
   
    const witchtype = this.data.selctype;
    const handle = e.currentTarget.dataset.handle;
    var cur_year = this.data.cyear;
    var cur_month = this.data.cmonth;
    var cur_day = this.data.cday;
    switch (witchtype) {
      case 0:  //日
        if (handle == 'prev') 
        {  //向前
        console.log('preday');
          const predate = this.getThisMonthDays(cur_year, cur_month-1);
          let preday = cur_day-1;
          if (preday<1){
            preday = predate;
            cur_month = cur_month - 1;
          }
          if (cur_month<1){
            preday = 31;
            cur_month = 12;
            cur_year = cur_year-1;
          }
          this.setData({
            cyear: cur_year,
            cmonth: cur_month,
            cday: preday,
          })

        } else {
          var nxday = cur_day+1;
          const predate = this.getThisMonthDays(cur_year, cur_month);
          if (nxday > predate){
            cur_month = cur_month+1;
            nxday = 1;
          }
          if (cur_month>12){
            cur_year = cur_year+1;
            cur_month = 1;
          }
          this.setData({
            cyear: cur_year,
            cmonth: cur_month,
            cday: nxday,
          })
        }
        break;

      case 1: //周
        var pretap = this.data.pretap;
        if (handle == 'prev') {
          pretap = pretap-1;
        } else {
          pretap = pretap+1;
        }
        // var Nowdate = new Date();
        // var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() +6 - 7 * pretap) * 86400000);
        // var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000); const firstday = this.formatDate(WeekFirstDay);
        // const lastday = this.formatDate(WeekLastDay);
        var dat = Date.now() + pretap *7* 86400000;
        var calewk = this.weekCaculate(dat);
        this.setData({
          week: calewk,
          pretap: pretap,
        })

        break;

      case 2: //月
        if (handle == 'prev') {
          console.log('pre');
          let nmonth = cur_month - 1;
          let nyear = cur_year;
          if (nmonth < 1) {
            nyear = cur_year - 1;
            nmonth = 12;
          }
          this.setData({
            cyear: nyear,
            cmonth: nmonth
          })
        } else {
          let nmonth = cur_month + 1;
          let nyear = cur_year;
          if (nmonth > 12) {
            nyear = cur_year + 1;
            nmonth = 1;
          }
          this.setData({
            cyear: nyear,
            cmonth: nmonth
          })
        }
        break;
    }
    this.checkpayConsistOf();
  },

  //格式化日期：yyyy-MM-dd
  formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
        return (myyear+"-" + mymonth + "-" + myweekday);
  },

  showWeekLastDay()     
{     

    var Nowdate= new Date();     
    var WeekFirstDay= new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);     
    var WeekLastDay= new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);     
   var  M=Number(WeekLastDay.getMonth()) + 1;
   return this.formatDate(WeekLastDay);     
  },
   showWeekFirstDay()     
{     
    var Nowdate= new Date();     
    var WeekFirstDay= new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);     
   var  M=Number(WeekFirstDay.getMonth()) + 1     
   return this.formatDate(WeekFirstDay);  
      
  },
//获取当月多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month,day) {
    return new Date(Date.UTC(year, month - 1, day)).getDay();
  },
  
  weekCaculate:function(e){
    // const dateOfToday = Date.now() - 1 * 86400000;
    const dateOfToday = e;
    const dayOfToday = (new Date(dateOfToday).getDay() + 7 - 1) % 7;
    const daysOfThisWeek = Array.from(new Array(7))
      .map((_, i) => {
        const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
        return date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0')
      })
      return (daysOfThisWeek[0]+'~'+daysOfThisWeek[6]);
  },

  selctType: function (e) {
    var index = e.currentTarget.dataset.info;
    this.setData({
      selctype: index
    })
    
    var calewk = this.weekCaculate(Date.now());

    this.setData({
      week: calewk,
    })
    this.checkpayConsistOf();
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