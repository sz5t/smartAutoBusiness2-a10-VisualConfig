import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-container',
  templateUrl: './cfg-page-container.component.html',
  styles: [
  ]
})
export class CfgPageContainerComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public testCmp: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    const cmp = this.testCmp;
    // console.log(cmp);
    // if (this.testCmp['children'][0]['container'] === 'row') {
    //   this.l_config = this.testCmp['children'][0]
    // }
    console.log(this.l_config);
  }

}
