import { Inject, Injectable } from '@angular/core';
import { CommonUtils } from '../../utils/common-utils';

@Injectable()
export class configFormDataServerService {
    public data: any = [];
    public componentInstance: any = {};
    public treeInstance: any;
    public layoutInstance: any;
    public controlsInstance: any;
    public attrSiderInstance: any;
    public formParameter: any;
    public layoutSourceData: any = {};
    constructor() { }
    public setComponentValue(id?: string, value?: any): void {
        console.log(`当前组件${id}值:`, value);
    }

    // 组件实例
    public setComponentInstace(id?: string, instace?: any): void {
        this.componentInstance[id] = instace;
    }

    // 获取组件值
    /**
     *  组件均是自定义，参数均不同，取值和参数构建，可调用当前组件自身的参数构建组装出响应的参数结构
     *  比较难区分组件内部值，与组件自身值的区分内部值一般是对象，自身值数组或者对象
     * 
     * @param id 组件标识
     */
    public getComponentValue(id?: string): void {
        const _instance = this.componentInstance[id];
        if (_instance) { // 存在实例
            // 参数构建
            _instance.buildParameters();
        }
    }

    /**
     * 获取组件实例
     * @param id 实例标识
     */
    public getInstanceById(id?: string): any {
        const _instance = this.componentInstance[id];
        return _instance;
    }

    /**
     * 获取当前页的实例
     */
    public getInstanceAll(): any {

        return this.componentInstance;
    }

    // 表单设计 实例
    public struct = {
        tree: '',
        conent: '',
        attr: '',
        commentData: []

    }

    /*
    【树】：提供选中事件，选中后触发 属性的响应
    【布局】：和树保存一致的选中
    【属性】：类似级联，应答不同类型选中
    【组件】：编辑的内容，均从组件集合读取，可保持数据一致


    
    */

    /*

    1.布局结构树【选中】 《==》布局上选中  

    2.布局结构触发-》属性栏设置

    3.布局调整-》触发布局结构树变化

    4.树上节点拖拽布局结构变化【暂时不支持】 后期布局内部拖拽偏向于这种
      于当前渲染的布局结构有偏差，相当于布局也分树形结构，内容列表，如此才可以调整结构

    


     */

    // 结构树节点选中
    treeNodeSelected() {
        // 判断手动选中 & 代码选中，交互方式不同



    }

    // 布局节点选中
    layoutNodeSelected(node?) {

        this.treeInstance.defaultSelectedKeys = [node['id']];
        // getTreeNodeByKey
        // nzTreeComponent
        this.controlsLoad(node);
        console.log('布局节点选中', node);
    }

    // 传递小组件配置
    transferComponents() {
        // 组件信息修改，读取均从服务读取，保持数据一致


    }

    controlsLoad(node?) {
        // this.controlsInstance.load(node);
        this.attrSiderInstance.load(node);

    }



    click_node(node?) {

        // 根据node 数据 响应
        //1 判断当前节点类型（布局、组件）

        //2 根据内容更新结构

    }



    /*

     【参数结构】：加载load（无组件参数）；  与 执行参数；  子组件参数（多级联参数）；

     不同命令执行事件，可选择参数不同，部分类型参数不可选

     页面：

     上：【选中参数，参数名称、类型 例如：component【cname】、tempValue【pid】
     左右结构
      左边：参数类型树；
      右边：参数内容
     
     */

    /*

     异步请求 不能配置结构响应，结果效应应该是执行

     exec:{
         ajax:异步请求，
         result：结果响应
     }

     页面：如下

     执行名称：
     执行类型：
     异步交互：{

     }，
     交互结果响应：{

     }
    
    
    */


    public l_createCol(pid) {
        let col_id = CommonUtils.uuID(30);
        let col_obj = {
            "id": col_id,
            "key": col_id,
            "type": "col",
            "title": "列",
            "parentId": pid,
            "expanded": true,
            "span": 24,
            "size": this.CreateLayout_col_size(24),
            "showTitle": false,
            "container": "component",
            "component": this.CreateLayout_component(col_id)
        }

        return col_obj;

    }
    CreateLayout_component(pid?) {
        let cmpt_id = CommonUtils.uuID(30);
        let cmpt_obj = {
            "id": cmpt_id,
            "key": cmpt_id,
            "type": "",
            "title": "明细项",
            "parentId": pid,
            "expanded": true
        }

        this.layoutSourceData[cmpt_id] = cmpt_obj;
        return cmpt_obj;


    }

    CreateLayout() {

        let layout_id = CommonUtils.uuID(30);
        let layout_obj = {
            "id": layout_id,
            "key": layout_id,
            "type": "layout",
            "title": "布局",
            "container": "rows",
            "expanded": true,
            "parentId": 'null'
        }
        this.layoutSourceData[layout_id] = layout_obj;


    }

    CreateLayout_row(count?, pid?) {

        let rows = [];
        for (let i = 0; i < count; i++) {
            let row_id = CommonUtils.uuID(30);
            let row_obj = {
                "id": row_id,
                "key": row_id,
                "type": "row",
                "title": "【新增】行",
                "parentId": pid,
                "expanded": true,
                "container": "cols"
            }
        }
        return rows;

    }

    CreateLayout_col_size(size?) {

        let sizeObj = {
            "nzXs": size,
            "nzSm": size,
            "nzMd": size,
            "nzLg": size,
            "ngXl": size,
            "nzXXl": size
        }
        return sizeObj;

    }



    public dynamic_attr() {
        let c = {

            type: 'input',
            label: '',
            sourceData: {
                name: 'title'
            },
            layout: {

            }

        }

    }


    // 可选参数
    Parameter = {
        tempValue: [
            { id: '001', name: 'pid', title: '', source: '[消息]', description: '', dataType: '' }
        ],
        initValue: [
            { id: '002', name: 'pageId', title: '', source: '[初始化]', description: '', dataType: '' }
        ],
        componentValue: [
            { id: '003', name: 'pageId', title: '', source: '[组件值]', description: '', dataType: '' }
        ]
    }

    // 【数据集】主资源参数，表格 列字段；表单 表单项字段； 指定字段-》从此处选择
    mainParameter = [
        {
            'id': '0001',
            name: '',
            title: '',
            source: '[主资源]',  // 主资源、自定义
            description: '',
            dataType: '' // 数据类型


        }
    ]

    //=============【参数】===============

    /**
     * 获取当前参数列表
    */
    public getParameter() {

        return this.Parameter;

    }

    // 添加当前参数列表
    public setParameter(data, type) {
        if (type) {
            let _data: [] = this.Parameter[type];
            let _index = _data.findIndex(item => {
                item['name'] === data['name']
            });
            if (_index > -1) {
                // 修改属性（来源）可不做

            } else {
                // 新增属性
                this.Parameter[type].push(data);
            }
        }


    }

    // 绑定主资源生成 组件参数
    createMainResourceParameter(data?) {
        this.mainParameter = data;

        console.log('生成主资源参数，feild 字段绑定取值');


    }

    // 删除参数
    public deleteParameter(data, type) {
        if (type) {
            let _data: [] = this.Parameter[type];
            let _index = _data.findIndex(item => {
                item['name'] === data['name']
            });
            if (_index > -1) {
                // 删除属性
                this.Parameter[type].splice(_index, 1);
            }
        }

    }

    //=================================


}
