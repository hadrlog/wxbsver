var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();
var columnChart = null;
var chartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 100, 37, 19],
    categories: ['现金', '会员卡', '微信', '支付宝', '银行卡']
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
    col: 'blue',
    week: '',
    pretap:0,  //点击向前-1 ，向后+1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  createSimulationData: function () {
    var categories = ['现金', '会员卡', '微信', '支付宝', '银行卡'];
    var data = [];
    for (var i = 0; i < 5; i++) {
      
      data.push(Math.random() * (20 - 10) + 10);
    }
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
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
      cur_year: newYear,
      cur_month: newMonth,
      cur_day: todayIndex
    })
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
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        },
        color: '#1a96fe',
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        },
        title: '单位:万元',
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
    this.updateData();
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
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1 - 7 * pretap) * 86400000);
        var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000); const firstday = this.formatDate(WeekFirstDay);
        const lastday = this.formatDate(WeekLastDay);
        this.setData({
          week: firstday + '~' + lastday,
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
  },

  //格式化日期：yyyy-MM-dd
  formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if(mymonth < 10){
      mymonth = "0" + mymonth;
    }
        if(myweekday < 10){
      myweekday = "0" + myweekday;
    }
        return (myyear+"/" + mymonth + "/" + myweekday);
  },

  showWeekLastDay()     
{     
    var Nowdate= new Date();     
    var WeekFirstDay= new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);     
    var WeekLastDay= new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);     
   var  M=Number(WeekLastDay.getMonth()) + 1     
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
  

  selctType: function (e) {
    var index = e.currentTarget.dataset.info;
    this.setData({
      selctype: index
    })
    const lastday = this.showWeekLastDay();
    const firstday = this.showWeekFirstDay();
    console.log(firstday + '~' + lastday);
    this.setData({
      week: firstday + '~' + lastday,
    })
    this.updateData();
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