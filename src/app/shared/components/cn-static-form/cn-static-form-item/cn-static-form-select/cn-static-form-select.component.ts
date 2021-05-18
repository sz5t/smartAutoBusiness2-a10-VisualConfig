import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-select',
  templateUrl: './cn-static-form-select.component.html',
  styles: [
  ]
})
export class CnStaticFormSelectComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  selectValue: any;
  selectOptions: any[];
  constructor() { }

  ngOnInit(): void {
    console.log('select:', this.config);
    if (this.config['componentConfig']) {
      this.selectOptions = this.config['componentConfig']['options'];

    }

  }

  log(v?) {
    this.selectValue = v;
    this.text(v);
    console.log('选择中：', v);
  }

  public text(v) {

    let back = { name: this.config.name, data: v, cascadeValueObj: this.config['componentConfig']['casadeValue'] }

    this.cascadeValue.emit(back);

  }


}
