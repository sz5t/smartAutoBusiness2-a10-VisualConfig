import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-smt-data-table-input',
  templateUrl: './smt-data-table-input.component.html',
  styles: [
  ]
})
export class SmtDataTableInputComponent implements OnInit {
  @Input() config;
  @Input() dataTableDataServe;
  @Input() valueConfig;
  @Input() state;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);

  public value = null;

  constructor() { }


  ngOnInit(): void {
    // console.log(this.dataTableDataServe);
    let input_value;
    if (this.valueConfig) {
      input_value = this.valueConfig.value;
    }

    this.value = input_value;
    this.valueChange(this.value);
  }

  public valueChange(v?) {
    console.log('value', v)
    const backValue = { id: this.valueConfig.id, name: this.config.field, value: v };
    this.updateValue.emit(backValue);
  }

  public onblur(e?, type?) {
    this.assemblyValue();

  }
  public onKeyPress(e?, type?) {
    if (e.code === 'Enter') {
      this.assemblyValue();
    }
  }

  // 组装值
  public assemblyValue() {
    console.log('组装值', this.value);
    this.valueChange(this.value);
  }

}
