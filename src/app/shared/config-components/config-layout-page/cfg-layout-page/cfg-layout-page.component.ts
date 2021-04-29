import { Component, OnInit, Input, Inject, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnCodeEditComponent } from 'src/app/shared/components/cn-code-edit/cn-code-edit.component';
import { CnComponentBase } from 'src/app/shared/components/cn-component.base';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

import { CfgLayoutComponent } from '../../config-layout/cfg-layout/cfg-layout.component';

@Component({
  selector: 'cfg-layout-page,[cfg-layout-page]',
  templateUrl: './cfg-layout-page.component.html',
  styleUrls: ['./cfg-layout-page.component.less'],
})
export class CfgLayoutPageComponent extends CnComponentBase implements OnInit, AfterViewInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;

    // init cacheValue
  }
  @Input()
  public config; // dataTables 的配置参数
  @Input() initData;
  @Input() tempData;
  @Input() public changeValue;

  @ViewChild('child0', { static: false }) public child0: CfgLayoutComponent;
  @ViewChild('child1', { static: false }) public child1: CfgLayoutComponent;

  // @ViewChild('appChild') componentChild: ChildComponent; // 通过模板变量名获取
  // @ViewChild(ChildComponent) componentChildByType: ChildComponent; // 直接通过组件类型获取
  // @ViewChild('appChild', {read: ElementRef}) componentChildElement: ElementRef; // 直接找到子组件对应的DOM
  // @ViewChildren(ChildComponent) componentChildList: QueryList<ChildComponent>; // 获取所有的

  public modelstyle = { 'min-height': (window.document.body.clientHeight - 160).toString() + 'px' };

  public modelstyle1 = { 'max-height': (window.document.body.clientHeight - 90).toString() + 'px', overflow: 'auto' };
  public _componentValue: any = {};
  index = 4;
  disable = false;

  public c_config;
  public designStatus = 'sj';
  public is_drag = true;
  public gridStyle = {
    width: '100%',
  };

  public ts_new = [];

  saveJsonConfig = {
    url: 'resource/B_P_SET_PAGELAYOUT_JSON/operate', // operation 操作 query
    ajaxType: 'post',
    params: [
      {
        name: 'PageJson',
        type: 'componentValue',
        valueName: 'pageJson',
        dataType: 'string',
      },
      {
        name: 'PageTreeJson',
        type: 'componentValue',
        valueName: 'pageTree',
        dataType: 'string',
      },
      {
        name: 'PageId',
        type: 'tempValue',
        valueName: 'ID',
        dataType: 'string',
        value: '',
      },
    ],
    filter: [],
  };

  loadingConfig = {
    id: 'loadform',
    url: 'td/SMT_SETTING_LAYOUT/query',
    urlType: 'inner',
    ajaxType: 'get',
    params: [
      {
        name: 'ID',
        type: 'tempValue',
        valueName: 'ID',
      },
    ],
    outputParameters: [],
    result: [
      // 描述 表单接收参数，将返回的哪些值赋给相应的组件属性
    ],
  };

  //  PROCEDURE B_P_C_CONFIG_PAGE

  loadingPageJson = {
    url: 'resource/B_P_C_CONFIG_PAGE/operate', // operation 操作 query
    ajaxType: 'post',
    params: [
      {
        name: 'PageId',
        type: 'tempValue',
        valueName: 'ID',
      },
    ],
    filter: [],
  };

  PageJson;

  async ngOnInit() {
    this._initInnerValue();
    this.setChangeValue(this.changeValue);
  }

  async ngAfterViewInit(): Promise<void> {
    console.log('*******ngAfterViewInit********', window.document.body.clientHeight, this.modelstyle);

    await this.load();
    this.onIndexChange(0);
  }
  private _initInnerValue() {
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
  }
  public setChangeValue(ChangeValues?) {
    console.log('changeValue', ChangeValues);
    // const ChangeValues = [{ name: "", value: "", valueTo: "" }];
    if (ChangeValues && ChangeValues.length > 0) {
      ChangeValues.forEach((p) => {
        switch (p.valueTo) {
          case 'tempValue':
            this.tempValue[p.name] = p.value;
            break;
          case 'initValue':
            this.initValue[p.name] = p.value;
            break;
          case 'staticComponentValue':
            this.staticComponentValue[p.name] = p.value;
            break;
        }
      });
    }
  }
  onIndexChange(index: number): void {
    this.index = index;
    // 切换导航，是数据流向保存等操作
  }

  /**
   * valueChangeLayout
   */
  public valueChangeLayout(v?) {
    if (v) {
      if (v.operation === 'json') {
        const _config = v.data.config;
        console.log('拖拽最新的布局配置', _config);
        this.c_config = _config;
      }
    }

    // 此处 做布局结构拆分保存，页面数据自身存储一条记录，页面配置一致。
    // 前端拆分出树形结构，复原平层结构后保存。
    //  insert into SMT_SETTING_PAGE 将json结构存储在页面的配置信息里
    // 分解json结构，树形结构拆分到【布局组件结构树】
    // 【编辑-》更新大字段json】-》【同步布局结构树】=》注意版本，更新有问题如何回滚
    // 生成版本过后，所有记录生成一个标准json，于明细记录分离，变更后均会生成新的记录，每次变更记录需要详细记录
    // 方便版本回退，若是直接拷贝生成json，就无法再次修改明细，需要有根据版本逆向生成明细记录的功能
    // 目前的表设计，逆向难度较大，向纯结构靠拢后，可实现
    this.ts_new = [];
    this.jxlayout(this.c_config, 'NULL');
    console.log('简析当前结构树：', this.ts_new, JSON.stringify(this.ts_new));
    this._componentValue.pageJson = JSON.stringify(this.c_config);
    this._componentValue.pageTree = JSON.stringify(this.ts_new);
  }

  // 拖动行

  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', d);
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss);
  }

  /**
   * jxlayout
   */
  public jxlayout(layoutconfig?, parentid?) {
    // console.log('xxx:',layoutconfig);
    if (layoutconfig instanceof Array) {
      // 数组
      layoutconfig.forEach((item) => {
        if (item.hasOwnProperty('container')) {
          this.ts_new.push({ id: item.id, type: item.type, title: item.title, parentId: parentid, container: item.container });
          if (item.container !== '') {
            this.jxlayout(item[item.container], item.id);
          }
        }
      });
    } else {
      // 第一步判断是否存在container
      if (layoutconfig.hasOwnProperty('container')) {
        // 下一层布局

        this.ts_new.push({
          id: layoutconfig.id,
          type: layoutconfig.type,
          title: layoutconfig.title,
          parentId: parentid,
          container: layoutconfig.container,
        });
        if (layoutconfig.container !== '' && layoutconfig[layoutconfig.container]) {
          this.jxlayout(layoutconfig[layoutconfig.container], layoutconfig.id);
        }
      }
    }
  }

  // 构建参数-》下拉选择自加载数据
  public buildParameters(paramsCfg) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: this._componentValue, //  组件值？返回值？级联值，需要三值参数
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      cascadeValue: this.cascadeValue,
      userValue: this.userValue,
    });
  }

  // 加载数据
  public async load() {
    const url = this.loadingConfig.url;
    const method = this.loadingConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.loadingConfig.params),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    // post
    const response = await this.componentService.apiService.get(url, params).toPromise();
    console.log('页面数据json加载', response.data);
    let pageV: any = {};
    if (Array.isArray(response.data)) {
      if (response.data && response.data.length > 0) {
        pageV = response.data[0];
      }
    } else {
      if (response.data) {
        pageV = response.data;
      }
    }

    if (pageV.JSON) {
      this.c_config = null;
      this.c_config = JSON.parse(pageV.JSON);
      this.ts_new = [];
      this.jxlayout(this.c_config, 'NULL');
      this._componentValue.pageJson = JSON.stringify(this.c_config);
      this._componentValue.pageTree = JSON.stringify(this.ts_new);
    }
    console.log('***', this.c_config);
    // if (response.data._procedure_resultset_1[0]['W'] === "") {
    //   this.dataList={};
    // }
    // else {
    //   const d = JSON.parse(response.data._procedure_resultset_1[0]['W']);
    //   this.convertData(d);
    // }
  }

  /**
   * execSaveJson 保存json结构
   */
  public async execSaveJson() {
    const url = this.saveJsonConfig.url;
    const method = this.saveJsonConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.saveJsonConfig.params),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    // post
    const response = await this.componentService.apiService.post(url, params).toPromise();
    console.log('页面数据json加载', response.data);
    let pageV = {};
    if (Array.isArray(response.data)) {
      if (response.data && response.data.length > 0) {
        pageV = response.data[0];
      }
    } else {
      if (response.data) {
        pageV = response.data;
      }
    }
  }
  public async loadPageJson() {
    const url = this.loadingPageJson.url;
    const method = this.loadingPageJson.ajaxType;
    const params = {
      ...this.buildParameters(this.loadingPageJson.params),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    const response = await this.componentService.apiService.post(url, params).toPromise();
    // console.log("页面组件编辑配置加载", response.data);
    if (response.data._procedure_resultset_1[0].W === '') {
      this.PageJson = null;
    } else {
      // this.PageJson = response.data._procedure_resultset_1[0]['W'];
      //  this.PageJson = JSON.parse(response.data._procedure_resultset_1[0]['W']);
      this.PageJson = this.formatJson(JSON.parse(response.data._procedure_resultset_1[0].W), {});
    }
    // console.log('表格的配置生成如下：', this.PageJson);
  }

  /**
   * execSaveComponentJson 保存组件结构
   */
  public execSaveComponentJson() {}

  /**
   * SaveJson
   */
  public SaveJson() {
    console.log(this.child0);
    this.child0.SaveJson();
    this.execSaveJson();
  }

  public SaveJson1() {
    this.child1.SaveJson();
    this.execSaveJson();

    //   const a="http://192.168.1.111:8089/aaa/table"
    //   const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}/;
    //   const ip = reg.exec(a)[0];
    //   const newip="10.10.1.222:333";
    //  const na=  a.replace(ip, newip);
    //   console.log('服务器ip',ip,'新网：',na);
  }

  // 导出当前页json
  public async DOWN_JSON() {
    await this.loadPageJson();
    console.log('++++++++++++++++++++++');
    //  console.log('当前页配置：', this.PageJson);
    this.componentService.modalService.create({
      nzWidth: '100%',
      nzStyle: { top: '0px', 'padding-bottom': '0px' },
      nzMaskClosable: false,
      nzBodyStyle: { overflow: 'auto' },
      nzTitle: '页面配置JSON',
      nzContent: CnCodeEditComponent, // CnCodeEditComponent,
      nzComponentParams: {
        config: { mode: 'text/x-sql', autofocus: true },
        //  value: JSON.stringify(this.PageJson)  "application/json"
        value: this.PageJson,
      },
      nzClosable: true, // 右上角关闭
      nzOnOk: (componentInstance) => {
        console.log('OK');
      },
    });

    console.log('++++++++++++++++++++++');
  }

  public formatJson(json, options) {
    let reg = null;
    let formatted = '';
    let pad = 0;
    const PADDING = '    '; // one can also use '\t' or a different number of spaces
    // optional settings
    options = options || {}; // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false; // use a space after a colon
    options.spaceAfterColon = options.spaceAfterColon === false ? false : true; // begin formatting...
    if (typeof json !== 'string') {
      // make sure we start with the JSON as a string
      json = JSON.stringify(json);
    } else {
      // is already a string, so parse and re-stringify in order to remove extra whitespace
      json = JSON.parse(json);
      json = JSON.stringify(json);
    }
    // add newline before and after curly braces
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n'); // add newline before and after square brackets
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n'); // add newline after comma
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n'); // remove multiple newlines
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n'); // remove newlines before commas
    reg = /\r\n\,/g;
    json = json.replace(reg, ','); // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
      reg = /\:\r\n\{/g;
      json = json.replace(reg, ':{');
      reg = /\:\r\n\[/g;
      json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
      reg = /\:/g;
      json = json.replace(reg, ':');
    }
    json.split('\r\n').forEach((node, index) => {
      let i = 0;
      let indent = 0;
      let padding = '';
      if (node.match(/\{$/) || node.match(/\[$/)) {
        indent = 1;
      } else if (node.match(/\}/) || node.match(/\]/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else {
        indent = 0;
      }
      for (i = 0; i < pad; i++) {
        padding += PADDING;
      }
      formatted += padding + node + '\r\n';
      pad += indent;
    });
    // $.each(json.split('\r\n'), (index, node) => {
    //   let i = 0;
    //   let indent = 0;
    //   let padding = '';
    //   if (node.match(/\{$/) || node.match(/\[$/)) { indent = 1; }
    //   else if (node.match(/\}/) || node.match(/\]/)) {
    //     if (pad !== 0) {
    //       pad -= 1;
    //     }
    //   } else { indent = 0; }
    //   for (i = 0; i < pad; i++) { padding += PADDING; }
    //   formatted += padding + node + '\r\n'; pad += indent;
    // });
    return formatted;
  }

  // CnCodeEditComponent
}
