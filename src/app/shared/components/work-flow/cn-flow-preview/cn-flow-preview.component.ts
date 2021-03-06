import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Addon, Dom, Graph } from '@antv/x6';
import { Dnd } from '@antv/x6/lib/addon';
import { Subject, Subscription } from 'rxjs';
import { CN_FLOW_PREVIEW_METHOD } from 'src/app/core/relations/bsn-methods/bsn-flow-preview-methods';
import { CN_FLOW_PREVIEW_PROPERTY } from 'src/app/core/relations/bsn-property/data-flow-preview.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../cn-component.base';

@Component({
  selector: 'cn-flow-preview,[cn-flow-preview]',
  templateUrl: './cn-flow-preview.component.html',
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
    
    `
  ]
})
export class CnFlowPreviewComponent extends CnComponentBase implements OnInit, OnDestroy, AfterViewInit {

  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;
  @Input() dataServe;

  @ViewChild('refContainer', { static: false }) refContainer: ElementRef;
  @ViewChild('refcontent', { static: false }) refcontent: ElementRef;



  public graph: any;
  public dnd: any;

  public history: any;
  public options: any; // ??????????????????

  isCollapsed = false;
  public selectedRow: any;

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
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }





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


  }


  public async ngAfterViewInit() {

    let _height = (window.document.body.clientHeight);
    let _width = (window.document.body.clientWidth - 260);



    this.graph = new Graph({
      container: this.refContainer.nativeElement,
      width: _width,
      height: _height,
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


    this.graph.on('edge:connected', ({ isNew, edge }) => {
      if (isNew) {
        // ?????????????????????????????????????????????????????????
        const source = edge.getSourceCell()
        console.log('??????', source);
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
      node.updateData({ "name": "dd" });
      this.nodeSelected(node);
    })

    this.graph.on('edge:click', ({ edge }) => {
      this.reset()
      edge.attr('line/stroke', 'orange')
      edge.prop('labels/0', {
        attrs: {
          body: {
            stroke: 'orange',
          },
        },
      })

      this.eageSelected(edge);
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
    })

    this.options = {
      offset: 30,
      useLocalStorage: true,
    }

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
      const url = this.config.loadingConfig.url;
      const method = this.config.loadingConfig.ajaxType;
      const params = {
        ...this.buildParameters(this.config.loadingConfig.params),
      };
      // ???????????? get ???????????????????????????????????????dataset ????????????????????????????????????????????????
      // response = null;
      response = await this.componentService.apiService[method](url, params).toPromise();
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
    }
    if (data_form) {
      let cells = JSON.parse(data_form['configjson']);
      this.graph.fromJSON(cells)
      this.changePortsVisible_Container(false);

      if (data_form.hasOwnProperty('edges')) {

        let _edges = data_form['edges'];
        if (_edges) {
          this.update_edges_state(_edges);
        }
      }

      // let dddd = this.graph.toJSON();
      // let cell = dddd['cells'];
      // if (cell) {
      //   const rect = this.graph.getCellsBBox(cell);
      //   this.graph.transitionToRect(rect, {
      //     duration: '500ms',
      //     center: cell[0].getBBox().center()
      //   });
      // }

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
      // componentValue: this.validateForm.value,
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


  public changePortsVisible_Container = (visible: boolean) => {
    const ports = this.refContainer.nativeElement.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGAElement>
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden'
    }
  }

  public onUndo() {
    console.log('ddddd');
    this.history.undo()
  }

  public onRedo() {
    this.history.redo()
  }

  onCopy = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      this.graph.copy(cells, this.options)
      console.log('????????????');
      // message.success('????????????')
    } else {
      // message.info('???????????????????????????')
      console.log('???????????????????????????');
    }
  }

  onPaste = () => {
    if (this.graph.isClipboardEmpty()) {
      // message.info('??????????????????????????????')
      console.log('??????????????????????????????');
    } else {
      const cells = this.graph.paste(this.options)

      this.graph.cleanSelection()
      this.graph.select(cells)
      console.log('????????????');
      //  message.success('????????????')
    }
  }


  onDelete = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      //removed
      this.graph.removeNode(cells[0]);
      console.log('????????????');
      // message.success('????????????')
    } else {
      // message.info('???????????????????????????')
      console.log('???????????????????????????');
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
      edge.prop('labels/0', {
        attrs: {
          body: {
            stroke: 'black',
          },
        },
      })
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


  public printData() {

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

    let submitData = {};
    submitData['configjson'] = JSON.stringify(dddd);
    submitData['nodejson'] = JSON.stringify(_nodes);
    submitData['edgejson'] = JSON.stringify(_edges);

    console.log('????????????', submitData)
  }

  public setComponentValue() {

    let cells = { "cells": [{ "position": { "x": -770, "y": -450 }, "size": { "width": 80, "height": 60 }, "attrs": { "body": { "stroke": "#31d0c6", "fill": "#73d13d" }, "label": { "text": "??????" } }, "shape": "ellipse", "id": "0efecbd0-6808-414f-8bc6-3a2b8008cb82", "nodeType": "??????", "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 4 }, { "position": { "x": -770, "y": -310 }, "size": { "width": 80, "height": 40 }, "attrs": { "body": { "stroke": "#31d0c6", "strokeWidth": 2 }, "label": { "text": "????????????", "fill": "#6a6c8a" } }, "shape": "rect", "id": "7aaaa11f-64c5-40de-b8c7-236899e9cc05", "nodeType": "????????????", "data": { "type": "tempValue" }, "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 5 }, { "shape": "edge", "attrs": { "line": { "stroke": "black" } }, "id": "66d6ba8f-37e4-43a6-a26c-0e89e117dc61", "source": { "cell": "0efecbd0-6808-414f-8bc6-3a2b8008cb82", "port": "port2" }, "target": { "cell": "7aaaa11f-64c5-40de-b8c7-236899e9cc05", "port": "port1" }, "zIndex": 6, "labels": [{ "attrs": { "body": { "stroke": "black" } } }] }, { "position": { "x": -770, "y": -215 }, "size": { "width": 80, "height": 80 }, "attrs": { "body": { "stroke": "#31d0c6", "refPoints": "0,10 10,0 20,10 10,20" }, "label": { "text": "????????????" } }, "shape": "polygon", "id": "c58802bc-39a8-48e5-8bd4-46e9670cbe4c", "nodeType": "????????????", "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 7 }, { "shape": "edge", "attrs": { "line": { "stroke": "black" } }, "id": "318af7c8-f941-4af7-b5b8-020b31d765f4", "source": { "cell": "7aaaa11f-64c5-40de-b8c7-236899e9cc05", "port": "port2" }, "target": { "cell": "c58802bc-39a8-48e5-8bd4-46e9670cbe4c", "port": "port1" }, "zIndex": 8, "labels": [{ "attrs": { "body": { "stroke": "black" } } }] }, { "position": { "x": -770, "y": -62 }, "size": { "width": 80, "height": 40 }, "attrs": { "body": { "stroke": "#31d0c6", "strokeWidth": 2 }, "label": { "text": "????????????", "fill": "#6a6c8a" } }, "shape": "rect", "id": "4672262f-3bec-467e-ae23-392c79be8346", "nodeType": "????????????", "data": { "type": "tempValue" }, "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 9 }, { "shape": "edge", "attrs": { "line": { "stroke": "black" } }, "id": "e1ef07df-88cf-48b9-89e4-f625e039154c", "source": { "cell": "c58802bc-39a8-48e5-8bd4-46e9670cbe4c", "port": "port2" }, "target": { "cell": "4672262f-3bec-467e-ae23-392c79be8346", "port": "port1" }, "zIndex": 10, "labels": [{ "attrs": { "body": { "stroke": "black" } } }] }, { "shape": "edge", "attrs": { "line": { "stroke": "black" } }, "id": "1efeec23-da9f-48a4-af29-7e5786cfca93", "source": { "cell": "c58802bc-39a8-48e5-8bd4-46e9670cbe4c", "port": "port4" }, "target": { "cell": "7aaaa11f-64c5-40de-b8c7-236899e9cc05", "port": "port4" }, "zIndex": 11, "labels": [{ "attrs": { "body": { "stroke": "black" } } }], "vertices": [{ "x": -580, "y": -175 }, { "x": -580, "y": -290 }] }, { "position": { "x": -770, "y": 40 }, "size": { "width": 80, "height": 60 }, "attrs": { "body": { "fill": "#efdbff", "stroke": "#31d0c6" }, "label": { "text": "??????" } }, "shape": "ellipse", "id": "98f0809b-baa6-4609-aa68-1265e679eaee", "nodeType": "??????", "ports": { "groups": { "in": { "position": "top", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "out": { "position": "bottom", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "right": { "position": "right", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } }, "left": { "position": "left", "attrs": { "circle": { "r": 6, "magnet": true, "stroke": "#31d0c6", "strokeWidth": 2, "fill": "#fff" } } } }, "items": [{ "id": "port1", "group": "in" }, { "id": "port2", "group": "out" }, { "id": "port3", "group": "left" }, { "id": "port4", "group": "right" }] }, "zIndex": 12 }, { "shape": "edge", "attrs": { "line": { "stroke": "black" } }, "id": "f92fd4f4-1e00-460d-86dd-7811d2300ee1", "source": { "cell": "4672262f-3bec-467e-ae23-392c79be8346", "port": "port2" }, "target": { "cell": "98f0809b-baa6-4609-aa68-1265e679eaee", "port": "port1" }, "zIndex": 13, "labels": [{ "attrs": { "body": { "stroke": "black" } } }] }] };
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

    return true;

  }

  // ?????????
  public eageSelected(eage?) {
    console.log('?????????', eage);
    this.cellId = eage['id'];
    // ??????????????????
    // eage.setAttrByPath('label/text', 'dddd')
    this.selectedRow = { 'id': this.cellId, 'text': '???' }
    return true;
  }

  // ????????????
  public containerSelected() {
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



  public update_edges_state(ids?) {

    let strs = ids.split(',');

    strs.forEach(element => {

      let cell = this.graph.getCellById(element)
      if (cell && cell.isEdge()) {
        let line = {
          stroke: 'black',
          strokeDasharray: 5,
          targetMarker: 'classic',
          style: {
            animation: 'ant-line 30s infinite linear',
          }
        };
        cell.attr('line', line)
      }


    });


  }

  public update_edge_state(id?) {


    let cell = this.graph.getCellById(this.cellId)
    if (cell && cell.isEdge()) {
      let line = {
        stroke: 'black',
        strokeDasharray: 5,
        targetMarker: 'classic',
        style: {
          animation: 'ant-line 30s infinite linear',
        }
      };
      cell.attr('line', line)
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

    }

  }









}
