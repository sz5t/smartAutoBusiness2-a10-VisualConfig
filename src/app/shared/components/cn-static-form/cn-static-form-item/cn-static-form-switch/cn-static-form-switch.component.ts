import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-switch',
  templateUrl: './cn-static-form-switch.component.html',
  styles: [
  ]
})
export class CnStaticFormSwitchComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  constructor() { }
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
  ngOnInit(): void {
    if (this.config.componentConfig) {
      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }

    }
    if (this.validateForm.controls[this.config['name']]) {
      let d = this.validateForm.controls[this.config['name']].value;
      if (this.config['componentConfig']['casadeValue']) {
        this.text(d);
      }
    }
  }


  log(v?) {
    console.log('switch', v, this.fromDataService, this.config);

    if (this.config['componentConfig']['casadeValue']) {
      this.text(v);
    }
  }
  public text(v) {
    let _c = {
      "cascadeName": "displayType",
      "cascadeItems": [
        {

          "type": "condition",
          "condition": [
            {
              "conditionType": 'and',
              "type": 'expression',
              "centent": [],
              "expression": {
                "comput": 'regular', // 正则、数学计算、非空、bool值
                "leftExpression": {
                  "type": 'value',
                  "value": 'ddd',
                  "valueName": ''
                },
                "righitExpression": {
                  "type": 'value',
                  "value": '^0$'
                }
              }

            }
          ],
          "content": {
            "type": "display",
            "data": {
              "option": [
                {
                  "name": "display",
                  "type": "value",
                  "value": true,
                  "valueName": ""
                }
              ]
            }
          }
        }
      ]
    }
    // 最终响应结构
    let cascadeValueObj = [
      {
        "cascadeName": "displayType",
        "cascadeItems": [
          {
            "type": "display",
            "data": {
              "option": [
                {
                  "value": v
                }
              ]
            }
          }

        ]
      }
    ]

    let back = { name: this.config.name, data: v, cascadeValueObj: this.config['componentConfig']['casadeValue'] }

    this.cascadeValue.emit(back);

  }

}
