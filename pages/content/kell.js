var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();
var areaChart = null;
var ringChart = null;
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
    pretap: 0,  //点击向前-1 ，向后+1
  },

//日数据
  sbuildAreaChartDayData:function(){
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
      categories.push((i*2)+':00');
      data.push(Math.random() * (20 - 10) + 10);
    }
    return {
      categories: categories,
      data: data
    }
  },
//周
  sbuildAreaChartWeekData: function () {
    var categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    var data = [];
    for (var i = 0; i < 7; i++) {
      data.push(Math.random() * (20 - 10) + 10);
    }
    return {
      categories: categories,
      data: data
    }
  },
//月
  sbuildAreaChartMonthData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 31; i++) {
      categories.push('1-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }

    return {
      categories: categories,
      data: data
    }
  },



  buildAreaChart:function(){
    const areadata = this.sbuildAreaChartDayData();
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: areadata.categories,
      animation: true,
      series: [{
        name: '成交量1',
        data: areadata.data,
        // format: function (val) {
        //   return val.toFixed(0) + '人';
        // }
      }],
      yAxis: {
        title: '单位 (人)',
        // format: function (val) {
        //   return val.toFixed(2);
        // },
        min: 0,
        fontColor: 'black',
        gridColor: 'lightgray',
        titleFontColor: '#1a96fe'
      },
      xAxis: {
        fontColor: 'black',
        gridColor: 'black',
        disableGrid:true,
        
      },
      dataLabel: false,
      width: windowWidth,
      height: 200

    });
  },

  onLoad: function (options) {
    this.buildAreaChart();
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25
      },
      title: {
        name: '¥3000',
        color: '#7cb5ec',
        fontSize: 25
      },
      subtitle: {
        name: '总营业额',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '成交量1',
        data: 15,
        stroke: false
      }, {
        name: '成交量2',
        data: 35,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 200,
      dataLabel: false,
      legend: false,
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);


  },
  //更新数据
  updateChartData:function(){
    const cht = this.data.selctype;
    var areadata = null;
    switch(cht){
      case 0:
        areadata = this.sbuildAreaChartDayData();

      break;
      case 1:
        areadata = this.sbuildAreaChartWeekData();

      break;
      case 2:
        areadata = this.sbuildAreaChartMonthData();
      break;
    }
   
    areaChart.updateData({
      categories: areadata.categories,
      series: [{
        data: areadata.data,
        // format: function (val) {
        //   return val.toFixed(0) + '人';
        // }
      }],
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
        if (handle == 'prev') {  //向前
          console.log('preday');
          const predate = this.getThisMonthDays(cur_year, cur_month - 1);
          let preday = cur_day - 1;
          if (preday < 1) {
            preday = predate;
            cur_month = cur_month - 1;
          }
          if (cur_month < 1) {
            preday = 31;
            cur_month = 12;
            cur_year = cur_year - 1;
          }
          this.setData({
            cyear: cur_year,
            cmonth: cur_month,
            cday: preday,
          })

        } else {
          var nxday = cur_day + 1;
          const predate = this.getThisMonthDays(cur_year, cur_month);
          if (nxday > predate) {
            cur_month = cur_month + 1;
            nxday = 1;
          }
          if (cur_month > 12) {
            cur_year = cur_year + 1;
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
          pretap = pretap - 1;
        } else {
          pretap = pretap + 1;
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

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "/" + mymonth + "/" + myweekday);
  },

  showWeekLastDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
    var M = Number(WeekLastDay.getMonth()) + 1
    return this.formatDate(WeekLastDay);
  },
  showWeekFirstDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    var M = Number(WeekFirstDay.getMonth()) + 1
    return this.formatDate(WeekFirstDay);
  },
  //获取当月多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month, day) {
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
    this.updateChartData();

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