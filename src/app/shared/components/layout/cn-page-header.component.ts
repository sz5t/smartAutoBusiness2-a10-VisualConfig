import { CnComponentBase } from '../cn-component.base';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-page-header',
  templateUrl: './cn-page-header.component.html',
  styles: [
    `
      nz-page-header {
        border: 1px solid rgb(235, 237, 240);
      }

      .wrap {
        display: flex;
      }

      .content {
        flex: 1;
        margin-top: 8px;
      }

      .content.padding {
        padding-left: 40px;
      }

      .extra-content {
        min-width: 240px;
        text-align: right;
      }

      .extra-content .label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }

      .extra-content .detail {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
      }

      nz-page-header-content {
      }

      .page-header__title {
        font-weight: 600;
      }
    `,
  ],
})
export class CnPageHeaderComponent extends CnComponentBase implements OnInit {
  @Input() public headerConfig;
  @Input() initData;
  @Input() tempData;

  public title;
  public subTitle;
  public tagText;
  public tagColor;
  public dataServe: any;
  public contentItems: {
    title: string;
    span: number;
    text: string;
  }[];

  public extraItems: {
    label: string;
    span: number;
    detail: string;
  }[];

  public CURRENT_ITEM;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    // 初始化组件内置对象, 必须要做的事情,否则无法将内置参数值进行传递
    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
  }

  public ngOnInit() {
    if (this.headerConfig.defaultLoading) {
      this.loadDefaultData();
    }
    if (this.headerConfig.initLoading) {
      this._load();
    }
  }

  private _findAjaxById(ajaxId) {
    return this.headerConfig.ajaxConfig.find((ajax) => ajax.id === ajaxId);
  }

  private loadDefaultData() {
    this.title = this.headerConfig.title;
    this.subTitle = this.headerConfig.subTitle;
    this.tagText = this.headerConfig.tagText;
    this.tagColor = this.headerConfig.tagColor;
    this.contentItems = this.headerConfig.contentItems;
    this.extraItems = this.headerConfig.extraItems;
  }

  private _load() {
    const ajaxObj = this._findAjaxById(this.headerConfig.loadingConfig.id);
    const params = {
      ...this._buildParameters(ajaxObj.params),
    };

    this.componentService.apiService.getRequest(ajaxObj.url, ajaxObj.method, { params }).subscribe((response) => {
      if (response && response.data) {
        this._headerMappingResolve(response.data);
        this._contentMappingResolve(response.data);
        this._footMappingResolve(response.data);
        this._extraMappingResolve(response.data);
      }
    });
  }

  private _buildParameters(paramCfg) {
    return ParameterResolver.resolve({
      params: paramCfg,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      item: this.CURRENT_ITEM,
      router: this.routerValue,
      userValue: this.userValue,
    });
  }

  /**
   *
   * @param item
   * {title:{titleName: '', subTitleName: '', tagTextName: ''}}
   */
  private _headerMappingResolve(item) {
    if (this.headerConfig.headerMapping) {
      this.title = item[this.headerConfig.headerMapping.titleName];
      this.subTitle = item[this.headerConfig.headerMapping.subTitleName];
      this.subTitle = item[this.headerConfig.headerMapping.tagTextName];
    }
  }

  private _contentMappingResolve(item) {
    this.contentItems = [];
    if (this.headerConfig.contentMapping && this.headerConfig.contentMapping.length > 0) {
      this.headerConfig.contentMapping.forEach((c) => {
        if (item[c.field]) {
          const _item = {};
          item.title = c.title;
          item.span = c.span;
          item.text = item[c.field];
          this.contentItems.push(item);
        }
      });
    }
  }

  private _footMappingResolve(item) {}

  private _extraMappingResolve(item) {
    this.extraItems = [];
    if (this.headerConfig.contentMapping && this.headerConfig.contentMapping.length > 0) {
      this.headerConfig.contentMapping.forEach((c) => {
        if (item[c.field]) {
          const _item = {};
          item.label = c.label;
          item.span = c.span;
          item.detail = item[c.field];
          this.extraItems.push(item);
        }
      });
    }
  }
}
