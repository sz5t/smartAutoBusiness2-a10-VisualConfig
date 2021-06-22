import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getISOWeek, getYear, addWeeks, getMonth } from 'date-fns';

@Component({
  selector: 'app-smt-data-table-week-picker',
  templateUrl: './smt-data-table-week-picker.component.html',
  styles: [
  ]
})
export class SmtDataTableWeekPickerComponent implements OnInit {
  @Input() config;
  @Input() dataTableDataServe;
  @Input() valueConfig;
  @Input() state;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);

  public date = null;
  public value = null;

  constructor() { }

  ngOnInit(): void {
    let v_value;
    if (this.valueConfig) {
      v_value = this.valueConfig.value;
    }
    this.value = v_value;
    setTimeout(() => {
      this.valueChange(this.value);
    });
  }

  getWeek(result: Date): void {
    let year = getYear(result);
    const week = this.getNewWeek(getISOWeek(result));
    const month = getMonth(result);
    if (month === 0) {
      if (week > 40) {
        year = year - 1;
      }
    }
    const yw = `${year}-${week}`;
    if (this.value !== yw) {
      this.value = yw;
    }
    console.log('周变化week: ', yw);
    this.valueChange(this.value);
  }

  public getNewWeek(d: any) {
    if (d <= 9) {
      d = '0' + d;
    }
    return d;
  }

  public valueChange(v?) {
    if (v) {
      const YearAndWeek = v.split('-');
      if (YearAndWeek.length > 1) {
        const _year = YearAndWeek[0];
        const _week = YearAndWeek[1];
        //const datenew =  addWeeks(_year, _week);
        const datenew: Date = addWeeks(new Date(_year, 0, 1), _week);
        const yearold = getYear(this.date);
        const weekold = this.getNewWeek(getISOWeek(this.date));
        const ywold = `${yearold}-${weekold}`;
        const yearnew = getYear(datenew);
        const weeknew = this.getNewWeek(getISOWeek(datenew));
        const ywnew = `${yearnew}-${weeknew}`;
        if (ywold !== ywnew) {
          this.date = datenew;
        }
        // console.log('==年周计算出时间==', datenew);
      }
      const year = getYear(this.date);
      const week = this.getNewWeek(getISOWeek(this.date));
      const weekValue = getISOWeek(this.date);
      const item = { year: year, week: weekValue, weekString: `${year}-${week}` };
      if (!this.date) {
        item.year = null;
        item.week = null;
        item.weekString = null;
      }
      const backValue = { name: this.config.field, value: v, id: this.valueConfig.id, dataItem: item };
      this.updateValue.emit(backValue);
      // console.log('周值变化', v);
    }
  }

  parserDate(date) {
    const t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/')));
    }
  }

}
