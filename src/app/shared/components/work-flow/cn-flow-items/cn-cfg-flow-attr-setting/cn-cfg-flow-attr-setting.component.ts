import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cn-cfg-flow-attr-setting',
  templateUrl: './cn-cfg-flow-attr-setting.component.html',
  styles: [
  ]
})
export class CnCfgFlowAttrSettingComponent implements OnInit {

  public sourceData: any;
  public config: any;
  @Input() public fromDataService;
  selectCmpt: any = 'notSet';
  staticData: any;
  constructor(private httpClient: HttpClient,) { }

  async ngOnInit(): Promise<void> {

    // 【当前组件是设置 表格项 展示，或者编辑的内容】
    // 1.计算出当前组件类型
    // 2.加载当前组件类型的配置
    // 3.值的收集,点击保存的时候，将值回写
    if (!this.sourceData) {
      this.sourceData = {}
    }
    console.log('弹出值', this.sourceData);

    if (this.config) {
      if (this.config.hasOwnProperty('asyncLoad') && this.config['asyncLoad']) {
        await this.load();

      } else {
        this.attr_config = this.config;
      }
    }
  }


  attr_typeConent;
  attr_config_data;
  attr_config;
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
    this.attr_typeConent = this.attr_config['typeConent'].filter(d => d !== '');

    console.log('_sider', this.attr_config);
  }



  valueChange(v) {

    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }
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


}
