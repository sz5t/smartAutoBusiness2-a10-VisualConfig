import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnPageComponent } from '../../../cn-page/cn-page.component';
import { CnStaticFormComponent } from '../../cn-static-form.component';

@Component({
  selector: 'app-cn-static-form-ajax',
  templateUrl: './cn-static-form-ajax.component.html',
  styles: [
  ]
})
export class CnStaticFormAjaxComponent implements OnInit {
  //   @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  staticData;
  ResourceType = 'cfgBusiModel';
  selectOptions = [

  ]
  @ViewChild('staticForm', { static: true }) public staticForm: CnStaticFormComponent;

  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
  }

  load() {
    // 加载数据， 根据id 值将所属数据标识加载  从全局缓存中加载数据【id】
    // 当前只记录ajax标识

  }

  valueChange(v?) {
    console.log('定义ing....', v);
  }

  _form_config = {

    type: 'staticForm',
    backName: 'ajaxConfig',
    properties: [
      {
        name: 'urlType',
        type: 'select',
        componentConfig: {
          "options": [
            {
              "label": "内部资源",
              "value": "inner"
            },
            {
              "label": "外部资源",
              "value": "out"
            }
          ],
          "labelName": "label",
          "valueName": "value",

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '请求资源类型'

      },
      {
        name: 'ajaxType',
        type: 'select',
        componentConfig: {
          "options": [
            {
              "label": "psot",
              "value": "post"
            },
            {
              "label": "get",
              "value": "get"
            },
            {
              "label": "put",
              "value": "put"
            },
            {
              "label": "delete",
              "value": "delete"
            }
          ],
          "labelName": "label",
          "valueName": "value",

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '请求资源方式'

      },
      {
        name: 'url',
        type: 'input',
        componentConfig: {

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '请求资源地址'
      },
      {
        name: 'params',
        type: 'arrayCard',
        componentConfig: {

        },
        formType: 'array',
        formName: 'formControlName',
        validations: [],
        title: '普通参数',
        properties: [
          {
            name: 'name',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数名称'

          },
          {
            name: 'type',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数类型'

          },
          {
            name: 'valueName',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数取值名称'

          },
          {
            name: 'value',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '静态值'

          }
        ]

      },
      {
        name: 'pathParams',
        type: 'arrayCard',
        componentConfig: {

        },
        formType: 'array',
        formName: 'formControlName',
        validations: [],
        title: '地址参数',
        properties: [
          {
            name: 'name',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数名称'

          },
          {
            name: 'type',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数类型'

          },
          {
            name: 'valueName',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数取值名称'

          }
        ]

      },
      {
        name: 'bodyParams',
        type: 'arrayTable',
        componentConfig: {

        },
        formType: 'array',
        formName: 'formControlName',
        validations: [],
        title: 'body参数',
        properties: [
          {
            name: 'name',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数名称'

          },
          {
            name: 'type',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数类型'

          },
          {
            name: 'valueName',
            type: 'input',
            componentConfig: {

            },
            formType: 'value',
            formName: 'formControlName',
            validations: [],
            title: '参数取值名称'

          }
        ]

      }
    ]
  }


  selectResource() {
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg =
    {
      "id": "window_selected_resource",
      "layoutName": "IAE3pJHJk2luj2YbCcRo0fywvCFbig8BFS0S",
      "type": "confirm",
      "width": "80%",
      "title": "资源选择",
      "style": null,
      "maskClosable": true,
      "cancelText": "取消",
      "okText": '确定',
      "footerButton": [
        {
          "name": "cancel",
          "text": "取消",
          "customActionId": "001"
        }
      ],
      "customAction": [
        {
          "id": "001",
          "execute": [
            {
              "type": "action",
              "content": {
                "actionType": "close"
              }
            }
          ]
        }
      ]
    }
    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: dialogCfg.layoutName, // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        initData: { 'resourceType': this.ResourceType }
        // changeValue: [{ 'resourceType': this.form.value.ResourceType }],
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: (componentInstance) => {

            console.log('弹出页', componentInstance)
            // dialog.close();
          },
        },
      ],
    };

    dialog = this.modal.create(dialogOptional);

  }

}
