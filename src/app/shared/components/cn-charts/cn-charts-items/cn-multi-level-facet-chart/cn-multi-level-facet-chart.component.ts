import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import DataSet from '@antv/data-set';

@Component({
  selector: 'app-cn-multi-level-facet-chart',
  templateUrl: './cn-multi-level-facet-chart.component.html',
  styles: [
  ]
})
export class CnMultiLevelFacetChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
  @Input() public config;
  @Input() tempData;
  @Input() initData;
  @ViewChild('container', { static: false }) public chartElement: ElementRef;

  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider) {
    super(componentService);
    this.initValue = {};
    this.tempValue = {};
  }

  public chart: any;
  public dataList: any[] = [];
  public classFieldArray: any[] = [];

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    if (this.config.BasiAttribute) {
      this.classFieldArray = this.config.BasiAttribute.classFieldArray ? this.config.BasiAttribute.classFieldArray : []
    }
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  public initComponentParams() {
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

  public async ngAfterViewInit() {
    await this.load_data();
    this.createChart();
  }

  public async load_data() {
    this.dataList = await this.createUrlParams(this.config.loadingConfig);
  }

  public async createUrlParams(config) {
    const url = this._buildURL(config.url);
    const params = {
      ...this._buildParameters(config.params),
      ...this._buildFilter(config.filter),
    };
    const method = config.method;
    const loadData = await this._load(url, params, method);
    if (loadData.success) {
      if (loadData.success === 1 || loadData.success === 2) {
        return loadData.data;
      }
    } else {
      return [];
    }
  }

  /*
   * 构建URL
   * @param ajaxUrl
   * @returns {string}
   * @private
   */
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this._isUrlString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }
  /*
   * 处理URL格式
   * @param url
   * @returns {boolean}
   * @private
   */
  private _isUrlString(url) {
    return Object.prototype.toString.call(url) === '[object String]';
  }

  /**
   * 构建URL参数
   * @param paramsConfig
   * @returns {{}}
   * @private
   */
  private _buildParameters(paramsConfig) {
    let params = {};
    if (paramsConfig) {
      params = ParameterResolver.resolve({
        params: paramsConfig,
        tempValue: this.tempValue,
        initValue: this.initData,
        cacheValue: this.cacheValue,
        cascadeValue: this.cascadeValue,
        userValue: this.userValue,
      });
    }
    return params;
  }
  /**
   * 构建查询过滤参数
   * @param filterConfig
   * @returns {{}}
   * @private
   */
  private _buildFilter(filterConfig) {
    let filter = {};
    if (filterConfig) {
      filter = ParameterResolver.resolve({
        params: filterConfig,
        tempValue: this.tempValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
    }
    return filter;
  }

  private async _load(url, params, method) {
    const mtd = method === 'proc' ? 'post' : method;
    return this.componentService.apiService[mtd](url, params).toPromise();
  }

  // 构建柱状图的方法
  public createChart() {
    const that = this;
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 500,
      padding: [60, 90, 80, 80]
    });

    this.chart.data(this.dataList);
    this.chart.coordinate('theta');
    this.chart.tooltip({
      showTitle: false,
      showMarkers: false
    });
    this.chart.facet('tree', {
      fields: ['GRADE', 'CLASS'],
      line: {
        style: that.config.BasiAttribute.lineStyle ? that.config.BasiAttribute.lineStyle : {},
        smooth: that.config.BasiAttribute.smooth ? that.config.BasiAttribute.smooth : true,
      },
      eachView(view, facet) {
        console.log(facet);
        const dv = new DataSet.DataView();
        // 这个地方可以抽成一个画图的入口方法，目前只写一个扇形比例


        dv.source(facet.data)
          .transform({
            type: 'percent',
            field: that.config.BasiAttribute.calField ? that.config.BasiAttribute.calField : null, // 计算字段
            dimension: that.config.BasiAttribute.dimensionField ? that.config.BasiAttribute.dimensionField : null, // 统计字段
            as: 'percent' // 数据处理之后存储的字段
          });

        view.data(dv.rows);
        view.scale({
          percent: {
            formatter(val) {
              return (val * 100).toFixed(2) + '%';
            }
          }
        });
        view.interval().position('percent').color(that.config.BasiAttribute.dimensionField).adjust('stack');
        view.interaction('element-active');
      }
    });
    this.chart.render();
  }

}
