import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';
import {
  getMonth,
  getHours,
  getDate,
  getMinutes,
  getSeconds,
  getMilliseconds,
  getYear,
  getISOWeek,
  getISOWeeksInYear,
  getQuarter,
} from 'date-fns';

@Component({
  selector: 'app-smt-form-picker-date',
  templateUrl: './smt-form-picker-date.component.html',
  styles: [],
})
export class SmtFormPickerDateComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;

  public model: any;
  public bindObj: {
    showTime: boolean;
    dateFormat: string;
  };
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  ngOnInit(): void {
    this.bindObj = this._setBindObj(this.config);
  }

  private _setBindObj(config: any) {
    return {
      showTime: config.showTime ? config.showTime : true,
      dateFormat: config.dateFormat ? config.dateFormat : 'yyyy-MM-dd HH:mm:ss',
    };
  }

  onChange(changeDate: Date): void {
    if (changeDate) {
      let _cdate = changeDate;
      const _bdate = this.parserDate(_cdate);

      if (this.model! == _bdate) {
        this.model = _bdate;
      }
    } else {
      this.model = null;
    }
  }

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
    console.log('getDateFormat', strDate);
    const o = {
      'M+': getMonth(strDate) + 1, // 月份
      'd+': getDate(strDate), // 日
      'H+': getHours(strDate), // 小时
      'm+': getMinutes(strDate), // 分
      's+': getSeconds(strDate), // 秒
      'q+': Math.floor((getMonth(strDate) + 3) / 3), // 季度
      S: getMilliseconds(strDate), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (strDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  }
}
