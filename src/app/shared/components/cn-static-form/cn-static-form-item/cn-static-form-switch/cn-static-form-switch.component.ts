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

  ngOnInit(): void {
  }


  log(v?) {
    console.log('switch', v, this.fromDataService, this.config);

    this.text(v);

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
