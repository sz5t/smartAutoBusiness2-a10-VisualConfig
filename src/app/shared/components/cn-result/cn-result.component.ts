import { Component, Inject, Input, OnInit } from '@angular/core';
import { CN_RESULT_METHOD } from 'src/app/core/relations/bsn-methods/bsn-result-method';
import { CN_RESULT_PROPERTY } from 'src/app/core/relations/bsn-property/result.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../cn-component.base';
/**
 * Result 组件主要应用与多步骤，或者批量处理数据过程中，对于所作数据处理结果的反馈
 * 1、首先通过数据检测结果，判断生成那种类型的结果页面内容，包括标题、结果状态、描述信息
 * 2、对于验证失败和错误的数据，需要生成对应的列表进行展示
 * 3、对于可能存在后续操作的处理数据，则相应根据状态动态加载json配置
 */
@Component({
  selector: 'app-cn-result',
  templateUrl: './cn-result.component.html',
  styles: [],
})
export class CnResultComponent extends CnComponentBase implements OnInit {
  @Input()
  public config: any;
  @Input()
  public initData: any;
  @Input()
  public tempData: any;

  public COMPONENT_NAME = 'CnResult';

  public layoutId: string;

  public COMPONENT_PROPERTY = CN_RESULT_PROPERTY;
  public COMPONENT_METHODS = CN_RESULT_METHOD;

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    private componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
    this.tempValue = {};
    this.initValue = {};
  }

  public title: string;
  public status: string;
  public subTitle: string;

  public resultContent: {
    contentTitle: string;
    contentList?: { icon: string; content: string }[];
  };

  public layout: any;
  public toolbarConfig: any;

  public async ngOnInit() {
    this.config = {
      title: '注册成功',
      status: 'success',
      subTitle: '包含 NG-ALAIN Schematics 、VSCODE插件',
      resultContent: {
        contentTitle: ' Ant Design',
        contentList: [
          {
            icon: 'book',
            content: '符合 Ant Design 设计价值观',
          },
          {
            icon: 'book',
            content: '符合 Ant Design 设计价值观',
          },
        ],
      },
      loadingConfig: {
        url: '',
        method: '',
        params: [],
      },
      loadingContentConfig: {
        url: '',
        method: '',
        params: [],
      },
      resultStatusLayoutMapping: [
        {
          layoutId: '',
          status: 'success',
        },
        {
          layoutId: '',
          status: 'error',
        },
        {
          layoutId: '',
          status: 'warning',
        },
      ],
    };

    this.loadContentData().then((_result) => {
      this.loadResultData().then((_result) => {
        this.loadLayoutConfig().then(() => {
          this.initResultContent();
        });
      });
    });
    return true;
  }

  private async initResultContent() {
    this.title = this.config.title ? this.config.title : '';
    this.status = this.config.status ? this.config.status : 'success';
    this.subTitle = this.config.subTitle ? this.config.subTitle : '';
    this.initContent(this.config);
    this.initToolbar(this.config);
    this.initLayout(this.config);
    return true;
  }

  private initContent(config: any): void {
    if (config.resultContent) {
      this.resultContent = config.resultContent;
    }
  }

  private initToolbar(config: any): void {
    if (config.toolbarConfig) {
      this.toolbarConfig = config.toolbarConfig;
    }
  }

  private initLayout(config: any): void {
    if (config.layout) {
      this.layout = config.layout;
    }
  }

  private buildParameters(paramsCfg): any {
    let parameterResult: any;
    parameterResult = ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      userValue: this.userValue,
      menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    });
    return parameterResult;
  }

  private async loadResultData() {
    if (!this.config.loadingConfig) {
      return;
    }

    const url = this.config.laodingConfig.url;
    const method = this.config.laodingConfig.method;
    const params = this.buildParameters(this.config.loadingConfig.params);
    const response: any = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    if (response && response.data) {
      this.config.title = response.data[0]['TITLE'];
      this.config.status = response.data[0]['STATUS'];
      this.config.subTitle = response.data[0]['SUB_TITLE'];
      this.config.resultContent = { contentTitle: response.data[0]['CONTENT_TITLE'] };
    }
    return true;
  }

  private async loadContentData() {
    if (!this.config.loadingContentConfig) {
      return;
    }
    const url = this.config.laodingConfig.url;
    const method = this.config.laodingConfig.method;
    const params = this.buildParameters(this.config.loadingConfig.params);
    const response: any = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    if (response && response.data) {
      this.config.resultContent.contentList = response.data;
    }
    return true;
  }

  private async loadLayoutConfig() {
    if (this.config.resultStatusLayoutMapping && this.config.resultStatusLayoutMapping.length > 0) {
      this.config.resultStatusLayoutMapping.forEach((_map): any => {
        if (_map.status === this.status) {
          // 根据配置的layoutId动态加载页面
        }
      });
    }
    return true;
  }
}
