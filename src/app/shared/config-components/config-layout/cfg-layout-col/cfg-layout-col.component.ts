import { Component, OnInit, Output, EventEmitter, Input, HostListener, Inject } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'cfg-layout-col,[cfg-layout-col]',
  templateUrl: './cfg-layout-col.component.html',
  styleUrls: ['./cfg-layout-col.component.css']
})
export class CfgLayoutColComponent implements OnInit {
  @Input() public config;
  @Input() public designStatus;  // 设计状态
  @Output() public updateValue = new EventEmitter();
  public bodystyle = { 'background-color': 'rgba(47, 164, 231, 0.15)' };
  public rows = [
  ];
  public tabs = {
    id: '',
    type: 'tabs',
    title: '标签页布局',
    container: "tabContent",
    tabContent: [

    ]
  };

  public collapse = {
    id: '',
    type: 'collapse',
    title: '折叠面板布局',
    container: "collapseContent",
    collapseContent: [

    ]
  };
  public isDown = false;
  public is_drag = true;

  public value1 = 24;
  public attribute_isVisible = false; // 属性设置弹出标识
  public attribute_config;
  public titlestate = true;
  public editTitleState = false;

  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider) { }

  public ngOnInit() {
    // background: #afd5ea;
    if (this.config['rows']) {
      this.rows = this.config['rows'];
    }
    if (this.config['container']) {
      this[this.config['container']] = this.config[this.config['container']];
    }

    this.attribute_config = JSON.parse(JSON.stringify(this.config));
  }
  /**
   * delCol 删除列
   */
  public delCol() {
    // console.log('删除当前列！');
    const back = {
      operation: 'delete',
      data: {
        id: this.config.id
      }
    }
    this.updateValue.emit(back);
  }

  /**
   * addRow 添加行
   */
  public addRow() {


    if (this.config.container === '' || this.config.container === 'rows') {
      // console.log('**列内添加行**');
      this.config.container = 'rows'
      const fieldIdentity = CommonUtils.uuID(36);
      const row = {
        cols: [],
        container: "cols"
      };
      row['id'] = fieldIdentity;
      row['type'] = 'row';
      row['title'] = '行';
      this.rows.push(row);
      this.config['rows'] = this.rows;
      this.config.container = 'rows';
    } else {
      // console.log('**列内添加行不允许,条件不满足**');
    }


  }

  /**
   * addTabs 添加页签
   */
  public addTabs() {
    if (this.config.container === '') {
      this.config.container = 'tabs';
      this.config['tabs'] = this.tabs;
      const fieldIdentity = CommonUtils.uuID(36);
      this.tabs['id'] = fieldIdentity;
    } else {
      // console.log('**列内添加tabs不允许,条件不满足**');
    }
  }

  /**
   * addCollapse 新增折叠面板
   */
  public addCollapse() {
    if (this.config.container === '') {
      this.config.container = 'collapse';
      this.config['collapse'] = this.collapse;
      const fieldIdentity = CommonUtils.uuID(36);
      this.collapse['id'] = fieldIdentity;
    } else {
      // console.log('**列内添加Collapse折叠面板不允许,条件不满足**');
    }
  }
  /**
   * dragCol 移动列
   */
  public dragCol() {

    // 移动列

  }

  // 鼠标按下事件
  // @HostListener('mousedown', ['$event']) public mymousedown(btn: any) {
  //   const x = btn.x
  //   const y = btn.y

  //   // 如果鼠标按下位置是图片位置  创建元素
  //   if (btn.target.id === 'dragCol') {
  //     // console.log('鼠标按下移动事件:', btn);
  //   //  this.CheckContentType(btn.target.currentSrc, x, y);
  //     this.isDown = true
  //   }
  // }
  // // 鼠标移动事件
  // @HostListener('mousemove', ['$event']) public onMousemove(btn: any) {
  //   // 判断该元素是否被点击了
  //   if (this.isDown) {
  //     // console.log('鼠标移动事件', btn)
  //     // 鼠标移动时创建的元素移动
  //    // this.r2.setStyle(this.div, 'top', (btn.y - 100) + 'px');
  //    // this.r2.setStyle(this.div, 'left', (btn.x - 100) + 'px');
  //   }
  // }
  // @HostListener('document:mouseup', ['$event']) public mymouseup(btn: any) { // 鼠标抬起事件
  //   // 鼠标抬起时删除添加的元素
  //   // console.log('鼠标抬起:', btn);

  //   if (this.isDown) {
  //     // const data = btn.dataTransfer.getData('Text');
  //     // // console.log('鼠标抬起+++:', data);
  //     this.isDown = false
  //    // this.r2.removeChild(this.el.nativeElement, this.div);
  //   }
  // }




  public valueChangeRow(col?) {

    // console.log('行操作返回信息', col, this.rows);

    if (col) {
      if (col['operation'] === 'delete') {
        // 计算出位置
        let deleteIndex;
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i]['id'] === col['data']['id']) {
            deleteIndex = i;
          }
        }
        // console.log('行删除前', this.rows.length, deleteIndex);
        this.rows.splice(deleteIndex, 1);
        if (this.rows.length === 0) {
          this.config.container = '';
        }
        //  this.cols = this.cols.slice(deleteIndex + 1);
        // console.log('删除结束后', this.rows);
      }
      if (col['operation'] === 'deleteTabs') {
        this.config.tabs = {};
        this.config.container = '';
      }
      if (col['operation'] === 'deleteCollapse') {
        this.config.collapse = {};
        this.config.container = '';
      }
    }
    this.config['rows'] = this.rows;
    const back = {
      operation: 'update',
      data: {
        id: this.config.id,
        config: this.config
      }
    }
    this.updateValue.emit(back);

  }


  // 拖动行

  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', this.config.id);
    // console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    // console.log('拖动行临时值', ss);
  }


  public f_ondrop(e?, d?) {
    e.preventDefault();
    // console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    // console.log('拖动行ondrop临时值', ss);
    // const c_config = this.c_data;
    // const index = c_config.findIndex(
    //     item => item.field === this.d_row['field']
    // );
    // const tindex = c_config.findIndex(
    //     item => item.field === d['field']
    // );
    // this.c_data = JSON.parse(JSON.stringify(this.droparr(c_config, index, tindex)));
  }

  // index是当前元素下标，tindex是拖动到的位置下标。
  public droparr(arr, index, tindex) {
    // 如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    // 我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    // if (index > tindex) {
    //     arr.splice(tindex, 0, arr[index]);
    //     arr.splice(index + 1, 1);
    // } else {
    //     // 如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
    //     // 这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
    //     arr.splice(tindex + 1, 0, arr[index]);
    //     arr.splice(index, 1);
    // }
    // return arr;
  }



  public f_ondragover(e?, d?) {
    // 进入，就设置可以拖放进来（设置不执行默认：【默认的是不可以拖动进来】）
    if (this.is_drag)
      e.preventDefault();
    // --05--设置具体效果copy
    e.dataTransfer.dropEffect = 'copy';
  }

  // ondrag 事件在元素或者选取的文本被拖动时触发。
  public f_drag(e?) {

  }

  public onblur(e?, d?) {
    this.is_drag = true;
  }
  public onfocus(e?, d?) {
    this.is_drag = false;
  }





  /**
   * openAttribute
   */
  public openAttribute() {

    this.attribute_config = JSON.parse(JSON.stringify(this.config));
    if (this.attribute_config.titlestate === 1) {
      this.titlestate = true;
    } else {
      this.titlestate = false;
    }
    this.attribute_isVisible = true;

  }
  /**
   * attribute_handleCancel
   */
  public attribute_handleCancel() {
    this.attribute_isVisible = false;
  }
  /**
   * attribute_handleOk
   */
  public attribute_handleOk() {
    this.config.title = this.attribute_config.title;
    this.config.titlestate = this.attribute_config.titlestate;
    this.config.span = this.attribute_config.span;
    this.config.size = this.attribute_config.size;
    this.attribute_isVisible = false;
  }

  public titlestateChange(v?) {
    if (v) {
      this.attribute_config.titlestate = 1;
    } else {
      this.attribute_config.titlestate = 0;
    }

  }



  /**
   * editTitle
   */
  public editTitle(e?) {
    this.editTitleState = true;
  }

  public onblurtitle(e?, type?) {
    this.editTitleState = false;
    event.stopPropagation();
  }
  public onKeyPress(e?, type?) {
    if (e.code === 'Enter') {
      this.editTitleState = false;
    }
  }

}
