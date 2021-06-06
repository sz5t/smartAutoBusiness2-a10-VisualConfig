import { Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-form-col',
  templateUrl: './cfg-form-col.component.html',
  styles: [
  ]
})
export class CfgFormColComponent implements OnInit, OnChanges {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  @Output() public layoutOptions = new EventEmitter();

  public config: any;
  public testCmp;
  public testRows;
  constructor() { }


  draging = false;
  optionState = false;
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {
    this.load();
    this.fromDataService.layoutStructInstance[this.l_config['id']] = this;
  }

  load() {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
    console.log(this.config);
  }
  ngOnChanges(changes: SimpleChanges) {

    // console.log('ngOnChanges', this.selectedItem);
    if (changes.hasOwnProperty('selectedItem')) {
      if (!changes.selectedItem.firstChange) {
        // 处理后续变化，初始变化不处理
        if (this.selectedItem === this.l_config) {
          this.body_style = {
            'padding': '1px 2px',
            'border': "3px solid #54e72f"
          }
        } else {
          this.body_style = { 'padding': '1px 2px' }
        }
      }
    }
  }


  // dragstart->dragenter->dragover->drop->dragend
  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', 'new_col');
    //e.dataTransfer.setData('text/plain', JSON.stringify({ 'name': 'col' }));
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss, e);
    // e.target.style.backgroundColor = 'yellow';
    this.draging = true;
    // e.dataTransfer.dropEffect = 'move';
  }

  public f_ondragend(e?) {
    e.stopPropagation();
    console.log('拖动结束', e);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动结束临时值', ss);
  }

  public f_ondrop(e?, d?) {

    e.preventDefault();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss);
    let dropData = JSON.parse(ss);
    // console.log('拖拽JSON', dropData);

    let dropName = dropData['dropName'];
    if (dropData['dropName'] === 'row') {
      const rowId = CommonUtils.uuID(36);
      this.l_config.children = [];
      if (this.l_config['container'] === 'component') {
        this.fromDataService.layoutTreeInstance.clearChildrenByNode(this.l_config['id']);
      }
      this.l_config['container'] = 'rows';
      // this.l_config.children.push(
      //   {
      //     cols: [],
      //     children: [],
      //     container: "cols",
      //     expanded: true,
      //     id: rowId,
      //     key: rowId,
      //     parentId: this.l_config['id'],
      //     title: "【表单主对象】布局",
      //     type: "row"
      //   }
      // )

      this.testRows = d;
      let node = this.fromDataService.l_createRow(this.l_config['id']);
      // this.l_config.children.splice(0, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, 0);

      e.stopPropagation();
    } else if (dropData['dropName'] === 'col') {

    }
    else {
      let cmpTypeMapping = {}
      if (dropData['dropType'] === 'form') {
        cmpTypeMapping = {
          cnFormInput: 'cnFormInput',
          cnFormSelect: 'cnFormSelect',
          cnFormTime: 'cnFormTime'
        }

      } else {
        cmpTypeMapping = {
          cnForm: 'cnForm',
          cnTable: 'cnDataTable',
          cnTree: 'cnTree',
          cnTreeTable: 'cnTreeTable',
          cnToolbar: 'cnToolbar',
          tabs: 'tabs'
        }
      }

      if (!cmpTypeMapping[dropName]) {
        e.stopPropagation();
        return;
      }

      let cmptObj = {
        "type": cmpTypeMapping[dropName],
        "title": "表单条目",
        "container": cmpTypeMapping[dropName]
      }
      this.l_config.children = [];
      if (this.l_config['container'] === 'rows') {
        this.fromDataService.layoutTreeInstance.clearChildrenByNode(this.l_config['id']);
      }
      if (this.l_config['container'] === 'component') {
        this.fromDataService.layoutTreeInstance.clearChildrenByNode(this.l_config['id']);
      }
      this.l_config['container'] = 'component';
      let node = this.fromDataService.l_create_component(this.l_config['id'], cmptObj);
      // this.l_config.children.splice(0, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, 0);

      e.stopPropagation();
    }
  }


  del() {
    let op = { type: 'del', data: this.l_config };
    this.layoutOptions.emit(op);
  }

  click(e?) {
    e.stopPropagation();
    this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'col';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前列', this.selectedItem);

  }

}
