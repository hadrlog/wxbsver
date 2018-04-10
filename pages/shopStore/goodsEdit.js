// pages/shopStore/goodsEdit.js
var app = getApp();
var api = require('../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['固定金额', '固定比例'],
    index: 0,

    gnumber: 1,
    ggflag: [0],
    topclassify: [], //一级目录
    topclassindex: 0,

    subclassify: [], //二级目录
    subclassindex: 0,

    sunits: ['个', '斤', '两', '克', '千克', '公斤', '桶', '提', '卷', '条', '打', '件', '只', '瓶', '袋', '箱', '双', '盒', '双', '台', '块', '套', '把', '码'],
    unitIndex: 0,

    ecode: '', //商品条码

    sizeClass: ['商品颜色', '商品尺码', '商品款式', '商品净含量', '商品版本', '商品套餐','商品包装', '商品系列', '商品口味', '商品产地'],  //商品规格数据
    sizeIndex: 0,
    itemFlag1: false,
    sizevalue: '',
    sizeArr: [], //规格数组

    oprice: '', //成本价
    lprice: '', //零售价
    hprice: '', //会员价
    pprice: '', //批发价

    goodName: '', //商品名称
    rememberCode: '', //商品助记码
    weightUnit: '', //称重计量

    diliveryArr: ['固定金额', '固定比率'],
    dindex: 0,//提成方式索引
    dliveryValue: ''  //提成
  },
  //提交
  uploadAction: function () {
    const topIndex = this.data.topclassindex;
    const secIndex = this.data.subclassindex;
    var topclassify = this.data.topclassify;
    var seClassify = this.data.subclassify;
    const shopNum = app.globalData.shoopnum;
    const busNum = app.globalData.merchno;

    

    const gname = this.data.goodName;
    const gcode = this.data.rememberCode;
    var topCategary = topclassify[topIndex];
    var secCategary = seClassify[secIndex];
    var topClassid = '';  //一级id
    var topclassName = ''; //一级名称
    var seClassid = ''; //二级id
    var seClassName = ''; //二级名称

    if (topCategary) {
      topClassid = topCategary.classify_id.toString();
      topclassName = topCategary.classify_name
    } else {
      return;
    }
    if (secCategary) {
      seClassid = secCategary.classify_id.toString();
      seClassName = secCategary.classify_name;
    } else {
    }
   
    const weight = this.data.weightUnit;

    const lsunits = this.data.sunits;
    const lunitIndex = this.data.unitIndex;

    var bweight = lsunits[lunitIndex];  //基本单位

    var productCode = this.data.ecode;

    var color = '';
    var size = '';
    var style = '';
    var content = '';
    var edition = '';
    var menu = '';
    var series = '';
    var flavor = '';
    var place = '';
    var packing ='';

    var serArr = this.data.sizeArr;
    if (serArr.length > 0) {
      for (var i = 0; i < serArr.length; i++) {
        var temp = serArr[i];
        // { pid: index, mval:'' }
        var currentId = temp.pid;
        if (currentId == 0) {
          color = temp.mval;
        } else if (currentId == 1) {
          size = temp.mval;
        } else if (currentId == 2) {
          style = temp.mval;
        } else if (currentId == 3) {
          content = temp.mval;
        } else if (currentId == 4) {
          edition = temp.mval;
        } else if (currentId == 5) {
          menu = temp.mval;
        } else if (currentId == 6) {
          packing = temp.mval;
        } else if (currentId == 7) {
          series = temp.mval;
        } else if (currentId == 8) {
          flavor = temp.mval;
        } else if (currentId == 9) {
          place = temp.mval;
        } else {
        }
      }
    } else {

    }
    
    var price1 = (parseFloat(this.data.oprice)*100).toFixed(0);
    var price2 =  (parseFloat(this.data.lprice) * 100).toFixed(0);
    var price3 = (parseFloat(this.data.hprice) * 100).toFixed(0);
    var price4 = (parseFloat(this.data.pprice) * 100).toFixed(0);

    const binx = this.data.dindex;
    var amont = '0';    //固定金额
    var rate = '0';   //固定比率
    var bselectype = '01';
    if (binx == 0) { //固定金额
      amont = (parseFloat(this.data.dliveryValue) * 100).toFixed(0);
      bselectype = "01";
    } else if (binx == 1) {  //固定比例
      rate = this.data.dliveryValue
      bselectype = "02";
    } else {
    }
    
    api.Cpic_fetchPost(api.ADDSHOPGOODS, {"shop_no":shopNum,"remember_code": gcode, "merchant_no": busNum, "product_name": gname, "first_cat_id": topClassid, "first_cat_name": topclassName, "second_cat_id": seClassid, "second_cat_name": seClassName, "weigh": weight, "base_unit": bweight, "product_code": productCode, "pro_color": color, "pro_size": size, "pro_style": style, "net_content": content, "pro_edition": edition, "pro_menu": menu, "pro_series": series,
      "pro_flavor": flavor, "pro_place": place, "cost_price": price1, "sell_price": price2, "member_price": price3, "pro_packing": packing, "batch_price": price4, "commission_type": bselectype, "commission_amount": amont, "commission_rate": rate, "store_warn_state": '0', "min_store": '',"max_store":''
    }, (err, res) => {
     
      if (err == "00") {
        wx.showModal({
          title: '成功',
          content: '添加成功',
          cancelText: '确定',
          confirmText:'继续添加',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
             
            } else if (res.cancel) {
              console.log('用户点击取消')
             
            }
          }
        })
      } else {  
        wx.showModal({
          title: '失败',
          content: err,
          cancelText: '取消',
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
   


    });


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkHightClassify();
  },
  //查询二级商品类目
  checkSubClass: function (cid) {

    const shopnum = app.globalData.shoopnum;
   
    api.Cpic_fetchPost(api.checkClassify, {
      "shop_no": shopnum, "parent_id": cid
    }, (err, res) => {
      if (err == "00") {
        console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
        this.setData({
          subclassify: res.data,
        })
      } else {

      }

    });
  },
  //查询一级商品类目
  checkHightClassify: function () {
    const shopnum = app.globalData.shoopnum;
    api.Cpic_fetchPost(api.checkClassify, {
      "shop_no": shopnum, "parent_id": ''
    }, (err, res) => {
      var topc = this.data.topclassify;
      if (err == "00") {
        topc = res.data;
        const addnew = { classify_id: '', classify_name: '--添加分类--' };
        topc.push(addnew);
        console.log("err:" + err + "DIC:" + res.ReturnMsg + 'GROUP：' + res.data);
        this.setData({
          topclassify: topc,
        })
      } else {
      }
    });
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //删除规格
  redeceAction: function (e) {
    const index = e.currentTarget.dataset.info;
    var cunrent = this.data.sizeArr;
    cunrent.splice(index, 1);
    this.setData({
      sizeArr: cunrent,
    })
  },
  deletAction: function (e) {
    var cunrent = this.data.sizeArr;
    var value = this.data.sizevalue;
    var index = this.data.sizeIndex;
    var predic = { pid: index, mval: '' };
    if (value) {
      predic.mval = value;
      cunrent.push(predic);
    } else {
    }
    this.setData({
      itemFlag1: false,
      sizeArr: cunrent,
    })
  },
  //规格输入框
  inputAction: function (e) {
    const value = e.detail.value;
    this.setData({
      sizevalue: value,
    })
  },
  showggAction: function (e) {
    this.setData({
      itemFlag1: true,
      sizevalue: '',
    })
  },

  //一级类目
  bindTopClassPickerChange: function (e) {
    const vl = e.detail.value;
    const toparr = this.data.topclassify;
    if (vl == toparr.length - 1) {
      wx.navigateTo({
        url: '/pages/storer/goodcategaryadd',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      const current = toparr[vl].classify_id;
      this.setData({
        topclassindex: vl
      })
      this.checkSubClass(current);
    }
  },
  //二级类目
  bindSubClassPickerChange: function (e) {
    const vl = e.detail.value;
    this.setData({
      subclassindex: vl
    })
  },
  bindUnitsPickerChange: function (e) {
    this.setData({
      unitIndex: e.detail.value
    })
  },
  //输入商品条码
  ecodeMakesure: function (e) {
    this.setData({
      ecode: e.detail.value,
    })
  },
  //扫码
  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        this.setData({
          ecode: res.result,
        })
      }
    })
  },
  //商品规格选择
  bindGGPickerChange: function (e) {
    this.setData({
      sizeIndex: e.detail.value,
    })
  },
  //商品名称
  goodNameAction: function (e) {
    this.setData({
      goodName: e.detail.value,
    })
  },
  //商品助记码
  rememberAction: function (e) {
    this.setData({
      rememberCode: e.detail.value,
    })
  },
  //称重计量
  radioChange: function (e) {
    this.setData({
      weightUnit: e.detail.value,
    })
  },
  //提成额度
  ticAction: function (e) {
    this.setData({
      dliveryValue: e.detail.value,
    })
  },
  // oprice: '', //成本价
  // lprice: '', //零售价
  // hprice: '', //会员价
  // pprice: '', //批发价
  //成本价
  coastAction:function(e){
    this.setData({
      oprice:e.detail.value,
    })
  },
  //零售价
  sellAction: function (e) {
    this.setData({
      lprice: e.detail.value,
    })
  },
  //会员价
  hyAction: function (e) {
    this.setData({
      hprice: e.detail.value,
    })
  },
  //批发价
  batchAction: function (e) {
    this.setData({
      pprice: e.detail.value,
    })
  }

})