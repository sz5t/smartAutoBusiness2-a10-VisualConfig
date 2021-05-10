import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-l-form-attr-ctr-title',
  templateUrl: './cfg-l-form-attr-ctr-title.component.html',
  styles: [
  ]
})
export class CfgLFormAttrCtrTitleComponent implements OnInit {
  @Input() public config;
  @Input() public configData;
  data: any;
  constructor() { }

  ngOnInit(): void {

    // this.data = this.fromDataService.layoutSourceData[node['id']];
  }

}
