import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-cmpt-tree',
  templateUrl: './cfg-page-cmpt-tree.component.html',
  styles: [],
})
export class CfgPageCmptTreeComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;

  public config: any;
  private titleRoot = '根节点';
  private titleChild = '子节点';
  constructor() {}

  public nodes = [];

  body_style: any = { padding: '2px 2px' };
  body_style_selected: any = { padding: '2px 2px', border: '2px dashed red' };
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
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
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'cnTree';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前tabs', this.selectedItem);
  }

  change($event) {}

  public f_ondrop(e?, d?) {
    e.preventDefault();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss);
    let dropData = JSON.parse(ss);
    // console.log('拖拽JSON', dropData);

    let dropName = dropData['dropName'];
    if (dropData['dropName'] === 'cnToolbar') {
      const cmpTypeMapping = {
        cnForm: 'cnForm',
        cnTable: 'cnDataTable',
        cnTree: 'cnTree',
        cnTreeTable: 'cnTreeTable',
        cnToolbar: 'cnToolbar',
        tabs: 'tabs',
      };

      if (!cmpTypeMapping[dropName]) {
        e.stopPropagation();
        return;
      }

      let cmptObj = {
        type: cmpTypeMapping[dropName],
        title: '组件' + cmpTypeMapping[dropName],
        container: cmpTypeMapping[dropName],
        positionId: this.l_config['id'],
      };

      // this.l_config.children = [];

      this.l_config['container'] = 'component';
      let node = this.fromDataService.l_create_component(this.l_config['id'], cmptObj);
      // this.l_config.children.splice(0, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, 0);

      e.stopPropagation();
    }
  }
}
