import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-layout',
  templateUrl: './cfg-page-layout.component.html',
  styles: [
  ]
})
export class CfgPageLayoutComponent implements OnInit {
  @Input() public showLayout;
  @Input() public cmptState;
  @Input() public selectedItem: any;
  @Input() public l_config: any;
  @Input() public fromDataService: configFormDataServerService;

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
