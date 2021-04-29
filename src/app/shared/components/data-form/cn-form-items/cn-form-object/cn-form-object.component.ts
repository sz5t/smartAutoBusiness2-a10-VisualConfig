import { Component, Input, OnInit, Output, EventEmitter, Type, ViewChild, ViewContainerRef, Inject, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import { CnDataFormComponent } from '../../cn-data-form.component';
const components: { [type: string]: Type<any> } = {
  form: CnDataFormComponent
};
@Component({
  selector: 'app-cn-form-object',
  templateUrl: './cn-form-object.component.html',
  styles: [
  ]
})
export class CnFormObjectComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() formGroup: FormGroup;
  @Output() public updateValue = new EventEmitter();
  @Input() public initData;
  @Input() tempData;
  private _componentRef: ComponentRef<any>;
  form1: CnDataFormComponent;
  @ViewChild('virtualContainer', { static: true, read: ViewContainerRef }) virtualContainer: ViewContainerRef;

  // @ViewChild('form1', { static: true }) public form1: CnDataFormComponent;
  tableConfig: any;
  loading = true;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private _resolver: ComponentFactoryResolver,
  ) {
    super(componentService);
  }
  value: any;
  ngOnInit(): void {


  }
  changeValue: any = null;
  async getJson() {
    if (!this.tableConfig) {
      if (this.config.layoutName) {
        // liu 20.11.12
        this.tableConfig = this.getMenuComponentConfigById(this.config.layoutName);
        // this.tableConfig = this.componentService.cacheService.getNone(this.config.layoutName);
      }
      if (!this.tableConfig) {
        await this.getCustomConfig(this.config.layoutName);

        this.tableConfig = this.getMenuComponentConfigById(this.config.layoutName);
        // this.tableConfig = this.componentService.cacheService.getNone(this.config.layoutName);
      }
      this.loading = false;
      this._buildComponent();
    } else {
      this.buildChangeValue(this.config);
    }
  }

  private _buildComponent(componentObj?) {
    // console.log('=+++++=====++++++======+++',this.tableConfig,this.config.layoutName)
    if (!this.tableConfig) {
      return false;
    }
    const comp = this._resolver.resolveComponentFactory<any>(components.form);
    this.virtualContainer.clear();
    this._componentRef = this.virtualContainer.createComponent(comp);
    this._componentRef.instance.config = this.tableConfig;
    //this._componentRef.instance.changeValue = this._changeValue;
    this._componentRef.instance.updateValue.subscribe((event) => {
      this.valueChange1(event);
    });
    this.form1 = this._componentRef.instance;

    this.buildChangeValue(this.config);
  }

  form_value = { base_attr_data: { id: '22', text: 'dd', nodeType: '测试' } }

  count = 0;
  public async valueChange(v?) {
    await this.getJson();
    this.form_value = { base_attr_data: v }

    if (v) {

      this.count++;
      if (this.count < 2) {
        if (this.config.passValue) {
          this.form1[this.config.passValue['toValue']][this.config.passValue['name']] = v;
        }
        // this.form1.tempValue['base_attr_data'] = v;
        this.form1.load();
      }


      console.log('object===>valuechange', v)
      const backValue: any = { name: this.config.field, value: v, id: this.config.config.id };
      this.updateValue.emit(backValue);
    }

  }

  valueChange1(v?) {
    this.value = v;

  }


  form_bese = {
    "id": "form_bese_1",
    "type": "form",
    "component": "form",
    "state": "text",
    "enableLoadStaticData": true,
    "enableUpdateValue": true,
    "staticDataConfig": {
      "name": "data",
      "type": "tempValue",
      "valueName": "base_attr_data"
    },
    "loadingConfig": {
      "id": "loadform"
    },
    "formLayout": {
      "id": "b86s2i",
      "type": "layout",
      "title": "表单布局b86s2i",
      "rows": [
        {
          "id": "MefhXa",
          "type": "row",
          "cols": [
            {
              "id": "ioj0m3",
              "col": "cc",
              "type": "col",
              "title": "列ioj0m3",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "001"
              }
            },
            {
              "id": "ioj0mV",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "004"
              }
            },
            {
              "id": "foj0dV",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "003"
              }
            }
          ]
        }
      ]
    },
    "formControls": [
      {
        "id": "001",
        "hidden": true,
        "title": "id",
        "titleConfig": {
          "required": false
        },
        "field": "id",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "id"
        },
        "editor": {
          "type": "label",
          "field": "id"
        }
      },
      {
        "id": "003",
        "hidden": true,
        "title": "名称",
        "titleConfig": {
          "required": false
        },
        "field": "text",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "text"
        },
        "editor": {
          "field": "text",
          "type": "input",
          "placeholder": "节点名称",
        }
      },
      {
        "id": "004",
        "hidden": true,
        "title": "类型",
        "titleConfig": {
          "required": false
        },
        "field": "nodeType",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "nodeType"
        },
        "editor": {
          "field": "nodeType",
          "type": "label",
          "placeholder": "节点名称",
        },
        children1: [
          {
            "id": "005",
            "hidden": true,
            "title": "fff",
            "titleConfig": {
              "required": false
            },
            "field": "text1",
            "labelSize": {
              "span": 4,
              "nzXs": 4,
              "nzSm": 4,
              "nzMd": 4,
              "nzLg": 4,
              "ngXl": 4,
              "nzXXl": 4
            },
            "controlSize": {
              "span": 14,
              "nzXs": 14,
              "nzSm": 14,
              "nzMd": 14,
              "nzLg": 14,
              "ngXl": 14,
              "nzXXl": 14
            },
            "state": "text1",
            "text": {
              "type": "label",
              "field": "text1"
            },
            "editor": {
              "field": "text1",
              "type": "input",
              "placeholder": "节点名称1",
            }
          }
        ]
      }
    ],
    "formControlsPermissions": [
      {
        "formState": "text",
        "isLoad": true,
        "Controls": [
          {
            "id": "001",
            "state": "text",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "003",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "004",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          }

        ]
      }
    ],
    "ajaxConfig": [
      {
        "id": "loadform",
        "url": "resource/GET_DEPARTMENT_DTL/query",
        "urlType": "inner",
        "ajaxType": "get",
        "params": [
          {
            "name": "ID",
            "type": "tempValue",
            "valueName": "PID",
            "value": "-999"
          }
        ],
        "outputParameters": [],
        "result": []
      }
    ],
    "cascade": {
      "messageSender": [],
      "messageReceiver": [
      ]
    },
    "cascadeValue": []

  }

  public buildChangeValue(option: any) {

    // this.table && this.table.setChangeValue(this._changeValue);

  }

}
