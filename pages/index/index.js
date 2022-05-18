// index.js
var arr = {"0":"白班","1":"夜班","2":"休息"};
function getDaysBetween(dateString1,dateString2){
  var  startDate = Date.parse(dateString1);
  var  endDate = Date.parse(dateString2);
  if (startDate>endDate){
      return 0;
  }
  if (startDate==endDate){
      return 0;
  }
  var days=(endDate - startDate)/(1*24*60*60*1000);
  return  days;
}

Page({
  data:{
    current:"白班"
  },

  onLoad:function(){
   this.init();
  },

  actionFix:function(){
    var page = this;
    wx.showActionSheet({
      itemList: ['白班', '夜班', '休息'],
      success (res) {
        console.log(res.tapIndex);
        console.log("new date:"+new Date());
        wx.setStorageSync('anchorDate', new Date());
        wx.setStorageSync('anchor', res.tapIndex);
        wx.setStorageSync('test', "test data");
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
    try{
      var anchorDate = wx.getStorageSync('anchorDate');
      var anchor = wx.getStorageSync('anchor');
      var testData = wx.getStorageSync('test');
      console.log("testData:"+testData);
      console.log("anchorDate:"+anchorDate);
      console.log("anchor:"+anchor);
      if(anchorDate){
        var anchorDate = new Date(anchorDate);
        var now = new Date();
        var diff = getDaysBetween(anchorDate,now);
        console.log("current:"+(diff+anchor)%3);
        this.setData({
          current:arr[(diff+anchor)%3]
        })
      } else {
        this.setData({
          current:"首次使用请先修正"
        })
      }
    }catch(e){
      wx.showToast({
        title: '未知错误',
        icon:'error',
        duration: 2000
      })
    }
  },

})
