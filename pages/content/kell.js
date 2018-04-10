var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();
var areaChart = null;
var ringChart = null;
var api = require('../../utils/api.js');
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
    member:'0',  //新增会员
    mbili:'0',   //会员占比
    nmbili:'0',  //非覅会员占比
    totoal_pay:'0', //总营业额

  },

//日数据
  sbuildAreaChartDayData:function(){
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
      categories.push((i*2)+':00');
      data.push(0);
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
      data.push(0);
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
      data.push(0);
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
        name: '¥30',
        color: '#7cb5ec',
        fontSize:18
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
      // disablePieStroke: true,
      // width: windowWidth,
      // height: 200,
      // dataLabel: false,
      // legend: false,
      // padding: 0,
       disablePieStroke: true,
      width: windowWidth,
      height: 200,
      dataLabel: false,
      legend: false,
      background: '#f5f5f5',
      padding: 0


   
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);

    var date = new Date();
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? date.getDate() : date.getDate();
    this.setData({
      cyear: Y,
      cmonth: M,
      cday: D,
    })
    this.myRequestServer();
  },

  //向后台请求客流量数据
  myRequestServer:function(){
    const shopnum = app.globalData.shoopnum;
    const dtype = this.data.selctype;

    var startDaytime = "";
    var endDaytime = "";
    var tdaty = "";
    var tmonth = "";

    var tdpe = "01";
    switch (dtype) {
      case 0:
        tdpe = "01";
        var m = this.data.cmonth;
        var d = this.data.cday;
        var cm = parseInt(m) < 10 ? ('0' + m) : m;
        var dd = parseInt(d) < 10 ? ('0' + d) : d;

        tdaty = this.data.cyear + '-' + cm + '-' + dd;
        break;
      case 1:
        tdpe = "02";
        const weektime = this.data.week;
        var str_before = weektime.split('~')[0];
        var str_after = weektime.split("~")[1];
        startDaytime = str_before;
        endDaytime = str_after;
        break;
      case 2:
        var m = this.data.cmonth;
        var cm = parseInt(m) < 10 ? ('0' + m) : m;
        tmonth = this.data.cyear + '-' + cm;
        tdpe = "03";
        break;
    }
    api.Cpic_fetchPost(api.KELL, {
      "shop_no": shopnum, "type": tdpe, "week_start_date": startDaytime, "week_end_date": endDaytime, "day_date": tdaty, "month_date": tmonth
    }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (err == "00") {
        
        const resdit = res.data_detail;
        if (resdit.length>0){
          this.treatLine(resdit);
        }else{
          this.treatError();
          wx.showToast({
            title: '无数据返回',
            icon: 'fail',
            duration: 2000
          })
        }
        this.treatPie(res.data);

      } else {
        wx.showToast({
          title: err,
          icon: 'fail',
          duration: 2000
        })

      }

    })
  },
  treatError:function(){
    const dtype = this.data.selctype;
    var chartData = [];
    var dcategories = [];


    switch (dtype) {
      case 0:
        for (var i = 0; i < 24; i++) {
          dcategories.push(i + ':00');
          chartData.push(0);
        }
        break;
      case 1:
        var sera = { '周一': 0, '周二': 0, '周三': 0, '周四': 0, '周五': 0, '周六': 0, '周日': 0 };
        for (var p in sera) {//遍历json对象的每个key/value对,p为key
          chartData.push(sera[p]);
          dcategories.push(p);
        }

        break;
      case 2:
        const cur_year = this.data.cyear;
        const cur_month = this.data.cmonth;
        var caculate_days = this.getThisMonthDays(cur_year, cur_month);
        var tmonth = parseInt(cur_month) < 10 ? ('0' + cur_month) : cur_month;


        for (var i = 1; i < caculate_days + 1; i++) {
          var iday = i < 10 ? ('0' + i) : i;
          var nday = cur_year + '-' + tmonth + '-' + iday;
          dcategories.push(i);
          chartData.push(0);
        }
        break;
    }
    var series = [{
      name: '成交量1',
      data: chartData,
      format: function (val, name) {
        return val.toFixed(2);
      }
    }];
    areaChart.updateData({
      categories: dcategories,
      series: series
    });
  },
  //处理环状图
  treatPie:function(e){
    var membacc = parseInt(e.member_amount);
    var newadd = e.new_add_member;
    var nmembacc = parseInt(e.not_member_amount);
    var tot = membacc + nmembacc;
    var tb = tot > 0 ? (membacc / tot * 100).toFixed(2) : '0';
    var ntb = tot > 0 ? (nmembacc / tot * 100).toFixed(2) : '0';
    var tpay = (tot * 0.01).toFixed(2);

    this.setData({
      member: newadd,
      mbili: tb,
      nmbili: ntb,
      totoal_pay: tpay,
    })
    var marr = [{ name: '会员', data: membacc }, { name: '散客', data: nmembacc }];
    
    ringChart.updateData({
      title: {
        name:'￥'+tpay
      },
     
      series: marr,
    });
  },
  //处理折线
  treatLine:function(e){
    const dtype = this.data.selctype;
    var chartData = [];
    var dcategories = [];


    switch (dtype) {
      case 0:
        for (var i = 0; i < 24; i++) {
          dcategories.push(i + ':00');
          chartData.push(0);
        }
        for (var j = 0; j < e.length; j++) {
          var cdx = e[j];
          if (cdx) {
            var tm = cdx.time_hour;
            var str_after = parseInt(tm.split(" ")[1]);
            var sale = parseInt(cdx.user_count);
            chartData[str_after] = sale;
          }
        }
        break;
      case 1:
        var sera = { '周一': 0, '周二': 0, '周三': 0, '周四': 0, '周五': 0, '周六': 0, '周日': 0 };

        for (var j = 0; j < e.length; j++) {
          var cdx = e[j];
          if (cdx) {
            var tm = cdx.time_day_week;
            var sale = parseInt(cdx.user_count);
            sera[tm] = sale;
          }
        }

        for (var p in sera) {//遍历json对象的每个key/value对,p为key
          chartData.push(sera[p]);
          dcategories.push(p);
        }

        break;
      case 2:
        const cur_year = this.data.cyear;
        const cur_month = this.data.cmonth;
        var caculate_days = this.getThisMonthDays(cur_year, cur_month);
        var tmonth = parseInt(cur_month) < 10 ? ('0' + cur_month) : cur_month;
        var tmdate = [];

        for (var i = 1; i < caculate_days + 1; i++) {
          var iday = i < 10 ? ('0' + i) : i;
          var nday = cur_year + '-' + tmonth + '-' + iday;
          dcategories.push(i);
          chartData.push(0);
          tmdate.push(nday);

        }


        for (var j = 0; j < tmdate.length; j++) {
          var d = tmdate[j];
          for (var m = 0; m < e.length; m++) {
            var jas = e[m].time_day;
            if (jas == d) {
              var money = e[m].user_count;
              var dat = chartData.splice(j, 1, money);
            }
          }
        }
        break;
    }
    var series = [{
      name: '成交量1',
      data: chartData,
      format: function (val, name) {
        return val.toFixed(2);
      }
    }];
    areaChart.updateData({
      categories: dcategories,
      series: series
    });
    
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
        var dat = Date.now() + pretap * 7 * 86400000;
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
    this.myRequestServer();
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
    return (myyear + "-" + mymonth + "-" + myweekday);
  },

  showWeekLastDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1+7) * 86400000);
    var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
    var M = Number(WeekLastDay.getMonth()) + 1
    return this.formatDate(WeekLastDay);
  },
  showWeekFirstDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1+7) * 86400000);
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

  datePickerChangeEvent1:function(e){
    const date = new Date(Date.parse(e.detail.value));
    var newYear = date.getFullYear();
    var newMonth = date.getMonth() + 1;
    var todayIndex = date.getDate();
    this.setData({
      cyear: newYear,
      cmonth: newMonth,
      cday: todayIndex,
      selctype: 0,
    })
    this.myRequestServer();
  },
  datePickerChangeEvent2:function(e){
    const date = new Date(Date.parse(e.detail.value));
    var newYear = date.getFullYear();
    var newMonth = date.getMonth() + 1;
    var todayIndex = date.getDate();
    this.setData({
      cyear: newYear,
      cmonth: newMonth,
      selctype: 2,
    })
    this.myRequestServer();
  },
  weekCaculate: function (e) {
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
    return (daysOfThisWeek[0] + '~' + daysOfThisWeek[6]);
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

    this.myRequestServer();

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