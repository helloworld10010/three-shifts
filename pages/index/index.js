// index.js
var arr = ["白班","夜班","休息"];
function getDaysBetween(dateString1,dateString2){
  var  startDateMS = Date.parse(dateString1);
  var  endDateMS = Date.parse(dateString2);
  if (startDateMS > endDateMS){
    wx.showToast({
      title: '不支持向前查询',
      duration:2000
    })
    return 0;
  }
  if (startDateMS==endDateMS){
      return 0;
  }
  var startDate = new Date(startDateMS);
  var endDate = new Date(endDateMS);
  var days=(endDateMS - startDateMS)/(1*24*60*60*1000);
  if(days < 1 && startDate.getDate() != endDate.getDate()){
    return 1;
  }
  return days;
}

Page({
  data:{
    current:"第一次使用请先修正"
  },

  onShow:function (){
    console.log("onShow.........................................")
    this.init()
  },

  actionFix:function(){
    var page = this;
    wx.showActionSheet({
      itemList: ['白班', '夜班', '休息'],
      success (res) {
        console.log(res.tapIndex);
        var newDate = new Date();
        newDate.setHours(0)
        newDate.setMinutes(0)
        newDate.setSeconds(0)
        newDate.setMilliseconds(0)
        console.log("new date:"+ newDate);
        wx.setStorageSync('anchorDate', new Date());
        wx.setStorageSync('anchor', res.tapIndex);
        page.init();
      },
      fail (res) {
        // wx.showToast({
        //   title: '未知错误',
        //   icon:'error',
        //   duration: 2000
        // })
        console.log(res.errMsg)
      }
      })
  },

  init:function(){
    console.log("init start....................")
    try{
      var anchorDate = wx.getStorageSync('anchorDate');
      var anchor = wx.getStorageSync('anchor');
      var testData = wx.getStorageSync('test');
      console.log("anchorDate:"+anchorDate);
      console.log("anchor:"+anchor);
      if(anchorDate){
        var anchorDate = new Date(anchorDate);
        var now = new Date();
        var diff = getDaysBetween(anchorDate,now);
        console.log("时间差为："+diff)
        console.log("current:"+(diff+anchor)%3);
        this.setData({
          current:arr[Math.trunc((diff+anchor)%3)]
        })
      } else {
        this.setData({
          current:"首次使用请先修正"
        })
      }
    }catch(e){
      console.log(e)
      wx.showToast({
        title: '未知错误',
        icon:'error',
        duration: 2000
      })
    }
  },

})
