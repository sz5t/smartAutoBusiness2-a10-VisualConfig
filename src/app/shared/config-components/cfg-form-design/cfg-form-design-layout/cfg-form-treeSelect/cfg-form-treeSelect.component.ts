import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-treeSelect',
  templateUrl: './cfg-form-treeSelect.component.html',
  styles: [],
})
export class CfgFormTreeSelectComponent extends CfgFormDesignBase implements OnInit {
  public nodes: any[] = [];
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
    this.initLayout();
    this.nodes = [
      {
        title: this.config.columns ? `#${this.config.columns[0].field}` : '根节点',
        key: '100',
        children: [
          {
            title: this.config.columns ? `#${this.config.columns[0].field}` : '子节点',
            key: '1001',
            children: [
              {
                title: `#${this.config.columns ? `${this.config.columns[0].field}` : '子节点'}`,
                key: '10bnbjbnbnbnmbnmdfggrtdf010',
                isLeaf: true,
              },
            ],
          },
        ],
      },
    ];
  }

  click(e?) {
    e.stopPropagation();
    this.selected();
  }
}
