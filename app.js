// app.js
// {
  // "2022年6月"：{
  //   shouldsigncount:20,
  //   signedcount:12,
  //   "2022年6月20日": {
  //     'shouldsign':false,
  //     'signed':false,
  //     'mark':'',
  //   },
  // }

// }

App({
  
  onLaunch() {
    console.log("app onLaunch -----------------------------------------");
    this.dataInit()
  },

  onHide(){
    console.log("app onHide")
    var that = this;
    try {
      wx.setStorage({
        key:'keycalendarsigninfoandmark',
        data:JSON.stringify(that.calendarSignInfoAndMarkObj)
      })
    } catch (error) {
      console.log(error)
    }
  },

  dataInit(){
    var that = this;
    try {
      wx.getStorage({
        key: 'keycalendarsigninfoandmark',
        success(res) {
          that.calendarSignInfoAndMarkObj = JSON.parse(res.data);
          console.log(res.data)
        }
      })
    } catch (error) {
      console.log("Storage key calendar-data read error");
    }

    try {
      wx.getStorage({
        key: 'anchorDate',
        success(res) {
          that.anchorDateMS = new Date(res.data).getTime();
          console.log("app 锚点时间："+ that.anchorDateMS);
        }
      })
    } catch (error) {
      console.log("Storage key anchorDate read error");
    }

    try {
      wx.getStorage({
        key: 'anchor',
        success(res) {
          that.anchor = res.data;
          console.log("anchor::"+that.anchor)
        }
      })
    } catch (error) {
      console.log("Storage key anchor read error");
    }  
  },

  monthStr(calendar){
    let year = calendar.getFullYear();
    let month = calendar.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let monthstr = year + "-" + month
    return monthstr;
  },
  getDaysBetween(date1, date2) {
    if (date1 instanceof Date && date2 instanceof Date) {
      var tdate1 = date1;
      tdate1.setHours(0);
      tdate1.setMinutes(0);
      tdate1.setSeconds(0);
      tdate1.setMilliseconds(0);
      var tdate2 = date2;
      tdate2.setHours(0);
      tdate2.setMinutes(0);
      tdate2.setSeconds(0);
      tdate2.setMilliseconds(0);

      // if (tdate1 > tdate2) {
      //   wx.showToast({
      //     title: '不支持向前查询',
      //     duration: 2000
      //   })
      //   return 0;
      // }

      var days = (tdate2 - tdate1) / (1 * 24 * 60 * 60 * 1000);
      return Math.trunc(days%3);
    } else {
      console.log("exists not Date type");
    }
  },

  getSchedulesStr(diffdays) {
    let remainder = (diffdays + this.anchor + 3) % 3;
    var sch = "";
    switch (remainder) {
      case 0:
        sch = "白班";
        break;
      case 1:
        sch = "夜班";
        break;
      case 2:
        sch = "休息";
        break;
      default:
        console.log('Sorry, we are out of '+remainder);
    }
    return sch;
  },

  getMonthDataObj(date){
    let calendarSignInfoAndMarkObj = this.calendarSignInfoAndMarkObj
    let monthStr = this.monthStr(new Date())
    if(!(this.monthStr(new Date()) in calendarSignInfoAndMarkObj)){
        calendarSignInfoAndMarkObj[monthStr] = {'shouldsigncount':0,'signedcount':0}
      }
    let monthObj = calendarSignInfoAndMarkObj[monthStr]
    return monthObj
  },

  getDateDataObj(date){
    let monthObj = this.getMonthDataObj(date)
    if(!(this.dateStr(date) in monthObj)){
      monthObj[this.dateStr(date)] = {'signed':false,'mark':''}
    }
    let dateObj = monthObj[this.dateStr(date)]
    return dateObj
  },

  monthStr(calendar){
    let year = calendar.getFullYear();
    let month = calendar.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let monthstr = year + "-" + month
    return monthstr;
  },
  dateStr(calendar) {
    let year = calendar.getFullYear();
    let month = calendar.getMonth() + 1;
    let date = calendar.getDate();
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    let datestr = year + "-" + month + "-" + date;
    return datestr;
  },
  anchorDateMS:0,
  anchor:0,
  calendarSignInfoAndMarkObj: {}
})