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

  selectNode: any; // 选中节点，根据节点切换内容
  constructor() { }

  ngOnInit(): void {
    this.Parameter['componentValue'] = this.mainParameter;

  }

  load() {

  }

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  defaultCheckedKeys = ['10020'];
  defaultSelectedKeys = ['10010'];
  defaultExpandedKeys = ['100', '1001'];

  nodes: NzTreeNodeOptions[] = [
    {
      title: '参数',
      key: '100',
      parameterType: '',
      disabled: true,
      children: [
        {
          title: '组件参数[componentValue]',
          key: '1001',
          parameterType: 'componentValue',
          disabled: true,
          children: [
            { title: '选中行[selectedRow]', key: '10010', parameterType: 'selectedRow', isLeaf: true },
            { title: '勾选行[checkedRow]', key: '10011', parameterType: 'checkedRow', isLeaf: true },
            { title: '当前行[currentRow]', key: '10012', parameterType: 'currentRow', isLeaf: true },
            { title: '当前列[currentCol]', key: '10013', parameterType: 'currentCol', isLeaf: true }
          ]
        },
        {
          title: '当前执行[item]',
          key: '1002',
          parameterType: 'item',
          isLeaf: true
        },
        {
          title: '初始值[initValue]',
          key: '1003',
          parameterType: 'initValue',
          isLeaf: true
        },
        {
          title: '临时值[tempValue]',
          key: '1004',
          parameterType: 'tempValue',
          isLeaf: true
        },
        {
          title: '级联参数[cascadeValue]',
          parameterType: 'cascadeValue',
          key: '1005',
          isLeaf: true
        },
        {
          title: '用户信息[userValue]',
          parameterType: 'userValue',
          key: '1006',
          isLeaf: true
        },
        {
          title: '系统参数[sysValue]',
          parameterType: 'sysValue',
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
    let _pname = event['node']['origin']['parameterType'];
    if (_pname) {

      if (this.Parameter.hasOwnProperty(_pname)) {
        this.listOfData = this.Parameter[_pname];
      } else {
        this.listOfData = [];
      }



    }
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



  // 可选参数
  Parameter = {
    tempValue: [
      { id: '001', name: 'pid', title: '父id', type: 'tempValue', source: '[消息]', description: '', dataType: '' }
    ],
    initValue: [
      { id: '002', name: 'pageId', title: '页id', type: 'initValue', source: '[初始化]', description: '', dataType: '' }
    ],
    userValue: [
      { id: '004', name: 'userId', title: '用户id', type: 'componentValue', source: '[组件值]', description: '', dataType: '' },
      { id: '005', name: 'userName', title: '用户名称', type: 'componentValue', source: '[组件值]', description: '', dataType: '' },
      { id: '006', name: 'realName', title: '姓名', type: 'componentValue', source: '[组件值]', description: '', dataType: '' }
    ]
  }

  // 【数据集】主资源参数，表格 列字段；表单 表单项字段； 指定字段-》从此处选择
  mainParameter = [
    {
      'id': '0001',
      name: 'ID',
      title: '主键',
      type: 'componentValue',
      source: '[主资源]',  // 主资源、自定义
      description: '',
      dataType: '' // 数据类型


    },
    {
      'id': '0002',
      name: 'name',
      title: '姓名',
      type: 'componentValue',
      source: '[主资源]',  // 主资源、自定义
      description: '',
      dataType: '' // 数据类型


    },
    {
      'id': '0003',
      name: 'sex',
      title: '性别',
      type: 'componentValue',
      source: '[主资源]',  // 主资源、自定义
      description: '',
      dataType: '' // 数据类型


    },
    {
      'id': '0004',
      name: 'adress',
      title: '地址',
      type: 'componentValue',
      source: '[主资源]',  // 主资源、自定义
      description: '',
      dataType: '' // 数据类型


    }
  ]

}
