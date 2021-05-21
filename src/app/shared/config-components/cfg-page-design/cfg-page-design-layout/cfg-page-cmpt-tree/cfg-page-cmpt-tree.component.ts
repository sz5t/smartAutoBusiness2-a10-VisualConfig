import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-page-cmpt-tree',
  templateUrl: './cfg-page-cmpt-tree.component.html',
  styles: [
  ]
})
export class CfgPageCmptTreeComponent implements OnInit {
  @Input() public l_config;

  constructor() { }

  public nodes = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          children: [
            { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        }
      ]
    }
  ];

  public config = {
    showCheckBox: false,
    expandAll: true
  }

  ngOnInit(): void {
    this.load();
  }

  public load() {

  }

}
