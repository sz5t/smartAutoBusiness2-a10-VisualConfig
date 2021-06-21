import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';
import { getYear, getMonth } from 'date-fns';
@Component({
  selector: 'app-smt-form-picker-month',
  templateUrl: './smt-form-picker-month.component.html',
  styles: [],
})
export class SmtFormPickerMonthComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;

  public model: any = null;
  public value: any = null;

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  ngOnInit(): void {}

  public onChange(result: Date): void {
    // 选择日期
    if (result) {
      let sj = result;
      if (typeof result === 'string') {
        sj = this.parserDate(result);
      }
      const year = getYear(this.model);
      const month = this.getNewMonth(getMonth(this.model) + 1);
      const ym = `${year}-${month}`;
      if (this.value !== ym) {
        this.value = ym;
      }
    } else {
      this.value = null;
    }

    console.log('年月 onChange: ', result, this.model, this.value);
  }

  public valueChange(v?) {
    if (v) {
      const sjstr = `${v}-1`;
      const sj = this.parserDate(sjstr);
      if (sj !== this.model) {
        this.model = sj;
      }
    } else {
      this.model = null;
    }
    const year = getYear(this.model);
    const month = this.getNewMonth(getMonth(this.model) + 1);
    const monthvalue = getMonth(this.model) + 1;
    const item = { year: year, month: monthvalue, monthString: `${year}-${month}` };
    if (!this.model) {
      item.year = null;
      item.month = null;
      item.monthString = null;
    }

    this.validateForm.controls[this.config.field].setValue(this.model);
  }

  parserDate(date) {
    const t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/')));
    }
  }

  public getNewMonth(d: any) {
    if (d <= 9) {
      d = '0' + d;
    }
    return d;
  }
}
