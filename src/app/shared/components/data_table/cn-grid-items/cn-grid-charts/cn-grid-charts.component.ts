import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';


@Component({
  selector: 'app-cn-grid-charts',
  templateUrl: './cn-grid-charts.component.html',
  styles: [
  ]
})
export class CnGridChartsComponent extends CnComponentBase implements OnInit, AfterViewInit {
  @Input() public config;
  @Input() public valueConfig;
  @Input() public state;
  @ViewChild('container', { static: true }) public chartElement: ElementRef;
  public datalist; // 行内图形的数据源
  public x; // 需要新数据源的图表的横坐标字段
  public y; // 需要新数据源的图表的纵坐标字段
  public type // 行内占比图表需要的属性
  public index // 行内占比图表需要的属性
  public indexField // 行内占比图表需要的属性

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
  }

  public ngOnInit() {
    if (this.config.BasiAttribute) {
      this.x = this.config.BasiAttribute.x ? this.config.BasiAttribute.x : 'x';
      this.y = this.config.BasiAttribute.y ? this.config.BasiAttribute.y : 'y';
      this.type = this.config.BasiAttribute.type ? this.config.BasiAttribute.type : 'type';
    }
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.load();
    }, 0);
  }

  /**
   * async load
   */
  public async load() {
    if (this.config.ajaxConfig) {
      this.datalist = await this.createUrlParams(this.config.ajaxConfig);
    }

    const type = this.config.chartType
    switch (type) {
      case 'singlebarchart':
        this.gridSingleBarChart();
        break;
      case 'brokenlinechart':
        this.gridBrokenLineChart(this.datalist);
        break;
      case 'barchart':
        this.gridBarChart(this.datalist);
        break;
      case 'ratiobarchart':
        this.gridRatioBarChart(this.datalist);
        break;
    }
  }

  /*
 * createUrlParams 创建查询的参数，调用方法，返回数据
 */
  public async createUrlParams(config) {
    const url = this._buildURL(config.url);
    const params = {
      ...this._buildParameters(config.params),
      ...this._buildFilter(config.filter)
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

  private _buildParameters(paramsConfig) {
    let params = {};
    if (paramsConfig) {
      params = ParameterResolver.resolve({
        params: paramsConfig,
        tempValue: this.tempValue,
        cacheValue: this.cacheValue,
        initValue: this.valueConfig.value,
        cascadeValue: this.cascadeValue
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
        cacheValue: this.cacheValue
      });
    }
    return filter;
  }

  private async _load(url, params, method) {
    const mtd = method === 'proc' ? 'post' : method;
    return this.componentService.apiService[mtd](url, params).toPromise();
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
   * gridSingleBarChart 行内单个柱状图
   */
  public gridSingleBarChart() {
    const field = this.config.field ? this.config.field : 'VALUE';
    const data = [{ [field]: this.valueConfig.value[field] }];
    const max = this.config.BasiAttribute.max ? this.config.BasiAttribute.max : 100;
    const min = this.config.BasiAttribute.min ? this.config.BasiAttribute.min : 0;
    const colorRuleField = this.config.format.colorRuleField ? this.config.format.colorRuleField : 'COLOR';
    const colorRuleMax = this.config.format.greaterValue ? this.config.format.greaterValue : null;
    const greaterColor = this.config.format.greaterColor ? this.config.format.greaterColor : null;
    const colorRuleMin = this.config.format.lessValue ? this.config.format.lessValue : null;
    const lessColor = this.config.format.lessColor ? this.config.format.lessColor : null;
    const defaultColor = this.config.format.defaultColor ? this.config.format.defaultColor : '#0066FF';
    const paddingLeft = this.config.haveNegative ? 50 : 10
    let beforeText;
    let afterText;
    if (this.config.format) {
      beforeText = this.config.format.beforeText;
      afterText = this.config.format.afterText;
    } else {
      beforeText = '';
      afterText = '';
    }
    const chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: 30,
      padding: [10, 50, 10, paddingLeft]
    });
    chart.data(data)
    // , {
    //   field: {
    //     max: [max],
    //     min: [min]
    //   }
    // });
    chart.legend(false);
    chart.axis(false);
    chart.tooltip({
      showTitle: false // 默认标题不显示
    });
    chart.coordinate().transpose();
    chart.interval().position('1*' + field).size(20).label(field, (val) => {
      return {
        content: beforeText + val + afterText
      }
    },
      {
        offset: 10,
        style: {
          fontSize: 12,
          color: '#595959'
        }
      })
      .color(colorRuleField, (value) => {
        if (value) {
          if (colorRuleMax && value > colorRuleMax) {
            return greaterColor;
          } else if (colorRuleMin && value < colorRuleMin) {
            return lessColor;
          } else {
            return defaultColor;
          }
        } else {
          return defaultColor;
        }
      });
    chart.render();
  }

  /**
   * gridBrokenLineChart 行内折线图
   */
  public gridBrokenLineChart(data) {
    const chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: 30,
      padding: [5, 20, 5, 5]
    });
    chart.data(data);
    chart.legend(false);
    chart.axis(false);
    chart.tooltip({
      showTitle: false // 默认标题不显示
    });
    chart.area().position(this.x + '*' + this.y).shape('smooth');
    chart.line().position(this.x + '*' + this.y).shape('smooth');
    // chart.guide().html({
    //   position: ['120%', '0%'],
    //   html: '<div class="g2-guide-html"><p class="title">总计</p><p class="value">' + 100 + '</p></div>'
    // });
    chart.render();
  }

  /**
   * gridBarChart 行内柱状图
   */
  public gridBarChart(data) {
    const chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: 30,
      padding: [5, 20, 5, 5]
    });
    chart.data(data);
    chart.legend(false);
    chart.axis(false);
    chart.tooltip({
      showTitle: false // 默认标题不显示
    });
    chart.interval().position(this.x + '*' + this.y);
    chart.render();
  }

  /**
   * gridRatioBarChart 行内带比例的条形图
   */
  public gridRatioBarChart(data) {
    this.indexField = this.config.BasiAttribute.index ? this.config.BasiAttribute.index : 'index';
    this.index = this.valueConfig.value[this.indexField]
    const chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: 30,
      padding: [0, 20, 0, 20]
    });
    chart.data(data);
    chart.legend(false);
    // chart.tooltip({
    //   useHtml:true, 
    //   htmlContent: (title, items) => {
    //     const pieData = [];
    //     const container = '<div class="g2-tooltip">';
    //     const titleDom = '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' + items[0].point._origin['VALUE_TYPE'] + '</div>';
    //     let listDom = '<ul class="g2-tooltip-list">';
    //     for (let item of items) {
    //       const itemDom = '<li data-index={{this.index}}>' + '<span style="background-color:' + item.color + ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' + item.name + '<span class="g2-tooltip-value">' + item.value + '</span>' + '</li>';
    //       listDom += itemDom;
    //       pieData.push(item.point._origin);
    //     }
    //     listDom += '</ul>';
    //     const chartDom = '<div id="g2-tooltip-pie' + this.index + '" class="tooltip-pie"></div>';
    //     return container + titleDom + listDom + chartDom + '</div>';
    //   }
    // })
    chart.tooltip({
      containerTpl: '<div class="g2-tooltip">'
        + '<div class="g2-tooltip-title" style="margin:10px 0;"></div>'
        + '<ul class="g2-tooltip-list"></ul></div>',
      itemTpl: '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {value}</li>'
    });
    chart.axis(false);
    chart.coordinate().transpose();
    chart.interval().adjust('stack').position(this.x + '*' + this.y).color(this.type).size(30);
    chart.render();
  }
}
