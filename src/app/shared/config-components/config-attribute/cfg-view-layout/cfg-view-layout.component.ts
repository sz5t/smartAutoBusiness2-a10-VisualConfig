import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getISOWeek, getYear, setISOWeek, addWeeks, addISOWeekYears, getMonth, differenceInBusinessDays, differenceInDays } from 'date-fns';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CfgLayoutComponent } from '../../config-layout/cfg-layout/cfg-layout.component';
@Component({
  selector: 'app-cfg-view-layout',
  templateUrl: './cfg-view-layout.component.html',
  styles: [
    `
    nz-header,
    nz-footer {
      background: #7dbcea;
      color: #fff;
    }
    .ant-card-type-inner .ant-card-body {
      padding: 1px 2px;
    }
    `
  ]
})
export class CfgViewLayoutComponent implements OnInit {


  @ViewChild('child0', { static: true }) public child0: CfgLayoutComponent;
  @ViewChild('content', { static: true }) content: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }
  public selectedValue = "1";
  sizeStyle = {
    transform: 'scale(1,1)',
    'transform-origin': '0 0'
  }

  div_style = {
    'overflow': 'auto',
    'background-image': 'linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%)',
    'background-size': '20px 20px',
    'background-repeat': 'repeat',
    'background-position': 'center center',
    'min-height': '680px',
    'max-height': '680px',
    'position': 'relative',
    'overflow-y': 'scroll'

  }
  div_container_style = {
    'width': '100%',
    'position': 'absolute',

  }
  log(value?): void {
    console.log(value);
    this.sizeStyle['transform'] = 'scale(' + value + ',' + value + ')';

    let C_width = this.content.nativeElement.clientWidth;
    //  this.div_style['max-width'] = C_width + 'px';
    console.log(this.content.nativeElement.clientWidth, this.content.nativeElement.parentNode.clientWidth)
  }

  c_size = {
    s1600: 'default',
    s1200: 'default',
    s768: 'default',
    sFILL: 'primary'

  }
  c_size_click(v?) {

    for (let key in this.c_size) {
      if (key === v) {
        this.c_size[v] = 'primary';
      } else {
        this.c_size[key] = 'default';
      }
    }
    let width = '1600';
    if (v === 's1600') {
      width = '1600' + 'px';
    }
    if (v === 's1200') {
      width = '1200' + 'px';
    }
    if (v === 's768') {
      width = '768' + 'px';
    }
    if (v === 'sFILL') {
      width = '100%';
    }
    this.div_container_style['width'] = width;

  }



  gridStyle = {
    width: '50%',
    textAlign: 'center'
  };

  gridStyle1 = {
    width: '100%',
    textAlign: 'center'
  };
  c_config: any;
  left_panels = [
    {
      active: true,
      name: '数据组件',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '布局组件'
    }

  ];

  panels = [
    {
      active: true,
      name: '加载1(A模式)【cmpt_load】【全局】',
      disabled: false
    },
    {
      active: true,
      name: '加载2(B模式)【cmpt_load】【全局】',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '值传递【transferValue】【全局】'
    },
    {
      active: false,
      disabled: false,
      name: '消息【message】【全局】'
    }
  ];

  event_panels = [
    {
      active: true,
      name: '选中行【selectedRow】',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '勾选行【checkedRows】'
    },
    {
      active: false,
      disabled: false,
      name: '值变化【valueChange】'
    }
  ];

  parameter_panels = [
    {
      active: true,
      name: '初始参数【initValue】',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '缓存参数【tempValue】'
    },
    {
      active: false,
      disabled: false,
      name: '用户信息【userValue】【系统内置】'
    },
    {
      active: false,
      disabled: false,
      name: '组件信息【componentValue】【系统内置】'
    }
  ];

  nodes = [

  ]
  layout_nodes = []

  component_s = [
    {
      active: true,
      name: '组件类型01',
      disabled: false,
      componentArray: [
        {
          id: '',
          code: '',
          icon: '',
          title: '',
          hasPop: [
            { 'code': 'mainData' }
          ],
          hasValue: [
            {
              type: 'component',
              subType: 'selectRow',
              dataType: 'object'
            }
          ],
          hasAction: [
            {
              id: '',
              code: '',
              title: ''
            }
          ]
        }


      ]
    }
  ]


  valueChangeLayout(v?) {
    console.log(v);
  }

  Flex = "250px";
  test_Flex() {
    if (this.Flex === "60px") {
      this.Flex = "250px";
    } else {
      this.Flex = "60px";
    }

    let d = differenceInBusinessDays(new Date('2021-6-30'), new Date());
    let d1 = differenceInDays(new Date('2021-6-30'), new Date());

    console.log('时间差', d, d1);
  }

  PreviewLayout() {
    this.nodes = [];
    this.jxlayout(this.child0.config, 'NULL');
    this.layout_nodes = this.listToTree(this.nodes);
    console.log('页面结构', this.child0, this.nodes);
  }

  public jxlayout(layoutconfig?, parentid?) {
    // console.log('xxx:',layoutconfig);
    if (layoutconfig instanceof Array) {
      // 数组
      layoutconfig.forEach((item) => {
        if (item.hasOwnProperty('container')) {
          this.nodes.push({ id: item.id, type: item.type, title: item.title, parentId: parentid, container: item.container });
          if (item.container !== '') {
            this.jxlayout(item[item.container], item.id);
          }
        }
      });
    } else {
      // 第一步判断是否存在container
      if (layoutconfig.hasOwnProperty('container')) {
        // 下一层布局

        this.nodes.push({
          id: layoutconfig.id,
          type: layoutconfig.type,
          title: layoutconfig.title,
          parentId: parentid,
          container: layoutconfig.container,
        });
        if (layoutconfig.container !== '' && layoutconfig[layoutconfig.container]) {
          this.jxlayout(layoutconfig[layoutconfig.container], layoutconfig.id);
        }
      }
    }
  }

  listToTree(oldArr) {
    oldArr.forEach(element => {
      element['expanded'] = true;
      let parentId = element.parentId;
      if (parentId !== 'NULL') {
        oldArr.forEach(ele => {
          if (ele.id == parentId) { //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
            if (!ele.children) {
              ele.children = [];
            }
            ele.children.push(element);
          }
        });
      }
    });
    console.log(oldArr) //此时的数组是在原基础上补充了children;
    oldArr = oldArr.filter(ele => ele.parentId === 'NULL'); //这一步是过滤，按树展开，将多余的数组剔除；
    console.log(oldArr)
    return oldArr;
  }

  /*
  listens  监听
 
     keyCode:标识
     类型：全局、范围
 
    【交互】：接口、事件、监听
    【基本属性】：组件基本属性、样式等
    【内置操作】：
    【】
     
 
 */

  drop(event: CdkDragDrop<string[]>): void {
    // moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    console.log(event);
  }


  is_drag = true;
  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', d);
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss);
  }

  /*
  
  【问题】
   1.菜单构成？  菜单-》指定功能主页？     需要新的结构支持
   2.功能构成？  功能-》一组页面组合构成？
   3.页面构成？
   4.组件构成？
   5.页面之间交互？
   6.页面内部(组件)交互？
   7.组件内部交互？
   8.按钮操作如何执行？
   9.组件、页面 如何自动执行ajax？【低】
   10.权限施加？ （分配操作权限结构）
   11.【未确定】按钮配置、数据组装？


   【功能构成】
    创建一个功能应该包含主页-》子页（页引用、方便权限管理）
    引用页面时：注意引用页面版本、last(最新版本) 指定版本（启用）
    
    页面关联【code】唯一  （项目为主，一个项目下唯一）



   【组件配置实现目标】
   页面(布局组件)、组件均支持“热插拔”  每个组件均有调用接口



   【分析页面结构】
    1.布局可递归（扩充部分布局可收缩）
    2.组件集合


   【配置结构拆分】

    注意：弹出表单、弹出页面  一致对待  合并；弹出内容均为子页面;


   【分析组件】
    组件包含内容
    -----------属性-------------
    1.组件标准属性 【组件标识、组件编码】 
    2.组件基本属性 【设置组件基本属性，基础组件提供属性接口】
    3.组件扩充属性 【自定义组件属性,补充组件属性,自定义】
    -----------布局、样式-------
    4.组件布局【例如：表单等】
    5.组件样式
    -----------交互-------------
    6.组件接口（规范标准名称，加载 load等等）
    7.组件命令定义 cmd（全局唯一命令）
    8.组件事件
    9.组件监听(监听命令)
    -----------属性-》功能-------------
    10.组件功能  【例如：级联、自定义列、自定义操作】
    -----------操作方法-------------
    11.自定义操作 


    【前置条件】多条件、多响应；

     前置通过：执行内容===》可以执行方法（方法完成后）-》继续执行当前内容，执行不间断
     未满足条件：执行内容

     
   [
     {
       id:'001',
       condition:{
         ? 参数远程构建 局部参数 类似异步验证



       },
       result:{
         on:{
           type:confirm\conent\messsage 确认\内容\提示消息
           execute:next / 执行下一个；通过；阻止； next 、pass、prevent、
         },
         off:{
           type:confirm\conent\messsage 确认\内容\提示消息
           execute:next / 执行下一个；通过；阻止； next 、pass、prevent、
         }
       }
      }


    ]





    【数据服务】
     服务，可取当前页组件参数、接口等互选信息。
     1.提供页公共参数（页初始化参数）
     2.提供组件参数（temp、init、compt）
     3.提供组件接口（接口名称、参数列表）
     4.提供当前命令列表  （可查阅命令）


    【组件公共属性】
     主数据源:  根据主数据源 生成组件【列参数】
     数据列: 标识、绑定组件列、其他...

     【特殊、动态表格】
     列信息是未知，当前行数据，取object 对象、或者字符串


     【数据库分析】==========================================================================

     ------------------------------
     【存储页】
         标识、编码、版本、启用状态、创建时间、创建人、标准json、配置json

      **原因**：json版本由用户自行控制，每个新增版本都是手动创建。
     【页变更历史记录】 (详细记载当前code下、不同版本 json 变更明细记录，方便做版本回溯。)
         标识、编码、版本、变更前标准json、变更后标准json、变更前配置json、变更后配置json、变更备注、变更时间

      【页面布局结构树】
         标识、所属页、类型（布局、组件、操作、行内操作、字段）、父节点、标题、编码、唯一标识（组合标识、权限用，系统生成）
    ------------------------------

      【组件分类】
      【组件属性枚举】
         标识、编码、描述
      【组件库】
         标识、组件名称、组件编码、属性表单json、
      【组件明细_拥有属性】（例如：数据表格：拥有 主资源配置、表格列配置、级联配置、接口配置、命令配置）
        标识、所属组件、拥有属性code
      【组件明细_可执行方法】
        标识、所属组件、方法编码、备注描述
      【组件明细_组件内置参数】（例如：表格有 选中行、勾选行、勾选id集合等...）
        标识、所属组件、参数编码、数据类型、描述
      【组件变更记录】
        标识、所属组件、变更属性类型（属性、可执行方法、内置参数）、变更类型（新增、替换、作废）、变更前、变更后、变更日期、变更人
  
  */


  VC_PAGE = {
    layoutJson: {

    },
    componentsJson: [

    ]
  }


  VC_PAGE_SERVICE = {
    pageConent: [  // 当前页的信息独立，页内容可与其他组件内容做合并，页内容是全局信息

    ],
    bodyConent: [
      {
        comptId: '001',
        parameter: { // 参数

        },
        function: [  // 可执行方法

        ]
      }

    ]
  }
  VC_PAGE_DATA_SERVICE = [

    {
      comptId: '001',
      type: "mainPage", // 主页【会将信息传递至子节点】
      parameter: [// 参数
        {
          parameter_type: 'tempValue',
          name: 'AA',
          commentId: '001'
        }

      ],
      function: [  // 可执行方法

      ],
      interface: [

      ],
      comd: [

      ]
    },
    {
      comptId: '002',
      type: "component", // 主页【会将信息传递至子节点】
      hasMainPage: '001',// 可继承公共属性
      parameter: [ // 参数
        {
          parameter_type: 'initValue',
          name: 'BB',
          commentId: '002'
        }

      ],
      method: [  // 可执行方法

      ],
      interface: [

      ],
      command: [

      ]
    }


  ]


  // 待选参数数据服务
  public service_component_paramter_list() {

    let paramter_list = [];

    this.VC_PAGE_DATA_SERVICE.forEach((cmpt_item) => {

      if (cmpt_item.hasOwnProperty('parameter')) {
        paramter_list.push(cmpt_item['parameter']);
      }

    });
    console.log(paramter_list);
  }

  // 测试 webSql 当前页交互数据比较方便【可监听数据变化】。
  database;
  public testDB() {
    if (window['openDatabase']) {
      // 操作 web SQL  
      // this.database = window['openDatabase']('stu', '1.0', '学生表', 1024 * 1024, function () { });
      this.database = window['openDatabase']('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
      this.database.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS WIN (id unique, name)');
      });
      this.database.transaction(function (tx) {
        tx.executeSql('INSERT INTO WIN (id, name) VALUES (3, "张三")');
        tx.executeSql('INSERT INTO WIN (id, name) VALUES (4, "李四22")');
      });
      this.database.transaction(function (tx) {
        tx.executeSql('SELECT * FROM WIN', [], function (tx, results) {
          var len = results.rows.length, i;
          for (i = 0; i < len; i++) {
            console.log(results.rows.item(i).name);
          }
          console.log(results.rows);

        }, null);
      });
      console.log('当前浏览器支持 webSQL !!!', this.database);
    } else {
      console.log('当前浏览器不支持 webSQL !!!');
    }
    // var db = openDatabase("myDB","1.0","test db",1024*100);
    /*
    说明： 
    1. 该方法返回的是创建的数据库的对象，如果该数据库不存在才会创建这个数据库。 
    2. 第一个参数：数据库的名称 
       第二个参数：数据库的版本号 
       第三个参数：数据库的描述 
       第四个参数：数据库的大小

       */
  }



  public compute() {

    // d *（a + b * c）-g

    // 层级递进带优先级计算优先级
    let content = {
      "type": "compute ",
      "compute": {
        expression: [ // 值：value  运算符号 symbol
          {
            type: "symbol",
            valueName: "-",
            children: [
              {
                type: "symbol",
                valueName: "*",  // 目前支持 +-*/
                children: [
                  {
                    type: "value",
                    valueName: "d"
                  },
                  {
                    type: "symbol",
                    valueName: "()",
                    children: [
                      {
                        type: "symbol",
                        valueName: "+",
                        children: [
                          {
                            type: "value",
                            valueName: "a"
                          },
                          {
                            type: "symbol",
                            valueName: "*",
                            children: [
                              {
                                type: "value",
                                valueName: "b"
                              },
                              {
                                type: "value",
                                valueName: "c"
                              }
                            ]
                          }

                        ]
                      }

                    ]
                  }
                ]
              },
              {
                type: "value",
                valueName: "g"
              }

            ]
          }

        ]
      }
    }

    // 表达式 解析时计算   symbol:'default', 标识无运算符号
    let content1 = {
      "type": "compute ",
      "compute": {
        expression: [ // 值：value  运算符号 symbol
          {
            type: "value",
            symbol: 'default',
            valueName: "d",
          },
          {
            type: "value",
            symbol: "*",
            children: [
              {
                type: "value",
                symbol: "()",
                children: [
                  {
                    type: "value",
                    symbol: "default",
                    valueName: "a"
                  },
                  {
                    type: "value",
                    symbol: "+",
                    valueName: "b"
                  },
                  {
                    type: "value",
                    symbol: "*",
                    valueName: "c"
                  }
                ]
              },
              {
                type: "value",
                valueName: "g"
              }

            ]
          },
          {
            type: "value",
            symbol: '-',
            valueName: "g",
          }

        ]
      }
    }
  }

}
