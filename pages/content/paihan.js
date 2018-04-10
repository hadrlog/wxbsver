var wxCharts = require('/../../utils/wxcharts.js');
var app = getApp();
var api = require('../../utils/api.js');

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
  
    top:{},
    seconde:{},
    topthird:{},

    dateseris:[], 
    colors: ['#7cb5ec', '#f7a35c', '#434348', '#90ed7d', '#f15c80', '#8085e9'],
    chanxArr:[],

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
    return {
      serios: serios
    }
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

    this.queryCategary();
    this.queryGoods();

  },
  //上部分查询商品
  queryGoods:function(){
    // GOODSELLQUERY
    const shopnum = app.globalData.shoopnum;

    const sety = this.data.selctype;
    var startDaytime = '';
    var endDaytime = '';
    switch (sety) {
      case 0:
        var cmth = this.data.cmonth;
        var  mt = parseInt(cmth)<10?('0'+cmth):cmth;
        var cmdy = this.data.cday;
        var dt = parseInt(cmdy)<10?('0'+cmdy):cmdy;

        var daytime = this.data.cyear + '-' + mt + '-' + dt;
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
        var cmth = this.data.cmonth;
        var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth;
        var month = this.data.cyear + '-' + mt;
        startDaytime = month + "-01 00:00:00";
        endDaytime = month + "-31 24:00:00";
        break;
    }
    console.log('开始时间' + startDaytime);
    console.log('截至时间' + endDaytime);


    api.Cpic_fetchPost(api.GOODSELLQUERY, {
      "shop_no": shopnum, "start_date": startDaytime, "end_date": endDaytime, "first_cat_id": '',"second_cat_id":'',"display_number": '3', "display_page": '1' }, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      if(res.data){
        var first = res.data[0]?this.tradedataTomywant(res.data[0]):'';
        var second = res.data[1]?this.tradedataTomywant(res.data[1]):'';
        var third = res.data[2] ?this.tradedataTomywant(res.data[2]):'';

        this.setData({
          top:first,
          seconde:second,
          topthird:third,
        })
    
      }
    })
  },
  tradedataTomywant:function(e){
    var tseller_count = e.seller_count;
    var tproduct_name = e.product_name;

    var tsell_price = e.sell_price;

    var total_price =(parseInt(tsell_price) * parseInt(tseller_count)*0.01).toFixed(2);
    var trade_price = (parseInt(tsell_price) * 0.01).toFixed(2);
    return ({ "seller_count": tseller_count, "product_name": tproduct_name, "sell_price": trade_price, "total_price": total_price});
  },
  //赋值数据
  updateSerios: function () {
    
    const dtype = this.data.producty;
    switch (dtype) {
      case 0:  //商品类别查询以及赋值
        this.queryCategary();

        break;
      case 1:  //商品排行查询以及赋值

        this.querygoodpaihan();
        break;
      case 2:   //畅销排行
        this.queryHot();
        break;

    }


  },

//查询商品排行
querygoodpaihan:function(){
  // GOODSELLQUERY
  const shopnum = app.globalData.shoopnum;

  const sety = this.data.selctype;
  var startDaytime = '';
  var endDaytime = '';
  switch (sety) {
    case 0:
      var cmth = this.data.cmonth;
      var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth;
      var cmdy = this.data.cday;
      var dt = parseInt(cmdy) < 10 ? ('0' + cmdy) : cmdy;

      var daytime = this.data.cyear + '-' + mt + '-' + dt;
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
      var cmth = this.data.cmonth;
      var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth;
      var month = this.data.cyear + '-' + mt;
      startDaytime = month + "-01 00:00:00";
      endDaytime = month + "-31 24:00:00";
      break;
  }
 
  api.Cpic_fetchPost(api.GOODSELLQUERY, {
    "shop_no": shopnum, "start_date": startDaytime, "end_date": endDaytime, "first_cat_id": '', "second_cat_id": '', "display_number": '6', "display_page": '1'
  }, (err, res) => {
    console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);

    var total = res.sum_seller_amount;
    var resdata = res.data;
    if (parseInt(total) == 0 || resdata.length ==0) {
      this.setData({
        dateseris: [],
        chanxArr: [],
      })
      return;
    }
   
    const total_money = res.sum_seller_amount;
    var tempArr = [];
    var excelArr = [];
    var mtoal = 0;


    for (var i = 0; i < resdata.length; i++) {
      var sellprice = resdata[i].sell_price;
      var sellaccount = resdata[i].seller_count;
      var sellam = parseInt(sellprice) * parseInt(sellaccount);
      var ttr = (sellam* 0.01 ).toFixed(2);
      var leibs = resdata[i].product_name;
      var vbili = sellam/ parseInt(total_money) * 100;
      var bili = 0;
      
      if(vbili>100){
        bili = 100;
      }else{
        bili = vbili;
      }
      mtoal += vbili;
      if(mtoal>100){
        bili = 100 - mtoal;
        bili += vbili;
      }
      var md = { name: leibs, data: sellam };
      var ed = { name: leibs, data: ttr, bili: bili.toFixed(2), cols: this.data.colors[i] };

      tempArr.push(md);
      excelArr.push(ed);
     

    }

    this.refleshChart(tempArr);
    this.refleshExcel(excelArr);
    
  })
},

//查询畅销排行 
queryHot:function(){
  // GOODSELLQUERY
  const shopnum = app.globalData.shoopnum;

  const sety = this.data.selctype;
  var startDaytime = '';
  var endDaytime = '';
  switch (sety) {
    case 0:
      var cmth = this.data.cmonth;
      var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth;
      var cmdy = this.data.cday;
      var dt = parseInt(cmdy) < 10 ? ('0' + cmdy) : cmdy;
      var daytime = this.data.cyear + '-' + mt + '-' + dt;
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
      var cmth = this.data.cmonth;
      var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth;
      var month = this.data.cyear + '-' + mt;
      startDaytime = month + "-01 00:00:00";
      endDaytime = month + "-31 24:00:00";
      break;
  }
  console.log('开始时间' + startDaytime);
  console.log('截至时间' + endDaytime);


  api.Cpic_fetchPost(api.GOODSELLQUERY, {
    "shop_no": shopnum, "start_date": startDaytime, "end_date": endDaytime, "first_cat_id": '', "second_cat_id": '', "display_number": '30', "display_page": '1'
  }, (err, res) => {
    console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
    var total = res.sum_seller_amount;
    var resdata = res.data;
    if (parseInt(total) == 0 || resdata.length==0 ) {
      this.setData({
      
        dateseris: [],
        chanxArr: [],
      })
      return;
    }
   
    var chanx = [];
    for(var i=0;i<resdata.length;i++){
      var pname = resdata[i].product_name;
      var pprice = resdata[i].sell_price;

      var traprice = (parseInt(pprice) * 0.01).toFixed(2);

      var pselcont = resdata[i].seller_count;
      var sellam = parseInt(pprice) * parseInt(pselcont)*0.01;
      var md = { name: pname, price: traprice, scont: pselcont, salet:sellam.toFixed(2)};
      chanx.push(md);
    }
    this.setData({
      chanxArr:chanx,
    })
  })
},


//查询商品类别排行
  queryCategary:function(){
    const shopnum = app.globalData.shoopnum;
  
    const sety = this.data.selctype;
    var startDaytime = '';
    var endDaytime = '';
    switch(sety){
      case 0:
        var cmth = this.data.cmonth;
        var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth;
        var cmdy = this.data.cday;
        var dt = parseInt(cmdy) < 10 ? ('0' + cmdy) : cmdy;
        var daytime = this.data.cyear + '-' + mt + '-' + dt;
        console.log('当前时间：'+daytime);
        startDaytime = daytime +' 00:00:00';
        endDaytime = daytime+' 24:00:00';

      break;
      case 1:
        const weektime = this.data.week;
        var str_before = weektime.split('~')[0];
        var str_after = weektime.split("~")[1];
        startDaytime = str_before+" 00:00:00";
        endDaytime = str_after+" 24:00:00";
      break;
      case 2:
        var cmth = this.data.cmonth;
        var mt = parseInt(cmth) < 10 ? ('0' + cmth) : cmth; 
        var month = this.data.cyear + '-' + mt;
        startDaytime = month+"-01 00:00:00";
        endDaytime = month+"-31 24:00:00";
      break;
    }
  
    api.Cpic_fetchPost(api.GOODSCATERY, {"shop_no":shopnum,"start_date":startDaytime,"end_date":endDaytime,"display_number":'3',"display_page":'1'}, (err, res) => {
      console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
      var total = res.sum_seller_amount;
      var resdata = res.data;
      if (parseInt(total) == 0 || resdata.length==0){
        this.setData({
          
          dateseris: [],
          chanxArr: [],
        })
        return;
      }
     
      const total_money = res.sum_seller_amount;
      var tempArr = [];
      var excelArr = [];

      var mtol = 0;
      for (var i = 0; i < resdata.length; i++) {
        var sellprice = resdata[i].seller_amount;
        var ttr = (parseInt(sellprice) * 0.01).toFixed(2);
        var leibs = resdata[i].classify_name;
        var vbili = parseInt(sellprice) / parseInt(total_money)*100;
       
        var bili= 0;
        if (vbili>100){
          bili = 100;
        }else{
          bili = vbili;
        }
        if(mtol>100){
          bili = 0;
        } 
       
        var md = { name: leibs, data: parseInt(sellprice)};
        var ed = { name: leibs, data: ttr, bili: bili.toFixed(2), cols:this.data.colors[i]};
        
        tempArr.push(md);
        excelArr.push(ed);
        mtol+=vbili;
      }
      
      this.refleshChart(tempArr);
      this.refleshExcel(excelArr);
    })
  },
  //更新表格
  refleshExcel:function(arry){
    console.log(arry);
    this.setData({
      dateseris:arry,
    })

  },

//跟新圆环
 refleshChart:function(arry){
  // var simulationData = this.createSimulationData();
    ringChart.updateData({
      series: arry,
    });
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
        
        break;
      case 1:
        console.log('商品');
        
        break;
      case 2:
        console.log('畅销');
        break;
    }
    this.updateSerios();
    
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
    this.queryGoods();
    this.updateSerios();
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

  selctTypeAction: function (e) {
    var index = e.currentTarget.dataset.info;
    this.setData({
      selctype: index
    })
    var calewk = this.weekCaculate(Date.now());

    this.setData({
      week: calewk,
    })

    // this.updateData();
    this.queryGoods();
    this.updateSerios();

  },

  pickerDateValueday:function(e){
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

    this.queryGoods();
    this.updateSerios();
  },
  pickerDateValuemonth:function(e){
    const date = new Date(Date.parse(e.detail.value));
    var newYear = date.getFullYear();
    var newMonth = date.getMonth() + 1;
    var todayIndex = date.getDate();
    this.setData({
      cyear: newYear,
      cmonth: newMonth,
      selctype: 2,
    })
    this.queryGoods();
    this.updateSerios();
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