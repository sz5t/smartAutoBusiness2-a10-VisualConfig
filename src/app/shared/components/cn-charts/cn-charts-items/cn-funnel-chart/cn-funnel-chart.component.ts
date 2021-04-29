import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import DataSet from '@antv/data-set';

@Component({
  selector: 'app-cn-funnel-chart',
  templateUrl: './cn-funnel-chart.component.html',
  styles: [
  ]
})
export class CnFunnelChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
  public countField: any;
  public maxValue: any;
  public titleField: any;
  public firstTitle: any;
  public secondTitle: any;
  public colorArray: any[] = [];

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    if (this.config.BasiAttribute) {
      this.titleField = this.config.BasiAttribute.titleField ? this.config.BasiAttribute.titleField : null;

      this.countField = this.config.BasiAttribute.countField ? this.config.BasiAttribute.countField : null;

      this.firstTitle = this.config.BasiAttribute.firstTitle ? this.config.BasiAttribute.firstTitle : '浏览人数';

      this.secondTitle = this.config.BasiAttribute.secondTitle ? this.config.BasiAttribute.secondTitle : '占比';

      this.colorArray = this.config.BasiAttribute.colorArray ? this.config.BasiAttribute.colorArray : [];
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
    // 寻找数据集中需要计算字段的最大值
    this.findMax();
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

  public findMax() {
    if (this.countField) {
      this.maxValue = Math.max.apply(Math, this.dataList.map(item => { return item[this.countField] }))
    }
  }

  // 构建柱状图的方法
  public createChart() {
    const that = this;
    const { DataView } = DataSet;
    const dv = new DataView().source(this.dataList);
    dv.transform({
      type: 'map',
      callback(row) {
        row.percent = row[that.countField] / that.maxValue;
        return row;
      },
    });
    const data = dv.rows;
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 500,
      padding: [20, 120, 95],
    });
    this.chart.data(data);
    this.chart.axis(false);
    this.chart.tooltip({
      showTitle: false,
      showMarkers: false,
      itemTpl:
        '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
        '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
        '{name}<br/>' +
        '<span style="padding-left: 16px;line-height: 16px;">' + this.firstTitle + '：{pv}</span><br/>' +
        '<span style="padding-left: 16px;line-height: 16px;">' + this.secondTitle + '：{percent}</span><br/>' +
        '</li>',
    });
    this.chart
      .coordinate('rect')
      .transpose()
      .scale(1, -1);
    this.chart
      .interval()
      .adjust('symmetric')
      .position(this.titleField + '*percent')
      .shape('funnel')
      .color(this.titleField, [...this.colorArray])
      .label(
        this.titleField + '*' + this.countField,
        (ACTION, pv) => {
          return {
            content: `${ACTION} ${pv}`,
          };
        },
        {
          offset: 35,
          labelLine: {
            style: {
              lineWidth: 1,
              stroke: 'rgba(0, 0, 0, 0.15)',
            },
          },
        }
      )
      .tooltip(this.titleField + '*' + this.countField + '*percent', (action, pv, percent) => {
        return {
          name: action,
          pv,
          percent: +percent * 100 + '%',
        };
      })
      .animate({
        appear: {
          animation: 'fade-in'
        },
        update: {
          annotation: 'fade-in'
        }
      });

    this.chart.interaction('element-active');

    this.chart.on('beforepaint', () => {
      this.chart.annotation().clear(true);
      const chartData = this.chart.getData();
      // 中间标签文本
      chartData.forEach((obj) => {
        this.chart.annotation().text({
          top: true,
          position: {
            [that.titleField]: obj[that.titleField],
            percent: 'median',
          },
          content: +obj.percent * 100 + '%', // 显示的文本内容
          style: {
            stroke: null,
            fill: '#fff',
            textAlign: 'center',
          },
        });
      });
    });

    this.chart.render();
  }
}
