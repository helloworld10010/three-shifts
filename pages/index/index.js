// index.js
const app = getApp()
let currentDate = new Date()
var arr = ["白班","夜班","休息"]
function getDaysBetween(date1,date2){
  var tdate1 = date1
  tdate1.setHours(0)
  tdate1.setMinutes(0)
  tdate1.setSeconds(0)
  tdate1.setMilliseconds(0)
  var tdate2 = date2
  tdate2.setHours(0)
  tdate2.setMinutes(0)
  tdate2.setSeconds(0)
  tdate2.setMilliseconds(0)

  if (tdate1 > tdate2){
    wx.showToast({
      title: '不支持向前查询',
      duration:2000
    })
    return 0
  }

  var days=(tdate2 - tdate1)/(1*24*60*60*1000)
  console.log("时间差"+ days +"天")
  return Math.trunc(days)
}

Page({
  data:{
    current:"第一次使用请先修正",
    nowDateStr:"",
    signed:false,
  },

  onReady(){
    this.init()
  },

  onShow(){
    console.log("indexonShow.........................................")
  },

  signIn:function (){
    if(this.data.signed){
      wx.showToast({
        title: '无需继续操作',
      })
    } else {
      this.setData({
        signed:true,
      })

      let calendarSignInfoAndMarkObj = app.calendarSignInfoAndMarkObj
      let monthStr = app.monthStr(new Date())
      if(!(app.monthStr(new Date()) in calendarSignInfoAndMarkObj)){
        calendarSignInfoAndMarkObj[monthStr] = {'shouldsigncount':0,'signedcount':0}
      }
      let monthObj = calendarSignInfoAndMarkObj[monthStr]

      if (!(app.dateStr(new Date()) in monthObj)) {
        monthObj[app.dateStr(new Date())] = {'signed':false,'mark':''}
      }

      var dateObj = monthObj[app.dateStr(new Date())]
      
      dateObj['signed'] = true
      wx.showToast({
        title: '签到成功',
        icon:'success',
      })
    }
    
  },

  actionFix:function(){
    var page = this
    wx.showActionSheet({
      itemList: ['白班', '夜班', '休息'],
      success (res) {
        console.log(res.tapIndex)
        wx.setStorageSync('anchorDate', new Date())
        wx.setStorageSync('anchor', res.tapIndex)

        app.dataInit() // 需要重新初始化数据

        page.init()
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
      var anchorDate = wx.getStorageSync('anchorDate')
      var anchor = wx.getStorageSync('anchor')
      console.log("anchorDate:"+anchorDate)
      console.log("anchor:"+anchor)
      if(anchorDate){
        var anchorDate = new Date(anchorDate)
        var now = new Date()
        var diff = getDaysBetween(anchorDate,now)
        console.log("时间差为："+diff)
        console.log("current:"+(diff+anchor)%3)

        let dateObj = app.getDateDataObj(new Date())
        this.setData({
          current:arr[(diff+anchor)%3],
          nowDateStr:now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日",
          anchorDate:anchorDate,
          signed:(diff+anchor)%3 == 2 || dateObj['signed']
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
