import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-condition',
  templateUrl: './cfg-condition.component.html',
  styles: [
    `
    [nz-row] {
     min-height:50px;
    
      border-bottom: 1px solid #f0f0f0;
    }
    .ant-tag {
      margin-bottom: 8px;
    }
    .dynamic-delete-button {
      cursor: pointer;
      position: relative;
      top: 4px;
      font-size: 24px;
      color: #999;
      transition: all 0.3s;
    }

    .dynamic-delete-button:hover {
      color: #777;
    }
    .ant-card-type-inner .ant-card-body {
      padding: 16px 4px 16px 24px;
    }
    `
  ]
})
export class CfgConditionComponent implements OnInit {
  @Input() public data;
  constructor() { }
  is_drag = true;
  ngOnInit(): void {
    if (!this.data) {
      this.data = [
        {
          id: "001",
          type: '条件', // 括号
          condition: "and",
          conditionStr: "a>6",
          conditionObj: {
            leftName: "a",
            Symbol: ">",
            rightName: "6"
          }
        },
        {
          id: "002",
          type: '括号', // 括号
          condition: "or",
          centent: [
            {
              id: "00201",
              type: '条件', // 括号
              condition: "and",
              conditionStr: "b>6",
              conditionObj: {
                leftName: "b",
                Symbol: ">",
                rightName: "6"
              }
            },
            {
              id: "00202",
              type: '条件', // 括号
              condition: "and",
              conditionStr: "c>6",
              conditionObj: {
                leftName: "a",
                Symbol: ">",
                rightName: "c"
              }
            },
            {
              id: "00203",
              type: '条件', // 括号
              condition: "and",
              conditionStr: "d>6",
              conditionObj: {
                leftName: "d",
                Symbol: ">",
                rightName: "6"
              }
            }
          ]

        }
      ]

    }
  }

  listData = [
    {
      leve: 1
    }
  ]

  /**
   
  1.组件递归 【推荐】效果明显
  2.数据计算平层递归

   */

  addCondition() {
    this.data.push(
      {
        id: CommonUtils.uuID(30),
        type: '条件', // 括号
        condition: "and",
        conditionStr: "ff>6",
        conditionObj: {
          leftName: null,
          Symbol: null,
          rightName: null
        }
      }
    );
  }

  addBrackets() {
    this.data.push(
      {
        id: CommonUtils.uuID(30),
        type: '括号', // 括号
        condition: "and",
        centent: []
      }
    );


  }



  printCondition() {
    let tiao = this.getCondition(this.data);
    console.log('条件', tiao, this.data);
  }
  getCondition(data) {
    let str = "";
    data.forEach((con, i) => {
      if (i === 0) {
        if (con['type'] === '条件') {
          str += " " + this.getConditionObj(con['conditionObj']);
        } else {
          str += " (" + this.getCondition(con['centent']) + ") "
        }
      }
      else {
        if (con['type'] === '条件') {
          str += " " + con['condition'] + " " + this.getConditionObj(con['conditionObj']);
        } else {
          // console.log("括号", con['centent']);
          str += " " + con['condition'] + "   (" + this.getCondition(con['centent']) + ") "
        }
      }

    });
    // console.log(str);
    return str;

  }

  getConditionObj(obj) {
    let str = "";
    if (obj) {
      str = obj["leftName"] + " " + obj["Symbol"] + " " + obj["rightName"]

    }

    return str;

  }


  removeCondition(c: any, e: MouseEvent) {
    console.log("删除条件", c);

    if (c && c['id']) {
      this.data = this.data.filter(d => d.id !== c['id']);
    }

  }


  public compt_p() {

    /**
    
      组件参数：全局参数；被注入进当前组件的参数（来源）
      参数类型
      initValue  构建初始化参数
      tempValue  构建消息等临时参数
      userValue  【系统】用户信息

      当前页的参数->下发至包含子组件（初始构建参数,规则以initValue为标准）
      父级继承【global】全局
      自定义【custom】

      每个页面编辑，提供当前页面数据服务（可自由存取参数）
      页面（定义全局参数，参数接口外部调用时将数据补充完整）

      【组件、页面 接口声明（参数均从接口进入）】
      【组件先定义接口，其他交互才可以调用】！！！！！！！【最重要】

      系统组件内置方法 必须参数 $_参数名称   自定义参数 参数名称
      page:{
        InterfaceConfig:[ // 描述当前页的参数，调用时changeValue 可提供结构
         {
           type:"init",  // 初始化接口
           name:"load", // 加载方法
           parameters:[ // 需要提供参数集合
            {
              name:"", // 参数名称
              valueTo:"initValue" 参数对象 【接口声明值缓存位置】
            }
           ]
         }，
          {
           type:"change",  // 变化接口
           name:"changeValue", // 值变化方法
           parameters:[ // 需要提供参数集合
            {
              name:"", // 参数名称
              valueTo:"tempValue" 参数对象 【接口声明值缓存位置】
            }

           ]
         }，
          {
           type:"refresh",  // 刷新接口
           name:"RefreshLoad", // 刷新方法
           parameters:[ // 需要提供参数集合
            {
              name:"", // 参数名称
              valueTo:"tempValue" 参数对象 【接口声明值缓存位置】
            }

           ]
         }

        ]

      }


     */

    const cmpt = {
      waitCmptP: [
        {
          cmptId: "",

        }
      ],
      cmptP: {
        initValue: [
          {
            id: "",
            name: "",
            dataType: "int/float/string/obj/array",
            formSource: []  // 数据来源
          }
        ],
        tempValue: []

      }
    }


    // 
    let c = {
      page: {

      },
      loadNext: { // 依赖加载

      },
      pageP: [ // 页面参数【供页面数据服务】，每次独立维护一个页面，页面数据存储在临时表，保存时写入正式数据表
        {
          cmptid001: {

          }

        }
      ]



    }


  }

  // 数据服务【提供页面所需参数】
  public getComptS() {
    // 当前页公共参数
    // 当前组件声明参数
    // 当前组件【组件属性】


  }




  // 页面构成
  /*

   左侧： 拖拽源：布局、组件、表单、行内组件
          布局结构树
          两部分可自由缩放
   中间：内容
   右侧：

   */

}
