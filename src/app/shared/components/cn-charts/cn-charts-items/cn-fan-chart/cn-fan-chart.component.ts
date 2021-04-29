import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cn-fan-chart',
  templateUrl: './cn-fan-chart.component.html',
  styles: [
  ]
})
export class CnFanChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
  public dataList = []; // 表格数据集合
  public KEY_ID: string;
  public percent: any; // 饼状图元素的占比
  public item: any; // 饼状图的元素
  public inner: any; // 饼状图分组内层的字段
  public outer: any;// 饼状图分组外层的字段
  public originDv: any;
  public ds: any; // 读取的全部数据
  public dv: any; // 根据要求过滤出的视图
  public Shape: any; // 自定义样式效果

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    // 设置数据操作主键
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'id';

    // 设置饼状图元素
    this.item = this.config.BasiAttribute.item.name ? this.config.BasiAttribute.item.name : 'item'

    // 设置饼状图元素占比
    this.percent = this.config.BasiAttribute.percent.name ? this.config.BasiAttribute.percent.name : 'percent'

    if (this.config.BasiAttribute.groupConfig) {
      // 分组展示的内层
      this.inner = this.config.BasiAttribute.groupConfig.inner ? this.config.BasiAttribute.groupConfig.inner : null

      // 分组展示的外层
      this.outer = this.config.BasiAttribute.groupConfig.outer ? this.config.BasiAttribute.groupConfig.outer : null
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
    if (this.config.BasiAttribute.ring) {
      this.registerRing();
    }
    if (this.config.loadingOnInit) {
      setTimeout(() => {
        this.load();
      }, 0);
    }
  }

  public async load() {

    await this.load_data();
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.config.BasiAttribute.group) {
      this.CreateGroupChart_Fan();
    } else {
      this.CreateChart_Fan();
    }
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

  /**
 * CreateChart_Fan  生成饼状图
 */
  public CreateChart_Fan() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      autoFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      // width: 600,  // 当 forceFit: true  时宽度配置不生效
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.chart.data(this.dataList)
    this.chart.scale(this.percent, {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });

    if (this.config.BasiAttribute.legend) {
      this.chart.legend(this.config.BasiAttribute.legend);
    }
    let yh = 0;
    if (this.config.BasiAttribute.ring) {
      yh = 1;
    }
    this.coord(yh);
    this.generateCharts();
    this.chart.tooltip({
      showTitle: false,
      showMarkers: false,
    })
    this.chart.interaction('element-active');
    this.chart.render();
  }

  /**
   * CreateGroupChart_Fan 生成具有分组展示的饼状图
   */
  public CreateGroupChart_Fan() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      autoFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      // width: 600,  // 当 forceFit: true  时宽度配置不生效
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.CreateGroupData();
    this.chart.interaction('element-highlight');
    this.chart.render();
  }

  /**
 * 生成图表
 */
  public generateCharts() {
    if (this.config.BasiAttribute.ring) {
      this.chart.interval().adjust('stack')
        .position(this.percent)
        .color(this.item)
        .label(this.percent, {
          content: (val, item) => {
            // console.log(item);
            return item._origin[this.item] + ': ' + val[this.percent];
          }
        })
        .shape('sliceShape')
    } else {
      this.chart.interval().adjust('stack')
        .position(this.percent)
        .color(this.item)
        .label(this.percent, {
          content: (val, item) => {
            // console.log(item);
            return item._origin[this.item] + ': ' + val[this.percent];
          }
        })
    }
  }

  /**
 * registerRing 环形图
 */
  public registerRing() {
    const sliceNumber = 0.01; // 圆环间的间距 0-1之间
    G2.registerShape('interval', 'sliceShape', {
      draw(cfg, container) {
        const points = cfg.points;
        let path = [];
        path.push(['M', points[0]['x'], points[0]['y']]);
        path.push(['L', points[1]['x'], points[1]['y'] - sliceNumber]);
        path.push(['L', points[2]['x'], points[2]['y'] - sliceNumber]);
        path.push(['L', points[3]['x'], points[3]['y']]);
        path.push('Z');
        path = this.parsePath(path);
        return container.addShape('path', {
          attrs: {
            fill: cfg.color,
            path
          }
        });
      }
    });
  }

  /**
   * coord 扇形和圆环的控制
   */
  public coord(bs) {
    if (bs === 1) {
      this.chart.coordinate('theta', {
        // radius: 0.75
        innerRadius: 0.75
      });
    } else {
      this.chart.coordinate('theta', {
        radius: 0.75
        // innerRadius: 0.75
      });
    }
  }

  /**
   * CreateGroupData 创建饼图的内外分组
   */
  public CreateGroupData() {
    const innerDV = new DataSet.DataView();
    innerDV.source(this.dataList).transform({
      type: 'percent',
      field: 'VALUE',
      dimension: this.inner,
      as: 'percent'
    });
    // this.calculateRatio(innerDV, this.inner);
    this.chart.data(innerDV['rows'])
    this.chart.scale({
      percent: {
        formatter: (val) => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        }
      }
    });
    this.chart.coordinate('theta', {
      radius: 0.5
    });
    this.chart.tooltip({
      showMarkers: false,
      showTitle: false
    });
    this.chart.legend(false);
    this.chart.interval().adjust('stack').position('percent').color(this.inner).label(this.inner, {
      offset: -10
    }).tooltip(this.inner + '*percent', (item, percent) => {
      percent = (percent * 100).toFixed(2) + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });

    let outView = this.chart.createView();
    const outterDV = new DataSet.DataView();
    outterDV.source(this.dataList).transform({
      type: 'percent',
      field: 'VALUE',
      dimension: this.outer,
      as: 'percent'
    });
    // this.calculateRatio(outterDV, this.outer);
    outView.source(outterDV['rows'])
    outView.scale({
      percent: {
        formatter: (val) => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        }
      }
    });
    outView.coordinate('theta', {
      innerRadius: 0.5 / 0.75,
      radius: 0.75
    });
    outView.interval().adjust('stack').position('percent').color(this.outer, ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4']).label(this.outer).tooltip(this.outer + '*percent', (item, percent) => {
      percent = (percent * 100).toFixed(2) + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
  }

  /**
   * calculateRatio 根据具体值计算饼图占比
   */
  public calculateRatio(dv, d) {
    dv.source(this.dataList).transform({
      type: 'percent',
      field: 'VALUE',
      dimension: d,
      as: 'percent'
    });
    return dv;
  }

}