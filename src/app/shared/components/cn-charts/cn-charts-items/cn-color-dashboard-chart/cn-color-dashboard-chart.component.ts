import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cn-color-dashboard-chart',
  templateUrl: './cn-color-dashboard-chart.component.html',
  styles: [
  ]
})
export class CnColorDashboardChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
  public value: any;
  public max: any;
  public min: any;
  public tickInterval: any;
  public showContent: any;
  public color: any[] = [];
  public colorInterval: any;

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {

    if (this.config.BasiAttribute) {
      this.value = this.config.BasiAttribute.value ? this.config.BasiAttribute.value : null;

      this.color = this.config.BasiAttribute.color ? this.config.BasiAttribute.color : [];

      this.colorInterval = this.config.BasiAttribute.colorInterval ? this.config.BasiAttribute.colorInterval : 2;

      this.max = this.config.BasiAttribute.max ? this.config.BasiAttribute.max : 9;

      this.min = this.config.BasiAttribute.min ? this.config.BasiAttribute.min : 0;

      this.tickInterval = this.config.BasiAttribute.tickInterval ? this.config.BasiAttribute.tickInterval : 1;

      this.showContent = this.config.BasiAttribute.showContent ? this.config.BasiAttribute.showContent : '合格率';
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
        return loadData.data[0];
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

  public registerPointStyle() {
    G2.registerShape('point', 'pointer', {
      draw(cfg, container) {
        console.log(cfg, container);
        const group = container.addGroup();
        const center = this.parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: cfg.x,
            y2: cfg.y,
            stroke: cfg.color,
            lineWidth: 5,
            lineCap: 'round',
          },
        });
        group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 9.75,
            stroke: cfg.color,
            lineWidth: 4.5,
            fill: '#fff',
          },
        });
        return group;
      }
    });
  }

  public createChart() {
    // 自定义Shape 部分
    this.registerPointStyle();
    const data = [this.dataList];
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement,
      autoFit: true,
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 500,
      padding: [0, 0, 30, 0],
    });
    this.chart.data(data);
    this.chart.scale(this.value, {
      min: this.min,
      max: this.max,
      tickInterval: this.tickInterval,
    });
    this.chart.coordinate('polar', {
      startAngle: (-9 / 8) * Math.PI,
      endAngle: (1 / 8) * Math.PI,
      radius: 0.75,
    });

    this.chart.axis('1', false);
    this.chart.axis(this.value, {
      line: null,
      label: {
        offset: -36,
        style: {
          fontSize: 18,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      },
      subTickLine: {
        count: 4,
        length: -15,
      },
      tickLine: {
        length: -24,
      },
      grid: null,
    });
    this.chart.legend(false);
    this.chart.point()
      .position(this.value + '*1')
      .shape('pointer')
      .color(this.value, (val) => {
        for (let i: any = 0; i < this.color.length; i++) {
          if (val > (i + 1) * this.colorInterval) {
            continue;
          } else {
            return this.color[i];
          }
        }
      })
      .animate({
        appear: {
          animation: 'fade-in'
        }
      });

    this.draw(data);
  }

  /**
   * draw 根据数值的不同，描绘不同的阶段颜色
   */
  public draw(data) {
    const val = data[0][this.value];
    const lineWidth = 25;
    this.chart.annotation().clear(true);
    // 绘制仪表盘背景
    this.chart.annotation().arc({
      top: false,
      start: [0, 1],
      end: [this.max, 1],
      style: {
        stroke: '#CBCBCB',
        lineWidth,
        lineDash: null,
      },
    });

    for (let i: any = 0; i < this.color.length; i++) {
      if (val >= (i + 1) * this.colorInterval) {
        this.drawColor(i * this.colorInterval, (i + 1) * this.colorInterval, i, lineWidth);
      } else {
        this.drawColor(i * this.colorInterval, val, i, lineWidth);
        break;
      }
    }

    // 绘制指标数字
    this.chart.annotation().text({
      position: ['50%', '85%'],
      content: this.showContent,
      style: {
        fontSize: 20,
        fill: '#545454',
        textAlign: 'center',
      },
    });
    this.chart.annotation().text({
      position: ['50%', '90%'],
      content: `${this.dataList[this.value] * 10} %`,
      style: {
        fontSize: 36,
        fill: '#545454',
        textAlign: 'center',
      },
      offsetY: 15,
    });
    this.chart.changeData(data);
  }

  public drawColor(startvalue, endvalue, colornumber, lineWidth) {
    this.chart.annotation().arc({
      start: [startvalue, 1],
      end: [endvalue, 1],
      style: {
        stroke: this.color[colornumber],
        lineWidth,
        lineDash: null,
      },
    });
  }


}
