import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import DataSet from '@antv/data-set';

@Component({
  selector: 'app-cn-broken-line-chart',
  templateUrl: './cn-broken-line-chart.component.html',
  styles: [`
  .g2-label-item {
        font-size: 10px;
        text-align: center;
    }

    .g2-label-item-value {
        color: #595959;
    }

    .g2-label-item-percent {
        color: #8c8c8c
    }}
`]
})
export class CnBrokenLineChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
  public KEY_ID: any;
  public dataList: any[] = [];

  public X: any;
  public Xscale: any;
  public Xaxis: any
  public Y: any;
  public Yscale: any;
  public Yaxis: any;

  public value: any;
  public color: any;
  public groupName: any; // 分组字段
  public start_value: any; // 辅助线的Y开始值
  public end_value: any; // 辅助线的Y结束值
  public start: any; // 辅助线的开始X值
  public end: any; //  辅助线的结束X值
  public condition: any; // 辅助线的条件
  public showdata: any[] = []; // 展示的数组
  public showguide: any[] = []; // 辅助线的数组
  public guidedataList: any[] = []; // 辅助线的数据集合
  public datalength: any; // 真实的数据长度
  public ds: any; // 读取的全部数据
  public dv: any; // 根据要求过滤出的视图
  public guideText: any; // 辅助线文本

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    // 设置数据操作主键
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'id';

    if (this.config.BasiAttribute) {
      this.X = this.config.BasiAttribute.x ? this.config.BasiAttribute.x['name'] : null

      this.Y = this.config.BasiAttribute.y ? this.config.BasiAttribute.y['name'] : null

      this.Xscale = this.config.BasiAttribute.x['scale'] ? this.config.BasiAttribute.x['scale'] : null

      this.Yscale = this.config.BasiAttribute.y['scale'] ? this.config.BasiAttribute.y['scale'] : null

      this.Xaxis = this.config.BasiAttribute.x['axis'] ? this.config.BasiAttribute.x['axis'] : null

      this.Yaxis = this.config.BasiAttribute.y['axis'] ? this.config.BasiAttribute.y['axis'] : null
    }

    // 设置辅助线值绑定的基本属性
    this.value = this.Y ? this.Y : 'value';

    this.start_value = this.config.guideBasicAttribute.start_value ? this.config.guideBasicAttribute.start_value : 'start_value';

    this.end_value = this.config.guideBasicAttribute.end_value ? this.config.guideBasicAttribute.end_value : 'end_value';

    this.start = this.config.guideBasicAttribute.start ? this.config.guideBasicAttribute.start : 'start'

    this.end = this.config.guideBasicAttribute.end ? this.config.guideBasicAttribute.end : 'end'

    this.condition = this.config.guideBasicAttribute.condition ? this.config.guideBasicAttribute.condition : 'conditon'

    this.color = this.config.guideBasicAttribute.color ? this.config.guideBasicAttribute.color : 'color'

    this.guideText = this.config.guideBasicAttribute.guidetText ? this.config.guideBasicAttribute.guidetText : '均值线 5,396万'

    if (!this.config.guideBasicAttribute.transformData) {
      this.groupName = this.config.guideBasicAttribute.groupName ? this.config.guideBasicAttribute.groupName : null
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
    if (this.config.loadingOnInit) {
      await this.load();
    }
  }

  public async load() {

    await this.load_data();
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.config.guideConfig.ajaxConfig) {
      await this.load_guide();
    }

    if (this.config.guideConfig.showUserPoint) {
      this.registerPointStyle();
    }

    this.CreateChart_Line();
  }

  public async load_data() {
    this.dataList = await this.createUrlParams(this.config.loadingConfig);
  }

  public async load_guide() {
    this.guidedataList = await this.createUrlParams(this.config.guideConfig.ajaxConfig);
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
   * CreateChart_Bar  生成折线图
   */
  public CreateChart_Line() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      autoFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      // width: 600,  // 当 forceFit: true  时宽度配置不生效
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 300, // 指定图表高度
      padding: 'auto'
    });

    this.InitAxis();

    if (!this.config.BasiAttribute.transformData) {
      this.chart.data(this.dataList);
    } else {
      this.ds = new DataSet({
        state: {}
      });
      this.dv = this.ds.createView();
      this.transformData();
      this.chart.data(this.dv.rows);
    }

    if (this.config.BasiAttribute.legend) {
      this.chart.legend(this.config.BasiAttribute.legend);
    }

    if (this.config.guideConfig.haveGuide) {
      this.writeAllAssist();
    }
    this.generateCharts();
    this.chart.tooltip({
      showCrosshairs: true,
      shared: true
    });
    this.chart.render();
  }
  /**
   * 标记点的样式
   */
  public registerPointStyle() {
    const that = this;
    G2.registerShape('point', 'breathPoint', {
      draw(cfg, container) {
        const data = cfg.data;
        const point: any = { x: cfg.x, y: cfg.y };
        const group = container.addGroup();
        let condition = 0; // 判断规则值数组和数据源的条件关系
        let color: any;
        if (that.guidedataList.length > 0) {
          that.guidedataList.forEach(e => {
            if (e[that.condition] === '>') {
              if (data[that.value] >= e[that.end_value]) {
                condition = 1
                color = e[that.color]
              }
            } else if (e[that.condition] === '<') {
              if (data[that.value] <= e[that.end_value]) {
                condition = 1
                color = e[that.color]
              }
            }
          })
        }
        if (condition === 1) {
          that.writePointStyle(container, point, color);
        }
      }
    });
  }

  // 标记点的方法
  public writePointStyle(container, point, color) {
    const decorator1 = container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 10,
        fill: color,
        opacity: 0.5
      }
    });
    const decorator2 = container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 10,
        fill: color,
        opacity: 0.5
      }
    });
    const decorator3 = container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 10,
        fill: color,
        opacity: 0.5
      }
    });
    decorator1.animate({
      r: 20,
      opacity: 0
    },
      {
        repeat: true,
        duration: 1800,
        easing: 'easeLinear',
      });
    decorator2.animate({
      r: 20,
      opacity: 0
    },
      {
        repeat: true,
        duration: 1800,
        easing: 'easeLinear',
        delay: 600,
      });
    decorator3.animate({
      r: 20,
      opacity: 0
    },
      {
        repeat: true,
        duration: 1800,
        easing: 'easeLinear',
        delay: 1200,
      });
    container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 6,
        fill: color,
        opacity: 0.7
      }
    });
    container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 1.5,
        fill: color
      }
    });
  }

  /**
   * transformData 一行数据中分组数据，改造数据源
   */
  public transformData() {
    const filedName = this.config.BasiAttribute.groupFiled.split(',');
    const fields = []
    filedName.forEach(d => {
      fields.push(d);
    })
    this.dv.source(this.dataList)
      .transform({
        type: 'fold',
        fields: [filedName[0], filedName[1]], // 展开字段集
        key: 'groupFiled', // key字段
        value: 'value' // value字段
      });
  }

  // 绘制各种辅助功能
  public writeAllAssist() {
    if (this.config.guideConfig.guideMin) {
      const min = this.config.guideConfig.guideMin;
      const text = this.config.guideConfig.guideText ? this.config.guideConfig.guideText : '满足区域'
      this.writeFixedRegion(min, text);
    }

    if (this.config.guideConfig.ajaxConfig) {
      const userGuide = this.config.guideConfig.showUserGuide ? this.config.guideConfig.showUserGuide : false;
      this.writeGuideLine(userGuide);
    }

    if (this.config.guideConfig.peakValue) {
      const groupPeakValue = this.config.BasiAttribute.groupName ? this.config.BasiAttribute.groupName : false
      this.writePeakValue(groupPeakValue);
    }
  }

  // 绘制辅助线
  /**
   * writeGuideLine
   */
  public writeGuideLine(bs) {
    const that = this;
    if (bs) {
      this.guidedataList.forEach(guide => {
        this.chart.annotation().line({
          top: true,
          start: [guide[this.start], guide[this.start_value]],
          end: [guide[this.end], guide[this.end_value]],
          style: {
            stroke: '#595959',
            lineWidth: 1,
            lineDash: [3, 3]
          },
          text: {
            position: 'start',
            style: {
              fill: '#8c8c8c',
              fontSize: 12,
              fontWeight: 300
            },
            content: that.guideText,
            offsetY: -5
          }
        });
        const cond = guide[this.condition] === '<' ? 'left' : 'right'
        // let cond;
        // if (guide[this.condition] === '<') {
        //   cond = 'left'
        // } else {
        //   cond = 'right';
        // }
        this.writeUserRegion(cond, guide[this.start_value], guide[this.color]);
      });
    } else {
      this.guidedataList.forEach(guide => {
        this.chart.annotation().line({
          top: true,
          start: [guide[this.start], guide[this.start_value]],
          end: [guide[this.end], guide[this.end_value]],
          style: {
            stroke: '#595959',
            lineWidth: 1,
            lineDash: [3, 3]
          },
          text: {
            position: 'start',
            style: {
              fill: '#8c8c8c',
              fontSize: 12,
              fontWeight: 300
            },
            content: that.guideText,
            offsetY: -5
          }
        });
      });
    }
  }

  // 绘制固定的自上往下的区域
  /**
   * min:最小值
   * text：区域的显示文本
   */
  public writeFixedRegion(min, text) {
    this.chart.annotation().region({
      start: ['start', 'max'],
      end: ['end', [min]],
      style: {
        lineWidth: 0,
        fill: '#4169E1', // 填充区域的颜色
        fillOpacity: 0.3,
        stroke: '#ccc'
      }
    });
    this.chart.annotation().text({
      top: true,
      position: ['end', 'max'],
      content: [text],
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
   * writeUserRegion 绘制自定义的图形染色区域
   */
  public writeUserRegion(cond, value, userColor) {
    if (cond === 'right') {
      this.chart.annotation().regionFilter({
        top: true,
        start: ['min', 'max'],
        end: ['max', value],
        color: userColor
      });
    } else if (cond === 'left') {
      this.chart.annotation().regionFilter({
        top: true,
        start: ['min', value],
        end: ['max', 'min'],
        color: userColor
      });
    }
  }

  /**
   * writePeakValue 静态数据集展示最大值最小值
   */
  public writePeakValue(group) {
    if (!this.groupName) {
      const max_min = this.findMaxMin();
      const max = max_min.max;
      const min = max_min.min;
      if (max_min) {
        this.chart.annotation().dataMarker({
          top: true,
          text: {
            content: '峰值：' + max[this.value],
            style: {
              fontSize: 13,
              stroke: 'white',
              lineWidth: 2
            },
          },
          line: {
            length: 40,
          },
          position: [max[this.X], max[this.value]]
        });
        this.chart.annotation().dataMarker({
          top: true,
          text: {
            content: '谷值：' + min[this.value],
            style: {
              fontSize: 13,
              stroke: 'white',
              lineWidth: 2
            },
          },
          line: {
            length: 50,
          },
          position: [min[this.X], min[this.value]]
        });
      }
    } else {
      const group = [];
      group.push(this.dataList[0][this.groupName]);
      for (let i = 0; i < this.dataList.length; i++) {
        for (let j = 0; j < group.length; j++) {
          if (!group.includes(this.dataList[i][this.groupName])) {
            // if (this.dataList[i][this.groupName] !== group[group.length - 1]) {
            group.push(this.dataList[i][this.groupName]);
          }
        }
      }
      group.forEach(element => {
        const max_min = this.findMaxMin(element);
        const max = max_min.max;
        const min = max_min.min;
        if (max_min) {
          this.chart.annotation().dataMarker({
            top: true,
            text: {
              content: element + '的峰值：' + max[this.value],
              style: {
                fontSize: 13,
                stroke: 'white',
                lineWidth: 2
              },
            },
            line: {
              length: 30,
            },
            position: [max[this.X], max[this.value]]
          });
          this.chart.annotation().dataMarker({
            top: true,
            text: {
              content: element + '的谷值：' + min[this.value],
              style: {
                fontSize: 13,
                stroke: 'white',
                lineWidth: 2
              },
            },
            line: {
              length: 50,
            },
            position: [min[this.X], min[this.value]]
          });

        }
      });
    }
  }

  /**
   * findMaxMin 具体的计算最值的方法
   */
  public findMaxMin(element?) {
    if (!element) {
      let maxValue = 0;
      let minValue = 50000;
      let maxObj = null;
      let minObj = null;
      const length = this.dataList.length
      for (let i = 0; i < length; i++) {
        const d = this.dataList[i];
        if (d[this.value] >= maxValue) {
          maxValue = d[this.value];
          maxObj = d;
        }
        if (d[this.value] < minValue) {
          minValue = d[this.value];
          minObj = d;
        }
      }
      return {
        max: maxObj,
        min: minObj
      };
    } else {
      let maxValue = 0;
      let minValue = 50000;
      let maxObj = null;
      let minObj = null;
      const length = this.dataList.length
      for (let i = 0; i < length; i++) {
        const d = this.dataList[i];
        if (d[this.groupName] === element) {
          if (d[this.value] >= maxValue) {
            maxValue = d[this.value];
            maxObj = d;
          }
          if (d[this.value] < minValue) {
            minValue = d[this.value];
            minObj = d;
          }
        }
      }
      return {
        max: maxObj,
        min: minObj
      };
    }
  }

  /**
   * 生成图表
   */
  public generateCharts() {
    if (this.config.guideConfig.showUserPoint) {
      if (this.config.BasiAttribute.groupName) {
        this.chart
          .line()
          .position(this.X + '*' + this.Y)
          .color(this.config.BasiAttribute.groupName)
          .shape('breathPoint');
        this.chart
          .point()
          .position(this.X + '*' + this.Y)
          .color(this.config.BasiAttribute.groupName)
          .size(4)
          .shape('breathPoint')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
      } else if (this.config.BasiAttribute.transformData) {
        this.chart.line().position(this.X + '*' + this.Y);
        this.chart.point().position(this.X + '*' + 'value')
          .size(4)
          .color('groupFiled')
          .shape('breathPoint')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });;  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
      } else if (!this.config.BasiAttribute.transformData) {
        this.chart.line().position(this.X + '*' + this.Y);
        this.chart.point().position(this.X + '*' + this.Y)
          .size(4)
          .shape('breathPoint')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });;  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
      }

    } else {
      if (this.config.BasiAttribute.groupName) {
        this.chart
          .line()
          .position(this.X + '*' + this.Y)
          .color(this.config.BasiAttribute.groupName)
          .shape('smooth');
        this.chart
          .point()
          .position(this.X + '*' + this.Y)
          .color(this.config.BasiAttribute.groupName)
          .size(4)
          .shape('circle')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
      } else if (this.config.BasiAttribute.transformData) {
        this.chart.line().position(this.X + '*' + 'value')
          .color('groupFiled').shape('smooth');
        this.chart.point().position(this.X + '*' + 'value')
          .size(4)
          .color('groupFiled')
          .shape('circle')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });;  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
      } else if (!this.config.BasiAttribute.transformData) {
        this.chart.line().position(this.X + '*' + this.Y);
        this.chart.point().position(this.X + '*' + this.Y)
          .size(4)
          .shape('circle')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });;  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
      }
    }
  }

}
