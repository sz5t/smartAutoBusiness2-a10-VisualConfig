import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-layout',
  templateUrl: './smt-layout.component.html',
  styles: [
  ]
})
export class SmtLayoutComponent implements OnInit {

  constructor() { }
  @Input() public config;
  @Input() public tempData;
  @Input() public dataServe;
  @Input() public initData;
  @Input() public layoutObj;

  ngOnInit(): void {
    // console.log('layoutObj', this.layoutObj);
    // console.log('dataServe', this.dataServe);

    // 重新加载布局的属性，优化时放入布局解析器里合并
    if (this.layoutObj.children.length > 0) {
      for (let i = 0; i < this.layoutObj.children.length; i++) {
        const tempRow = this.layoutObj.children[i]['children'];
        this.dataServe.componentsConfig[this.layoutObj.children[i]['id']]['children'] = tempRow;
        this.layoutObj.children[i] = this.dataServe.componentsConfig[this.layoutObj.children[i]['id']];
        if (this.layoutObj.children[i].children && this.layoutObj.children[i].children.length > 0) {
          for (let j = 0; j < this.layoutObj.children[i].children.length; j++) {
            const tempCol = this.layoutObj.children[i].children[j]['children'];
            const tempContainer = this.layoutObj.children[i].children[j]['container'];
            this.dataServe.componentsConfig[this.layoutObj.children[i].children[j]['id']]['children'] = tempCol;
            this.dataServe.componentsConfig[this.layoutObj.children[i].children[j]['id']]['container'] = tempContainer;
            this.layoutObj.children[i].children[j] = this.dataServe.componentsConfig[this.layoutObj.children[i].children[j]['id']];
          }
        }
      }
    }
  }

}
