var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();

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
    producty: 0,  //选择商品类别
    dateseris: [],  //饼状图数据

  },
  createSimulationData: function () {
    const dtype = this.data.producty;
    const leib = ['护肤品','酒品','零食'];
    const shanp = ['香飘飘','茅台','中华','德芙巧克力','矿泉水'];
    var serios = [];
    switch (dtype) {
      case 0:
        for (var i = 0; i < leib.length; i++) {
          var numb = Math.random() * (20 - 10) + 10;
          var leibs = leib[i];
          var md = { name: leibs, data: numb};
          serios.push(md);
        }
        break;
      case 1:
        for (var i = 0; i < shanp.length; i++) {
          var numb = Math.random() * (20 - 10) + 10;
          var leibs = shanp[i];
          var md = { name: leibs, data: numb};
          serios.push(md);
        }
        break;
    }
      this.setData({
        dateseris: serios
      })
    return {
      serios: serios
    }
  },
  //赋值数据
  updateSerios: function () {
    var simulationData = this.createSimulationData();
    ringChart.updateData({
      series: simulationData.serios,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var simulationData = this.createSimulationData();
    var windowWidth = 320;
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25
      },
      series: simulationData.serios,
      disablePieStroke: true,
      width: windowWidth,
      height: 170,
      dataLabel: false,
      legend: false,
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //更新排行
  updateData: function () {

  },
  //商品类别选择
  procuctSelct: function (e) {
    
    const handle = e.currentTarget.dataset.prod;
    this.setData({
      producty: handle,
    })
    switch (handle) {
      case 0:
        console.log('商品类别');
        this.updateSerios();
        break;
      case 1:
        console.log('商品');
        this.updateSerios();
        break;
      case 2:
        console.log('畅销');
        break;
    }
  },
  //更新选择商品类别，商品，畅销
  updateProduct() {
     
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