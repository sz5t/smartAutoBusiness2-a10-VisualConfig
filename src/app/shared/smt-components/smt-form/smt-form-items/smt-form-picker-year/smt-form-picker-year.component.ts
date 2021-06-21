import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';
import { getMonth, getDate, getHours, getMinutes, getSeconds, getMilliseconds } from 'date-fns';
@Component({
  selector: 'app-smt-form-picker-year',
  templateUrl: './smt-form-picker-year.component.html',
  styles: [],
})
export class SmtFormPickerYearComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;

  public bindObj: {
    model: any;
    value: any;
  };
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }
  ngOnInit(): void {}

  valueChange(v?) {
    if (v) {
      const sj = this.parserDate(v);
      if (this.bindObj.model) {
        const _oldyear = this.getDateFormat(this.bindObj.model, 'yyyy');
        const _newyear = this.getDateFormat(sj, 'yyyy');
        if (_oldyear !== _newyear) {
          this.bindObj.model = sj;
        }
      } else {
        this.bindObj.model = sj;
      }
    } else {
      this.bindObj.model = null;
    }

    this.validateForm.controls[this.config.field].setValue(this.bindObj.model);
  }

  onChange(result: Date): void {
    console.log('年变化onChange: ', result);
    if (result) {
      const bc = this.getDateFormat(result, 'yyyy');
      if (this.bindObj.value !== bc) {
        this.bindObj.value = bc;
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
