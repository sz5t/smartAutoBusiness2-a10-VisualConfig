import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-form-layout',
  templateUrl: './cfg-form-layout.component.html',
  styles: [
  ]
})
export class CfgFormLayoutComponent implements OnInit {

  @Input() public showLayout;
  @Input() public cmptState;
  @Input() public selectedItem: any;
  @Input() public l_config: any;
  @Input() public fromDataService;

  config = {};
  constructor() { }

  ngOnInit(): void {

    this.load();
  }
  load() {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
    console.log(this.config);
  }
}
