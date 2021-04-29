import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { ConfigLLayoutComponent } from '../config-l-layout/config-l-layout.component';
import { CfgLFormAttrSiderComponent } from './cfg-l-form-attr-sider/cfg-l-form-attr-sider.component';
import { CfgLFormSiderComponent } from './cfg-l-form-sider/cfg-l-form-sider.component';

@Component({
  selector: 'app-cfg-l-form-design',
  templateUrl: './cfg-l-form-design.component.html',
  styles: [
    `
    nz-header{
      background: #7dbcea;
      color: #fff;
    }
    nz-footer {
      background: #7dbcea;
      color: #fff;
    }
    .ant-card-type-inner .ant-card-body {
      padding: 1px 2px;
    }
    `
  ],
  providers: [configFormDataServerService]
})
export class CfgLFormDesignComponent implements OnInit {

  @ViewChild('child0', { static: true }) public child0: ConfigLLayoutComponent;
  @ViewChild('child1', { static: true }) public child1: CfgLFormSiderComponent;
  @ViewChild('child2', { static: true }) public child2: CfgLFormAttrSiderComponent

  selectedItem: any = { item: null, cmptitem: null, rowitem: null, active: null };
  layout_nodes: NzTreeNodeOptions[];
  showLayout = true;
  constructor(public fromDataService: configFormDataServerService) { }
  ngOnInit(): void {


  }
  public selectedValue = "1";
  Flex = "250px";
  sizeStyle = {
    transform: 'scale(1,1)',
    'transform-origin': '0 0'
  }
  div_style = {
    'overflow': 'auto',
    'background-image': 'linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%)',
    'background-size': '20px 20px',
    'background-repeat': 'repeat',
    'background-position': 'center center',
    'min-height': '680px',
    'max-height': '680px',
    'position': 'relative',
    'overflow-y': 'scroll'

  }
  div_container_style = {
    'width': '100%',
    'position': 'absolute',

  }
  c_size = {
    s1600: 'default',
    s1200: 'default',
    s768: 'default',
    sFILL: 'primary'

  }
  c_size_click(v?) {

    for (let key in this.c_size) {
      if (key === v) {
        this.c_size[v] = 'primary';
      } else {
        this.c_size[key] = 'default';
      }
    }
    let width = '1600';
    if (v === 's1600') {
      width = '1600' + 'px';
    }
    if (v === 's1200') {
      width = '1200' + 'px';
    }
    if (v === 's768') {
      width = '768' + 'px';
    }
    if (v === 'sFILL') {
      width = '100%';
    }
    this.div_container_style['width'] = width;

  }
  sizeChange(value?): void {
    console.log(value);
    this.sizeStyle['transform'] = 'scale(' + value + ',' + value + ')';
  }

  // ==========步骤=============
  // 初始是编辑状态、文本默认lable
  cmptState: any = { initState: 'editor' };
  index = 0;
  disable = false;
  onIndexChange(index: number): void {
    this.index = index;
    if (index === 0) {
      this.showLayout = true;
    }
    if (index === 1) {
      this.showLayout = false;
      this.cmptState['initState'] = 'editor';
    }
    if (index === 2) {
      this.showLayout = false;
      this.cmptState['initState'] = 'text';
    }

  }
  //============================


  PreviewLayout() {

    this.child0.PreviewLayout();
    this.child1.text_sider();
    this.layout_nodes = this.child0.layout_nodes;
    if (!this.fromDataService.treeInstance) {
      this.fromDataService.treeInstance = this.child1;
    }
    if (!this.fromDataService.layoutInstance) {
      this.fromDataService.layoutInstance = this.child0;
    }
    console.log(this.fromDataService, '=======>', this.child1, this.child0, this.child2);
    this.fromDataService.setComponentValue('002', '003');



  }




}
