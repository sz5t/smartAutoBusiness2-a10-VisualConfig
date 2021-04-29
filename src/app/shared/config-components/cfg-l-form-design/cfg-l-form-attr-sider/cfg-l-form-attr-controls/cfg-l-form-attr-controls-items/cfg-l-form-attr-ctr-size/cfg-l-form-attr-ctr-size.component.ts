import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-l-form-attr-ctr-size',
  templateUrl: './cfg-l-form-attr-ctr-size.component.html',
  styles: [
  ]
})
export class CfgLFormAttrCtrSizeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  labelSize = {                // 标签文本所占布局
    "span": 8,                  // 默认比例
    "nzXs": {
      "span": 7,
      "offset": 1
    },
    "nzSm": {
      "span": 7,
      "offset": 1
    },
    "nzMd": {
      "span": 7,
      "offset": 1
    },
    "nzLg": {
      "span": 7,
      "offset": 1
    },
    "ngXl": {
      "span": 7,
      "offset": 1
    },
    "nzXXl": {
      "span": 7,
      "offset": 1
    }
  }


  sizePanels = [
    {
      active: true,
      name: 'nzXXl',
      disabled: false,
      type: 'title'
    }
  ]

}
