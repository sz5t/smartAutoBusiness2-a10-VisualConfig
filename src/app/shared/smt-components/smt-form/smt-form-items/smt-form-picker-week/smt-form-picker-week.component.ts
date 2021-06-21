import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';
import { getISOWeek, getYear, setISOWeek, addWeeks, addISOWeekYears, getMonth } from 'date-fns';
@Component({
  selector: 'app-smt-form-picker-week',
  templateUrl: './smt-form-picker-week.component.html',
  styles: [],
})
export class SmtFormPickerWeekComponent extends SmtComponentBase implements OnInit {
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
  getWeek(result: Date): void {
    if (result) {
      let year = getYear(result);
      const week = this.getNewWeek(getISOWeek(result));
      const month = getMonth(result);
      if (month === 0) {
        if (week > 40) {
          year = year - 1;
        }
      }
      const yw = `${year}-${week}`;
      if (this.bindObj.value !== yw) {
        this.bindObj.value = yw;
      }
      console.log('周变化week: ', yw, result);
    } else {
      this.bindObj.value = null;
    }
  }
  public valueChange(v?) {
    if (v) {
      const YearAndWeek = v.split('-');
      if (YearAndWeek.length > 1) {
        const _year = YearAndWeek[0];
        const _week = YearAndWeek[1];
        // const datenew:Date = addWeeks(new Date(Number(_year)-1, 1, 1), _week);

        const datenew: Date = addWeeks(new Date(_year, 0, 1), _week);
        const yearold = getYear(this.bindObj.model);
        const weekold = this.getNewWeek(getISOWeek(this.bindObj.model));
        const ywold = `${yearold}-${weekold}`;
        const yearnew = getYear(datenew);
        const weeknew = this.getNewWeek(getISOWeek(datenew));
        const ywnew = `${yearnew}-${weeknew}`;
        if (ywold !== ywnew) {
          this.bindObj.model = datenew;
        }
        console.log('==年周计算出时间==', datenew);
      }
      const year = getYear(this.bindObj.model);
      const week = this.getNewWeek(getISOWeek(this.bindObj.model));
      const weekValue = getISOWeek(this.bindObj.model);
      const item = { year: year, week: weekValue, weekString: `${year}-${week}` };
      if (!this.bindObj.model) {
        item.year = null;
        item.week = null;
        item.weekString = null;
      }

      this.validateForm.controls[this.config.field].setValue(this.bindObj.model);
    }
  }

  public getNewWeek(d: any) {
    // d=d+1;
    if (d <= 9) {
      d = '0' + d;
    }
    return d;
  }
}
