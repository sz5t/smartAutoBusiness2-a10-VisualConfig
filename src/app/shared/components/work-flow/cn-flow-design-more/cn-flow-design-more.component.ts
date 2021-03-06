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
  public options: any; // ??????????????????

  isCollapsed = false;
  selectedRow: any;
  currentRow: any;
  currentRowData: any;

  public COMPONENT_NAME = 'CnFlowPreview';
  /**
   * ????????????????????????
   * ???????????????????????????
   */
  public COMPONENT_METHODS = CN_FLOW_PREVIEW_METHOD;

  public COMPONENT_PROPERTY = CN_FLOW_PREVIEW_PROPERTY;
  public FORM_VALUE: any = {}; // ?????????????????????
  public FORM_STATE: any; // ???????????????=???????????????????????????
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
        nodeType: '????????????',
        nodeTypeText: '????????????',
        nodeSubType: 'startEvent',
        attrs: {
          body: {
            stroke: '#237804',
            fill: '#73d13d',
          },
          label: {
            text: '??????'
          },
        },
        ports: {
          groups: {
            // ???????????????????????????
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
            // ???????????????????????????
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
        shape: 'rect', // ?????? rect ??????
        x: 60,
        y: 150,
        width: 80,
        height: 40,
        nodeType: '????????????',
        nodeTypeText: '????????????',
        nodeSubType: 'userTask',
        attrs: {
          label: {
            text: '????????????',
            fill: '#6a6c8a',
          },
          body: {
            stroke: '#31d0c6',
            strokeWidth: 2,
          },
        },
        ports: {
          groups: {
            // ???????????????????????????
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
            // ???????????????????????????
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
        nodeType: '????????????',
        nodeTypeText: '????????????',
        nodeSubType: 'endEvent',
        attrs: {
          label: {
            text: '??????',
          },
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
          },
        },
        ports: {
          groups: {
            // ???????????????????????????
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
            // ???????????????????????????
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
        nodeType: '????????????',
        nodeTypeText: '????????????',
        nodeSubType: 'exclusiveGateway',
        attrs: {
          body: {
            // fill: '#efdbff',  // ????????????
            stroke: '#31d0c6',
            // ?????? refPoints ???????????????????????????????????????????????????
            // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
            refPoints: '0,10 10,0 20,10 10,20',
          },
          label: {
            text: '????????????'
          },
        },
        ports: {
          groups: {
            // ???????????????????????????
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
            // ???????????????????????????
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
        nodeType: '????????????',
        nodeTypeText: '????????????',
        nodeSubType: 'parallelGateway',
        attrs: {
          body: {
            // fill: '#efdbff',  // ????????????
            stroke: '#31d0c6',
            // ?????? refPoints ???????????????????????????????????????????????????
            // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
            refPoints: '0,10 10,0 20,10 10,20',
          },
          label: {
            text: '????????????'
          },
        },
        ports: {
          groups: {
            // ???????????????????????????
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
            // ???????????????????????????
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
        nodeType: '????????????',
        nodeTypeText: '????????????',
        nodeSubType: 'inclusiveGateway',
        attrs: {
          body: {
            // fill: '#efdbff',  // ????????????
            stroke: '#31d0c6',
            // ?????? refPoints ???????????????????????????????????????????????????
            // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
            refPoints: '0,10 10,0 20,10 10,20',
          },
          label: {
            text: '????????????'
          },
        },
        ports: {
          groups: {
            // ???????????????????????????
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
            // ???????????????????????????
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
        nodeMovable: false // ???????????????????????????
      },
      background: {
        color: '#F4F4F4', // ????????????????????????
      },
      grid: {
        size: 10,      // ???????????? 10px
        visible: false, // ??????????????????
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
    // ?????????
    this.changePortsVisible_check(false);


    this.graph = new Graph({
      container: this.refContainer.nativeElement,
      width: _width,
      height: _height + 100,
      resizing: true, // ???????????????
      grid: true,
      history: true,
      // history: {
      //   // enable: true,
      //   ignoreAdd: true,
      //   ignoreRemove: true,
      //   ignoreChange: true,
      // },
      clipboard: {  // ??????
        enabled: true,
        useLocalStorage: true,
      },
      selecting: { // ??????
        enabled: true,
        showNodeSelectionBox: false,
      },
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: false,   // ??????   ??????????????????????????????????????????????????????????????????
        pageVisible: false,
        pageBreak: false,
        pannable: true, // ????????????????????????????????????????????????????????????????????????????????????
      },
      connecting: { // ??????
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
          if (a.edge.store.data.target['cell']) {  // ???????????????
            if (a.edge.store.data.target['cell'] === a.edge.store.data.source['cell']) { // ???????????????????????????
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
        // ?????????????????????????????????????????????????????????
        const source = edge.getSourceCell()
        console.log('??????', source);
        edge['store']['data']['nodeType'] = '??????';
        edge['store']['data']['nodeTypeText'] = '??????';
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
        console.log('????????????');
      }
    })

    this.graph.on('edge:change:target', (a: any) => {

      console.log('change__??????', a);

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
          // {   // ????????????
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

      // ????????????Data??????
      // node.updateData({ "name": "dd" });
      this.nodeSelected(node);
    })

    // ????????????
    this.graph.on('cell:contextmenu', ({ e, cell }) => {

      let d = {
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY
      };

      console.log('??????????????????', d);
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
      console.log('????????????????????????====', cell, this.currentRow);

      this.contextMenu(d, this.menu)
    })

    this.graph.on('blank:contextmenu', ({ e }) => {
      let d = {
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY
      };
      this.currentRow = {
        'id': this.cellId, 'text': this.cellText ? this.cellText : "", "nodeType": "process",
        "nodeTypeText": "??????",
        "nodeSubType": "process"
      }

      //, 'data': cell.getData()
      this.currentRowData = {};
      console.log('???????????????????????????====', this.currentRow);

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

    // ????????????
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

    // ????????????
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
        // ???????????? get ???????????????????????????????????????dataset ????????????????????????????????????????????????
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
          "strict": false, // ??????????????????(?????????????????????????????????), ????????????false
          "typeId": this.tempValue['TYPE_ID'], // ???????????????id, ????????????
          "description": null // ??????
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
        "strict": false, // ??????????????????(?????????????????????????????????), ????????????false
        "typeId": this.tempValue['TYPE_ID'], // ???????????????id, ????????????
        "description": null // ??????
      };

      // this.form1.tempValue['base_attr_data'] = v;
      this.form1.load();
    }

    console.log('?????????????????????===?????????', data_form)

    return true;
  }


  public buildUserInfo(data?, userConfig?) {
    const userInfo = {};
    userConfig.forEach((item) => {
      let valueItem: any;
      if (item.type === 'returnValue') {
        // str=???jpg|bmp|gif|ico|png???; arr=str.split(???|???);
        let strs: any[]; // ???????????????
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
              // ??????
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
    // ??????????????????
    this.unsubscribeRelation();
    // ????????????????????????
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    // ?????????????????????
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
 * setChangeValue ?????? ???????????????
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
   *  ??????????????????
   */
  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (!this._sender_source$) {
        // ??????????????????????????????,???????????????????????????
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // ????????????????????????,???????????????????????????
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
      console.log('????????????');
      // message.success('????????????')
    } else {
      // message.info('???????????????????????????')
      console.log('???????????????????????????');
      this.componentService.msgService.create('warning', '???????????????????????????');
    }
  }

  onPaste = (option?) => {
    if (this.graph.isClipboardEmpty()) {
      // message.info('??????????????????????????????')
      console.log('??????????????????????????????');
      this.componentService.msgService.create('warning', '??????????????????????????????');
    } else {
      const cells = this.graph.paste(this.options)

      this.graph.cleanSelection()
      this.graph.select(cells)
      console.log('????????????');
      //  message.success('????????????')
    }
  }


  onDelete = (option?) => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      //removed

      this.componentService.modalService.confirm({
        nzTitle: '??????',
        nzContent: '<b style="color: red;">???????????????????</b>',
        nzOkText: '??????',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.graph.removeNode(cells[0]);
          console.log('????????????');
        },
        nzCancelText: '??????',
        nzOnCancel: () => console.log('Cancel')
      });
      // message.success('????????????')
    } else {
      // message.info('???????????????????????????')
      console.log('???????????????????????????');
      this.componentService.msgService.create('warning', '???????????????????????????');
    }
  }


  // ???????????????????????????
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



  // ??????id ????????????
  public Get_Cell(id?): any {
    let cell = this.graph.getCell();
    return cell;
  }




  public h() {

    // ??????????????????
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


    console.log('???', edges, 'V1.0:', _edges);
    console.log('??????', nodes, 'V1.0:', _nodes);
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

    console.log('????????????', submitData)
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

      if (element['nodeType'] === '????????????') {
        if (element['data']) {
          _node['data'] = {};

          _node['data']['variableExtend'] = element['data']['nodeGateway'];
        } else {
          _node['data'] = null;
        }
      }
      if (element['nodeType'] === '????????????') {
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
      if (element['nodeType'] === '????????????') {
        if (element['data']) {
          _node['data'] = element['data']['nodeBegin'];
        } else {
          _node['data'] = null;
        }

      }
      if (element['nodeType'] === '????????????') {
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
      "title": "????????????9",
      "pageID": "",
      "strict": true, // ??????????????????(?????????????????????????????????), ????????????false
      "typeId": 9, // ???????????????id, ????????????
      "description": "" // ??????
    }
    console.log('????????????', submitData)
    console.log('????????????', JSON.stringify(submitData))
    let image = {
      wfconfig: dddd,
      process: this.form1.validateForm.value
    }
    return { struct: JSON.stringify(submitData), image: JSON.stringify(image) };
  }

  public setComponentValue() {

    let cells = { "cells": [{ "position": { "x": -310, "y": -430 }, "size": { "width": 80, "height": 60 }, "attrs": { "body": { "stroke": "#237804", "fill": "#73d13d" }, "label": { "text": "??????" } }, "shape": "ellipse", "id": "dd2792e6-798b-46f0-872e-f5f1bb8bef97", "nodeType": "??????", "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 1 }, { "position": { "x": -310, "y": -255 }, "size": { "width": 80, "height": 40 }, "attrs": { "body": { "stroke": "#31d0c6", "strokeWidth": 2 }, "label": { "text": "????????????", "fill": "#6a6c8a" } }, "shape": "rect", "id": "151ac334-a1ae-4c20-a206-bb318b120ec4", "nodeType": "????????????", "data": { "type": "tempValue" }, "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 2 }, { "shape": "edge", "id": "80d60870-6f06-4d68-893a-f8f69795657e", "source": { "cell": "dd2792e6-798b-46f0-872e-f5f1bb8bef97", "port": "port2" }, "target": { "cell": "151ac334-a1ae-4c20-a206-bb318b120ec4", "port": "port1" }, "zIndex": 3 }] };

    this.graph.fromJSON(cells)
    this.changePortsVisible_Container(false);
  }


  // ?????????????????????????????????
  public transferValue(option?) {
    console.log('?????????????????????', this.tempValue);
  }


  // ????????????
  public nodeSelected(node?) {
    console.log('????????????', node);
    // ??????????????????
    this.cellId = node['id'];
    this.cellText = node.getAttrByPath('label/text')

    this.selectedRow = { 'id': this.cellId, 'text': this.cellText }

    return true;
  }

  // ??????????????? ??????
  public unSelected() {
    this.selectedRow = null;
    return true;

  }

  // ?????????
  public eageSelected(eage?) {
    console.log('?????????', eage);
    // ??????????????????
    // eage.setAttrByPath('label/text', 'dddd')
    this.selectedRow = { 'id': eage['id'], 'text': '???' }
    return true;
  }

  // ????????????
  public containerSelected() {
    // this.selectedRow = null;
    this.selectedRow = {};
    return true;
  }


  public update_node(option?) {

    // 1.?????????????????????????????????id
    // 2.?????????????????????????????????
    // setAttrByPath  ??????????????????
    // updateData   ???????????????????????????

    if (option['$Id']) {  // ??????id

    }



  }

  cellId: any;
  cellText: any;
  public getCellById() {
    let cell = this.graph.getCellById(this.cellId)

    cell.setAttrByPath('label/text', this.cellText)
    //  cell.setAttrByPath('textWrap/text', this.cellText)
    // cell.removeAttrByPath('label'); ????????????
    //  cell.removeAttrByPath('text');


    // textWrap: {
    //   text: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    //   width: -10,     // ???????????? 10px
    //   height: '50%',  // ????????????????????????????????????
    //   ellipsis: true, // ???????????????????????????????????????????????????
    // }

    console.log('??????????????????', cell)
  }


  public async executeModal(execConfig) {


    console.log('-------------??????sql', execConfig);
    // ??????????????????
    // ??????????????????
    // this.componentService.apiService.doPost();
    const url = execConfig.url;
    const params = this.buildParameters(execConfig.params);
    //  console.log(this.config.id + '-------------??????sql params:', params);
    const back = false;

    let response: any;
    if (execConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(execConfig, {}, 'buildParameters', null);
    } else {
      response = await this.componentService.apiService[execConfig.ajaxType](url, params).toPromise();
    }
    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, execConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, execConfig.result);

    // ??????error??????
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
      // ???????????????
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
 * ???????????????
 * @param option
 */
  public showMessage(option) {
    let msgObj;
    if (option && Array.isArray(option)) {
      // ??????????????????????????????????????????????????????
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

  ?????????json ?????????

  userTask id="userTask1" name="????????????" defaultFlow="" pageID="" timeLimit=""

  node:{
    "id":"001",
    "name":"??????1",
    "pageID":"",
    "timeLimit":"", // ??????
    "candidate":{ // ???????????????
       "assignPolicy":{ // ?????????
        "mode":"", //fixed/variable/assigned
        "assignNum":1,
        "expressionList":[ // ????????????????????????, ???????????????
          {
            "name":"???????????????",
            "value":"?????????????????????",
            "extendValue":"????????????, ???????????????????????????"

          }
        ]


       }

    }

  }




   */





  /**
     1.0 ???????????? ????????????
     2.0 ???????????? ???????????? 
  
     ?????????????????????????????????????????????????????????????????????????????????
  'success' | 'info' | 'warning' | 'error' | 'loading'
  this.componentService.msgService.create('warning', '');
   */

  wf_config = {

    "id": "wf_001",
    "title": "???????????????",
    "titleIcon": "right-circle",
    "component": "cnWF",
    "keyId": "id",
    "loadingOnInit": true, // ??????????????????
    "loadingConfig": {
      "url": "sd/GET_DATA_MODELING_TABLE/query",
      "method": "get",
      "params": [
      ],
      "filter": [
      ],
      "backData": [  // ??????ajax ?????? ?????????????????????????????????
        {
          "name": "json",
          "path": "data\\_procedure_resultset_1$0",
          "type": "returnValue",
          "valueName": "R_JSON"

        }
      ]

    },
    "enableToolbar": true, // ???????????? ????????????
    "innerToolbar": [
      {
        "id": "tool_onUndo",
        "innerType": "onUndo",
        "text": "??????",
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
        "text": "??????",
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
        "text": "??????",
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
        "text": "??????",
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
        "text": "??????",
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
        "text": "??????",
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
        "text": "??????",                   // ????????????
        "icon": "setting",                  // ????????????
        "color": "text-primary",         // ??????????????????
        "hidden": false,                 // ????????????
        "disabled": false,               // ????????????
        "execute": [                     // ????????????
          {
            "triggerType": "STATE",      // ??????????????????
            "trigger": "ADD_ROW",        // ??????????????????
            "conditionId": "add_state_1" // ????????????????????????
          }
        ]
      },
      {
        "id": "002",
        "text": "??????",
        "code": "222",
        "execute": []
      },
      {
        "id": "003",
        "text": "??????????????????",
        "code": "111",
        "execute": []
      },
      {
        "id": "004",
        "text": "??????????????????",
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
            "name": '????????????',
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
            "name": '??????????????????',
            "component": {
              "id": "form_task",
              "type": "condition",
              "caseValue": {
                "type": "tempValue",
                "valueName": "nodeType",
                "regular": "^????????????$",
                "value": ""
              }
            }
          },
          {
            "id": "panel_begin",
            "active": true,
            "hidden": false,
            "disabled": false,
            "name": '??????????????????',
            "component": {
              "id": "form_begin",
              "type": "condition",
              "caseValue": {
                "type": "tempValue",
                "valueName": "nodeType",
                "regular": "^????????????$",
                "value": ""
              }
            }
          },
          {
            "id": "panel_edge",
            "active": true,
            "hidden": false,
            "disabled": false,
            "name": '????????????',
            "component": {
              "id": "form_edge",
              "type": "condition",
              "caseValue": {
                "type": "tempValue",
                "valueName": "nodeType",
                "regular": "^??????$",
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
              "title": "????????????b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0m3",
                      "col": "cc",
                      "type": "col",
                      "title": "???ioj0m3",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                "title": "??????",
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
                  "placeholder": "????????????",
                }
              },
              {
                "id": "004",
                "hidden": true,
                "title": "??????",
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
                  "placeholder": "????????????",
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
              "title": "????????????b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                "title": "??????????????????",
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
                      "label": "??????",
                      "value": 0,
                      "disabled": false
                    },
                    {
                      "label": "??????",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "??????",
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
                "title": "?????????",
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
                  "placeholder": "????????????",
                }
              },
              {
                "id": "005",
                "hidden": true,
                "title": "????????????",
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
                  "placeholder": "????????????",
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
                "title": "????????????",
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
                  "placeholder": "????????????",
                  "asyncData": false,  // ???????????? ?????????false
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
                "title": "????????????",
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
                      "label": "?????????",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "??????",
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
                "title": "????????????",
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
                      "label": "????????????",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "????????????",
                      "value": 2,
                      "disabled": false
                    },
                    {
                      "label": "??????????????????",
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
                "title": "???????????????",
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
                  "placeholder": "???????????????",
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
              "title": "????????????b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                "title": "????????????",
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
                      "label": "????????????",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "??????????????????",
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
                "title": "????????????",
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
                  "placeholder": "????????????",
                  "asyncData": false,  // ???????????? ?????????false
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
                "title": "????????????json",
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
                  "placeholder": "?????????",
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
                "title": "??????API",
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
                  "placeholder": "??????API"
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
              "title": "????????????b86s2i",
              "rows": [
                {
                  "id": "MefhXa",
                  "type": "row",
                  "cols": [
                    {
                      "id": "ioj0mV",
                      "col": "cc",
                      "type": "col",
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                      "title": "???ioj0mV",
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
                "title": "????????????",
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
                  "placeholder": "????????????"
                }
              },
              {
                "id": "004",
                "hidden": true,
                "title": "??????????????????",
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
                  "placeholder": "??????????????????"

                }
              },
              {
                "id": "005",
                "hidden": true,
                "title": "??????????????????",
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
                      "label": "??????",
                      "value": 1,
                      "disabled": false
                    },
                    {
                      "label": "???????????????",
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


  // ??????????????????
  dropdown_change(code) {
    console.log(code);
    this.attr_setting();
  }

  // CnFlowAttrSettingComponent


  setting_dialog: any;
  public attr_setting(option?) {

    const dialogCfg = {
      title: '????????????',
      width: "80%",
      style: null,
      maskClosable: false,
      cancelText: '??????',
      okText: '??????',
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


    // ????????? ?????????????????? ???????????? ???????????????
    let sub_Config = {
      state1: { // ??????????????????
        hasPanels: [] // ???????????????

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
              console.log('??????????????????', componentInstance.sons._results, dialog_data)
            }

            let cell = this.graph.getCellById(dialog_data['form_bese']['id'])

            if (cell.isNode()) {
              cell.setAttrByPath('label/text', dialog_data['form_bese']['text'])

              let nodedata = {
                nodeData: dialog_data['form_task'],
                nodeResouce: dialog_data['form_begin'],
                nodeAssignPolicy: dialog_data['form_assignPolicy'], // ????????????
                nodeHandlePolicy: dialog_data['form_handlePolicy'], // ????????????
                nodeOption: dialog_data['form_option'], // ????????????
                nodeGateway: dialog_data['form_Gateway'], // ????????????
                nodeBegin: dialog_data['form_begin'] // ????????????


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
              "value": "????????????"
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
                    "value": "????????????"
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



  //=========???????????????????????????????????????============
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
    { option: "?????????" },
    { option: "?????????" }
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

  //????????????
  addItem() {
    this.testArrFormArray.push(this.creatRow());
  }
  //????????????
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
      "title": "????????????b86s2i",
      "rows": [
        {
          "id": "MefhXa",
          "type": "row",
          "cols": [
            {
              "id": "ioj0mV",
              "col": "cc",
              "type": "col",
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
              "title": "???ioj0mV",
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
        "title": "??????id",

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
          "placeholder": "??????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "003",
        "hidden": true,
        "title": "??????????????????",

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
          "placeholder": "??????",
          "off": false,
          "on": true,
          "options": [
            { "type": "check", "lable": "???", "value": true },
            { "type": "close", "lable": "???", "value": false }
          ]
        }
      },


      {
        "id": "004",
        "hidden": true,
        "title": "??????",

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
          "placeholder": "??????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "005",
        "hidden": true,
        "title": "??????",

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
          "placeholder": "??????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "006",
        "hidden": true,
        "title": "??????",

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
          "placeholder": "??????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "007",
        "hidden": true,
        "title": "??????",

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
          "placeholder": "??????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "008",
        "hidden": true,
        "title": "??????",

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
          "placeholder": "??????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      },
      {
        "id": "009",
        "hidden": true,
        "title": "??????",
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
          "placeholder": "??????",
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
