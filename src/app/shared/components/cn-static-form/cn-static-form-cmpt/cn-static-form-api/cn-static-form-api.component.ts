import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { CnPageComponent } from '../../../cn-page/cn-page.component';
import { ApiService } from 'src/app/core/services/api/api.service';
@Component({
  selector: 'app-cn-static-form-api',
  templateUrl: './cn-static-form-api.component.html',
  styles: [
  ]
})
export class CnStaticFormApiComponent implements OnInit, AfterViewInit {
  public sourceData: any;
  public config: any;
  public initData: any;
  @Input() public fromDataService;
  selectCmpt: any = 'notSet';
  staticData: any;
  attr_config;
  sourceConfigData = {
    ajaxType: "get",
    isCreateParameter: false,
    executionType: "query"
  }
  constructor(private httpClient: HttpClient,
    private _apiService: ApiService,) {

  }

  async ngOnInit(): Promise<void> {
    if (!this.sourceData) {
      this.sourceData = {}
    } else {
      this.sourceConfigData = this.sourceData;
    }
    console.log('弹出值', this.sourceData);
    if (!this.config) {
      this.config = {
        "asyncLoad": true,
        "loadingConfig": {
          "path": "vc/config/sourceConfigData.json"
        }
      }
    }

    if (this.config) {
      if (this.config.hasOwnProperty('asyncLoad') && this.config['asyncLoad']) {
        await this.load();

      } else {
        this.attr_config = this.config;
      }
    }
  }


  ngAfterViewInit() {


  }
  async load(node?) {

    if (this.config['loadingConfig']) {

      let d;
      if (this.config['loadingConfig']['path']) {
        d = await this.loadConfig(this.config['loadingConfig']['path']);
      }
      if (d) {
        this.attr_config = d;
      } else {
        this.attr_config = null;
      }

    }
    console.log('_sider', this.attr_config);
  }
  async loadConfig(cmpt) {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 
    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    backData = data;
    console.log('加载配置', data);
    return backData;


  }

  staticFormValueChange(v?) {
    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceConfigData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceConfigData[v['name']] = v['data'];
    }

    console.log('====static最终====>>>', this.sourceConfigData);
  }


  cn_page_config = {
    id: '001',
    isAllJson: false,

  }
  @ViewChild('page', { static: true }) public page: CnPageComponent;



  public after(target, method, advice) {
    const original = target[method];
    target[method] = (...args) => {
      original.apply(target, args) && advice(this, args);
    };
    return target;
  }

  writeLogInfo(that?, arguments1?) {

    let add_data = {
      label: arguments1[0]['descName'],
      value: arguments1[0]['resourceName']
    }

    console.log('xxxxxxxxxxxxxx', that, arguments1, that.tag.addSingleNode(add_data));
  }

  zhuceEvent() {
    // componentDataService
    let dd = this.page.componentDataService.componentInstance['pop_view_data_table']['instance'];
    //   this.after(dd, 'setSelectRow', this.writeLogInfo);
    let tag = this.page.componentDataService.componentInstance['BAxdPtAm5Gbzipe3DFRjhbtRcysySoIrlG5C']['instance'];

    console.log('选中资源信息：', tag['nodeList']);
    this.getApiInfo(tag['nodeList'][0]);
    //nodeList
  }

  public executeHttpRequest(url, method, paramData, logInfo?: any): any {
    let _header = {};
    if (logInfo) {
      const logInfoStr = JSON.stringify(logInfo);
      const dd = encodeURI(logInfoStr);
      _header = new HttpHeaders({
        _log: dd,
      });
    }
    switch (method) {
      case 'get':
        return this._apiService[method](url, paramData, { headers: _header });
      default:
        return this._apiService[method](url, paramData, {}, { headers: _header });
    }
  }

  async getApiInfo(node?) {
    let url = "smt-app/column/queryParamByResourceId";
    let method = "get";
    let params = {
      resourceId: node['apiId'] //'J3neTLLwky15pkBxrlZamVsL4k8MxREyD79M'
    };
    ///column/queryParamByResourceId?resourceId=
    let response = await this.executeHttpRequest(url, method, params).toPromise();
    console.log('分析api', response);
    let r = {
      "data": {
        "parameterSet": [
          {
            "createDate": "2021-06-02 14:19:02",
            "createUserId": "accountId",
            "customerId": "customerId",
            "datatype": "number",
            "defaultValue": "",
            "descName": "年龄",
            "id": "DUxMBFKBwNiTPCZkIM6m4U3EUWQOqOxauJaO",
            "inout": 0,
            "isNullable": 1,
            "isUnique": 0,
            "isValidate": 1,
            "lastUpdateDate": "2021-06-02 14:19:02",
            "lastUpdateUserId": "accountId",
            "length": 8,
            "oldParamName": null,
            "orderCode": 2,
            "paramName": "age",
            "paramType": 0,
            "precision": 0,
            "projectId": "projectId",
            "resourceId": "J3neTLLwky15pkBxrlZamVsL4k8MxREyD79M"
          },
          {
            "createDate": "2021-06-02 14:19:02",
            "createUserId": "accountId",
            "customerId": "customerId",
            "datatype": "string",
            "defaultValue": "",
            "descName": "名称",
            "id": "SVaaWUjGxyWcSUWIRffg0TDuJectBj0AzXgO",
            "inout": 0,
            "isNullable": 1,
            "isUnique": 0,
            "isValidate": 1,
            "lastUpdateDate": "2021-06-02 14:19:02",
            "lastUpdateUserId": "accountId",
            "length": 50,
            "oldParamName": null,
            "orderCode": 1,
            "paramName": "name",
            "paramType": 0,
            "precision": 0,
            "projectId": "projectId",
            "resourceId": "J3neTLLwky15pkBxrlZamVsL4k8MxREyD79M"
          }
        ],
        "resultSet": [

        ]
      },
      "error": null,
      "exception": null,
      "success": 1,
      "validation": null,
      "warn": null
    }

    return response['data'];
  }

  async getNode() {
    let tag = this.page.componentDataService.componentInstance['BAxdPtAm5Gbzipe3DFRjhbtRcysySoIrlG5C']['instance'];


    console.log('选中资源信息：', tag['nodeList']);
    let node = {};
    if (tag['nodeList'] && tag['nodeList'].length > 0) {
      node = tag['nodeList'][0]
      let nodeInfo = await this.getApiInfo(node);

      node = { ...node, ...nodeInfo, ...this.sourceConfigData }
    }

    return node;

  }

}
