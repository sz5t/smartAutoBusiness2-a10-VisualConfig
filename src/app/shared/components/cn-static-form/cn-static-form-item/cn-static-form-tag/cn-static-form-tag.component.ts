import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { VcComponentBase } from 'src/app/shared/vc-components/vc-component';

@Component({
  selector: 'app-cn-static-form-tag',
  templateUrl: './cn-static-form-tag.component.html',
  styles: [
  ]
})
export class CnStaticFormTagComponent extends VcComponentBase implements OnInit {

  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  itemConfig: any = {
    hiddenTitle: false,
    "labelSize": {
      "span": 8,
      "nzXs": {
        "span": 8,
        "offset": 0
      },
      "nzSm": {
        "span": 8,
        "offset": 0
      },
      "nzMd": {
        "span": 8,
        "offset": 0
      },
      "nzLg": {
        "span": 8,
        "offset": 0
      },
      "ngXl": {
        "span": 8,
        "offset": 0
      },
      "nzXXl": {
        "span": 8,
        "offset": 0
      }
    },
    "controlSize": {
      "span": 16,
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    }
  };
  public color: string;
  showValue: any;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,) {
    super(componentService);
  }


  ngOnInit(): void {
    if (this.config.componentConfig) {
      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }

      if (this.config.componentConfig['enableDefaultValue']) {
        this.validateForm.controls[this.config['name']].setValue(null);
      }

    }
    this.loadShowValue();
  }

  loadShowValue() {
    let d = this.validateForm.controls[this.config['name']].value;
    // this.showValue = d;
    this.showValue = this._colorMappingResolve(d);

  }
  valueChange(v?) {
    this.loadShowValue();
  }

  private _colorMappingResolve(value) {
    let text;
    if (this.config.componentConfig['dataMapping']) {
      this.config.componentConfig.dataMapping.forEach(d => {
        let val = value;
        /*  if (d.type === 'tempValue') {
           val = this.tempData[d.field];
         }
         if (d.type === 'initValue') {
           val = this.initData[d.field];
         } */
        if (d.type === 'rowValue') {
          val = this.validateForm.value[d.field];
        }
        if (d.type === 'formValue') {
          val = this.validateForm.value[d.field];
        }
        if (d.type === 'currentValue') {
          val = value;
        }
        if ((val || val === 0 || val === false) && (d.value === val)) {
          this.color = d.color;
          if (d.valueText) {
            text = d.valueText;
          }
          if (d.valueField) {
            text = this.validateForm.value[d.valueField];
          }
          if (!d.valueText && !d.valueField) {
            text = value;
          }
          return false;
        }
      });
    }
    return text;

  }

}
