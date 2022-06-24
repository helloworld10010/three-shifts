// components/calendar/calendar.js
const app = getApp();
Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/
  },
  properties: {
    date: {
      type: null,
      value: new Date()
    },
    /**
     * 选中的日期
     */
    selected: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        this.getWeek(new Date())
      }
    },
    /**
     * 锁定日期
     */
    lockDay: {
      type: String,
    },
    /**
     * 是否默认展开, 可以调用open事件展开组件
     */
    isOpen: {
      type: Boolean,
      value: false
    },
    /**
     * 是否多选日期
     */
    multiple: {
      type: Boolean,
      value: true
    },
    /**
     * 是否展示头部
     */
    showHeader: {
      type: Boolean,
      value: false
    },
    /**
     * 是否不能修改
     */
    readonly: {
      type: Boolean,
      value: false
    },
    /**
     * 使用mini样式
     */
    mini: {
      type: Boolean,
      value: false
    },

    calendarSignInfoAndMark: {
      type: String,
      value: ""
    },

    anchorDateMS: {
      type: Number,
      value: 0,
    },

  },

  /**
   * 组件的初始数据
   */
  lifetimes: {
    attached() {
      console.log("calendar attached")
    },
    detached() {
      console.log("calendar detached")
    },
  },

  pageLifetimes: {
    show() {
      console.log("calendar show")
      this.backtoday(new Date())
    },
    hide() {
      console.log("calendar hide");
    }
  },

  data: {
    calShow: true, // 日历组件是否打开
    dateShow: false, // 日期是否选择
    selectDay: '', // 当前选择日期
    selectDays: [], //多选日期
    canlender: {
      "weeks": []
    },
    currentMonth: null,
    nowMonth: new Date().getMonth() + 1,
    nowDate: new Date().getDate(),
    nowDateTime: new Date().getTime(),
    sch: "",
  },
  ready() {
    console.log("calendar ready");

    let sdays = this.data.selected;
    sdays.forEach(v => {
      this.data.selectDays.push(v);
    })
    this.getWeek(new Date());
    if (this.data.isOpen) {
      this.setData({
        calShow: false,
        dateShow: true
      })
    }
    this.backtoday();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    open: function (date) {
      if (date && date != '') {
        this.data.selectDays = []; //打开时候显示一个
        this.data.selectDays.push(date);
        this.setData({
          selectDays: this.data.selectDays
        })
        this.getWeek(date);
      }
      this.dateSelection();
    },
    close: function () {
      this.packup();
    },
    clear: function () {
      this.setData({
        selectDays: []
      })
      let m;
      if (this.data.currentMonth == null) {
        m = this.data.canlender.month
      } else {
        m = this.data.currentMonth
      }
      let year = this.data.canlender.year + "-" + m + "-" + this.data.canlender.date
      let _date = this.getDate(year, 0);
      this.getWeek(_date);
      this.triggerEvent("clear", {})
    },
    dateSelection() {
      if (this.data.isOpen) {
        return
      }
      let self = this;
      if (self.data.calShow) {
        self.setData({
          calShow: false
        }, () => {
          setTimeout(() => {
            self.setData({
              dateShow: true
            }, () => {
              self.triggerEvent('show', {
                ischeck: !self.data.calShow
              })
            })
          }, 100)
        })
      } else {
        self.setData({
          dateShow: false
        }, () => {
          setTimeout(() => {
            self.setData({
              calShow: true
            }, () => {
              self.triggerEvent('show', {
                ischeck: !self.data.calShow
              })
            })
          }, 300)
        })
      }
    },
    //选择日期
    selectDay(e) {
      if (this.data.readonly) {
        return
      }
      let index = e.currentTarget.dataset.index;
      let week = e.currentTarget.dataset.week;
      let ischeck = e.currentTarget.dataset.ischeck;
      let canlender = this.data.canlender;
      // if (!ischeck) return false;
      let month = canlender.weeks[week][index].month < 10 ? "0" + canlender.weeks[week][index].month : canlender.weeks[week][index].month
      let date = canlender.weeks[week][index].date < 10 ? "0" + canlender.weeks[week][index].date : canlender.weeks[week][index].date
      let datestr = canlender.year + "-" + month + "-" + date;
      let selectDays = this.data.selectDays;
      if (selectDays.indexOf(datestr) == -1) {
        if (this.data.multiple) {
          //多选
          selectDays.push(datestr);
        } else {
          selectDays = []; //只保留最后选的
          selectDays.push(datestr);
        }
      } else {
        let index = selectDays.indexOf(datestr);
        selectDays.splice(index, 1);
      }
      selectDays.sort(function (a, b) {
        let ds1 = a.split("-");
        let ds2 = b.split("-");
        let d1 = new Date(ds1[0], ds1[1], ds1[2]);
        let d2 = new Date(ds2[0], ds2[1], ds2[2]);
        return d1 - d2;
      });
      this.data.selectDays = selectDays;
      this.getWeek(datestr);

      let calendarSignInfoAndMarkObj = app.calendarSignInfoAndMarkObj
      if(!(this.dateStrCutToMonthStr(datestr) in calendarSignInfoAndMarkObj)){
        calendarSignInfoAndMarkObj[this.dateStrCutToMonthStr(datestr)] = {'shouldsigncount':0,'signedcount':0}
      }
      if(!(datestr in calendarSignInfoAndMarkObj[this.dateStrCutToMonthStr(datestr)])){
        calendarSignInfoAndMarkObj[this.dateStrCutToMonthStr(datestr)][datestr] = {'signed':false,'mark':''}
      }
      let dateinfoobj = calendarSignInfoAndMarkObj[this.dateStrCutToMonthStr(datestr)][datestr]
      let mark = dateinfoobj['mark']
      this.triggerEvent('getdate', {
        'selecteddate': datestr,
        'selecteddatemark': mark
      })

    },
    //点击确定
    packup() {
      let self = this;
      self.triggerEvent('select', {
        selectDays: self.data.selectDays
      })
      if (this.data.isOpen) {
        let year = self.data.canlender.year + "-" + self.data.canlender.month + "-" + self.data.canlender.date
        let _date = self.getDate(year, 0);
        self.getWeek(_date);
        return
      }
      self.setData({
        dateShow: false
      }, () => {
        setTimeout(() => {
          self.setData({
            calShow: true
          }, () => {
            let year = self.data.canlender.year + "-" + self.data.canlender.month + "-" + self.data.canlender.date
            let _date = self.getDate(year, 0);
            self.getWeek(_date);
          })
        }, 300)
      })
    },
    /**
     * 页面通过事件选中日期后调用refresh方法刷新日历组件
     */
    refresh: function (num) {
      this.setData({
        selectDays: num
      })
      let m;
      if (this.data.currentMonth == null) {
        m = this.data.canlender.month
      } else {
        m = this.data.currentMonth
      }

      let year = this.data.canlender.year + "-" + m + "-" + this.data.canlender.date
      let _date = this.getDate(year, 0);
      this.getWeek(_date);
    },
    // 返回今天
    backtoday() {
      if (!this.data.readonly) {
        let datestr = this.dateStr(new Date());
        if(!this.data.multiple) this.data.selectDays = []
        this.data.selectDays.push(datestr);
        this.setData({
          selectDays: this.data.selectDays
        });

        
        let calendarSignInfoAndMarkObj = app.calendarSignInfoAndMarkObj
        console.log("当前日期数据："+app.calendarSignInfoAndMarkObj)
        if(!(this.dateStrCutToMonthStr(datestr) in calendarSignInfoAndMarkObj)){
          calendarSignInfoAndMarkObj[this.dateStrCutToMonthStr(datestr)] = {'shouldsigncount':0,'signedcount':0}
        }
        let monthObj = calendarSignInfoAndMarkObj[this.dateStrCutToMonthStr(datestr)]
        if(!(datestr in monthObj)){
          monthObj[datestr] = {'signed':false,'mark':''}
        }
        let dateinfoobj = monthObj[datestr]
        let mark = dateinfoobj['mark']
        this.triggerEvent('getdate', {
          'selecteddate': datestr,
          'selecteddatemark': mark,
          'shouldsigncount':monthObj['shouldsigncount'],
          'signedcount':monthObj['signedcount']
        })
      }
      this.getWeek(new Date());
    },
    // 前一天|| 后一天
    dataBefor(e) {
      let num = 0;
      let types = e.currentTarget.dataset.type;

      if (e.currentTarget.dataset.id === "0") {
        num = -1;
      } else {
        num = 1
      }
      let year = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
      let _date = this.getDate(year, num, types === 'month' ? "month" : "day");
      this.getWeek(_date);
    },

    // 获取日历内容
    getWeek(dateData) {
      var cobj = this;
      let selected = this.data.selected
      let selectDays = this.data.selectDays
      // 判断当前是 安卓还是ios ，传入不容的日期格式
      if (typeof dateData !== 'object') {
        dateData = dateData.replace(/-/g, "/")
      }
      let _date = new Date(dateData);
      let year = _date.getFullYear(); //年
      let month = _date.getMonth() + 1; //月
      let date = _date.getDate(); //日
      let day = _date.getDay(); // 天
      let canlender = [];

      console.log("当前日历内容：year:" + year + " month:" + month + " date:" + date)

      let dates = {
        firstDay: new Date(year, month - 1, 1).getDay(),
        lastMonthDays: [], // 上个月末尾几天
        currentMonthDys: [], // 本月天数
        nextMonthDays: [], // 下个月开始几天
        endDay: new Date(year, month, 0).getDay(),
        weeks: []
      }

      console.log("dates.firstDay:" + dates.firstDay)
      console.log("dates.endDay:" + dates.endDay)
      // 循环上个月末尾几天添加到数组
      for (let i = dates.firstDay; i > 0; i--) {
        let dd = new Date(year, month - 1, -(i - 1));
        let checked = false;
        selectDays.forEach(v => {
          let selDate = v.split('-');
          let ddstr = this.dateStr(dd);
          if (ddstr == v) {
            checked = true;
          }
        })

        dates.lastMonthDays.push({
          'date': dd.getDate() + '',
          'month': month - 1,
          'time': dd.getTime(),
          'signed': false,
          'shouldsign':false,
          checked
        })
      }
      // 循环本月天数添加到数组
      let calendarSignInfoAndMarkObj = app.calendarSignInfoAndMarkObj
        if(!(cobj.monthStr(new Date(year, month-1)) in calendarSignInfoAndMarkObj)){
          calendarSignInfoAndMarkObj[cobj.monthStr(new Date(year, month-1))] = {'shouldsigncount':0,'signedcount':0}
        }
      let monthObj = calendarSignInfoAndMarkObj[cobj.monthStr(new Date(year, month-1))]
      monthObj['shouldsigncount'] = 0  
      monthObj['signedcount'] = 0
      for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
        let have = false;
        let checked = false;
        // for (let j = 0; j < selected.length; j++) {
        //   let selDate = selected[j].split('-');
        //   if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(i) === Number(selDate[2])) {
        //     have = true;
        //   }
        // }
        selectDays.forEach(v => {
          let selDate = v.split('-');
          if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(i) === Number(selDate[2])) {
            checked = true;
          }
        })

        let everyDate = new Date(year, month - 1, i)
        let diff = app.getDaysBetween(new Date(this.data.anchorDateMS), everyDate);
        if (checked) {
          cobj.setData({
            sch: app.getSchedulesStr(diff)
          })
          console.log("当前选中时间差：" + diff + "天")
          console.log("最终班次结果index：" + (diff + 3 + app.anchor))
        }
        let shouldsign = (diff + 3 + app.anchor) % 3 != 2

        
        if (!(cobj.dateStr(everyDate) in monthObj)) {
          monthObj[cobj.dateStr(everyDate)] = {'signed':false,'mark':''}
        }
        let sp = monthObj[cobj.dateStr(everyDate)]
        let signed = sp['signed']

        if(shouldsign){
          monthObj['shouldsigncount'] = monthObj['shouldsigncount']+1
        }

        if(signed){
          monthObj['signedcount']=monthObj['signedcount']+1
        }

        dates.currentMonthDys.push({
          'date': i + "",
          'month': month,
          'time': everyDate.getTime(),
          'signed': signed,
          'shouldsign': (diff + 3 + app.anchor) % 3 != 2,
          // have,
          checked
        })
      }
      this.triggerEvent('getmonth', {  // 月度信息
        'shouldsigncount':monthObj['shouldsigncount'],
        'signedcount':monthObj['signedcount']
      })

      // 循环下个月开始几天 添加到数组
      for (let i = 1; i < 7 - dates.endDay; i++) {
        dates.nextMonthDays.push({
          'date': i + '',
          'month': month + 1,   // 用于显示的月份都得加一
          'time': new Date(year, month, i).getTime(),
          'signed': false,
          'shouldsign': false,
        })
      }

      canlender = canlender.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
      // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
      for (let i = 0; i < canlender.length; i++) {
        if (i % 7 == 0) {
          dates.weeks[parseInt(i / 7)] = new Array(7); // 第几行
        }
        dates.weeks[parseInt(i / 7)][i % 7] = canlender[i]
      }
      // 渲染数据
      this.setData({
        selectDay: month + "月" + date + "日",
        "canlender.weeks": dates.weeks,
        'canlender.month': month,
        'canlender.date': date,
        "canlender.day": day,
        'canlender.year': year,
      })
      month = month < 10 ? "0" + month : month
      date = date < 10 ? "0" + date : date
      // let localstr = year+"-"+month+"-"+date;
      // this.triggerEvent('getdate', {
      //   year,
      //   month,
      //   date,
      //   localstr
      // })
    },
    checkall() {
      let date = new Date();
      let m, d, day, dayNum;
      let days = [];
      if (this.data.currentMonth == null) {
        m = parseInt(this.data.nowMonth)
      } else {
        m = parseInt(this.data.currentMonth)
      }

      switch (m) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          dayNum = 31;
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          dayNum = 30;
          break;
        case 2:
          if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            dayNum = 29;
          } else {
            dayNum = 28;
          }
          break;
      }
      for (d = 1; d <= dayNum; d++) {
        date.setMonth(m - 1, d);
        day = date.getDay();
        let str = this.format(date);
        if (date.getMonth() == new Date().getMonth()) {
          if (date.getDate() - new Date().getDate() >= 0) {
            days.push(str);
          }
        } else if (date.getMonth() > new Date().getMonth()) {
          days.push(str);
        }
      }
      this.refresh(days);
      this.triggerEvent('checkall', {
        days
      })
    },
    /**
     * 时间计算
     */
    getDate(date, AddDayCount, str = 'day') {
      if (typeof date !== 'object') {
        date = date.replace(/-/g, "/")
      }
      let dd = new Date(date)
      switch (str) {
        case 'day':
          dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
          break;
        case 'month':
          dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
          break;
        case 'year':
          dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
          break;
      }
      let y = dd.getFullYear()
      let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) // 获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
      this.setData({
        currentMonth: m
      })
      return y + '-' + m + '-' + d
    },

    monthStr(calendar){
      let year = calendar.getFullYear();
      let month = calendar.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let monthstr = year + "-" + month
      return monthstr;
    },

    dateStrCutToMonthStr(dateStr){
      if(dateStr <10) return 
      return dateStr.substr(1,7)
    },
    //日期转字符串
    dateStr(calendar) {
      let year = calendar.getFullYear();
      let month = calendar.getMonth() + 1;
      let date = calendar.getDate();
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      let datestr = year + "-" + month + "-" + date;
      return datestr;
    },
    format(dd) {
      let y = dd.getFullYear()
      let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
      return y + '-' + m + '-' + d
    }
  }
})