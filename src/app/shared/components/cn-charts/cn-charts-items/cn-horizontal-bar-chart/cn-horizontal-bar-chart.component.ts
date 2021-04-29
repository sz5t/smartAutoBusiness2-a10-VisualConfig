import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cn-horizontal-bar-chart',
  templateUrl: './cn-horizontal-bar-chart.component.html',
  styles: [
  ]
})
export class CnHorizontalBarChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
  public Xscale: any;
  public Xaxis: any
  public Y: any;
  public Yscale: any;
  public Yaxis: any;
  public defaultColor: any;
  public warningColor: any;
  public meetWarning: any[];

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    if (this.config.BasiAttribute) {
      this.X = this.config.BasiAttribute.x ? this.config.BasiAttribute.x['name'] : null

      this.Y = this.config.BasiAttribute.y ? this.config.BasiAttribute.y['name'] : null

      this.Xscale = this.config.BasiAttribute.x['scale'] ? this.config.BasiAttribute.x['scale'] : null

      this.Yscale = this.config.BasiAttribute.y['scale'] ? this.config.BasiAttribute.y['scale'] : null

      this.Xaxis = this.config.BasiAttribute.x['axis'] ? this.config.BasiAttribute.x['axis'] : null

      this.Yaxis = this.config.BasiAttribute.y['axis'] ? this.config.BasiAttribute.y['axis'] : null
    }
    if (this.config.markConfig) {
      this.defaultColor = this.config.markConfig['defaultColor'] ? this.config.markConfig['defaultColor'] : '#2194ff'

      this.warningColor = this.config.markConfig['warningColor'] ? this.config.markConfig['warningColor'] : '#ff4d4f'

      this.meetWarning = this.config.markConfig['meetWarning'] ? this.config.markConfig['meetWarning'] : null
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
    // console.log('ngAfterViewInit ==>', this.initValue, this.tempValue);
    await this.load_data();
    this.createBarChart();
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
  public createBarChart() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: 500,
      width: 700
    });
    this.InitAxis();
    this.chart.coordinate().transpose();
    this.chart.data(this.dataList);
    this.chart.tooltip({
      showMarkers: false, // 提示框不展示辅助线
    });
    this.chart.interaction('element-active'); // 激活活动区域active-region 激活区域提示，element-active 激活元素提示
    if (this.config.BasiAttribute.legend) {
      this.chart.legend(this.config.BasiAttribute.legend);
    } else {
      this.chart.legend(false);
    }
    if (this.config.haveGuide) {
      this.writeguide();
    }
    this.generateCharts();
    this.chart.render();
  }

  // 初始化坐标轴配置
  public InitAxis() {
    if (this.X) {
      if (this.Xaxis) {
        this.chart.axis(this.X, this.Xaxis);
      }
      if (this.Xscale) {
        this.chart.scale(this.X, this.Xscale);
      }
    }

    if (this.Y) {
      if (this.Yaxis) {
        this.chart.axis(this.Y, this.Yaxis);
      }
      if (this.Yscale) {
        this.chart.scale(this.Y, this.Yscale);
      }
    }
  }

  /**
   * writeguide 画辅助线
   */
  public writeguide() {
    this.chart.annotation().region({
      start: ['start', 'max'],
      end: ['end', [this.config.guideConfig.guideMin]],
      style: {
        lineWidth: 0,
        fill: '#dcdcdc',
        fillOpacity: 0.3,
        stroke: '#ccc'
      }
    });
    this.chart.annotation().text({
      top: true,
      position: ['end', 'max'],
      content: [this.config.guideConfig.guideText],
      style: {
        fill: '#aaaaaa',
        textAlign: 'end',
        textBaseline: 'top',
        fontWeight: 300
      },
      offsetX: -10,
      offsetY: 6
    });
  }

  /**
   * generateCharts 画图入口方法
   */
  public generateCharts() {
    if (this.config.BasiAttribute.groupName) {
      this.chart.interval().position(this.X + '*' + this.Y).color(this.config.BasiAttribute.groupName).adjust([{
        type: 'dodge',
        marginRatio: 0
      }]);
    } else if (this.config.markConfig) {
      this.chart.interval().position(this.X + '*' + this.Y)
        .color(this.X, (val) => {
          if (this.meetWarning) {
            if (this.meetWarning.findIndex(e => e === val) > -1) {
              return this.warningColor;
            }
            return this.defaultColor;
          } else {
            return this.defaultColor;
          }
        })
        .label(this.Y, {
          offset: 10,
          textStyle: {
            fill: '#595959',
            fontSize: 12
          }
        });
    } else if (this.config.guideConfig.haveColorSign) {
      this.chart.interval().position(this.X + '*' + this.Y)
        .color(this.Y, val => {
          if (val === this.config.guideConfig.signValue) {
            return this.config.guideConfig.signColor;
          }
          return '#2194ff';
        })
        .label(this.Y, {
          offset: 10,
          textStyle: {
            fill: '#595959',
            fontSize: 12
          }
        });
    } else {
      this.chart.interval().position(this.X + '*' + this.Y)
        .label(this.Y, {
          offset: 10,
          textStyle: {
            fill: '#595959',
            fontSize: 12
          }
        });  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
    }
  }

}