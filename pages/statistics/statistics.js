// pages/statistics/statistics.js
const app = getApp();
Page({

  options:{
    pureDataPattern:/^_/
  },
  /**
   * 页面的初始数据
   */
  data: {
    calendarSignInfoAndMark:"{}",
    anchorDateMS:0,
    _selectedDateStr:null,
    selectedDateMark:"",
    shouldsigncount:0,
    signedcount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      anchorDateMS:app.anchorDateMS,
      calendarSignInfoAndMark:app.calendarSignInfoAndMark,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log("statistics onReady anchorDateMS:"+this.data.anchorDateMS);
    console.log("statistics app anchorDateMS"+app.anchorDateMS)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // console.log("statistics onShow")
    // let calendarSignInfoAndMarkObj = app.calendarSignInfoAndMarkObj
    // if(!(app.monthStr(new Date()).substr(1,7) in calendarSignInfoAndMarkObj)){
    //   calendarSignInfoAndMarkObj[app.monthStr(new Date()).substr(1,7)] = {'shouldsigncount':0,'signedcount':0}
    // }
    // let monthdata = calendarSignInfoAndMarkObj[app.monthStr(new Date()).substr(1,7)]
    // console.log("monthData:"+JSON.stringify(monthdata))
    // this.setData({
    //   shouldsigncount:monthdata['shouldsigncount'],
    //   signedcount:monthdata['signedcount']
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  selectedDateHandle:function(e){
    console.log("selectedDateHandle::"+ JSON.stringify(e.detail))
    this.setData({
      _selectedDateStr: e.detail.selecteddate,
      selectedDateMark:e.detail.selecteddatemark,
    })
  },

  selectedMonthHandle:function(e){
    console.log("selectedMonthHandle::"+ JSON.stringify(e.detail))
    this.setData({
      shouldsigncount:e.detail.shouldsigncount,
      signedcount:e.detail.signedcount
    })
  },


  textareaConfirm(event){
    // console.log("textarea 确定输入："+event.detail.value)
  },

  textareaInput(event){
    console.log("textarea 输入东西："+event.detail.value)

    var markobj = app.calendarSignInfoAndMarkObj     // 两边数据不同步
    var markobjdate = markobj[this.data._selectedDateStr.substr(1,7)][this.data._selectedDateStr]
    
    markobjdate['mark'] = event.detail.value
    this.setData({
      calendarSignInfoAndMark:JSON.stringify(markobj)
    })

    app.calendarSignInfoAndMark = JSON.stringify(markobj)
  }
})