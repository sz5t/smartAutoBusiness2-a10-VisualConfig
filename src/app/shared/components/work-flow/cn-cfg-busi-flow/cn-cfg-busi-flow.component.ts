import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { Addon, Graph } from '@antv/x6';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { Subject, Subscription } from 'rxjs';
import { CN_FLOW_PREVIEW_METHOD } from 'src/app/core/relations/bsn-methods/bsn-flow-preview-methods';
import { CN_FLOW_PREVIEW_PROPERTY } from 'src/app/core/relations/bsn-property/data-flow-preview.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../cn-component.base';
import { CnCfgFlowAttrSettingComponent } from '../cn-flow-items/cn-cfg-flow-attr-setting/cn-cfg-flow-attr-setting.component';
const components: { [type: string]: Type<any> } = {
  flowAttrSetting: CnCfgFlowAttrSettingComponent
};
@Component({
  selector: 'app-cn-cfg-busi-flow',
  templateUrl: './cn-cfg-busi-flow.component.html',
  styles: [
  ]
})
export class CnCfgBusiFlowComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;
  @Input() dataServe;
  @ViewChild('checkContainer', { static: false }) checkContainer: ElementRef;
  @ViewChild('refContainer', { static: false }) refContainer: ElementRef;
  @ViewChild('menu', { static: true }) public menu: NzDropdownMenuComponent;
  public COMPONENT_NAME = 'CnFlowPreview';
  /**
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  public COMPONENT_METHODS = CN_FLOW_PREVIEW_METHOD;

  public COMPONENT_PROPERTY = CN_FLOW_PREVIEW_PROPERTY;
  public FORM_VALUE: any = {}; // 当前表单组件值
  public FORM_STATE: any; // 表单的状态=》新增、修改、展示
  public FORM_VALID: any;
  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private nzContextMenuService: NzContextMenuService,
    private httpClient: HttpClient,
  ) {
    super(componentService);
  }
  ctrlPressed = false;
  embedPadding = 40;
  graph: any;
  graph1: any;
  public history: any;
  dnd: any;
  currentRowData: any;
  currentRow: any;
  cellId: any;
  cellText: any;
  selectedRow: any;
  form_process_config: any;
  public options: any; // 复制偏移配置
  async ngAfterViewInit(): Promise<void> {

    let _height = (window.document.body.clientHeight);
    let _width = (window.document.body.clientWidth - 260);

    this.graph1 = new Graph({
      container: this.checkContainer.nativeElement,
      width: 200,
      height: _height + 100,
      interacting: {
        nodeMovable: false // 节点是否可以被移动
      },
      background: {
        color: '#F4F4F4', // 设置画布背景颜色
      },
      grid: {
        size: 10,      // 网格大小 10px
        visible: false, // 渲染网格背景
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    });
    this.graph1.fromJSON(this.config.siderNode)

    this.changePortsVisible_check(false);


    this.graph = new Graph({
      container: this.refContainer.nativeElement,
      width: 1500,
      height: 1000,
      grid: true,
      history: true,
      clipboard: {  // 拷贝
        enabled: true,
        useLocalStorage: true,
      },
      panning: true,
      selecting: { // 选择
        enabled: true,
        showNodeSelectionBox: false,
      },
      embedding: {
        enabled: true,
        validate: (a: any) => {
          console.log('当前节点拖入', a);
          let back = false;
          if (a.parent) {
            if (a.parent.store.data['nodeType'] === 'group') {
              back = true;
            }
          }
          return back;
        }
        /*         (
                  this: Graph,
                  args: {
                    child: Node
                    parent: Node
                    childView: CellView
                    parentView: CellView
                  },
                ) => boolean */
      },
      highlighting: {
        embedding: {
          name: 'stroke',
          args: {
            padding: -1,
            attrs: {
              stroke: '#73d13d',
            },
          },
        },
      },
      connecting: { // 连线
        snap: {
          radius: 80,
        },
        highlight: true,
        // validateConnection: (a: any) => {


        //   if (a.edge.store.data.target['cell']) {
        //     console.log('sssss', a);
        //     return true;
        //   }
        //   else {
        //     return true;
        //   }

        // },
        validateEdge: (a: any) => {
          console.log('sssss', a);
          if (a.edge.store.data.target['cell']) {  // 连线是节点
            if (a.edge.store.data.target['cell'] === a.edge.store.data.source['cell']) { // 连线不能自己连自己
              return false;
            } else {
              return true;
            }

          } else {
            return false;
          }
        },
        // validateConnection:true
      },
    })

    this.history = this.graph.history
    this.history.on('change', () => {
      this.state = {
        canRedo: this.history.canRedo(),
        canUndo: this.history.canUndo(),
      };

      this.innerToolbar_state();

    })

    this.graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    });
    this.graph.on('node:change:position', ({ node, options }) => {
      console.log('node:change:position', node);
      if (options.skipParentHandler || this.ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(this.embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            { skipParentHandler: true },
          )
        }
      }
    }
    );

    let options: any = {
      target: this.graph,
      animation: true,
      validateNode: (droppingNode, options): boolean => {

        // droppingNode.store.data['attrs']['text']['text'] = 'xxxx';

        let dataNameType = droppingNode.store.data['nodeType'];
        let dataName = droppingNode.store.data['nodeSubType'];
        if (dataNameType === 'group') {
          droppingNode.store.data['size'] = {
            height: 200,
            width: 300
          };
        }

        let default_data = this.config.nodeMappingData[dataName]['nodeData'];
        droppingNode.updateData({ "id": droppingNode['id'], ...default_data });
        console.log('droppingNode', droppingNode, options)
        // this.graph_data.nodes.push(droppingNode.store.data);
        return true;

      }

    };
    this.dnd = new Addon.Dnd(options)
    this.graph1.on('node:mousedown', ({ e, node, view }) => {

      console.log('mousedown', node);

      this.dnd.start(node, e);

    })

    // 节点连线
    this.graph.on('edge:connected', ({ isNew, edge }) => {
      if (isNew) {
        // 对新创建的边进行插入数据库等持久化操作
        const source = edge.getSourceCell()
        console.log('新边', source);
        edge['store']['data']['nodeType'] = '连线';
        edge['store']['data']['nodeTypeText'] = '连线';
        edge['store']['data']['nodeSubType'] = 'flow';

        edge['store']['data']['labels'] = [
          {
            "attrs": {
              text: {
                text: '',
              },
            },
          },
        ]

        let dataName = edge.store.data['nodeSubType'];
        let default_data = this.config.nodeMappingData[dataName]['nodeData'];
        edge.updateData({ "id": edge['id'], ...default_data });

        console.log('====>', edge);
      } else {
        console.log('新边失败');
      }
    })
    this.graph.on('edge:change:target', (a: any) => {

      console.log('change__目标', a);

    })
    // 右键事件
    this.graph.on('cell:contextmenu', ({ e, cell }) => {

      let d = {
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY
      };

      console.log('节点右键事件', d);
      this.cellId = cell['id'];

      if (cell.isNode()) {
        this.cellText = cell.getAttrByPath('label/text')
      }
      else {
        let d = cell.getLabels();
        let wb = d[0]['attrs']['text']['text'];
        console.log('==>', d, wb);
        this.cellText = wb;
      }


      this.currentRow = {
        'id': this.cellId,
        'text': this.cellText ? this.cellText : "",
        "nodeType": cell['store']['data']['nodeType'] ? cell['store']['data']['nodeType'] : "",
        "nodeTypeText": cell['store']['data']['nodeTypeText'] ? cell['store']['data']['nodeTypeText'] : "",
        "nodeSubType": cell['store']['data']['nodeSubType'] ? cell['store']['data']['nodeSubType'] : ""
      }

      //, 'data': cell.getData()
      this.currentRowData = cell['data'] ? cell['data'] : null;
      console.log('节点右键事件数据====', cell, this.currentRow);

      this.contextMenu(d, this.menu)
    })

    this.graph.on('node:click', ({ node }) => {
      this.reset()
      node.attr('body/stroke', 'orange')

      // 更新节点Data数据
      // node.updateData({ "name": "dd" });
      this.nodeSelected(node);
    })

    this.graph.on('edge:click', ({ edge }) => {
      this.reset()
      edge.attr('line/stroke', 'orange')
      // edge.prop('labels/0', {
      //   "attrs": {
      //     body: {
      //       stroke: 'orange',
      //     },
      //   },
      // })

      this.eageSelected(edge);
    })

    this.graph.on('cell:mouseenter', ({ cell }) => {
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              "attrs": {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
          // {   // 节点删除
          //   name: 'button-remove',
          //   args: {
          //     x: 0,
          //     y: 0,
          //     offset: { x: 10, y: 10 },
          //   },
          // },
        ])

        this.changePortsVisible(true)


      } else {
        // cell.addTools(['vertices', 'segments',
        //   {
        //     name: 'source-arrowhead',
        //   },
        //   {
        //     name: 'target-arrowhead',
        //     args: {
        //       "attrs": {
        //         fill: 'red',
        //       },
        //     },
        //   },])
      }
    })
    this.graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
      if (cell.isNode()) {
        this.changePortsVisible(false)
      }
    })


    // 加载图形
    if (this.config.loadingOnInit) {
      await this.load();
    }
    this.graph.centerContent();

  }

  async ngOnInit(): Promise<void> {

    if (!this.config) {
      this.config = this.wf_config;
    }

    this.options = {
      offset: 30,
      useLocalStorage: true,
    }

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

    if (!this.config) {
      this.config = this.wf_config;
    }


    this.form_process_config = await this.loadConfig('vc/busi/main.json');



    this.setChangeValue(this.changeValue);

    this.resolveRelations();
  }




  public async load() {
    let response;
    let data_form;
    if (this.config.enableLoadStaticData) {
      response = this.buildParameters(this.config.staticDataConfig);
    } else {
      if (!this.config.loadingConfig) {
        return;
      }

      if (this.config.loadingConfig['enableAjaxMore']) {
        response = await this.executeHttpMore(this.config.loadingConfig, {}, 'buildParameters', null);
      } else {
        const url = this.config.loadingConfig.url;
        const method = this.config.loadingConfig.ajaxType;
        const params = {
          ...this.buildParameters(this.config.loadingConfig.params),
        };
        // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
        // response = null;
        response = await this.componentService.apiService[method](url, params).toPromise();
      }
    }

    if (response) {
      if (Array.isArray(response.data)) {
        if (response.data && response.data.length > 0) {
          data_form = response.data[0];
        }
      } else {
        if (response.data) {
          data_form = response.data;
        }
      }

    }
    if (this.config.loadingConfig.backData) {
      data_form = this.buildUserInfo(data_form, this.config.loadingConfig.backData)
      console.log('==========================', data_form)
    }
    if (data_form) {

      let image = JSON.parse(data_form['image']);
      if (image['config']) {

        let cells = image['config'];
        this.graph.fromJSON(cells)
      }
      if (image['busi']) {
        this.sourceData = image['busi'];
      } else {
        this.sourceData = {
          "id": CommonUtils.uuID(36),
          "name": null,
          "description": null,
          "params": []
        };
      }
      this.changePortsVisible_Container(false);

    } else {
      this.sourceData = {
        "id": CommonUtils.uuID(36),
        "name": null,
        "description": null,
        "params": []
      };
    }

    console.log('加载工作流图形===》》》', data_form)

    return true;
  }

  async loadConfig(cmpt) {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 
    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    backData = data;
    console.log('加载配置', data);
    return backData;


  }


  public buildUserInfo(data?, userConfig?) {
    const userInfo = {};
    userConfig.forEach((item) => {
      let valueItem: any;
      if (item.type === 'returnValue') {
        // str=”jpg|bmp|gif|ico|png”; arr=str.split(”|”);
        let strs: any[]; // 定义一数组
        let _data: any = data;
        let _isPass = true;
        strs = item.path.split('\\');
        for (let _index = 0; _index < strs.length; _index++) {
          if (_isPass) {
            const _indexStr = strs[_index];
            if (_indexStr.indexOf('$') > -1) {
              const arry_index = _indexStr.split('$');
              if (arry_index.length < 2) {
                _isPass = false;
              }
              const _arr_index = parseInt(arry_index[1]);
              if (_data[arry_index[0]] && _data[arry_index[0]].length > _arr_index) {
                _data = _data[arry_index[0]][_arr_index];
              } else {
                _isPass = false;
              }
            } else {
              // 对象
              if (_indexStr === 'root') {
                _data = _data;
              } else {
                _data = _data[_indexStr];
              }
            }
          }
        }
        if (_isPass) {
          valueItem = _data[item.valueName];
        } else {
          valueItem = null;
        }
      } else {
        valueItem = item.value;
      }
      userInfo[item.name] = valueItem;
    });

    return userInfo;
  }

  state = {
    canRedo: false,
    canUndo: false,
  }

  public changePortsVisible = (visible: boolean) => {
    const ports = this.refContainer.nativeElement.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGAElement>
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden'
    }
  }
  public changePortsVisible_check = (visible: boolean) => {
    const ports = this.checkContainer.nativeElement.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGAElement>
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden'
    }
  }
  public changePortsVisible_Container = (visible: boolean) => {
    const ports = this.refContainer.nativeElement.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGAElement>
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden'
    }
  }

  /**
    *  解析级联消息
    */
  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (!this._sender_source$) {
        // 解析组件发送消息配置,并注册消息发送对象
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // 解析消息接受配置,并注册消息接收对象
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_subscription$ = this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }

    this._trigger_source$ = new RelationResolver(this).resolve();
  }

  /**
* setChangeValue 接受 初始变量值
*/
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

  contextMenu($event: any, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }


  sourceData: any;
  public getComponentValue_VC() {
    let flowJson = this.graph.toJSON();
    let edges = flowJson.cells.filter(item => item.shape === 'edge');
    let nodes = JSON.parse(JSON.stringify(flowJson.cells.filter(item => item.shape !== 'edge')));
    let _nodes = [];
    nodes.forEach(element => {
      let _node = {};
      _node['id'] = element['id'];
      _node['shape'] = element['shape'];
      _node['label'] = element.attrs.label.text;
      _node['nodeType'] = element['nodeSubType'];
      _node['index'] = element['zIndex'];
      if (element['parent']) {
        _node['parentActionId'] = element['parent'];
      } else {
        _node['parentActionId'] = "null";
      }
      _node['data'] = element['data']['data'];
      _nodes.push(_node);
    });

    let _edges = [];
    edges.forEach(element => {
      let _edge = {};
      _edge['id'] = element['id'];
      _edge['shape'] = element['shape'];
      _edge['sourceId'] = element['source'] ? element['source']['cell'] : null;
      _edge['targetId'] = element['target'] ? element['target']['cell'] : null;
      _edge['data'] = element['data'];
      _edge['index'] = element['zIndex'];

      try {
        _edge['label'] = element['labels'][0]['attrs']['text']['text'];
        _edge['name'] = element['labels'][0]['attrs']['text']['text'];
      } catch {

      }

      _edges.push(_edge);
    });

    let submitData = {};
    submitData['actions'] = _nodes;
    submitData['flows'] = _edges;

    let backData = { ...this.sourceData, ...submitData };


    // console.log('最终数据', JSON.stringify(submitData))
    let image = {
      config: flowJson,
      busi: this.sourceData
    }
    console.log('最终数据', backData);
    return { struct: JSON.stringify(backData), image: JSON.stringify(image) };



  }


  public inner_action(btn?) {
    if (btn['execute']) {
      btn['execute'].forEach(element => {
        this[element['trigger']](element);
      });
    }
  }
  public innerToolbar_state() {

    if (this.config && this.config.innerToolbar) {
      this.config.innerToolbar.forEach(item => {
        if (item.innerType === 'onUndo') {
          item.disabled = !this.state.canUndo;
        }
        if (item.innerType === 'onRedo') {
          item.disabled = !this.state.canRedo;
        }
      })

    }


  }
  public onUndo(option?) {
    this.history.undo()
  }

  public onRedo(option?) {
    this.history.redo()
  }
  onCopy = (option?) => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      this.graph.copy(cells, this.options)
      console.log('复制成功');
      // message.success('复制成功')
    } else {
      // message.info('请先选中节点再复制')
      console.log('请先选中节点再复制');
      this.componentService.msgService.create('warning', '请先选中节点再复制');
    }
  }

  onPaste = (option?) => {
    if (this.graph.isClipboardEmpty()) {
      // message.info('剪切板为空，不可粘贴')
      console.log('剪切板为空，不可粘贴');
      this.componentService.msgService.create('warning', '剪切板为空，不可粘贴');
    } else {
      const cells = this.graph.paste(this.options)

      this.graph.cleanSelection()
      this.graph.select(cells)
      console.log('粘贴成功');
      //  message.success('粘贴成功')
    }
  }


  public onSave(option?) {

    let save_config: any;

    if (option) {
      if (option.hasOwnProperty('ajaxId')) {
        if (this.config.ajaxConfig) {
          this.config.ajaxConfig.forEach(element => {
            if (element.id === option['ajaxId']) {
              save_config = element
            }
          });
        }
      }
    }


    if (save_config) {
      this.executeModal(save_config);
    } else {
      this.componentService.msgService.create('warning', '未设置保存接口api');
    }

  }


  onDelete = (option?) => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      //removed

      this.componentService.modalService.confirm({
        nzTitle: '提示',
        nzContent: '<b style="color: red;">确定要删除吗?</b>',
        nzOkText: '确定',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.graph.removeNode(cells[0]);
          console.log('删除成功');
        },
        nzCancelText: '取消',
        nzOnCancel: () => console.log('Cancel')
      });
      // message.success('复制成功')
    } else {
      // message.info('请先选中节点再复制')
      console.log('请先选中节点再删除');
      this.componentService.msgService.create('warning', '请先选中节点再删除');
    }
  }

  // 重置样式
  public reset() {

    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()

    nodes.forEach((node) => {
      node.attr('body/stroke', '#31d0c6')
    })

    edges.forEach((edge) => {
      edge.attr('line/stroke', 'black')
      // edge.prop('labels/0', {
      //   "attrs": {
      //     body: {
      //       stroke: 'black',
      //     },
      //   },
      // })
    })
  }

  // 节点选中
  public nodeSelected(node?) {
    console.log('节点选中', node);
    // 修改属性名称
    this.cellId = node['id'];
    this.cellText = node.getAttrByPath('label/text')

    this.selectedRow = { 'id': this.cellId, 'text': this.cellText }

    return true;
  }
  // 边选中
  public eageSelected(eage?) {
    console.log('边选中', eage);
    // 修改属性名称
    // eage.setAttrByPath('label/text', 'dddd')
    this.selectedRow = { 'id': eage['id'], 'text': '边' }
    return true;
  }

  // 右键事件响应
  dropdown_change(code) {
    console.log(code);
    // this.attr_setting();
    this.attr_static_setting();
  }
  setting_static_dialog: any;
  public attr_static_setting(option?) {

    let dataName = this.currentRow["nodeSubType"];
    let default_config = this.config.nodeMappingData[dataName]['nodeConfig'];
    let _data;
    if (this.currentRowData) {
      if (this.currentRowData.hasOwnProperty('nodeData')) {
        _data = this.currentRowData['nodeData'];
      }
    }
    const dialogCfg = {
      title: '属性设置',
      width: "90%",
      style: null,
      maskClosable: false,
      cancelText: '取消',
      okText: '确定',
      config: {
        asyncLoad: true,
        loadingConfig: {
          path: "vc/flow/endNode.json"
        }

      },
      enableCustomFooter: true

    }

    if (default_config) {
      dialogCfg['config'] = default_config;
    }

    let dialog;
    // ？如何 将动态配置和 预置配置 相结合？？
    let sub_Config = {
      state1: { // 某种状态下的
        hasPanels: [] // 拥有的面板

      }
    }


    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components['flowAttrSetting'],
      nzComponentParams: {
        config: dialogCfg.config,
        sourceData: this.currentRowData
      },
      nzFooter1: null,
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: (componentInstance) => {
            let dialog_data = {};

            console.log('最终值', componentInstance.sourceData);
            let cell = this.graph.getCellById(this.currentRow['id'])
            // currentRowData
            if (cell.isNode()) {
              cell.setAttrByPath('label/text', componentInstance.sourceData['text'])
              cell.updateData(componentInstance.sourceData);
            } else {
              cell.setLabels([
                {
                  "attrs": {
                    text: {
                      text: componentInstance.sourceData['text'],
                    },
                  },
                },
              ]);

              cell.updateData(componentInstance.sourceData);
            }
            dialog.close();

          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
    this.setting_static_dialog = dialog;

  }


  public buildParameters(paramsCfg, returnData?, itemData?) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: this.getComponentValue_VC(),
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      returnValue: returnData ? returnData : {},
      item: itemData ? itemData : {},
      userValue: this.userValue,
      selectedRow: this.selectedRow
    });
  }
  public async executeModal(execConfig) {


    console.log('-------------执行sql', execConfig);
    // 构建业务对象
    // 执行异步操作
    // this.componentService.apiService.doPost();
    const url = execConfig.url;
    const params = this.buildParameters(execConfig.params);
    //  console.log(this.config.id + '-------------执行sql params:', params);
    const back = false;

    let response: any;
    if (execConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(execConfig, {}, 'buildParameters', null);
    } else {
      response = await this.componentService.apiService[execConfig.ajaxType](url, params).toPromise();
    }
    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, execConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, execConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, execConfig.result);

    return validationResult && errorResult;

  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find((res) => res.name === 'data');
      // 弹出提示框
      if (successCfg) {
        new RelationResolver(this).resolveInnerSender(successCfg, response.data, Array.isArray(response.data));
      }
      result = true;
    }

    return result;
  }

  private _sendDataValidationMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.validation) && response.validation.length <= 0) {
      return result;
    }
    if (response && response.validation) {
      const validationCfg = resultCfg.find((res) => res.name === 'validation');
      if (validationCfg) {
        new RelationResolver(this).resolverDataValidationSender(validationCfg, response.validation);
      }
      result = false;
    }
    return result;
  }

  private _sendDataErrorMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.error) && response.error.length <= 0) {
      return result;
    }
    if (response && response.error) {
      const errorCfg = resultCfg.find((res) => res.name === 'error');
      if (errorCfg) {
        new RelationResolver(this).resolverDataErrorSender(errorCfg, response.error);
      }
      result = false;
    }
    return result;
  }

  public getCurrentComponentId() {
    return this.config.id;
  }
  wf_config = {

    "id": "wf_001",
    "title": "业务流",
    "titleIcon": "right-circle",
    "component": "cnCfgBusiFlowDesign",
    "keyId": "id",
    "loadingOnInit": true, // 是否初始加载
    "loadingConfig": {
      "url": "sd/GET_DATA_MODELING_TABLE/query",
      "method": "get",
      "params": [
      ],
      "filter": [
      ],
      "backData": [  // 描述ajax 取值 字段绑定的流程配置信息
        {
          "name": "json",
          "path": "data\\_procedure_resultset_1$0",
          "type": "returnValue",
          "valueName": "R_JSON"

        }
      ]

    },
    "enableToolbar": true, // 是否启用 内置操作
    "innerToolbar": [
      {
        "id": "tool_onUndo",
        "innerType": "onUndo",
        "text": "撤销",
        "icon": "undo",
        "color": "text-primary",
        "hidden": false,
        "disabled": false,
        "execute": [
          {
            "triggerType": "STATE",
            "trigger": "onUndo"
          }
        ]
      },
      {
        "id": "tool_onRedo",
        "text": "恢复",
        "icon": "redo",
        "innerType": "onRedo",
        "color": "text-primary",
        "hidden": false,
        "disabled": true,
        "execute": [
          {
            "triggerType": "STATE",
            "trigger": "onRedo"
          }
        ]
      },
      {
        "id": "tool_onCopy",
        "text": "复制",
        "icon": "copy",
        "color": "text-primary",
        "hidden": false,
        "disabled": false,
        "innerType": "onCopy",
        "execute": [
          {
            "triggerType": "STATE",
            "trigger": "onCopy"
          }
        ]
      },
      {
        "id": "tool_onPaste",
        "text": "粘贴",
        "icon": "diff",
        "color": "text-primary",
        "hidden": false,
        "disabled": false,
        "innerType": "onPaste",
        "execute": [
          {
            "triggerType": "STATE",
            "trigger": "onPaste"
          }
        ]
      },
      {
        "id": "tool_onDelete",
        "text": "删除",
        "icon": "delete",
        "color": "text-primary",
        "hidden": false,
        "disabled": false,
        "innerType": "onDelete",
        "execute": [
          {
            "triggerType": "STATE",
            "trigger": "onDelete"
          }
        ]
      },
      {
        "id": "tool_onSave",
        "text": "保存",
        "icon": "save",
        "color": "text-primary",
        "hidden": false,
        "disabled": false,
        "innerType": "onSave",
        "execute": [
          {
            "triggerType": "STATE",
            "trigger": "onSave"
          }
        ]
      }
    ],
    "dropdownMenu": [
      {
        "id": "001",
        "text": "编辑",                   // 按钮文本
        "icon": "setting",                  // 按钮图标
        "color": "text-primary",         // 按钮颜色样式
        "hidden": false,                 // 是否显示
        "disabled": false,               // 是否启用
        "execute": [                     // 执行操作
          {
            "triggerType": "STATE",      // 操作触发类型
            "trigger": "ADD_ROW",        // 操作触发方法
            "conditionId": "add_state_1" // 设置引用前置条件
          }
        ]
      }
    ],
    "siderNode": {
      "nodes": [
        {
          "shape": "ellipse",
          "x": "60",
          "y": 50,
          "width": 80,
          "height": 60,
          "nodeType": "startEvent",
          "nodeTypeText": "开始",
          "nodeSubType": "startEvent",
          "attrs": {
            "body": {
              "stroke": "#237804",
              "fill": "#73d13d"
            },
            "label": {
              "text": "开始"
            }
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        },
        {
          "id": "node1",
          "shape": "rect",
          "x": 60,
          "y": 150,
          "width": 80,
          "height": 40,
          "nodeType": "userTask",
          "nodeTypeText": "任务节点",
          "nodeSubType": "userTask",
          "attrs": {
            "label": {
              "text": "任务节点",
              "fill": "#6a6c8a"
            },
            "body": {
              "stroke": "#31d0c6",
              "strokeWidth": 2
            }
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        },
        {
          "shape": "ellipse",
          "x": 60,
          "y": 240,
          "width": 80,
          "height": 60,
          "nodeType": "endEvent",
          "nodeTypeText": "结束",
          "nodeSubType": "endEvent",
          "attrs": {
            "label": {
              "text": "结束"
            },
            "body": {
              "fill": "#efdbff",
              "stroke": "#9254de"
            }
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        },
        {
          "shape": "polygon",
          "x": 60,
          "y": 330,
          "width": 80,
          "height": 80,
          "nodeType": "Gateway",
          "nodeTypeText": "排他网关",
          "nodeSubType": "exclusiveGateway",
          "attrs": {
            "body": {
              "stroke": "#31d0c6",
              "refPoints": "0,10 10,0 20,10 10,20"
            },
            "label": {
              "text": "排他网关"
            }
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        },
        {
          "shape": "polygon",
          "x": 60,
          "y": 430,
          "width": 80,
          "height": 80,
          "nodeType": "Gateway",
          "nodeTypeText": "并行网关",
          "nodeSubType": "parallelGateway",
          "attrs": {
            "body": {
              "stroke": "#31d0c6",
              "refPoints": "0,10 10,0 20,10 10,20"
            },
            "label": {
              "text": "并行网关"
            }
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        },
        {
          "shape": "polygon",
          "x": 60,
          "y": 530,
          "width": 80,
          "height": 80,
          "nodeType": "Gateway",
          "nodeTypeText": "包容网关",
          "nodeSubType": "inclusiveGateway",
          "attrs": {
            "body": {
              "stroke": "#31d0c6",
              "refPoints": "0,10 10,0 20,10 10,20"
            },
            "label": {
              "text": "包容网关"
            }
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        },
        {
          "x": 60,
          "y": 630,
          "width": 80,
          "height": 80,
          "nodeType": "group",
          "nodeTypeText": "组",
          "nodeSubType": "group",
          zIndex: 1,
          label: '组',
          attrs: {
            body: {
              fill: '#fffbe6',
              stroke: '#ffe7ba',
            },
            label: {
              fontSize: 12,
            },
          },
          "ports1": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "out": {
                "position": "bottom",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "right": {
                "position": "right",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              },
              "left": {
                "position": "left",
                "attrs": {
                  "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#31d0c6",
                    "strokeWidth": 2,
                    "fill": "#fff"
                  }
                }
              }
            },
            "items": [
              {
                "id": "port1",
                "group": "in"
              },
              {
                "id": "port2",
                "group": "out"
              },
              {
                "id": "port3",
                "group": "left"
              },
              {
                "id": "port4",
                "group": "right"
              }
            ]
          }
        }
      ],
      "edges": []
    },
    "nodeMappingData": {
      "startEvent": {
        "title": "开始",
        "nodeData": {
          "nodeTypeText": "开始",
          "text": "开始",
          "data": {
            "conditionExpression": null
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/startNode.json"
          }
        }

      },
      "userTask": {
        "title": "任务",
        "nodeData": {
          "nodeTypeText": "任务",
          "text": "任务",
          "data": {
            "candidate": {
              "assignPolicy": {
                "isDynamic": true,
                "assignNum": "100%",
                "expressionList": null
              },
              "handlePolicy": {
                "suggest": false,
                "attitude": false,
                "claim": {
                  "name": "byNumber",
                  "value": "100%"
                },
                "serialHandle": null
              }

            },
            "optionList": null
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/taskNode.json"
          }
        }
      },
      "endEvent": {
        "title": "结束",
        "nodeData": {
          "nodeTypeText": "结束",
          "text": "结束",
          "data": {}
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/endNode.json"
          }
        }
      },
      "exclusiveGateway": {
        "title": "排他网关",
        "nodeData": {
          "nodeTypeText": "排他网关",
          "text": "排他网关",
          "data": {
            "variableExtend": {
              "global": true,
              "local": true,
              "transient": true
            }
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/gateway.json"
          }
        }
      },
      "parallelGateway": {
        "title": "并行网关",
        "nodeData": {
          "nodeTypeText": "并行网关",
          "text": "并行网关",
          "data": {
            "variableExtend": {
              "global": true,
              "local": true,
              "transient": true
            }
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/gateway.json"
          }
        }
      },
      "inclusiveGateway": {
        "title": "包容网关",
        "nodeData": {
          "nodeTypeText": "包容网关",
          "text": "包容网关",
          "data": {
            "variableExtend": {
              "global": true,
              "local": true,
              "transient": true
            }
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/gateway.json"
          }
        }
      },
      "flow": {
        "title": "边",
        "nodeData": {
          "nodeTypeText": "边",
          "text": "",
          "data": {
            "conditionExpression": null
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/startNode.json"
          }
        }
      },
      "group": {
        "title": "组",
        "nodeData": {
          "nodeTypeText": "组",
          "text": "组",
          "data": {
            "conditionExpression": null
          }
        },
        "nodeConfig": {
          "asyncLoad": true,
          "loadingConfig": {
            "path": "vc/flow/startNode.json"
          }
        }
      }

    }


  }

  form_process_config1 = {
    "type": "staticForm",
    "backName": "title",
    "backConfig": [
      {
        "name": "id"
      },
      {
        "name": "name"
      },
      {
        "name": "description"
      },
      {
        "name": "params"
      }
    ],
    "properties": [
      {
        "code": "001",
        "name": "id",
        "type": "label",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "标识"
      },
      {
        "code": "002",
        "name": "name",
        "type": "input",
        "componentConfig": {
        },
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "名称"
      },
      {
        "code": "003",
        "name": "description",
        "type": "input",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "描述"
      },
      {
        "code": "004",
        "name": "params",
        "type": "arrayCollapse",
        "componentConfig": {
        },
        "formType": "array",
        "formName": "formControlName",
        "validations": [],
        "title": "参数",
        "properties": [
          {
            "name": "id",
            "type": "input",
            "componentConfig": {},
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "主键"
          },
          {
            "name": "scope",
            "type": "select",
            "componentConfig": {
              "options": [
                {
                  "label": "输入参数",
                  "value": "1"
                },
                {
                  "label": "输入输出参数",
                  "value": "2"
                },
                {
                  "label": "输出参数",
                  "value": "3"
                },
                {
                  "label": "全局参数",
                  "value": "4"
                },
                {
                  "label": "本地参数",
                  "value": "5"
                }
              ],
              "labelName": "label",
              "valueName": "value"
            },
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "参数范围"
          },
          {
            "name": "name",
            "type": "input",
            "componentConfig": {},
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "名称"
          },
          {
            "name": "dataType",
            "type": "select",
            "componentConfig": {
              "options": [
                {
                  "label": "string",
                  "value": "string"
                },
                {
                  "label": "byte",
                  "value": "byte"
                },
                {
                  "label": "short",
                  "value": "short"
                },
                {
                  "label": "integer",
                  "value": "integer"
                },
                {
                  "label": "long",
                  "value": "long"
                },
                {
                  "label": "float",
                  "value": "float"
                },
                {
                  "label": "double",
                  "value": "double"
                },
                {
                  "label": "boolean",
                  "value": "boolean"
                },
                {
                  "label": "date",
                  "value": "date"
                },
                {
                  "label": "list",
                  "value": "list"
                },
                {
                  "label": "object",
                  "value": "object"
                }
              ],
              "labelName": "label",
              "valueName": "value"
            },
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "类型"
          },
          {
            "name": "defaultValue",
            "type": "input",
            "componentConfig": {},
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "默认值"
          },
          {
            "name": "required",
            "type": "switch",
            "componentConfig": {
            },
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "是否必须"
          }
        ]
      }

    ]
  }

  staticFormValueChange(v?) {

    console.log('返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }

    console.log('====static最终====>>>', this.sourceData);

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
  }

}




