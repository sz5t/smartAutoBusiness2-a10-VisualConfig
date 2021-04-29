import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CnComponentBase } from '../../../cn-component.base';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

@Component({
  selector: 'app-cn-form-label',
  templateUrl: './cn-form-label.component.html',
  styleUrls: ['./cn-form-label.component.less']
})
export class CnFormLabelComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() formGroup: FormGroup;
  @Output() public updateValue = new EventEmitter();

  public value: any;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider) {
    super(componentService);
    this.initValue = {};
    this.tempValue = {};
  }

  ngOnInit() {
  }

  /**
   * valueChange
   */
  public valueChange(v?) {
    setTimeout(() => {
      this.value = v;
    });
    // console.log('label 值变化', v);
    const backValue = { name: this.config.field, value: v, id: this.config.config.id };
    // this.updateValue.emit(backValue);
  }

  public cascadeAnalysis(c?) {
    if (c.hasOwnProperty(this.config.field)) {
      if (c[this.config.field].hasOwnProperty('cascadeValue')) {
        this.cascadeValue = c[this.config.field].cascadeValue;
      }


      if (c[this.config.field].hasOwnProperty('exec')) {
        if (c[this.config.field].exec === 'updateValue') {
          this.valueChangeBack(this.value);
        }
      }

    }
  }

  valueChangeBack(v?) {
    const backValue = { name: this.config.field, value: v, id: this.config.config.id };
    this.updateValue.emit(backValue);
  }

}
