import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-toolbar',
  templateUrl: './smt-toolbar.component.html',
  styles: [
    `
      .toolbarGroup {
        margin-right: 8px;
      }
    `
  ]
})
export class SmtToolbarComponent implements OnInit {

  constructor() { }
  @Input() public config; // dataTables 的配置参数
  @Input() public initData;
  @Input() public tempData;
  @Input() public dataServe;

  ngOnInit(): void {
    this.editConfig(this.config);
    console.log(this.config);
    // console.log(this.initData);
    // console.log(this.tempData);
    // console.log(this.dataServe);
  }

  public action(cfg, originData) {
    console.log(cfg);
    console.log(originData);
    if (cfg['originData']) {
      cfg['eventConent'] = originData[cfg['id']]['eventConent'];
    }
  }

  public editConfig(cfg) {
    if (cfg['originData'] && cfg.children && cfg.children.length > 0) {
      for (let i = 0; i < cfg.children.length; i++) {
        const children = cfg.children[i]['children']
        const id = cfg.children[i]['id']
        cfg.children[i] = cfg['originData'][id];
        cfg.children[i]['children'] = children;
      }
    }
  }

}
