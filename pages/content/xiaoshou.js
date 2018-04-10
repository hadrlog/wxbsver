// pages/content/xiaoshou.js
var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
var columnChart = null;
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
    xiaoshoutype: '0',  //选择销售额还是毛利额
    week: '',
    pretap: 0,  //点击向前-1 ，向后+1
    producty: 0,  //选择商品类别
    dateseris: [],  //饼状图数据
    current_shopDetail: { shopname: '--', srate: '--', crate: '--', rblit: '--' },  //当前门店详情
    trshops: [{ shopname: '--', sale: '--', rate: '--' }],  //门店
    colors: ['#7cb5ec', '#f7a35c', '#434348', '#90ed7d', '#f15c80', '#8085e9'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
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
    this.queryDataFromServer();
  },
  createSimulationData: function () {
    const dtype = this.data.producty;
    const leib = ['护肤品', '酒品', '零食'];
    const shanp = ['香飘飘', '茅台', '中华', '德芙巧克力', '矿泉水'];
    var serios = [];
    switch (dtype) {
      case 0:
        for (var i = 0; i < leib.length; i++) {
          var numb = Math.random() * (20 - 10) + 10;
          var leibs = leib[i];
          var md = { name: leibs, data: 0 };
          serios.push(md);
        }
        break;
      case 1:
        for (var i = 0; i < shanp.length; i++) {
          var numb = Math.random() * (20 - 10) + 10;
          var leibs = shanp[i];
          var md = { name: leibs, data: 0 };
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
  //从后台查询数据
  queryDataFromServer: function () {
    const shopnum = app.globalData.shoopnum;

    const sety = this.data.selctype;
    var startDaytime = '';
    var endDaytime = '';
    switch (sety) {
      case 0:

        var cd = this.data.cday;
        var cdt = parseInt(cd)<10?('0'+cd):cd;
        var cm = this.data.cmonth;
        var cmt = parseInt(cm)<10?('0'+cm):cm;
        var daytime = this.data.cyear + '-' + cmt+ '-' + cdt;
        
        console.log('当前时间：' + daytime);
        startDaytime = daytime + ' 00:00:00';
        endDaytime = daytime + ' 24:00:00';

        break;
      case 1:
        const weektime = this.data.week;
        var str_before = weektime.split('~')[0];
        var str_after = weektime.split("~")[1];
        startDaytime = str_before + " 00:00:00";
        endDaytime = str_after + " 24:00:00";
        break;
      case 2:
      var cm = this.data.cmonth;
      var cmt = parseInt(cm)<10?('0'+cm):cm;
        var month = this.data.cyear + '-' + cmt;
        startDaytime = month + "-01 00:00:00";
        endDaytime = month + "-31 24:00:00";
        break;
    }
    api.Cpic_fetchPost(api.SHOPRACE, {
      "shop_no": shopnum, "start_date": startDaytime, "end_date": endDaytime
    }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if (err == '00') {
        if (res.data_detail.length > 0) {
          this.updataTopChart(res.data_detail);
          this.updataCircleChart(res.data_detail);
          this.updataExcel(res.data_detail);
        } else {
          wx.showModal({
            title: '查询失败',
            content: '当前日期无交易结果',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: err,
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  //更新柱状图
  updataTopChart:function(e){
    const shopnum = app.globalData.shoopnum;
    var shops = [];   //商店
    var seller = [];  //营业额
    var gold =[]; //毛利
    var cushop = {};
    for(var i = 0;i<e.length;i++){
      var cta = e[i];
      if(!cta){
        break;
      }
      var nums = cta.shop_no;
      if (nums == shopnum){
        var shopname = cta.shop_name;
        var sellmoney = (parseInt(cta.sell_amount)) * 0.01;
        var profitmoney = (parseInt(cta.profit_amount)) * 0.01;
        var reb = sellmoney>0? ((profitmoney/sellmoney)*100).toFixed(2):'0';
        cushop = { shopname: shopname, srate: sellmoney.toFixed(2), crate: profitmoney.toFixed(2), rblit: reb};
        var smoy = sellmoney.toFixed(2);
        shops.push(shopname);
        seller.push(smoy);
        gold.push(profitmoney.toFixed(2));
        break;
      }
    }
    this.setData({
      current_shopDetail: cushop,
    })
    columnChart.updateData({
      categories: shops,
      series:[{
        name: '成交量1',
        data: seller
      },{
          name: '成交量2',
          data: gold
      }]
    })


  },
  //更新环状图
  updataCircleChart:function(e){
    var sellrate = [];  
    const stype = this.data.xiaoshoutype;
    switch (stype){
      case '0':
        for(var i=0;i<e.length;i++){
          var sdtaitl = e[i];
          var shopname = sdtaitl.shop_name;
          var sale =parseInt(sdtaitl.sell_amount);
          var cst = { name: shopname, data: sale};
          sellrate.push(cst);
        }
      break;
      case '1':
        for (var j = 0; j < e.length; j++) {
          var tsdtaitl = e[j];
          var tshopname = tsdtaitl.shop_name;
          var tsale =parseInt(tsdtaitl.profit_amount);
          var tcst = { name: tshopname, data: tsale };
          sellrate.push(tcst);
        }
      break;
    }
    ringChart.updateData({
      series: sellrate,
    });
  },
  //更新表格
  updataExcel:function(e){
    const stype=this.data.xiaoshoutype;
    var myshops = [];
    if(stype =='0'){
      var totalsale = 0;
      for (var i = 0; i<e.length;i++){
        var trm = e[i];
        var moy =parseInt(trm.sell_amount);
        totalsale+=moy;
      }
      for(var j=0;j<e.length;j++){
        var tmt = e[j];
        var shopnam = tmt.shop_name;
        var mny = parseInt(tmt.sell_amount);
        var bili = totalsale>0?((mny/totalsale*100).toFixed(2)):'0';
        var tmny = (mny*0.01).toFixed(2);
       
        var sht = {shopname:shopnam,sale:tmny,rate:bili};
        myshops.push(sht);
      }
    }else{
      var totalsale = 0;
      for (var i = 0; i < e.length; i++) {
        var trm = e[i];
        var moy = parseInt(trm.profit_amount);
        totalsale += moy;
      }
      for (var j = 0; j < e.length; j++) {
        var tmt = e[j];
        var shopnam = tmt.shop_name;
        var mny = parseInt(tmt.profit_amount);
        var bili = totalsale > 0 ? ((mny / totalsale * 100).toFixed(2)) : '0';
        var tmny = (mny * 0.01).toFixed(2);
        var sht = { shopname: shopnam, sale: tmny, rate: bili };
        myshops.push(sht);
      }
    }
    this.setData({
      trshops: myshops,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
      categories: ['--'],
      series: [{
        name: '成交量1',
        data: [0]
      }, {
        name: '成交量2',
        data: [0]
      }],
      yAxis: {
        format: function (val) {
          return val;
        }
      },
      width: windowWidth * 0.6,
      height: 200
    });
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

    this.queryDataFromServer();
  },
  xiaose: function (e) {
    var index = e.currentTarget.dataset.info;
    this.setData({
      xiaoshoutype: index
    })
    this.queryDataFromServer();
  },
  handleCalendar(e) {
    // this.updateData();
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
    this.queryDataFromServer();
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
    this.queryDataFromServer();
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
     this.queryDataFromServer();
  },

  showWeekLastDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() -1 +7) * 86400000);
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