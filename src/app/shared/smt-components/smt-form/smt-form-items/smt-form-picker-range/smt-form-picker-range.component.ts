import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';
import { getMonth, getMilliseconds, getSeconds, getMinutes, getHours, getDate } from 'date-fns';
@Component({
  selector: 'app-smt-form-picker-range',
  templateUrl: './smt-form-picker-range.component.html',
  styles: [],
})
export class SmtFormPickerRangeComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;

  dateRange = []; // [ new Date(), addDays(new Date(), 3) ];

  public bindObj: {
    dateFormat: string;
    showTime: boolean;
    model: any;
    value: any;
    dateRange: any[];
  };

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  private _setBindObj(config: any) {
    return {
      dateFormat: '',
      showTime: config.showTime,
      model: null,
      value: null,
      dateRange: [],
    };
  }

  ngOnInit(): void {
    this.bindObj = this._setBindObj(this.config);
  }

  valueChange(v?) {
    if (this.config.showTime) {
      this.bindObj.dateFormat = 'yyyy-MM-dd hh:mm:ss';
    } else {
      this.bindObj.dateFormat = 'yyyy-MM-dd';
    }
    console.log('时间范围:>>>valueChange>>', v);
    const item: any = {};
    if (v) {
      const time: any = v.split(',');
      item.beginTime = time[0];
      item.endTime = time[1];

      let rangeTime = '';
      if (this.bindObj.dateRange.length > 0) {
        const begin = this.bindObj.dateRange[0];
        const beginTime = this.getDateFormat(begin, this.bindObj.dateFormat);
        const end = this.bindObj.dateRange[1];
        const endTime = this.getDateFormat(end, this.bindObj.dateFormat);
        rangeTime = beginTime + ',' + endTime;
      }
      if (v !== rangeTime) {
        const _beginTime = this.parserDate(item.beginTime);
        const _endTime = this.parserDate(item.endTime);
        const _rangeTime = [];
        _rangeTime.push(_beginTime);
        _rangeTime.push(_endTime);
        this.bindObj.dateRange = _rangeTime;
      }
    } else {
      this.dateRange = [];
    }
    this.validateForm.controls[this.config.field].setValue(this.config.bindObj.dateRange);
  }

  onChange(result): void {
    console.log('时间范围-onChange: ', result);
    if (result.length > 0) {
      const begin = result[0];
      const beginTime = this.getDateFormat(begin, this.bindObj.dateFormat);
      const end = result[1];
      const endTime = this.getDateFormat(end, this.bindObj.dateFormat);
      const rangeTime = beginTime + ',' + endTime;
      if (this.bindObj.value !== rangeTime) {
        this.bindObj.value = rangeTime;
      }
    } else {
      this.bindObj.value = null;
    }
  }

  parserDate(date) {
    const t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/')));
    }
  }

  public getDateFormat(strDate: Date, fmt?) {
    const o = {
      'M+': getMonth(strDate) + 1, // 月份
      'd+': getDate(strDate), // 日
      'h+': getHours(strDate), // 小时
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
