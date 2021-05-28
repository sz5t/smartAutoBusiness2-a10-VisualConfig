import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-static-form',
  templateUrl: './cn-static-form-static-form.component.html',
  styles: [
  ]
})
export class CnStaticFormStaticFormComponent implements OnInit {

  public sourceData: any;
  public config: any;
  @Input() public fromDataService: configFormDataServerService;
  selectCmpt: any = 'notSet';
  staticData: any;
  constructor(private httpClient: HttpClient,) { }

  ngOnInit(): void {

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
        this.load();

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
    console.log('_sider', this.attr_config);
  }


  staticFormValueChange(v?) {
    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }

    console.log('====static最终====>>>', this.sourceData);
  }

  async loadConfig(cmpt) {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 
    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}.json?${timestamp}`).toPromise();
    backData = data;
    console.log('加载配置', data);
    return backData;


  }


}
