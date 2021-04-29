import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-cfg-l-form-select-parameter',
  templateUrl: './cfg-l-form-select-parameter.component.html',
  styles: [
    `
    .ant-tag {
      margin-bottom: 8px;
    }
    `
  ]
})
export class CfgLFormSelectParameterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  defaultCheckedKeys = ['10020'];
  defaultSelectedKeys = ['10010'];
  defaultExpandedKeys = ['100', '1001'];

  nodes: NzTreeNodeOptions[] = [
    {
      title: '参数',
      key: '100',
      disabled: true,
      children: [
        {
          title: '组件参数[componentValue]',
          key: '1001',
          disabled: true,
          children: [
            { title: '选中行[selectedRow]', key: '10010', isLeaf: true },
            { title: '勾选行[checkedRow]', key: '10011', isLeaf: true },
            { title: '当前行[currentRow]', key: '10012', isLeaf: true },
            { title: '当前列[currentCol]', key: '10013', isLeaf: true }
          ]
        },
        {
          title: '当前执行[item]',
          key: '1002',
          isLeaf: true
        },
        {
          title: '初始值[initValue]',
          key: '1003',
          isLeaf: true
        },
        {
          title: '临时值[tempValue]',
          key: '1004',
          isLeaf: true
        },
        {
          title: '级联参数[cascadeValue]',
          key: '1005',
          isLeaf: true
        },
        {
          title: '用户信息[userValue]',
          key: '1006',
          isLeaf: true
        },
        {
          title: '系统参数[sysValue]',
          key: '1007',
          isLeaf: true
        },
      ]
    }
  ];

  listOfData = [
    {
      key: '1',
      name: 'name',
      type: 'componentValue',
      source: '当前组件'
    },
    {
      key: '2',
      name: 'name',
      type: 'componentValue',
      source: '当前组件'
    },
    {
      key: '3',
      name: 'pid',
      type: 'initValue',
      source: '命令、消息'
    },
    {
      key: '3',
      name: 'GUID',
      type: 'sysValue',
      source: '系统内置'
    }
  ];

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  // nzSelectedKeys change
  nzSelect(keys: string[]): void {
    console.log(keys, this.nzTreeComponent.getSelectedNodeList());
  }

  /*   ngAfterViewInit(): void {
      // get node by key: '10011'
      console.log(this.nzTreeComponent.getTreeNodeByKey('10011'));
      // use tree methods
      console.log(
        this.nzTreeComponent.getTreeNodes(),
        this.nzTreeComponent.getCheckedNodeList(),
        this.nzTreeComponent.getSelectedNodeList(),
        this.nzTreeComponent.getExpandedNodeList()
      );
    } */

}
