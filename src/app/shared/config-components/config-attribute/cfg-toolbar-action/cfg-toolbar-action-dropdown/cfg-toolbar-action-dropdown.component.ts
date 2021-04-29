import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-toolbar-action-dropdown',
  templateUrl: './cfg-toolbar-action-dropdown.component.html',
  styles: [
  ]
})
export class CfgToolbarActionDropdownComponent implements OnInit {
  @Input() public dataConent;
  constructor() { }

  ngOnInit(): void {
  }

}
