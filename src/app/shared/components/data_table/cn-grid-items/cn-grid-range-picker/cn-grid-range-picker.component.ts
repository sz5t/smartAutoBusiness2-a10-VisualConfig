import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getMilliseconds, getMonth, getSeconds, getMinutes, getHours, getDate } from 'date-fns';

@Component({
  selector: 'app-cn-grid-range-picker',
  templateUrl: './cn-grid-range-picker.component.html',
  styleUrls: ['./cn-grid-range-picker.component.less']
})
export class CnGridRangePickerComponent implements OnInit {

  @Input() public config;
  @Input() public valueConfig;
  @Output() public updateValue = new EventEmitter();
  @Input() public state;
  date = null; // new Date();
  value = null;
  dateRange = []; // [ new Date(), addDays(new Date(), 3) ];
  constructor() { }

  ngOnInit() {
    let v_value;
    if (this.valueConfig) {
      v_value = this.valueConfig.value;
    }
    if (this.state === 'new') {
      if (this.config.defaultValue) {
        if (!this.value) {
          v_value = this.config.defaultValue;
        }
      }
    }

    setTimeout(() => {
      this.value = v_value;
      this.valueChange(this.value);
    });
  }

  valueChange(v?) {
    console.log('时间范围:>>>valueChange>>', v);
    const item: any = {};
    if (v) {
      const time: any = v.split(',');
      item.beginTime = time[0];
      item.endTime = time[1];

      let rangeTime = '';
      if (this.dateRange.length > 0) {
        const begin = this.dateRange[0];
        const beginTime = this.getDateFormat(begin, 'yyyy-MM-dd');
        const end = this.dateRange[1];
        const endTime = this.getDateFormat(end, 'yyyy-MM-dd');
        rangeTime = beginTime + ',' + endTime;
      }
      if (v !== rangeTime) {
        const _beginTime = this.parserDate(item.beginTime);
        const _endTime = this.parserDate(item.endTime);
        const _rangeTime = [];
        _rangeTime.push(_beginTime);
        _rangeTime.push(_endTime);
        this.dateRange = _rangeTime;
      }
    } else {
      this.dateRange = [];
    }
    const backValue = { name: this.config.field, value: v, id: this.valueConfig.id, dataItem: item };
    this.updateValue.emit(backValue);

  }



  onChange(result): void {
    console.log('时间范围-onChange: ', result);
    if (result.length > 0) {

      const begin = result[0];
      const beginTime = this.getDateFormat(begin, 'yyyy-MM-dd');
      const end = result[1];
      const endTime = this.getDateFormat(end, 'yyyy-MM-dd');
      const rangeTime = beginTime + ',' + endTime;
      if (this.value !== rangeTime) {
        this.value = rangeTime;
      }
    } else {
      this.value = null;
    }
    this.valueChange(this.value);
  }
  public cascadeAnalysis(c?) { }


  parserDate(date) {
    const t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/')));
    }
  }
  // 字符串转日期格式，strDate要转为日期格式的字符串
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  // let time1 = new Date().Format("yyyy-MM-dd");
  // let time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
  public getDateFormat(strDate: Date, fmt?) {
    const o = {
      'M+': getMonth(strDate) + 1, // 月份
      'd+': getDate(strDate), // 日
      'h+': getHours(strDate), // 小时
      'm+': getMinutes(strDate), // 分
      's+': getSeconds(strDate), // 秒
      'q+': Math.floor((getMonth(strDate) + 3) / 3), // 季度
      S: getMilliseconds(strDate) // 毫秒
    };
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (strDate.getFullYear() + '').substr(4 - RegExp.$1.length)); }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
    }
    return fmt;

  }

}
