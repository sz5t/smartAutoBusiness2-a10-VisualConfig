import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cfg-form-container',
  templateUrl: './cfg-form-container.component.html',
  styles: [
  ]
})
export class CfgFormContainerComponent implements OnInit {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public testCmp: any;
  @Input() public fromDataService;
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
