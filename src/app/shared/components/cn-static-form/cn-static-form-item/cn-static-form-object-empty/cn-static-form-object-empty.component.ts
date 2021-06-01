import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-object-empty',
  templateUrl: './cn-static-form-object-empty.component.html',
  styles: [
  ]
})
export class CnStaticFormObjectEmptyComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  @Input() public fromDataService;
  constructor() { }

  ngOnInit(): void {
    this.config = JSON.parse(JSON.stringify(this.config));

  }

  cascadeValueEmit(back?) {
    console.log('object==级联');
    let cascadeValueObj;
    let currentValue;
    if (back['cascadeValueObj']) {
      cascadeValueObj = back['cascadeValueObj'];
    }
    currentValue = back['data'];

    cascadeValueObj && cascadeValueObj.forEach(cascade => {
      let index = this.config.properties.findIndex(item => item.name === cascade['cascadeName']);
      if (cascade.cascadeItems) {
        cascade.cascadeItems.forEach(_cascadeItem => {
          let isPass = true;
          if (_cascadeItem['type'] === 'condition') {
            isPass = this.analysisResult(_cascadeItem['condition']);
          }

          if (isPass) {
            let cascadeItem = _cascadeItem['content']
            if (cascadeItem['type'] === 'display') {

              if (cascadeItem['data']['option']) {
                let displayValueOption = cascadeItem['data']['option'];
                displayValueOption.forEach(element => {
                  if (element['type'] === 'currentValue') {
                    element['value'] = currentValue;
                  }

                });
                let displayValue = displayValueOption[0]['value'];
                if (index > -1) {
                  this.config.properties[index]['hidden'] = displayValue;
                }
              }

            }
          }


        });
      }

    });


    console.log('$$$$$$cascadeValue');
  }


  compute() {
    let condition = [
      {
        "conditionType": 'and',
        "type": 'expression',  // expression  brackets
        "brackets": [],
        "expression": {
          "comput": 'regular', // 正则、数学计算、非空、bool值
          "leftExpression": {
            "type": 'value',
            "value": '0',
            "valueName": ''
          },
          "righitExpression": {
            "type": 'value',
            "value": '^0$'
          }
        }

      },
      {
        "conditionType": 'and',
        "type": 'expression',  // expression  brackets
        "brackets": [],
        "expression": {
          "comput": 'regular', // 正则、数学计算、非空、bool值
          "leftExpression": {
            "type": 'value',
            "value": '0',
            "valueName": ''
          },
          "righitExpression": {
            "type": 'value',
            "value": '^0$'
          }
        }

      },
      {
        "conditionType": 'and',
        "type": 'brackets',  // expression  brackets
        "brackets": [
          {
            "conditionType": 'and',
            "type": 'expression',  // expression  brackets
            "brackets": [],
            "expression": {
              "comput": 'regular', // 正则、数学计算、非空、bool值
              "leftExpression": {
                "type": 'value',
                "value": '0',
                "valueName": ''
              },
              "righitExpression": {
                "type": 'value',
                "value": '^0$'
              }
            }

          }
        ]

      }
    ]

    // 计算当前条件

    let r = this.analysisResult(condition);
    // 生成新的条件详细  value 里 是表达式的值结果

    console.log('===解析结果如下===', r);


  }

  // 结果分析
  analysisResult(option) {

    // 数组 第一个 【and true  】【 or  false】  合并进去。

    // 返回 结果是否通过

    let Result = false;
    option.forEach((element, index) => {

      if (element['type'] === 'expression') {
        element['value'] = this.getExpressionResult(element['expression']);
      }
      if (element['type'] === 'brackets') {
        element['value'] = this.analysisResult(element['brackets']);
      }

      // 计算出当前条件最终值
      if (element['conditionType'] === 'and') {
        if (index === 0) {
          Result = true;
        }
        Result = Result && element['value'];
      }
      if (element['conditionType'] === 'or') {
        if (index === 0) {
          Result = false;
        }
        Result = Result || element['value'];
      }
    });



    return Result;

  }

  // 计算表达式
  computeExpression(expression) {

    let Expression;
    let result = false;
    switch (expression.comput) {

      case 'empty':
        break;
      case 'notempty':
        break;
      case 'null':
        break;
      case 'notnull':
        break;
      case 'true':
        break;
      case 'false':
        break;
      case 'regular':
        result = this.Expression_regular(expression);
        break;
      case 'equal':
        break;
      case 'notequal':
        break;


    }

    return result;


  }





  // 表达式取值
  getExpressionResult(expression) {
    let back = {
      left: null,
      comput: null,
      righit: null
    }
    if (expression) {
      let expression1 = {
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

      if (expression['comput']) {
        back['comput'] = expression['comput'];
      }
      if (expression['leftExpression']) {
        back['left'] = this.getExpressionValue(expression['leftExpression']);
      }
      if (expression['righitExpression']) {
        back['righit'] = this.getExpressionValue(expression['righitExpression']);
      }

    } else {

    }

    return this.computeExpression(back);

  }

  getExpressionValue(option) {
    let value = null;
    switch (option['type']) {
      case 'value':
        value = option['value'];
        break;
      case 'componentValue':
        value = this.validateForm.value[option['valueName']];
        break;


      // ......多种取值方式
      default:
        value = option['value'];
        break;
    }

    return value;

  }


  // 计算表达式
  Expression_regular(option) {

    let regularflag = false;
    const reg1 = new RegExp(option.righit);
    regularflag = reg1.test(option.left);
    return regularflag;
  }


}
