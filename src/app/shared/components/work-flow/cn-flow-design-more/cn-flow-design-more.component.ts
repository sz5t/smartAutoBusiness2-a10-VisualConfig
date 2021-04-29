import { Type, AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Graph, Addon } from '@antv/x6';
import { Stencil } from '@antv/x6/lib/addon';
import { Circle, Rect } from '@antv/x6/lib/shape/basic';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { Subject, Subscription } from 'rxjs';
import { CN_FLOW_PREVIEW_METHOD } from 'src/app/core/relations/bsn-methods/bsn-flow-preview-methods';
import { CN_FLOW_PREVIEW_PROPERTY } from 'src/app/core/relations/bsn-property/data-flow-preview.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../cn-component.base';
import { CnDataFormComponent } from '../../data-form/cn-data-form.component';
import { CnFlowAttrSettingMoreComponent } from '../cn-flow-items/cn-flow-attr-setting-more/cn-flow-attr-setting-more.component';
import { CnFlowAttrSettingComponent } from '../cn-flow-items/cn-flow-attr-setting/cn-flow-attr-setting.component';
const components: { [type: string]: Type<any> } = {
  flowAttrSetting: CnFlowAttrSettingComponent,
  flowAttrSettingMore: CnFlowAttrSettingMoreComponent

};
@Component({
  selector: 'cn-flow-design-more,[cn-flow-design-more]',
  templateUrl: './cn-flow-design-more.component.html',
  styles: [
    `
    @keyframes ant-line {
      to {
          stroke-dashoffset: -1000
      }
    }

    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }

    .trigger:hover {
      color: #1890ff;
    }

    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
    }

    nz-header {
      background: #fff;
      padding: 0;
    }

    nz-content {
      margin: 0 16px;
    }

    nz-breadcrumb {
      margin: 16px 0;
    }

    .inner-content {
      padding: 24px;
      background: #fff;
      min-height: 360px;
    }
    .ant-layout-sider {
      position: relative;
      min-width: 0;
      background: #d3e2f1;
      transition: all 0.2s;
    }
    
    .x6-graph-scroller {
      border: 1px solid #f0f0f0;
      margin-left: -1px;
    }
    `
  ]
})
export class CnFlowDesignMoreComponent extends CnComponentBase implements OnInit, OnDestroy, AfterViewInit {

  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;
  @Input() dataServe;
  @ViewChild('checkContainer', { static: false }) checkContainer: ElementRef;
  @ViewChild('refContainer', { static: false }) refContainer: ElementRef;
  @ViewChild('refcontent', { static: false }) refcontent: ElementRef;

  @ViewChild('form1', { static: true }) public form1: CnDataFormComponent;

  public graph: any;
  public graph1: any;
  public dnd: any;
  public dnd1: any;

  public history: any;
  public options: any; // 复制偏移配置

  isCollapsed = false;
  selectedRow: any;
  currentRow: any;
  currentRowData: any;

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
    private fb: FormBuilder,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private nzContextMenuService: NzContextMenuService
  ) {
    super(componentService);
  }

  @ViewChild('menu', { static: true }) public menu: NzDropdownMenuComponent;
  contextMenu($event: any, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }



  public graph_data1 = {
    nodes: [

      {
        shape: 'ellipse',
        x: 60,
        y: 50,
        width: 80,
        height: 60,
        nodeType: '开始节点',
        nodeTypeText: '开始节点',
        nodeSubType: 'startEvent',
        attrs: {
          body: {
            stroke: '#237804',
            fill: '#73d13d',
          },
          label: {
            text: '开始'
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'top',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            {
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            },
            {
              id: 'port3',
              group: 'left',
            },
            {
              id: 'port4',
              group: 'right',
            }

          ],
        }
      },
      {
        id: 'node1',
        shape: 'rect', // 使用 rect 渲染
        x: 60,
        y: 150,
        width: 80,
        height: 40,
        nodeType: '任务节点',
        nodeTypeText: '任务节点',
        nodeSubType: 'userTask',
        attrs: {
          label: {
            text: '任务节点',
            fill: '#6a6c8a',
          },
          body: {
            stroke: '#31d0c6',
            strokeWidth: 2,
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'top',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            {
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            },
            {
              id: 'port3',
              group: 'left',
            },
            {
              id: 'port4',
              group: 'right',
            }

          ],
        }
      },
      {
        shape: 'ellipse',
        x: 60,
        y: 240,
        width: 80,
        height: 60,
        nodeType: '结束节点',
        nodeTypeText: '结束节点',
        nodeSubType: 'endEvent',
        attrs: {
          label: {
            text: '结束',
          },
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'top',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            {
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            },
            {
              id: 'port3',
              group: 'left',
            },
            {
              id: 'port4',
              group: 'right',
            }

          ],
        }
      },
      {
        shape: 'polygon',
        x: 60,
        y: 330,
        width: 80,
        height: 80,
        nodeType: '分支节点',
        nodeTypeText: '排他网关',
        nodeSubType: 'exclusiveGateway',
        attrs: {
          body: {
            // fill: '#efdbff',  // 填充颜色
            stroke: '#31d0c6',
            // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
            // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
            refPoints: '0,10 10,0 20,10 10,20',
          },
          label: {
            text: '排他网关'
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'top',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            {
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            },
            {
              id: 'port3',
              group: 'left',
            },
            {
              id: 'port4',
              group: 'right',
            }

          ],
        }
      },
      {
        shape: 'polygon',
        x: 60,
        y: 430,
        width: 80,
        height: 80,
        nodeType: '分支节点',
        nodeTypeText: '并行网关',
        nodeSubType: 'parallelGateway',
        attrs: {
          body: {
            // fill: '#efdbff',  // 填充颜色
            stroke: '#31d0c6',
            // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
            // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
            refPoints: '0,10 10,0 20,10 10,20',
          },
          label: {
            text: '并行网关'
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'top',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            {
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            },
            {
              id: 'port3',
              group: 'left',
            },
            {
              id: 'port4',
              group: 'right',
            }

          ],
        }
      },
      {
        shape: 'polygon',
        x: 60,
        y: 530,
        width: 80,
        height: 80,
        nodeType: '分支节点',
        nodeTypeText: '包容网关',
        nodeSubType: 'inclusiveGateway',
        attrs: {
          body: {
            // fill: '#efdbff',  // 填充颜色
            stroke: '#31d0c6',
            // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
            // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
            refPoints: '0,10 10,0 20,10 10,20',
          },
          label: {
            text: '包容网关'
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'top',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            {
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            },
            {
              id: 'port3',
              group: 'left',
            },
            {
              id: 'port4',
              group: 'right',
            }

          ],
        }
      }

    ],
    edges: [
    ],
  };

  ngOnInit(): void {
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
    this.setChangeValue(this.changeValue);

    this.resolveRelations();

    this.test_form();

  }


  public async ngAfterViewInit() {

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

    // this.graph1.on('node:mouseenter', () => {
    //   this.changePortsVisible_check(true)
    // })

    // this.graph1.on('node:mouseleave', () => {
    //   this.changePortsVisible_check(false)
    // })
    this.graph1.fromJSON(this.graph_data1)
    // 初始化
    this.changePortsVisible_check(false);


    this.graph = new Graph({
      container: this.refContainer.nativeElement,
      width: _width,
      height: _height + 100,
      resizing: true, // 可设置大小
      grid: true,
      history: true,
      // history: {
      //   // enable: true,
      //   ignoreAdd: true,
      //   ignoreRemove: true,
      //   ignoreChange: true,
      // },
      clipboard: {  // 拷贝
        enabled: true,
        useLocalStorage: true,
      },
      selecting: { // 选择
        enabled: true,
        showNodeSelectionBox: false,
      },
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: false,   // 滚动   设计流程不允许滚动，查阅时可以滚动，方便查看
        pageVisible: false,
        pageBreak: false,
        pannable: true, // 是否启用画布平移能力（在空白位置按下鼠标后拖动平移画布）
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
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    this.graph.centerContent();

    let options: any = {
      target: this.graph,
      animation: true,
      validateNode: (droppingNode, options): boolean => {

        // droppingNode.store.data['attrs']['text']['text'] = 'xxxx';
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
            attrs: {
              text: {
                text: '',
              },
            },
          },
        ]

        console.log('====>', edge);
      } else {
        console.log('新边失败');
      }
    })

    this.graph.on('edge:change:target', (a: any) => {

      console.log('change__目标', a);

    })

    this.graph.on('cell:mouseenter', ({ cell }) => {
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              attrs: {
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
        //       attrs: {
        //         fill: 'red',
        //       },
        //     },
        //   },])
      }
    })
    this.graph.on('edge:dblclick', ({ cell }) => {
      if (cell.isNode()) {
      } else {
        cell.addTools(['vertices', 'segments',
          {
            name: 'source-arrowhead',
          },
          {
            name: 'target-arrowhead',
            args: {
              attrs: {
                fill: 'red',
              },
            },
          },])
      }
    })

    this.graph.on('node:click', ({ node }) => {
      this.reset()
      node.attr('body/stroke', 'orange')

      // 更新节点Data数据
      // node.updateData({ "name": "dd" });
      this.nodeSelected(node);
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

    this.graph.on('blank:contextmenu', ({ e }) => {
      let d = {
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY
      };
      this.currentRow = {
        'id': this.cellId, 'text': this.cellText ? this.cellText : "", "nodeType": "process",
        "nodeTypeText": "流程",
        "nodeSubType": "process"
      }

      //, 'data': cell.getData()
      this.currentRowData = {};
      console.log('节画布右键事件数据====', this.currentRow);

      this.contextMenu(d, this.menu)
    })
    // nzDropdownMenu


    this.graph.on('edge:click', ({ edge }) => {
      this.reset()
      edge.attr('line/stroke', 'orange')
      // edge.prop('labels/0', {
      //   attrs: {
      //     body: {
      //       stroke: 'orange',
      //     },
      //   },
      // })

      this.eageSelected(edge);
    })

    // 画布选中
    this.graph.on('blank:click', ({ e }) => {
      this.reset()
      this.containerSelected();

    })





    this.graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
      if (cell.isNode()) {
        this.changePortsVisible(false)
      }
    })


    this.history = this.graph.history
    this.history.on('change', () => {
      this.state = {
        canRedo: this.history.canRedo(),
        canUndo: this.history.canUndo(),
      };

      this.innerToolbar_state();

    })

    this.options = {
      offset: 30,
      useLocalStorage: true,
    }

    // 加载图形
    if (this.config.loadingOnInit) {
      await this.load();
    }


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

      if (image['wfconfig']) {

        let cells = image['wfconfig'];
        this.graph.fromJSON(cells)
      }
      if (image['process']) {
        this.form1['tempValue']['base_setting_data_process'] = image['process'];
      } else {
        this.form1['tempValue']['base_setting_data_process'] = {
          "code": null,
          "version": null,
          "name": null,
          "title": null,
          "pageID": null,
          "strict": false, // 是否强制保存(用在存在实例的流程定义), 默认值为false
          "typeId": this.tempValue['TYPE_ID'], // 关联的类型id, 数字类型
          "description": null // 描述
        };
      }
      // this.form1.tempValue['base_attr_data'] = v;
      this.form1.load();


      this.changePortsVisible_Container(false);

      // let dddd = this.graph.toJSON();
      // let cell = dddd['cells'];
      // if (cell) {
      //   const rect = this.graph.getCellsBBox(cell);
      //   this.graph.transitionToRect(rect, {
      //     duration: '500ms',
      //     center: cell[0].getBBox().center()
      //   });
      // }

    } else {
      this.form1['tempValue']['base_setting_data_process'] = {
        "code": null,
        "version": null,
        "name": null,
        "title": null,
        "pageID": null,
        "strict": false, // 是否强制保存(用在存在实例的流程定义), 默认值为false
        "typeId": this.tempValue['TYPE_ID'], // 关联的类型id, 数字类型
        "description": null // 描述
      };

      // this.form1.tempValue['base_attr_data'] = v;
      this.form1.load();
    }

    console.log('加载工作流图形===》》》', data_form)

    return true;
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

  public buildParameters(paramsCfg, returnData?, itemData?) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: this.getComponentValueNew(),
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      returnValue: returnData ? returnData : {},
      item: itemData ? itemData : {},
      userValue: this.userValue,
      selectedRow: this.selectedRow
    });
  }

  public getCurrentComponentId() {
    return this.config.id;
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


  // 重置未选中节点样式
  public reset() {

    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()

    nodes.forEach((node) => {
      node.attr('body/stroke', '#31d0c6')
    })

    edges.forEach((edge) => {
      edge.attr('line/stroke', 'black')
      // edge.prop('labels/0', {
      //   attrs: {
      //     body: {
      //       stroke: 'black',
      //     },
      //   },
      // })
    })
  }



  // 根据id 获取节点
  public Get_Cell(id?): any {
    let cell = this.graph.getCell();
    return cell;
  }




  public h() {

    // 获取画布大小
    console.log(this.refcontent.nativeElement);
    console.log(this.refcontent.nativeElement.getHeight());

  }


  public printData(option?) {

    let ddd = this.graph.getNodes();
    let dddd = this.graph.toJSON();
    // let ddd1 =new Graph({}).toJSON

    let edges = dddd.cells.filter(item => item.shape === 'edge')
    let nodes = dddd.cells.filter(item => item.shape !== 'edge')

    let _nodes = [];
    nodes.forEach(element => {
      let _node = {};
      _node['id'] = element['id'];
      _node['shape'] = element['shape'];
      _node['label'] = element.attrs.label.text;
      _node['nodeType'] = element['nodeType'];

      _node['index'] = element['zIndex'];

      _nodes.push(_node);
    });

    let _edges = [];
    edges.forEach(element => {
      let _edge = {};
      _edge['id'] = element['id'];
      _edge['shape'] = element['shape'];
      _edge['source'] = element['source'] ? element['source']['cell'] : null;
      _edge['target'] = element['target'] ? element['target']['cell'] : null;

      _edge['index'] = element['zIndex'];

      _edges.push(_edge);
    });


    console.log('边', edges, 'V1.0:', _edges);
    console.log('节点', nodes, 'V1.0:', _nodes);
    console.log('xxxxxx', ddd, dddd);
    this.getComponentValue()
  }


  public onSave(option?) {

    let save_config = {
      "id": "tree_add_func",
      "url": "resource/B_WF_SAVEFLOW/operate",
      "urlType": "inner",
      "ajaxType": "post",
      "params": [
        {
          "name": "ID",
          "type": "tempValue",
          "valueName": "ID"

        },
        {
          "name": "CONFIGJSON",
          "type": "componentValue",
          "valueName": "configjson"
        },
        {
          "name": "NODESJSON",
          "type": "componentValue",
          "valueName": "nodejson"
        },
        {
          "name": "EDGESJSON",
          "type": "componentValue",
          "valueName": "edgejson"
        }


      ],
      "outputParameters": [],
      "result": [
        {
          "name": "data",
          "showMessageWithNext": 0,
          "message": "message.ajax.state.success",
          "senderId": "aftetFuncSaveSuccessfully"
        }
      ]
    }

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



    this.executeModal(save_config);
  }



  public getComponentValue() {
    let dddd = this.graph.toJSON();
    let edges = dddd.cells.filter(item => item.shape === 'edge')
    let nodes = dddd.cells.filter(item => item.shape !== 'edge')

    let _nodes = [];
    nodes.forEach(element => {
      let _node = {};
      _node['id'] = element['id'];
      _node['shape'] = element['shape'];
      _node['label'] = element.attrs.label.text;
      _node['nodeType'] = element['nodeType'];

      _node['index'] = element['zIndex'];
      // _node['data'] = JSON.stringify(element['data']);

      if (element['data']) {

        if (element['data']['nodeData']) {
          _node['data'] = JSON.stringify(element['data']['nodeData']);
        }
        if (element['data']['nodeResouce']) {
          _node['dataResouce'] = JSON.stringify(element['data']['nodeResouce']);
        }

      } else {
        _node['data'] = null;
      }
      _nodes.push(_node);
    });

    let _edges = [];
    edges.forEach(element => {
      let _edge = {};
      _edge['id'] = element['id'];
      _edge['shape'] = element['shape'];
      _edge['source'] = element['source'] ? element['source']['cell'] : null;
      _edge['target'] = element['target'] ? element['target']['cell'] : null;
      _edge['data'] = JSON.stringify(element['data']);
      _edge['index'] = element['zIndex'];

      _edges.push(_edge);
    });

    let submitData = {};
    submitData['configjson'] = JSON.stringify(dddd);
    submitData['nodejson'] = JSON.stringify(_nodes);
    submitData['edgejson'] = JSON.stringify(_edges);

    console.log('最终数据', submitData)
    return submitData;
  }

  public getComponentValueNew() {
    let dddd = this.graph.toJSON();
    let edges = dddd.cells.filter(item => item.shape === 'edge')
    let nodes = JSON.parse(JSON.stringify(dddd.cells.filter(item => item.shape !== 'edge')))

    let _nodes = [];
    nodes.forEach(element => {
      let _node = {};
      _node['id'] = element['id'];
      _node['shape'] = element['shape'];
      _node['label'] = element.attrs.label.text;
      _node['nodeType'] = element['nodeSubType'];


      _node['index'] = element['zIndex'];
      _node['data'] = element['data'];
      // _node['data'] = JSON.stringify(element['data']);

      if (element['nodeType'] === '分支节点') {
        if (element['data']) {
          _node['data'] = {};

          _node['data']['variableExtend'] = element['data']['nodeGateway'];
        } else {
          _node['data'] = null;
        }
      }
      if (element['nodeType'] === '任务节点') {
        if (element['data']) {
          _node['data'] = element['data']['nodeData'];
          _node['data']['candidate'] = {
            assignPolicy: element['data']['nodeAssignPolicy'],
            handlePolicy: element['data']['nodeHandlePolicy']
          };
          _node['data']['optionList'] = element['data']['nodeOption']['optionList']
        } else {
          _node['data'] = null;
        }
      }
      if (element['nodeType'] === '开始节点') {
        if (element['data']) {
          _node['data'] = element['data']['nodeBegin'];
        } else {
          _node['data'] = null;
        }

      }
      if (element['nodeType'] === '结束节点') {
        _node['data'] = null;

      }

      _nodes.push(_node);
    });

    let _edges = [];
    edges.forEach(element => {
      let _edge = {};
      _edge['id'] = element['id'];
      _edge['shape'] = element['shape'];
      _edge['source'] = element['source'] ? element['source']['cell'] : null;
      _edge['target'] = element['target'] ? element['target']['cell'] : null;
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
    // submitData['configjson'] = JSON.stringify(dddd);
    submitData['nodejson'] = _nodes;
    submitData['edgejson'] = _edges;
    submitData['process'] = this.form1.validateForm.value;
    const d_ = {
      "code": "vocation9",
      "version": "v202109",
      "name": "wf",
      "title": "测试流程9",
      "pageID": "",
      "strict": true, // 是否强制保存(用在存在实例的流程定义), 默认值为false
      "typeId": 9, // 关联的类型id, 数字类型
      "description": "" // 描述
    }
    console.log('最终数据', submitData)
    console.log('最终数据', JSON.stringify(submitData))
    let image = {
      wfconfig: dddd,
      process: this.form1.validateForm.value
    }
    return { struct: JSON.stringify(submitData), image: JSON.stringify(image) };
  }

  public setComponentValue() {

    let cells = { "cells": [{ "position": { "x": -310, "y": -430 }, "size": { "width": 80, "height": 60 }, "attrs": { "body": { "stroke": "#237804", "fill": "#73d13d" }, "label": { "text": "开始" } }, "shape": "ellipse", "id": "dd2792e6-798b-46f0-872e-f5f1bb8bef97", "nodeType": "开始", "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 1 }, { "position": { "x": -310, "y": -255 }, "size": { "width": 80, "height": 40 }, "attrs": { "body": { "stroke": "#31d0c6", "strokeWidth": 2 }, "label": { "text": "任务节点", "fill": "#6a6c8a" } }, "shape": "rect", "id": "151ac334-a1ae-4c20-a206-bb318b120ec4", "nodeType": "任务节点", "data": { "type": "tempValue" }, "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 2 }, { "shape": "edge", "id": "80d60870-6f06-4d68-893a-f8f69795657e", "source": { "cell": "dd2792e6-798b-46f0-872e-f5f1bb8bef97", "port": "port2" }, "target": { "cell": "151ac334-a1ae-4c20-a206-bb318b120ec4", "port": "port1" }, "zIndex": 3 }] };

    this.graph.fromJSON(cells)
    this.changePortsVisible_Container(false);
  }


  // 接受消息值，无行为响应
  public transferValue(option?) {
    console.log('将接受传递的值', this.tempValue);
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

  // 无节点、边 选中
  public unSelected() {
    this.selectedRow = null;
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

  // 画布选中
  public containerSelected() {
    // this.selectedRow = null;
    this.selectedRow = {};
    return true;
  }


  public update_node(option?) {

    // 1.根据标识取出当前节点的id
    // 2.根据参数，回写节点属性
    // setAttrByPath  回写节点名称
    // updateData   回写节点缓存信息值

    if (option['$Id']) {  // 节点id

    }



  }

  cellId: any;
  cellText: any;
  public getCellById() {
    let cell = this.graph.getCellById(this.cellId)

    cell.setAttrByPath('label/text', this.cellText)
    //  cell.setAttrByPath('textWrap/text', this.cellText)
    // cell.removeAttrByPath('label'); 移除属性
    //  cell.removeAttrByPath('text');


    // textWrap: {
    //   text: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    //   width: -10,     // 宽度减少 10px
    //   height: '50%',  // 高度为参照元素高度的一半
    //   ellipsis: true, // 文本超出显示范围时，自动添加省略号
    // }

    console.log('当前节点为：', cell)
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

  /**
 * 显示消息框
 * @param option
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




  //

  /*

  【节点json 整理】

  userTask id="userTask1" name="任务名称" defaultFlow="" pageID="" timeLimit=""

  node:{
    "id":"001",
    "name":"任务1",
    "pageID":"",
    "timeLimit":"", // 时效
    "candidate":{ // 候选人信息
       "assignPolicy":{ // 策略等
        "mode":"", //fixed/variable/assigned
        "assignNum":1,
        "expressionList":[ // 指派用户的表达式, 可配置多组
          {
            "name":"表达式名称",
            "value":"表达式需要的值",
            "extendValue":"扩展信息, 提供给二次开发使用"

          }
        ]


       }

    }

  }




   */





  /**
     1.0 工作流程 分布存储
     2.0 工作流程 整体存储 
  
     流程图形操作的前置条件，将图形与相应节点等信息一次操作
  'success' | 'info' | 'warning' | 'error' | 'loading'
  this.componentService.msgService.create('warning', '');
   */

  wf_config = {

    "id": "wf_001",
    "title": "工作流程表",
    "titleIcon": "right-circle",
    "component": "cnWF",
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
      },
      {
        "id": "002",
        "text": "设置",
        "code": "222",
        "execute": []
      },
      {
        "id": "003",
        "text": "自定义操作一",
        "code": "111",
        "execute": []
      },
      {
        "id": "004",
        "text": "自定义操作二",
        "code": "222",
        "execute": []
      }
    ],
    "customStructure": {
      "setting": {
        "panels": [
          {
            "id": "panel_bese",
            "active": true,
            "disabled": false,
            "hidden": false,
            "name": '基本属性',
            "component": {
              "id": "form_bese",
              "type": "default"
            }
          },
          {
            "id": "panel_task",
            "active": true,
            "hidden": false,
            "disabled": true,
            "name": '任务节点设置',
            "component": {
              "id": "form_task",
              "type": "condition",
              "caseValue": {
                "type": "tempValue",
                "valueName": "nodeType",
                "regular": "^任务节点$",
                "value": ""
              }
            }
          },
          {
            "id": "panel_begin",
            "active": true,
            "hidden": false,
            "disabled": false,
            "name": '开始节点设置',
            "component": {
              "id": "form_begin",
              "type": "condition",
              "caseValue": {
                "type": "tempValue",
                "valueName": "nodeType",
                "regular": "^开始节点$",
                "value": ""
              }
            }
          },
          {
            "id": "panel_edge",
            "active": true,
            "hidden": false,
            "disabled": false,
            "name": '连线设置',
            "component": {
              "id": "form_edge",
              "type": "condition",
              "caseValue": {
                "type": "tempValue",
                "valueName": "nodeType",
                "regular": "^连线$",
                "value": ""
              }
            }
          }
        ],
        "components": {
          "form_bese": {
            "id": "form_bese",
            "type": "form",
            "component": "form",
            "state": "text",
            "enableLoadStaticData": true,
            "staticDataConfig": {
              "name": "data",
              "type": "tempValue",
              "valueName": "base_attr_data"
            },
            "loadingConfig": {
              "id": "loadform"
            },
            "formLayout": {
              "id": "b86s2i",
              "type": "layout",
              "title": "表单布局b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0m3",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0m3",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "001"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "004"
                      }
                    },
                    {
                      "id": "foj0dV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "003"
                      }
                    }
                  ]
                }
              ]
            },
            "formControls": [
              {
                "id": "001",
                "hidden": true,
                "title": "id",
                "titleConfig": {
                  "required": false
                },
                "field": "id",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "id"
                },
                "editor": {
                  "type": "label",
                  "field": "id"
                }
              },
              {
                "id": "003",
                "hidden": true,
                "title": "名称",
                "titleConfig": {
                  "required": false
                },
                "field": "text",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "text"
                },
                "editor": {
                  "field": "text",
                  "type": "input",
                  "placeholder": "节点名称",
                }
              },
              {
                "id": "004",
                "hidden": true,
                "title": "类型",
                "titleConfig": {
                  "required": false
                },
                "field": "nodeType",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "nodeType"
                },
                "editor": {
                  "field": "nodeType",
                  "type": "label",
                  "placeholder": "节点名称",
                }
              }
            ],
            "formControlsPermissions": [
              {
                "formState": "text",
                "isLoad": true,
                "Controls": [
                  {
                    "id": "001",
                    "state": "text",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "003",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "004",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  }

                ]
              }
            ],
            "ajaxConfig": [
              {
                "id": "loadform",
                "url": "resource/GET_DEPARTMENT_DTL/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "ID",
                    "type": "tempValue",
                    "valueName": "PID",
                    "value": "-999"
                  }
                ],
                "outputParameters": [],
                "result": []
              }
            ],
            "cascade": {
              "messageSender": [],
              "messageReceiver": [
              ]
            },
            "cascadeValue": []

          },
          "form_task": {
            "id": "form_task",
            "type": "form",
            "component": "form",
            "state": "text",
            "loadingConfig": {
              "id": "loadform"
            },
            "enableLoadStaticData": true,
            "staticDataConfig": {
              "name": "data",
              "type": "tempValue",
              "valueName": "base_setting_data"
            },
            "formLayout": {
              "id": "b86s2i",
              "type": "layout",
              "title": "表单布局b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "003"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "004"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "005"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "006"
                      }
                    },
                    {
                      "id": "iod0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "007"
                      }
                    },
                    {
                      "id": "ioj0dV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "008"
                      }
                    },
                    {
                      "id": "i3j0dV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "009"
                      }
                    }
                  ]
                }
              ]
            },
            "formControls": [
              {
                "id": "001",
                "hidden": true,
                "title": "ID",
                "titleConfig": {
                  "required": false
                },
                "field": "ID",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "ID"
                },
                "editor": {
                  "type": "label",
                  "field": "ID"
                }
              },
              {
                "id": "003",
                "hidden": true,
                "title": "审批用户类型",
                "titleConfig": {
                  "required": false
                },
                "field": "CKTYPE",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "CKTYPE"
                },
                "editor": {
                  "type": "select",
                  "field": "CKTYPE",
                  "options": [
                    {
                      "label": "人员",
                      "value": 0,
                      "disabled": false
                    },
                    {
                      "label": "角色",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "部门",
                      "value": 2,
                      "disabled": false
                    }
                  ],
                  "showSearch": false,
                  "serverSearch": false
                }
              },
              {
                "id": "004",
                "hidden": true,
                "title": "审批人",
                "titleConfig": {
                  "required": false
                },
                "field": "APPROVERS",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "APPROVERS"
                },
                "editor": {
                  "type": "input",
                  "field": "APPROVERS",
                  "placeholder": "审批人员",
                }
              },
              {
                "id": "005",
                "hidden": true,
                "title": "审批角色",
                "titleConfig": {
                  "required": false
                },
                "field": "CKTYPEI",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "CKTYPEI"
                },
                "editor": {
                  "type": "select",
                  "field": "CKTYPEI",
                  "placeholder": "审批角色",
                  "labelName": "SIR_NAME",
                  "valueName": "SIR_CODE",
                  "showSearch": false,
                  "serverSearch": false,
                  "loadingConfig": {
                    "id": "loadformselectRole"
                  }

                }
              },
              {
                "id": "006",
                "hidden": true,
                "title": "审批部门",
                "titleConfig": {
                  "required": false
                },
                "field": "APPROVALORG",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "APPROVALORG"
                },
                "editor": {
                  "type": "treeSelect",
                  "field": "APPROVALORG",
                  "placeholder": "审批部门",
                  "asyncData": false,  // 是否异步 默认是false
                  "keyId": "ID",
                  "loadingConfig": {
                    "id": "loadformselectDept"
                  },
                  "columns": [
                    {
                      "title": "ID",
                      "type": "key",
                      "field": "ID"
                    },
                    {
                      "title": "PARENT_ID",
                      "type": "parentId",
                      "field": "PARENT_ID"
                    },
                    {
                      "title": "NAME",
                      "type": "title",
                      "field": "NAME"
                    }
                  ]
                }
              },
              {
                "id": "007",
                "hidden": true,
                "title": "会签策略",
                "titleConfig": {
                  "required": false
                },
                "field": "SIGNTACTICS",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "SIGNTACTICS"
                },
                "editor": {
                  "type": "select",
                  "field": "SIGNTACTICS",
                  "options": [
                    {
                      "label": "不会签",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "会签",
                      "value": 2,
                      "disabled": false
                    }
                  ],
                  "showSearch": false,
                  "serverSearch": false
                }
              },
              {
                "id": "008",
                "hidden": true,
                "title": "审批策略",
                "titleConfig": {
                  "required": false
                },
                "field": "APPROVALTACTICS",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "APPROVALTACTICS"
                },
                "editor": {
                  "type": "select",
                  "field": "APPROVALTACTICS",

                  "options": [
                    {
                      "label": "单人通过",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "全员通过",
                      "value": 2,
                      "disabled": false
                    },
                    {
                      "label": "按照比例通过",
                      "value": 3,
                      "disabled": false
                    }
                  ],
                  "showSearch": false,
                  "serverSearch": false
                }
              },
              {
                "id": "009",
                "hidden": true,
                "title": "策略百分比",
                "titleConfig": {
                  "required": false
                },
                "field": "APPROVALNUM",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "APPROVALNUM"
                },
                "editor": {
                  "type": "input",
                  "field": "APPROVALNUM",
                  "placeholder": "策略百分比",
                }
              }



            ],
            "formControlsPermissions": [
              {
                "formState": "text",
                "isLoad": true,
                "Controls": [
                  {
                    "id": "001",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "003",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "004",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "005",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "006",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "007",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "008",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "009",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  }
                ]
              }
            ],
            "ajaxConfig": [
              {
                "id": "loadform",
                "url": "resource/GET_DEPARTMENT_DTL/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "ID",
                    "type": "tempValue",
                    "valueName": "PID",
                    "value": "-999"
                  }
                ],
                "outputParameters": [],
                "result": []
              },
              {
                "id": "loadformselectRole",
                "url": "resource/SMT_IMP_ROLE/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                ]
              },
              {
                "id": "loadformselectDept",
                "url": "resource/GET_SYSTEM_DEPT/query",
                "method": "get",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "_recursive",
                    "type": "value",
                    "value": true
                  },
                  {
                    "name": "_deep",
                    "type": "value",
                    "value": "-1"
                  },
                  {
                    "name": "_pcName",
                    "type": "value",
                    "value": "PARENT_ID"
                  },
                  {
                    "name": "_sort",
                    "type": "value",
                    "value": "CREATE_DATE"
                  }
                ]
              }
            ],
            "cascade": {
              "messageSender": [],
              "messageReceiver": [
              ]
            },
            "cascadeValue": []

          },
          "form_begin": {
            "id": "form_begin",
            "type": "form",
            "component": "form",
            "state": "text",
            "loadingConfig": {
              "id": "loadform"
            },
            "enableLoadStaticData": true,
            "staticDataConfig": {
              "name": "data",
              "type": "tempValue",
              "valueName": "base_setting_data_begin"
            },
            "formLayout": {
              "id": "b86s2i",
              "type": "layout",
              "title": "表单布局b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "003"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "004"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "005"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "006"
                      }
                    }

                  ]
                }
              ]
            },
            "formControls": [
              {
                "id": "001",
                "hidden": true,
                "title": "ID",
                "titleConfig": {
                  "required": false
                },
                "field": "ID",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "ID"
                },
                "editor": {
                  "type": "label",
                  "field": "ID"
                }
              },
              {
                "id": "003",
                "hidden": true,
                "title": "审批类型",
                "titleConfig": {
                  "required": false
                },
                "field": "TYSE_RESOUCE_TYPE",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "TYSE_RESOUCE_TYPE"
                },
                "editor": {
                  "type": "select",
                  "field": "TYSE_RESOUCE_TYPE",
                  "options": [
                    {
                      "label": "表单审批",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "业务数据审批",
                      "value": 2,
                      "disabled": false
                    }
                  ],
                  "showSearch": false,
                  "serverSearch": false
                }
              },
              {
                "id": "004",
                "hidden": true,
                "title": "关联模块",
                "titleConfig": {
                  "required": false
                },
                "field": "TYSE_PROCESS_TYPE",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "TYSE_PROCESS_TYPE"
                },
                "editor": {
                  "type": "treeSelect",
                  "field": "TYSE_PROCESS_TYPE",
                  "placeholder": "关联模块",
                  "asyncData": false,  // 是否异步 默认是false
                  "keyId": "ID",
                  "loadingConfig": {
                    "id": "loadformselectMenu"
                  },
                  "columns": [
                    {
                      "title": "ID",
                      "type": "key",
                      "field": "ID"
                    },
                    {
                      "title": "PID",
                      "type": "parentId",
                      "field": "PID"
                    },
                    {
                      "title": "NAME",
                      "type": "title",
                      "field": "NAME"
                    }
                  ]
                }
              },
              {
                "id": "005",
                "hidden": true,
                "title": "关联页面json",
                "titleConfig": {
                  "required": false
                },
                "field": "TYSE_RESOUCE_JSON",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "TYSE_RESOUCE_JSON"
                },
                "editor": {
                  "type": "treeSelect",
                  "field": "TYSE_RESOUCE_JSON",
                  "placeholder": "请输入",
                  "asyncData": true,
                  "keyId": "ID",
                  "loadingConfig": {
                    "id": "loadPageTree"
                  },
                  "expandConfig": {
                    "id": "loadPageTreeExpand"
                  },
                  "loadingItemConfig": {
                    "id": "loadMenuPageitem"
                  },
                  "columns": [
                    {
                      "title": "ID",
                      "type": "key",
                      "field": "ID"
                    },
                    {
                      "title": "PID",
                      "type": "parentId",
                      "field": "PID"
                    },
                    {
                      "title": "NAME",
                      "type": "title",
                      "field": "NAME"
                    }
                  ]

                }
              },
              {
                "id": "006",
                "hidden": true,
                "title": "关联API",
                "titleConfig": {
                  "required": false
                },
                "field": "TYSE_MODULE_API",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "TYSE_MODULE_API"
                },
                "editor": {
                  "type": "input",
                  "field": "TYSE_MODULE_API",
                  "placeholder": "关联API"
                }
              }



            ],
            "formControlsPermissions": [
              {
                "formState": "text",
                "isLoad": true,
                "Controls": [
                  {
                    "id": "001",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "003",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "004",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "005",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "006",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  }
                ]
              }
            ],
            "ajaxConfig": [

              {
                "id": "loadformselectMenu",
                "url": "resource/GET_SYS_MENU_TREE/query",
                "method": "get",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "_recursive",
                    "type": "value",
                    "value": true
                  },
                  {
                    "name": "_deep",
                    "type": "value",
                    "value": "-1"
                  },
                  {
                    "name": "_pcName",
                    "type": "value",
                    "value": "PID"
                  }
                ]
              },
              {
                "id": "loadMenuPageitem",
                "url": "resource/GET_SMT_PAGE_LAYOUT_TREE/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "ID",
                    "type": "componentValue",
                    "valueName": "value"
                  }
                ],
                "outputParameters": [],
                "result": []
              },
              {
                "id": "loadPageTree",
                "url": "resource/GET_SMT_PAGE_LAYOUT_TREE/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "_recursive",
                    "type": "value",
                    "value": true
                  },
                  {
                    "name": "_deep",
                    "type": "value",
                    "value": "2"
                  },
                  {
                    "name": "_pcName",
                    "type": "value",
                    "value": "PID"
                  }
                ],
                "outputParameters": [],
                "result": []
              },
              {
                "id": "loadPageTreeExpand",
                "url": "resource/GET_SMT_PAGE_LAYOUT_TREE/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "_recursive",
                    "type": "value",
                    "value": true
                  },
                  {
                    "name": "_deep",
                    "type": "value",
                    "value": "2"
                  },
                  {
                    "name": "_pcName",
                    "type": "value",
                    "value": "PID"
                  },
                  {
                    "name": "_root.PID",
                    "type": "item",
                    "valueName": "key"
                  }
                ],
                "outputParameters": [],
                "result": []
              },
              {
                "id": "loadMenuPageTree",
                "url": "resource/GET_MENU_PAGE_TREE/query",
                "urlType": "inner",
                "ajaxType": "get",
                "params": [
                  {
                    "name": "_recursive",
                    "type": "value",
                    "value": true
                  },
                  {
                    "name": "_deep",
                    "type": "value",
                    "value": "-1"
                  },
                  {
                    "name": "_pcName",
                    "type": "value",
                    "value,": "PARENT_ID"
                  },
                  {
                    "name": "_root.MENU_ID",
                    "type": "tempValue",
                    "valueName": "MENU_ID"
                  }
                ],
                "outputParameters": [],
                "result": []
              }
            ],
            "cascade": {
              "messageSender": [],
              "messageReceiver": [
              ]
            },
            "cascadeValue": []

          },
          "form_edge": {
            "id": "form_edge",
            "type": "form",
            "component": "form",
            "state": "text",
            "loadingConfig": {
              "id": "loadform"
            },
            "enableLoadStaticData": true,
            "staticDataConfig": {
              "name": "data",
              "type": "tempValue",
              "valueName": "base_setting_data_edge"
            },
            "formLayout": {
              "id": "b86s2i",
              "type": "layout",
              "title": "表单布局b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "003"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "004"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "005"
                      }
                    },
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "列ioj0mV",
                      "span": 24,
                      "layoutContain": "input",
                      "size": {
                        "nzXs": 24,
                        "nzSm": 24,
                        "nzMd": 24,
                        "nzLg": 24,
                        "ngXl": 24,
                        "nzXXl": 24
                      },
                      "control": {
                        "id": "006"
                      }
                    }

                  ]
                }
              ]
            },
            "formControls": [
              {
                "id": "001",
                "hidden": true,
                "title": "ID",
                "titleConfig": {
                  "required": false
                },
                "field": "ID",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "ID"
                },
                "editor": {
                  "type": "label",
                  "field": "ID"
                }
              },
              {
                "id": "003",
                "hidden": true,
                "title": "前置条件",
                "titleConfig": {
                  "required": false
                },
                "field": "WHERESTR",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "WHERESTR"
                },
                "editor": {
                  "type": "input",
                  "field": "WHERESTR",
                  "placeholder": "前置条件"
                }
              },
              {
                "id": "004",
                "hidden": true,
                "title": "前置条件状态",
                "titleConfig": {
                  "required": false
                },
                "field": "WHERTSTATE",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "WHERTSTATE"
                },
                "editor": {
                  "type": "input",
                  "field": "WHERTSTATE",
                  "displayType": "number",
                  "placeholder": "前置条件状态"

                }
              },
              {
                "id": "005",
                "hidden": true,
                "title": "启用前置条件",
                "titleConfig": {
                  "required": false
                },
                "field": "WHERETACTICS",
                "labelSize": {
                  "span": 4,
                  "nzXs": 4,
                  "nzSm": 4,
                  "nzMd": 4,
                  "nzLg": 4,
                  "ngXl": 4,
                  "nzXXl": 4
                },
                "controlSize": {
                  "span": 14,
                  "nzXs": 14,
                  "nzSm": 14,
                  "nzMd": 14,
                  "nzLg": 14,
                  "ngXl": 14,
                  "nzXXl": 14
                },
                "state": "text",
                "text": {
                  "type": "label",
                  "field": "WHERETACTICS"
                },
                "editor": {
                  "type": "select",
                  "field": "WHERETACTICS",
                  "options": [
                    {
                      "label": "启用",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "无条件通过",
                      "value": 2,
                      "disabled": false
                    }
                  ],
                  "showSearch": false,
                  "serverSearch": false
                }
              }



            ],
            "formControlsPermissions": [
              {
                "formState": "text",
                "isLoad": true,
                "Controls": [
                  {
                    "id": "001",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "003",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "004",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  },
                  {
                    "id": "005",
                    "state": "edit",
                    "hidden": false,
                    "readOnly": false
                  }
                ]
              }
            ],
            "ajaxConfig": [
            ],
            "cascade": {
              "messageSender": [],
              "messageReceiver": [
              ]
            },
            "cascadeValue": []

          }

        }

      }
    }

  }


  public inner_action(btn?) {
    if (btn['execute']) {
      btn['execute'].forEach(element => {
        this[element['trigger']](element);
      });
    }
  }


  // 右键事件响应
  dropdown_change(code) {
    console.log(code);
    this.attr_setting();
  }

  // CnFlowAttrSettingComponent


  setting_dialog: any;
  public attr_setting(option?) {

    const dialogCfg = {
      title: '属性设置',
      width: "80%",
      style: null,
      maskClosable: false,
      cancelText: '取消',
      okText: '确定',
      config: this.config.customStructure.setting,
      enableCustomFooter: true

    }

    let dialog;


    let _data = null;
    let _dataResouce = null;
    let _assignPolicy = null;
    let _handlePolicy = null;
    let _gateway = null;

    let _option = null;
    if (this.currentRowData) {
      if (this.currentRowData.hasOwnProperty('nodeData')) {
        _data = this.currentRowData['nodeData'];
      }
      if (this.currentRowData.hasOwnProperty('nodeResouce')) {
        _dataResouce = this.currentRowData['nodeResouce'];
      }
      if (this.currentRowData.hasOwnProperty('nodeAssignPolicy')) {
        _assignPolicy = this.currentRowData['nodeAssignPolicy']
      }
      if (this.currentRowData.hasOwnProperty('nodeHandlePolicy')) {
        _handlePolicy = this.currentRowData['nodeHandlePolicy']
      }
      if (this.currentRowData.hasOwnProperty('nodeOption')) {
        _option = this.currentRowData['nodeOption']
      }
      if (this.currentRowData.hasOwnProperty('nodeGateway')) {
        _gateway = this.currentRowData['nodeGateway']
      }
    }


    let changeValue = [
      {
        "name": "nodeType",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": this.currentRow['nodeType']
      },
      {
        "name": "base_attr_data",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": this.currentRow
      },
      {
        "name": "base_setting_data",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": _data
      },
      {
        "name": "base_setting_data_begin",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": _dataResouce
      },
      {
        "name": "base_setting_assignPolicy",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": _assignPolicy
      },
      {
        "name": "base_setting_handlePolicy",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": _handlePolicy
      },
      {
        "name": "base_setting_gateway",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": _gateway
      },

      {
        "name": "base_setting_option",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": _option
      },
      {
        "name": "base_setting_data_edge",
        "type": "item",
        "valueName": "id",
        "valueTo": "tempValue",
        "value": this.currentRowData
      }
    ]


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
      nzContent: components['flowAttrSettingMore'],
      nzComponentParams: {
        config: dialogCfg.config,
        valueConfig: this.config.columns,
        changeValue: changeValue ? changeValue : [],
        enableCustomFooter: true,
        dialog: this
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
            if (componentInstance.sons._results) {
              componentInstance.sons._results.forEach(element => {
                dialog_data[element['config']['id']] = element['formValue'];

              });
              console.log('分组表单包含', componentInstance.sons._results, dialog_data)
            }

            let cell = this.graph.getCellById(dialog_data['form_bese']['id'])

            if (cell.isNode()) {
              cell.setAttrByPath('label/text', dialog_data['form_bese']['text'])

              let nodedata = {
                nodeData: dialog_data['form_task'],
                nodeResouce: dialog_data['form_begin'],
                nodeAssignPolicy: dialog_data['form_assignPolicy'], // 指派用户
                nodeHandlePolicy: dialog_data['form_handlePolicy'], // 认领策略
                nodeOption: dialog_data['form_option'], // 操作设置
                nodeGateway: dialog_data['form_Gateway'], // 网关设置
                nodeBegin: dialog_data['form_begin'] // 网关设置


              }
              cell.updateData(nodedata);
            } else {
              //cell.setAttrByPath('label/text', '4444444444');
              cell.setLabels([
                {
                  attrs: {
                    text: {
                      text: dialog_data['form_bese']['text'],
                    },
                  },
                },
              ]);
              // cell['store']['data']['labels'][0]['attrs']['text']['text'] = dialog_data['form_bese']['text'];
              cell.updateData(dialog_data['form_edge']);
            }



            dialog.close();

          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
    this.setting_dialog = dialog;

  }



  public onTestSave() {
    this.getComponentValue();


    let save_config = {
      "id": "tree_add_func1",
      "url": "cfgBusiModel/YCL_BARCODE_SEL/query",
      "urlType": "inner",
      "ajaxType": "post",
      "params": [



      ],
      "outputParameters": [],
      "result": [
        {
          "name": "data",
          "showMessageWithNext": 0,
          "message": "message.ajax.state.success",
          "senderId": "aftetFuncSaveSuccessfully"
        }
      ]
    }


    // B_WF_SAVEFLOW
    // (
    //     @ID nvarchar(50), 
    //   @CONFIGJSON nvarchar(max),
    //   @NODESJSON  nvarchar(max),
    //   @EDGESJSON nvarchar(max)
    // )

    let dd = {
      "id": "aftetFuncSaveSuccessfully",
      "senderId": "tree_page",
      "sendData": [
        {
          "beforeSend": {},
          "reveicerId": "",
          "receiverTriggerType": "ACTION",
          "receiverTrigger": "MESSAGE",
          "params": [
            {
              "name": "type",
              "type": "value",
              "value": "success"
            },
            {
              "name": "code",
              "type": "value",
              "value": "新增成功"
            }
          ]
        }
      ]
    }

    let d1 = {
      "id": "s_201",
      "senderId": "tree_page",
      "receiveData": [
        {
          "triggerType": "ACTION",
          "trigger": "MESSAGE"
        }
      ]
    }

    let ddd = {
      "cascade": {
        "messageSender": [
          {
            "id": "aftetFuncSaveSuccessfully",
            "senderId": "wf_001",
            "sendData": [
              {
                "beforeSend": {},
                "reveicerId": "",
                "receiverTriggerType": "ACTION",
                "receiverTrigger": "MESSAGE",
                "params": [
                  {
                    "name": "type",
                    "type": "value",
                    "value": "success"
                  },
                  {
                    "name": "code",
                    "type": "value",
                    "value": "保存成功"
                  }
                ]
              }
            ]
          }
        ],
        "messageReceiver": [
          {
            "id": "s_201",
            "senderId": "wf_001",
            "receiveData": [
              {
                "triggerType": "ACTION",
                "trigger": "MESSAGE"
              }
            ]
          }
        ]
      }
    }
    this.executeModal(save_config);
  }



  //=========【功能实验、复杂结构表单】============
  validateForm!: FormGroup;

  public test_form() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      connection: this.fb.group({
        url: [null, [Validators.email, Validators.required]],
        expressionList: [[{ "name": "ff" }], [Validators.email, Validators.required]]
      }),
      stageContent: this.fb.array([
        this.fb.group({
          etcName: new FormControl(null, Validators.required),
          date: new FormControl(null, Validators.required)
        })
      ])
    });


  }
  dataSet: any[] = [];

  public test_to_form() {
    console.log('====>', this.validateForm);
  }

  testArryCopy = [
    { option: "第一场" },
    { option: "第二场" }
  ];
  get testArrFormArray() {
    return this.validateForm.controls['stageContent'] as FormArray;
  }

  creatRow() {
    return this.fb.group({
      etcName: [null, [Validators.required]],
      date: [null, [Validators.required]]
    });
  }

  add() {
    this.dataSet.push({ "name": 'fddfdfdf' });
    this.dataSet = this.dataSet.filter(d => d.name !== "i");
  }

  //新增组合
  addItem() {
    this.testArrFormArray.push(this.creatRow());
  }
  //刪除组合
  delItem(i) {
    this.testArrFormArray.removeAt(i);
  }

  test_del(i?) {
    console.log("xxxxxx", i);
  }


  form_process_config = {
    "id": "form_process_1",
    "type": "form",
    "component": "form",
    "state": "text",
    "loadingConfig": {
      "id": "loadform"
    },
    "enableLoadStaticData": true,
    "staticDataConfig": {
      "name": "data",
      "type": "tempValue",
      "valueName": "base_setting_data_process"
    },
    "formLayout": {
      "id": "b86s2i",
      "type": "layout",
      "title": "表单布局b86s2i",
      "rows": [
        {
          "id": "MefhXa",
          "type": "row",
          "cols": [
            {
              "id": "ioj0mV",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "002"
              }
            },
            {
              "id": "ioj0mV3",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "003"
              }
            },
            {
              "id": "ioj0mV4",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "004"
              }
            },
            {
              "id": "ioj0mV5",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "005"
              }
            },
            {
              "id": "ioj0mV6",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "006"
              }
            },
            {
              "id": "ioj0mV7",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "007"
              }
            },
            {
              "id": "ioj0mV8",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "008"
              }
            },
            {
              "id": "ioj0mV9",
              "col": "cc",
              "type": "col",
              "title": "列ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "009"
              }
            }
          ]
        }
      ]
    },
    "formControls": [
      {
        "id": "001",
        "hidden": true,
        "title": "ID",
        "titleConfig": {
          "required": false
        },
        "field": "ID",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "ID"
        },
        "editor": {
          "type": "label",
          "field": "ID"
        }
      },
      {
        "id": "002",
        "hidden": true,
        "title": "类型id",

        "titleConfig": {
          "required": false
        },
        "field": "typeId",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "typeId"
        },
        "editor": {
          "type": "label",
          "field": "typeId",
          "placeholder": "页面",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "003",
        "hidden": true,
        "title": "是否强制保存",

        "titleConfig": {
          "required": false
        },
        "field": "strict",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "strict"
        },
        "editor": {
          "type": "switch",
          "field": "strict",
          "placeholder": "页面",
          "off": false,
          "on": true,
          "options": [
            { "type": "check", "lable": "是", "value": true },
            { "type": "close", "lable": "否", "value": false }
          ]
        }
      },


      {
        "id": "004",
        "hidden": true,
        "title": "编号",

        "titleConfig": {
          "required": false
        },
        "field": "code",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "code"
        },
        "editor": {
          "type": "input",
          "field": "code",
          "placeholder": "编号",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "005",
        "hidden": true,
        "title": "版本",

        "titleConfig": {
          "required": false
        },
        "field": "version",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "version"
        },
        "editor": {
          "type": "input",
          "field": "version",
          "placeholder": "版本",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "006",
        "hidden": true,
        "title": "名称",

        "titleConfig": {
          "required": false
        },
        "field": "name",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "name"
        },
        "editor": {
          "type": "input",
          "field": "name",
          "placeholder": "名称",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "007",
        "hidden": true,
        "title": "标题",

        "titleConfig": {
          "required": false
        },
        "field": "title",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "title"
        },
        "editor": {
          "type": "input",
          "field": "title",
          "placeholder": "标题",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "008",
        "hidden": true,
        "title": "页面",

        "titleConfig": {
          "required": false
        },
        "field": "pageID",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "pageID"
        },
        "editor": {
          "type": "textarea",
          "field": "pageID",
          "placeholder": "页面",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "009",
        "hidden": true,
        "title": "描述",
        "titleConfig": {
          "required": false
        },
        "field": "description",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "description"
        },
        "editor": {
          "type": "textarea",
          "field": "description",
          "placeholder": "描述",
          "autosize": {
            "minRows": 2,
            "maxRows": 5
          }
        }
      }






    ],
    "formControlsPermissions": [
      {
        "formState": "text",
        "isLoad": false,
        "Controls": [
          {
            "id": "001",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "002",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "003",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "004",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "005",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "006",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "007",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "008",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "009",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          }
        ]
      }
    ],
    "ajaxConfig": [],
    "cascade": {
      "messageSender": [],
      "messageReceiver": []
    },
    "cascadeValue": []
  }



}
