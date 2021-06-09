import { Inject, Injectable } from '@angular/core';
import { CommonUtils } from '../../utils/common-utils';

@Injectable()
export class pageServerService {


    //=====公共参数======
    public data: any = [];
    public componentInstance: any = {};
    public componentsConfig: any = {};
    public permissionConfig: any = [];

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


    /**
     * 布局节点配置
     * @param id 
     * @returns 
     */
    public getComponentConfig(id?): any {

        return this.componentsConfig[id];
    }









}