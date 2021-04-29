import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-brackets',
  templateUrl: './cfg-brackets.component.html',
  styles: [
    `
    [nz-row] {
      min-height:50px;
     
       border-bottom: 1px solid #f0f0f0;
     }

    `
  ]
})
export class CfgBracketsComponent implements OnInit {
  @Input() public data;
  constructor() { }

  ngOnInit(): void {
  }

}
