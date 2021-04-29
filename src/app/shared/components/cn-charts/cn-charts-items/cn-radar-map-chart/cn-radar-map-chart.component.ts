import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import DataSet from '@antv/data-set';

@Component({
  selector: 'app-cn-radar-map-chart',
  templateUrl: './cn-radar-map-chart.component.html',
  styles: [
  ]
})
export class CnRadarMapChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
  public X: any;
  public Y: any;
  public max: any;
  public min: any;
  public groupFiled: any;
  public fomartField: any[] = [];

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    if (this.config.BasiAttribute) {
      this.fomartField = this.config.BasiAttribute.fomartField ? this.config.BasiAttribute.fomartField : [];

      this.X = this.config.BasiAttribute.x ? this.config.BasiAttribute.x : 'X';

      this.Y = this.config.BasiAttribute.y ? this.config.BasiAttribute.y : 'Y';

      this.groupFiled = this.config.BasiAttribute.groupFiled ? this.config.BasiAttribute.groupFiled : 'groupName';

      this.max = this.config.BasiAttribute.max ? this.config.BasiAttribute.max : 100;

      this.min = this.config.BasiAttribute.min ? this.config.BasiAttribute.min : 0;
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

  public createChart() {
    const { DataView } = DataSet;
    const dv = new DataView().source(this.dataList);
    this.transformData(dv);
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 500,
    });
    this.chart.data(dv.rows);
    this.chart.scale(this.Y, {
      min: this.min,
      max: this.max,
    });
    this.chart.coordinate('polar', {
      radius: 0.8,
    });
    this.chart.tooltip({
      shared: true,
      showCrosshairs: true,
      crosshairs: {
        line: {
          style: {
            lineDash: [4, 4],
            stroke: '#333'
          }
        }
      }
    });
    this.chart.axis(this.X, {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    });
    this.chart.axis(this.Y, {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
      },
    });

    this.chart
      .line()
      .position(this.X + '*' + this.Y)
      .color(this.groupFiled)
      .size(2);
    this.chart
      .point()
      .position(this.X + '*' + this.Y)
      .color(this.groupFiled)
      .shape('circle')
      .size(4)
      .style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1,
      });
    this.chart
      .area()
      .position(this.X + '*' + this.Y)
      .color(this.groupFiled)
    this.chart.render();
  }

  /**
   * transformData 一行数据中分组数据，改造数据源
   */
  public transformData(dv) {
    dv.source(this.dataList)
      .transform({
        type: 'fold',
        fields: this.fomartField, // 展开字段集
        key: this.groupFiled, // key字段
        value: this.Y // value字段
      });
  }
}
