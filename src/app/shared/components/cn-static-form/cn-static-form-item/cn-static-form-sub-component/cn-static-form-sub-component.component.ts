import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { VcComponentBase } from 'src/app/shared/vc-components/vc-component';

@Component({
  selector: 'app-cn-static-form-sub-component',
  templateUrl: './cn-static-form-sub-component.component.html',
  styles: [
  ]
})
export class CnStaticFormSubComponentComponent extends VcComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,) {
    super(componentService);

  }

  ngOnInit(): void {
    this.config = JSON.parse(JSON.stringify(this.config));
    console.log("sub::::::", this.config);

    // subProperties
    this.sub(this.validateForm.value);
    if (this.config['componentConfig']['subField']) {
      this.validateForm.get(this.config['componentConfig']['subField']).valueChanges.subscribe(data => {

        let form_data = {};
        form_data = this.validateForm.value;
        form_data[this.config['componentConfig']['subField']] = data;
        if (this.config['componentConfig']['clearValue']) {
          this.validateForm.controls[this.config.name].setValue(null);
        }
        this.sub(form_data);
      });
    }



  }

  public sub(form_data?) {
    this.componentValue = form_data;
    let subMapping = [];
    let subMapping1 = [

      {
        "type": "condition",
        "condition": [
          {
            "conditionType": 'and',
            "type": 'expression',  // expression  brackets
            "brackets": [],
            "expression": {
              "comput": 'true', // 正则、数学计算、非空、bool值
              "leftExpression": {
                "type": 'componentValue',
                "value": '0',
                "valueName": 'showTitle'
              },
              "righitExpression": {
                "type": 'value',
                "value": '^0$'
              }
            }

          }
        ],
        "code": "01"
      },
      {
        "type": "condition",
        "condition": [
          {
            "conditionType": 'and',
            "type": 'expression',  // expression  brackets
            "brackets": [],
            "expression": {
              "comput": 'false', // 正则、数学计算、非空、bool值
              "leftExpression": {
                "type": 'componentValue',
                "value": '0',
                "valueName": 'showTitle'
              },
              "righitExpression": {
                "type": 'value',
                "value": '^0$'
              }
            }

          }
        ],
        "code": "02"
      },
      {
        "type": "default",
        "code": "02"
      }
    ]

    subMapping = this.config['componentConfig']['subMapping'];

    let _viewCode = "";
    let _viewItem = "";
    try {
      subMapping.forEach(item => {
        let isPass = true;
        if (item['type'] === 'condition') {
          isPass = this.analysisResult(item['condition']);
        }
        if (isPass) {
          // 返回 满足条件视图
          _viewCode = item.code;
          _viewItem = item;
          throw new Error();
        }
      })
    } catch (e) {
      // console.log(e)
    }



    console.log('计算', _viewCode);
    this.config['subProperties'].forEach(element => {
      if (element['code'] === _viewCode) {
        element['show'] = true;
      } else {
        element['show'] = false;
      }
    });
  }



  cascadeValueEmit(v) {

  }




}
