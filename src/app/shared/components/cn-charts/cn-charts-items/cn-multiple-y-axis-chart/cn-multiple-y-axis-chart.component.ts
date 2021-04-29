import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import * as G2 from '@antv/g2';
import { getYear, getMonth, getDate, getHours, getTime, getMinutes, getSeconds } from 'date-fns';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import DataSet from '@antv/data-set';
import { Subject, Subscription } from 'rxjs';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cn-multiple-y-axis-chart',
  templateUrl: './cn-multiple-y-axis-chart.component.html',
  styles: [
  ]
})
export class CnMultipleYAxisChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
  @Input() public config;
  @Input() tempData;
  @Input() initData;
  @ViewChild('container', { static: false }) public chartElement: ElementRef;
  @ViewChild('slider', { static: false }) public sliderElement: ElementRef;

  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider) {
    super(componentService);
    this.initValue = {};
    this.tempValue = {};
  }

  public chart: any;
  public slider: any;
  public dataList: any[] = [];
  public X: any; // 配置的横坐标字段
  public Xscale: any;
  public Xaxis: any
  public Y: any; // 配置的左纵坐标字段
  public Yscale: any;
  public Yaxis: any;
  public Y1; // 配置的右纵坐标字段
  public Y1scale: any;
  public Y1axis: any;
  public KEY_ID: string;
  public value;
  public color;

  public groupMax = []; // 分组每组最大值的数组
  public groupMin = []; // 分组每组最小值的数组
  public itemName = []; // 分组名称的数组
  public chartName; // 图表的名称
  public showDataLength; // 分组的展示数据长度（暂时只有分组折线使用）

  public autoPlay;
  public intervalTime;// 刷新间隔时间
  public next = 1; // 自动播放的标识变量
  public curStage; // 自动播放的阶段变量
  public curNum = 1; // 默认的设备数据阶段
  public refreshNumber = 1; // 分组自动刷新的增量
  public stageRuleDatalist = []; // 阶段开始的标准
  public stageCurrentDatalist = []; // 当前阶段的数组
  public ruledataList = []; // 规则算出的标准值的集合
  public rulenameList = []; // 规则转换的展示值集合

  public maxValue; // 辅助线的最大值
  public minValue; // 辅助线的最小值
  public maxText; // 辅助线最大值对应的文本
  public minText; // 辅助线最小值对应的文本
  public start; // 辅助线的开始X值
  public end; //  辅助线的结束X值
  public condition; // 辅助线的条件
  public guideFiled; // 辅助线对应哪个Y轴的字段

  public originDv;
  public showdata = []; // 展示的数组
  public showguide = []; // 辅助线的数组
  public guidedataList = []; // 辅助线的数据集合
  public ds; // 读取的全部数据
  public dv; // 根据要求过滤出的视图
  public datalength; // 真实的数据长度
  public Shape; // 自定义样式效果
  public test = []; // 辅助线的图例数组
  public groupName; // 分组的字段
  public StageTime; // 启动阶段的时间
  public filedName = []; // 图表Y轴的字段数组
  public filedShowName = []; // 图表展示的字段数组
  public y1andgroup = false; // 分组+双轴的标识
  public yDataArray = []; // 需要画图的y轴字段数组
  public yField = []; // y轴字段的数据
  public yType: any;


  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  ngOnInit(): void {
    this.initComponentValue();
    this.initComponentParams();
  }

  public initComponentValue() {
    if (this.config.BasiAttribute) {
      this.X = this.config.BasiAttribute.x ? this.config.BasiAttribute.x['name'] : null

      this.Y = this.config.BasiAttribute.yDataArray ? this.config.BasiAttribute.yDataArray[0].name : null

      this.Xscale = this.config.BasiAttribute.x['scale'] ? this.config.BasiAttribute.x['scale'] : null

      this.Xaxis = this.config.BasiAttribute.x['axis'] ? this.config.BasiAttribute.x['axis'] : null
    }

    this.yDataArray = this.config.BasiAttribute.yDataArray;
    if (this.yDataArray) {
      for (let i = 0; i < this.yDataArray.length; i++) {
        this.yField.push(this.yDataArray[i].name)
      }
    }

    if (this.config.guideConfig) {
      this.maxValue = this.config.guideBasicAttribute.max ? this.config.guideBasicAttribute.max : 'MAXVALUE';

      this.minValue = this.config.guideBasicAttribute.min ? this.config.guideBasicAttribute.min : 'MINVALUE';

      this.start = this.config.guideBasicAttribute.start ? this.config.guideBasicAttribute.start : 'START_TIME'

      this.end = this.config.guideBasicAttribute.end ? this.config.guideBasicAttribute.end : 'END_TIME'

      this.color = this.config.guideBasicAttribute.color ? this.config.guideBasicAttribute.color : '#FF0000'

      this.maxText = this.config.guideBasicAttribute.maxtext ? this.config.guideBasicAttribute.maxtext : '上限'

      this.minText = this.config.guideBasicAttribute.mintext ? this.config.guideBasicAttribute.mintext : '下限'

      this.guideFiled = this.config.guideBasicAttribute.guideFiled ? this.config.guideBasicAttribute.guideFiled : 'FILED'
    }

    if (this.config.autoPlay) {
      this.intervalTime = this.config.intervalTime ? this.config.intervalTime : 2000;
    }

    if (this.config.showDataLength) {
      this.datalength = this.config.showDataLength
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

    if (this.config.guideConfig.showUserPoint) {
      this.registerPointStyle();
    }

    this.CreateChart_TimeLine();

    if (this.config.autoPlay) {
      this.autoPlay = setInterval(async () => {
        this.chart.clear();
        this.initPrintChart(this.chart)
        this.dataList = await this.createUrlParams(this.config.loadingConfig);
        this.next = this.next + 1;
        if (this.datalength) {
          if ((this.showdata[this.datalength - 1]) && (this.dataList[this.dataList.length - 1] !== this.showdata[this.datalength - 1])) {
            if (this.refreshNumber === 1) {
              for (let aa = 0; aa < this.refreshNumber; aa++) {
                this.showdata.shift();
                this.showdata.push(this.dataList[this.datalength - 2 + this.next + aa]);
              }
            } else {
              for (let aa = 0; aa < this.refreshNumber; aa++) {
                this.showdata.shift();
                this.showdata.push(this.dataList[this.datalength + (this.next - 2) * this.refreshNumber + aa]);
              }
            }
            if (this.config.stageRuleConfig) {
              if (!this.curStage) {
                this.curStage = 1;
              }
              const tempStage = this.curStage;
              if (this.showdata[this.datalength - 1]) {
                this.setDataStage('dynamic', this.showdata[this.datalength - 1], this.curStage);
              }
              if (this.config.curStageConfig) {
                this.stageCurrentDatalist = await this.createUrlParams(this.config.curStageConfig);
              }
              if (this.curStage !== 1 && tempStage === this.curStage) {
                this.curNum += 1;
              } else {
                this.curNum = 1;
              }
              this.showdata[this.datalength - 1]['stage'] = this.curStage - 1;
              this.showdata[this.datalength - 1]['number'] = this.curNum;
            }
            this.createSlider()
            // this.slider.start = new Date(this.showdata[0][this.X]).getTime();
            // this.slider.end = new Date(this.showdata[this.datalength - 1][this.X]).getTime();
            if (this.config.guideConfig && this.config.guideConfig.guideType !== 'line') {
              this.ds.state.from = new Date(this.showdata[0][this.X]).getTime();
              this.ds.state.to = new Date(this.showdata[this.showdata.length - 1][this.X]).getTime();
              this.dv.source(this.showdata);
              this.chart.data(this.dv.rows);
            } else {
              this.chart.data(this.showdata);
            }
            setTimeout(async () => {
              // this.chart.guide().clear();
              if (this.groupName && !(this.config.peakValue)) {
                await this.getGroupPeakValue();
              }
              this.chart.annotation().clear(true);
              this.writeAllAssist(new Date(this.showdata[0][this.X]).getTime(), new Date(this.showdata[this.showdata.length - 1][this.X]).getTime());
              this.generateCharts();
              this.chart.render(true);
            });
            // this.slider.changeData(this.showdata);
          } else {
            this.operationAjax(this.showdata[this.datalength - 2][this.X], 'finish');
            if (this.autoPlay) {
              clearInterval(this.autoPlay);
            }
          }
        }
      }, this.intervalTime)
    }
  }

  public ngOnDestroy() {
    // 释放级联对象
    this.unsubscribeRelation();
    // 释放及联接受对象
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    // 释放触发器对象
    if (this._trigger_receiver_subscription$) {
      this._trigger_receiver_subscription$.unsubscribe();
    }

    if (this._trigger_source$) {
      this._trigger_source$.unsubscribe();
    }

    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }

    if (this.autoPlay) {
      clearInterval(this.autoPlay);
    }
  }

  public async load_data() {
    this.dataList = await this.createUrlParams(this.config.loadingConfig);

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.config.showDataLength) {
      await this.sourceModify(this.config.showDataLength);
    }

    if (this.config.stageRuleConfig) {
      this.stageRuleDatalist = await this.createUrlParams(this.config.stageRuleConfig);
      this.setDataStage('static', this.showdata, 1);
    }

    if (this.config.ruleConfig) {
      this.ruledataList = await this.createUrlParams(this.config.ruleConfig);
      if (this.config.curStageConfig) {
        this.stageCurrentDatalist = await this.createUrlParams(this.config.curStageConfig);
      }
    }

    if (this.config.ruleNameConfig) {
      this.rulenameList = await this.createUrlParams(this.config.ruleNameConfig);
    }

    if (this.config.guideConfig) {
      this.guidedataList = await this.createUrlParams(this.config.guideConfig.ajaxConfig);
    }
  }

  public async createUrlParams(config) {
    const url = this._buildURL(config.url);
    const params = {
      ...this.buildParameters(config.params),
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
  private buildParameters(paramsConfig, successData?) {
    let params = {};
    if (paramsConfig) {
      params = ParameterResolver.resolve({
        params: paramsConfig,
        tempValue: this.tempValue,
        initValue: this.initData,
        cacheValue: this.cacheValue,
        cascadeValue: this.cascadeValue,
        userValue: this.userValue,
        returnValue: successData
      });
    }
    return params;
  }

  /**
   * 显示消息框
   */
  public showMessage(option) {
    let msgObj;
    if (option && Array.isArray(option)) {
      // 后续需要根据具体情况解析批量处理结果
      msgObj = this.buildMessageContent(option[0]);
    } else if (option) {
      msgObj = this.buildMessageContent(option);
    }
    option && this.componentService.msgService.create(msgObj.type, `${msgObj.message}`);
  }

  public buildMessageContent(msgObj) {
    const message: any = {};
    let array: any[];
    if (msgObj.type) {
    } else {
      array = msgObj.message.split(':');
    }

    if (!array) {
      if (msgObj.code) {
        message.message = msgObj.code;
      } else if (msgObj.message) {
        message.message = msgObj.message;
      }
      // message.message = option.code ? option.code : '';
      msgObj.field && (message.field = msgObj.field ? msgObj.field : '');
      message.type = msgObj.type;
    } else {
      message.type = array[0];
      message.message = array[1];
    }
    return message;
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
 * CreateChart_Bar  生成折线图
 */
  public CreateChart_TimeLine() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      autoFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      // width: 600,  // 当 forceFit: true  时宽度配置不生效
      height: this.config.BasiAttribute.height ? this.config.BasiAttribute.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.showdata = this.showdata.length > 0 ? this.showdata : this.dataList
    const dataLength = this.config.showDataLength
    this.ds = new DataSet({
      state: {
        from: new Date(this.showdata[0][this.X]).getTime(),
        to: new Date(this.showdata[dataLength - 1][this.X]).getTime()
      }
    });

    this.initPrintChart(this.chart);

    const sliderdata = this.config.autoPlay ? this.showdata : this.dataList;

    this.createSlider(sliderdata);

    this.dv = this.ds.createView('origin').source(sliderdata);
    this.dv.transform({
      type: 'filter',
      callback: obj => {
        const a = new Date(obj[this.X]);
        return (new Date(obj[this.X])).getTime() >= this.ds.state.from && (new Date(obj[this.X])).getTime() <= this.ds.state.to;
      }
    });

    this.generateCharts();

    this.chart.data(this.dv.rows);
    if (this.config.haveGuide) {
      this.writeAllAssist();
    }
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

    if (this.yDataArray) {
      for (let i = 0; i < this.yDataArray.length; i++) {
        this.chart.axis(this.yDataArray[i].name, this.yDataArray[i].axis);
        if (this.yDataArray[i].scale) {
          this.chart.scale(this.yDataArray[i].name, this.yDataArray[i].scale);
        }
        // if (this.yDataArray[i].formatter) {
        this.axisFormatter(this.yDataArray[i].name, this.yDataArray[i].axis);
        // }
      }
    }
  }

  /**
 * createSlider 创建时间轴
 */
  public createSlider(data?) {
    this.chart.option('slider', {
      start: 0,
      end: 1,
      trendCfg: {
        isArea: true,
      },
    });
  }

  // 绘制各种辅助功能
  public writeAllAssist(startValue?, endValue?) {
    this.chart.annotation().clear();
    // 默认的带状区域，最高点往下画
    if (this.config.guideMin) {
      const min = this.config.guideMin;
      const text = this.config.guideText ? this.config.guideText : '满足区域'
      this.writeFixedRegion(min, text);
    }

    // 用户自定义的区间
    if (this.config.guideConfig) {
      // const userGuide = this.config.showUserGuide ? this.config.showUserGuide : false;
      this.writeGuideLine(startValue, endValue);
    }

    // 三层判断，最值-> 自动刷新-> 分组数据
    if (this.config.peakValue) {
      // 是否自动加载数据
      if (this.config.autoPlay) {
        // 是否有分组数据
        if (this.groupName) {
          const group = [];
          group.push(this.showdata[0][this.groupName]);
        } else {

        }
      } else {

      }
    }

  }

  // 绘制辅助线
  /**
   * writeGuideLine
   */
  public writeGuideLine(start?, end?) {
    // 辅助线展示的起始
    let lineStartTime;
    let lineEndTime;
    // 库里面的基线的起始
    let dataStartTime;
    let dataEndTime;
    start = start ? start : this.transStringTime(this.dv.rows[0][this.X]);
    end = end ? end : this.transStringTime(this.dv.rows[this.dv.rows.length - 1][this.X]);
    this.guidedataList.forEach(guide => {
      dataStartTime = this.transStringTime(guide[this.start]);
      dataEndTime = this.transStringTime(guide[this.end]);
      lineStartTime = start > dataStartTime ? start : dataStartTime;
      lineEndTime = end > dataEndTime ? dataEndTime : end;
      lineStartTime = this.transTimeString(lineStartTime);
      lineEndTime = this.transTimeString(lineEndTime);
      if (dataStartTime <= end) {
        if (dataEndTime > start) {
          if (guide[this.maxValue]) {
            this.printGuideLine(lineStartTime, guide[this.maxValue], lineEndTime, guide[this.maxValue], this.maxText, this.color, this.X, guide[this.guideFiled]);
          }

          if (guide[this.minValue]) {
            this.printGuideLine(lineStartTime, guide[this.minValue], lineEndTime, guide[this.minValue], this.minText, this.color, this.X, guide[this.guideFiled]);
          }
        }
      }
    });
    // }
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
   * printGuideLine 画辅助线的统一方法
   */
  public printGuideLine(start, startValue, end, endValue, text, color, x, y) {
    this.chart.annotation().line({
      top: true,
      start: { [x]: start, [y]: startValue },
      end: { [x]: end, [y]: endValue },
      style: {
        stroke: color,
        lineWidth: 1,
        lineDash: [3, 3]
      },
      text: {
        position: 'start',
        style: {
          fill: color,
          fontSize: 12,
          fontWeight: 300
        },
        content: text,
        offsetY: -5
      }
    });
  }

  /**
   * transTimeString 时间戳转字符串
   */
  public transTimeString(time) {
    return `${getYear(time)}-${getMonth(time) + 1}-${getDate(time)}${' '}${getHours(getTime(time))}${':'}${getMinutes(getTime(time))}${':'}${getSeconds(getTime(time))}`;
  }

  /**
   * transStringTime 字符串转时间戳
   */
  public transStringTime(string) {
    return new Date(string).getTime();
  }

  /**
   * operationAjax 提交数据操作
   */
  public async operationAjax(time, temp?) {
    let response;
    if (!temp) {
      response = await this._executeAjaxConfig(
        this.config.stageRuleConfig.operateConfig,
        time
      );
    } else {
      response = await this._executeAjaxConfig(
        this.config.stageRuleConfig.finishConfig,
        time
      );
    }
  }

  /**
   * _executeAjaxConfig 异步执行SQL提交数据
   */
  public async _executeAjaxConfig(ajaxConfig, handleData) {
    const url = ajaxConfig.url;
    let executeParam = ParameterResolver.resolve({
      params: ajaxConfig.params
    });
    const tempCondition = { 'time': handleData, 'stage': this.curStage }
    executeParam = { ...executeParam, ...tempCondition }

    const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, executeParam).toPromise();

    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // 返回true可以发送后续操作, 返回false终止发送,之前定义的后续操作将无法执行
    return validationResult;
  }

  // 发送成功的消息内容
  private _sendDataSuccessMessage(response, resultCfg): boolean {
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find(res => res.name === "data");
      // 弹出提示框
      if (successCfg) {
        new RelationResolver(this).resolveInnerSender(successCfg, response.data, Array.isArray(response.data));
      }
      result = true;
    }

    return result;
  }

  // 发送警告的消息内容
  private _sendDataValidationMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.validation) && response.validation.length <= 0) {
      return result;
    }
    if (response && response.validation) {
      const validationCfg = resultCfg.find(
        res => res.name === "validation"
      );
      if (validationCfg) {
        new RelationResolver(this).resolveInnerSender(validationCfg, response.validation, Array.isArray(response.validation));
      }
      result = false;
    }
    return result;
  }

  /**
   * getGroupPeakValue 获取分组峰谷值
   */
  public async getGroupPeakValue() {
    this.groupMax = [];
    this.groupMin = [];
    if (this.itemName.length !== this.refreshNumber) {
      this.refreshNumber = this.itemName.length
    }
    for (const item of this.itemName) {
      this.groupMax.push(this.findMax(item[this.groupName])[this.Y]);
      this.groupMin.push(this.findMin(item[this.groupName])[this.Y]);
    }
  }

  // 静态图表计算峰值
  public findMaxMin(start?, end?, e?) {
    if (start && end) {
      if (!e) {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        // const length = this.dataList.length > this.showDataLength ? this.showDataLength : this.dataList.length
        const length = this.dataList.length;
        for (let i = 0; i < length; i++) {
          // 日期转时间戳进行比较
          const d = this.dataList[i];
          let date = this.dataList[i][this.X];
          date = date;
          date = new Date(date).getTime();
          if (date >= start && date <= end) {
            if (d[this.Y] >= maxValue) {
              maxValue = d[this.Y];
              maxObj = d;
            }
            if (d[this.Y] < minValue) {
              minValue = d[this.Y];
              minObj = d;
            }
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
        const length = this.dataList.length > this.showDataLength ? this.showDataLength : this.dataList.length
        for (let i = 0; i < length; i++) {
          const d = this.dataList[i];
          if (d[this.groupName] === e) {
            if (d[this.Y] >= maxValue) {
              maxValue = d[this.Y];
              maxObj = d;
            }
            if (d[this.Y] < minValue) {
              minValue = d[this.Y];
              minObj = d;
            }
          }
        }
        return {
          max: maxObj,
          min: minObj
        };
      }
    } else {
      if (start) {
        e = start
      }
      if (!e) {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        const length = this.dataList.length > this.showDataLength ? this.showDataLength : this.dataList.length
        for (let i = 0; i < length - 1; i++) {
          const d = this.dataList[i];
          if (d[this.Y] >= maxValue) {
            maxValue = d[this.Y];
            maxObj = d;
          }
          if (d[this.Y] < minValue) {
            minValue = d[this.Y];
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
        const length = this.dataList.length > this.showDataLength ? this.showDataLength : this.dataList.length
        for (let i = 0; i < length - 1; i++) {
          const d = this.dataList[i];
          if (d[this.groupName] === e) {
            if (d[this.Y] >= maxValue) {
              maxValue = d[this.Y];
              maxObj = d;
            }
            if (d[this.Y] < minValue) {
              minValue = d[this.Y];
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
  }

  // 动态轮播最大值最小值计算
  public findMax(element?) {
    if (element) {
      let maxValue = 0;
      let maxObj = null;
      for (const item of this.showdata) {
        let d = item;
        if (d[this.groupName] === element && d[this.Y] >= maxValue) {
          maxValue = d[this.Y];
          maxObj = d;
        }
      }
      return maxObj;
    } else {
      let maxValue = 0;
      let maxObj = null;
      for (const item of this.showdata) {
        let d = item;
        if (d[this.Y] >= maxValue) {
          maxValue = d[this.Y];
          maxObj = d;
        }
      }
      return maxObj;
    }
  }

  public findMin(element?) {
    if (element) {
      let minValue = 50000;
      let minObj = null;
      for (const item of this.showdata) {
        const d = item;
        if (d[this.groupName] === element && d[this.Y] <= minValue) {
          minValue = d[this.Y];
          minObj = d;
        }
      }
      return minObj;
    } else {
      let minValue = 50000;
      let minObj = null;
      for (const item of this.showdata) {
        const d = item;
        if (d[this.Y] <= minValue) {
          minValue = d[this.Y];
          minObj = d;
        }
      }
      return minObj;
    }
  }


  /**
   * generateCharts 画图入口方法
   */
  public generateCharts() {
    for (let i = 0; i < this.yDataArray.length; i++) {
      this.chart.line().position(this.X + '*' + this.yDataArray[i].name).color(this.yDataArray[i].color).shape(this.config.shape ? this.config.shape : 'circle');
      if (this.config.showUserPoint) {
        if (this.config.guideConfig) {
          this.chart.point().position(this.X + '*' + this.yDataArray[i].name).size(4).shape('overyGuide').style({
            stroke: '#fff',
            lineWidth: 1,
            field: this.yDataArray[i].name,
            type: this.yDataArray[i].type
          });
        }
        if (this.config.ruleConfig && this.config.ruleConfig.rule) {
          this.chart.point().position(this.X + '*' + this.yDataArray[i].name).size(4).shape('overDataRule').style({
            stroke: '#fff',
            lineWidth: 1,
            type: this.yDataArray[i].type
          });
        }
      }
    }
  }

  // 静态数据判断点的阶段，回写阶段时间
  /**
   * data 需要判断的数据集
   */
  public setDataStage(kind, data, curStage?) {
    const stage = this.config.stageRuleConfig.stageFiled;
    const currentStage = [];
    let stageRule = {};
    curStage = curStage ? curStage : this.curStage
    for (const item of this.stageRuleDatalist) {
      if (item[stage] === curStage) {
        currentStage.splice(0, 0, item);
      }
    }

    currentStage.forEach(s => {
      const field = s['FIEL'];
      const value = s['FIEL_VALUE'];
      const obj = { [field]: value }
      stageRule = { ...stageRule, ...obj }
    })
    if (kind === 'static') {
      let num = 0;
      data.forEach(e => {
        num += 1;
        const field = Object.keys(stageRule)[0];
        const value = stageRule[Object.keys(stageRule)[0]];
        let field1;
        let value1;
        if (Object.keys(stageRule).length > 1) {
          field1 = Object.keys(stageRule)[1];
          value1 = stageRule[Object.keys(stageRule)[1]];
        }
        if (Object.keys(stageRule).length === 1) {
          if (e[field] && e[field] === value) {
            this.operationAjax(e[this.X]);
            this.curStage += 1;
          }
        } else if (e[field] && e[field] === value && e[field1] && e[field1] === value1) {
          this.operationAjax(e[this.X]);
          this.curStage += 1;
        }
        e['stage'] = this.curStage - 1;
        e['number'] = num;
      });
    } else if (kind === 'dynamic') {
      const field = Object.keys(stageRule)[0];
      const value = stageRule[Object.keys(stageRule)[0]];
      let field1;
      let value1;
      if (Object.keys(stageRule).length > 1) {
        field1 = Object.keys(stageRule)[1];
        value1 = stageRule[Object.keys(stageRule)[1]];
      }
      if (Object.keys(stageRule).length === 1) {
        if (data[field] && data[field] === value) {
          this.operationAjax(data[this.X]);
          this.curStage += 1;
        }
      } else if (data[field] && data[field] === value && data[field1] && data[field1] === value1) {
        this.operationAjax(data[this.X]);
        this.curStage += 1;
      }
    }
  }

  /**
 * sourceModify 数据源根据配置展示一部分
 */
  public sourceModify(length) {
    if (this.dataList.length > length) {
      for (let i = 0; i < length; i++) {
        this.showdata.push(this.dataList[i]);
      }
    } else {
      this.showdata = this.dataList;
    }
  }

  /**
 * 标记点的样式
 */
  public registerPointStyle() {
    const that = this;
    const lineguide = this.guidedataList;
    let color;
    // 在Y轴的范围之外的提示
    G2.registerShape('point', 'overyGuide', {
      draw(cfg, container) {
        const data = cfg.data;
        const point = { x: cfg.x, y: cfg.y };
        const field = cfg.style.field;
        const type = cfg.style.type;
        let condition = 0; // 判断规则值数组和数据源的条件关系
        color = that.config.guideConfig.pointColor ? that.config.guideConfig.pointColor : '#DC143C';
        if (that.guidedataList.length > 0) {
          // that.showdata.forEach(e => {
          lineguide.forEach(t => {
            const btime = that.transStringTime(t[that.start]);
            const etime = that.transStringTime(t[that.end]);
            const datatime = that.transStringTime(data[that.X]);
            if (datatime >= btime && datatime <= etime) {
              if (data[field] && type === t.FILED) {
                if ((t[that.maxValue] && data[field] > t[that.maxValue]) || (t[that.minValue] && data[field] < t[that.minValue])) {
                  condition = 1;
                }
              }
            }
          })
          // });
          if (condition === 1) {
            that.writePointStyle(container, point, color)
          }
        }
      }
    });

    // 不符合计划表中对应点的数据
    G2.registerShape('point', 'overyGuide', {
      draw(cfg, container) {
        const data = cfg.data;
        const point = { x: cfg.x, y: cfg.y };
        let condition = 0; // 判断规则值数组和数据源的条件关系
        if (that.ruledataList.length > 0) {
          color = that.config.ruleConfig.pointColor ? that.config.ruleConfig.pointColor : '#008000'
          that.ruledataList.forEach(e => {
            // 点的阶段和点处于具体的第几个值都在规则里面有
            if (data['STAGE'] === e['STAGE'] && data['NUMBER'] === e['NUMBER']) {
              // 没有对应规则字段的值
              if (!data[e['FILED']]) {
                condition = 1;
              } else if (data[e['FILED']] && data[e['FILED']] !== e['RULE_VALUE']) {
                condition = 1;
              }
              // 点的阶段有，没有点处于具体的第几个值
            } else if (data['STAGE'] === e['STAGE'] && !that.ruledataList.find(e => (e['NUMBER'] === data['NUMBER']))) {
              condition = 1;
            } else if (!data['STAGE']) {
              condition = 1;
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
 * axisFormatter 坐标轴自定义初始化
 */
  public axisFormatter(axis, axisConfig) {
    const that = this;
    let format;
    if (axis === this.X) {
      format = {
        label: {
          formatter: val => {
            let xformat;
            this.stageCurrentDatalist.forEach(s => {
              if (s[that.start]) {
                if (s[that.end]) {
                  if (this.transStringTime(val) >= this.transStringTime(s[that.start]) && this.transStringTime(val) < this.transStringTime(s[that.end])) {
                    xformat = s['STAGE']
                  }
                } else {
                  if (this.transStringTime(val) >= this.transStringTime(s[that.start])) {
                    xformat = s['STAGE']
                  }
                }
              }
            });
            if (!xformat) {
              // xformat = 1;
              return val;
            } else {
              let stageName;
              if (this.rulenameList.length > 0) {
                this.rulenameList.forEach(e => {
                  if (e['STAGE'] === xformat) {
                    stageName = e['SHOW_NAME'];
                  }
                })
              }
              if (stageName) {
                return val + '  ' + stageName + '阶段';
              } else {
                return val + '  ' + '第' + xformat + '阶段'; // 格式化坐标轴显示文本
              }
            }
          },
        }
      }
    }
    axisConfig = { ...axisConfig, ...format }
    this.chart.axis(axis, axisConfig);
  }

  public initPrintChart(chart) {

    this.InitAxis();
    if (this.config.BasiAttribute.y1) {
      if (this.config.BasiAttribute.formatConfig && Object.keys(this.config.BasiAttribute.formatConfig.y1).length !== 0) {
        this.axisFormatter(this.Y1, this.config.BasiAttribute.y1.axis);
      }
    }

    if (this.config.BasiAttribute.formatConfig && Object.keys(this.config.BasiAttribute.formatConfig.x).length !== 0) {
      this.axisFormatter(this.X, this.config.BasiAttribute.x.axis);
    }

    if (this.config.BasiAttribute.formatConfig && Object.keys(this.config.BasiAttribute.formatConfig.y).length !== 0) {
      this.axisFormatter(this.Y, this.config.BasiAttribute.y.axis);
    }

    if (this.config.BasiAttribute.legend) {
      chart.legend(this.config.BasiAttribute.legend);
    }

    chart.tooltip({
      showCrosshairs: true,
      shared: true
    });
  }
}