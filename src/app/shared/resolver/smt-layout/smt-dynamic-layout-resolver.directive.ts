import { Directive, OnInit, OnDestroy, Input, ComponentRef, ComponentFactoryResolver, ViewContainerRef, Inject } from '@angular/core';
import { de } from 'date-fns/locale';
import { Subject, Subscription } from 'rxjs';
import { CN_LAYOUT_DIRECTIVE_RESOLVER_METHOD } from 'src/app/core/relations/bsn-methods/layout-directive-resolver-methods';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { pageServerService } from 'src/app/core/services/page/page.service';
import { CnComponentBase } from '../../components/cn-component.base';
import { CnCustomLayoutComponent } from '../../components/layout/cn-custom-layout.component';
import { CnDynamicLayoutComponent } from '../../components/layout/cn-dynamic-layout.component';
// import { CnDynamicPageHeaderComponent } from '../../components/layout/cn-dynamic-page-header.component';
// import { CnPageHeaderComponent } from '../../components/layout/cn-page-header.component';
import { CnTabsComponent } from '../../components/layout/cn-tabs.component';
import { SmtLayoutComponent } from '../../components/smt-layout/smt-layout/smt-layout.component';
import { SmtTabsComponent } from '../../smt-components/smt-tabs/smt-tabs.component';
import { RelationResolver } from '../relation/relation.resolver';
import { LayoutBase, LayoutSize } from './layout.base';
import { LayoutColumn } from './layout.column';
// import { LayoutPageHeader } from './layout.page-header';
import { LayoutRow } from './layout.row';
import { LayoutTabs } from './layout.tabs';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: ' [SmtDynamicLayoutResolverDirective]'
})
export class SmtDynamicLayoutResolverDirective extends CnComponentBase implements OnInit, OnDestroy {
    /**
     * layoutJson:{}
     * componentsJson:{}
     */

    @Input() public config: any;
    @Input() public originData: any;
    @Input() public tempData;
    @Input() public initData;
    @Input() public dataServe;

    private _layoutObj: ComponentRef<any>;
    private _rowsObj: ComponentRef<any>;
    private _tabObj: ComponentRef<any>;
    private _customObj: ComponentRef<any>;
    //   private _pageHeaderObj: ComponentRef<CnPageHeaderComponent>;

    private component: ComponentRef<any>;
    public COMPONENT_METHODS = CN_LAYOUT_DIRECTIVE_RESOLVER_METHOD;
    public COMPONENT_PROPERTY = {};

    private _sender_source$: Subject<any>;
    private _receiver_source$: Subject<any>;
    private _trigger_source$: Subject<any>;

    private _receiver_subscription$: Subscription;
    private _sender_subscription$: Subscription;
    private _trigger_receiver_subscription$: Subscription;
    constructor(
        private _resolver: ComponentFactoryResolver,
        private _container: ViewContainerRef,
        @Inject(BSN_COMPONENT_SERVICES)
        public componentService: ComponentServiceProvider,
    ) {
        super(componentService);
        this.cacheValue = this.componentService.cacheService;
        if (this.tempData) {
            this.tempValue = this.tempData;
        } else {
            this.tempValue = {};
        }
        if (this.initData) {
            this.initValue = this.initData;
        } else {
            this.initValue = {};
        }
    }

    /**
     * 解析级联消息
     */
    private resolveRelations() {
        if (this.config && this.config.cascade && this.config.cascade.messageSender) {
            if (!this._sender_source$) {
                // 解析组件发送消息配置,并注册消息发送对象
                this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
                this._sender_subscription$ = this._sender_source$.subscribe();
            }
        }
        if (this.config && this.config.cascade && this.config.cascade.messageReceiver) {
            // 解析消息接受配置,并注册消息接收对象
            // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
            // this._receiver_subscription$ = this._receiver_source$.subscribe();
            new RelationResolver(this).resolveReceiver(this.config);
        }

        this.config && (this._trigger_source$ = new RelationResolver(this).resolve());
    }

    ngOnInit() {
        let configObj;
        // this.resolveRelations();
        if (typeof (this.config) === 'string') {
            this.config = JSON.parse(this.config);
        }
        // console.log(this.config);
        if (this.config) {
            configObj = this.resolver(this.config);
        }
        if (configObj) {
            switch (configObj.type) {
                case 'col':
                    this.buildLayout(configObj);
                    break;
                // case 'tabs':
                //     this.buildTabsLayout(configObj);
                //     break;
                // case 'pageHeader':
                //   this.buildPageHeader(configObj);
                //   break;
                // case 'customLayout':
                //     this.buildCustomerLayout(configObj);
                //     break;
                default:
                    this.buildLayout(configObj);
            }
        }
    }

    public getCurrentComponentId() {
        return this.config.id;
    }

    public receiveMessage(data) {
        if (this._tabObj) {
            const _initValue_new = { ...this.initValue };
            const _tempValue_new = { ...this.tempValue };
            this._tabObj.instance.initData = _initValue_new;
            this._tabObj.instance.tempData = _tempValue_new;
            this._tabObj.instance.reloadTabContent();
            // this._tabObj.instance.tabsObj = CommonUtils.deepCopy(this._tabObj.instance.tabsObj);
        }
    }

    public tabActiveChangeByMapping(data) {
        if (this._tabObj) {
            const _initValue_new = { ...this.initValue };
            const _tempValue_new = { ...this.tempValue };
            this._tabObj.instance.initData = _initValue_new;
            this._tabObj.instance.tempData = _tempValue_new;
            this._tabObj.instance.setActiveByMapping(data);
            // this._tabObj.instance.tabsObj = CommonUtils.deepCopy(this._tabObj.instance.tabsObj);
        }
    }

    ngOnDestroy(): void {
        // 释放级联对象
        this.unsubscribeRelation();
        // 释放及联接受对象
        if (this._receiver_subscription$) {
            this._receiver_subscription$.unsubscribe();
        }

        if (this._sender_subscription$) {
            this._sender_subscription$.unsubscribe();
        }

        // 释放触发器对象
        if (this._trigger_receiver_subscription$) {
            this._trigger_receiver_subscription$.unsubscribe();
        }

        if (this._trigger_source$) {
            this._trigger_source$.unsubscribe();
        }

        if (this.subscription$) {
            this.subscription$.unsubscribe();
        }
    }

    //   private buildPageHeader(pageHeaderObj: any) {
    //     // console.log('buildLayout Receive message --', this.initValue, this.tempValue);
    //     const cmpt = this._resolver.resolveComponentFactory<any>(CnDynamicPageHeaderComponent);
    //     this._container.clear();
    //     this._pageHeaderObj = this._container.createComponent(cmpt);
    //     this._pageHeaderObj.instance.headerConfig = pageHeaderObj;
    //     if (this.tempValue) {
    //       this._pageHeaderObj.instance.tempData = this.tempData;
    //     }
    //     if (this.initValue) {
    //       this._pageHeaderObj.instance.initData = this.initData;
    //     }
    //     this._pageHeaderObj.instance.dataServe = this.dataServe;
    //   }

    private buildLayout(layoutObj: any) {
        // console.log('buildLayout Receive message --', this.initValue, this.tempValue);
        const cmpt = this._resolver.resolveComponentFactory<any>(SmtLayoutComponent);
        this._container.clear();
        this._layoutObj = this._container.createComponent(cmpt);
        this._layoutObj.instance.layoutObj = layoutObj;
        if (this.tempValue) {
            this._layoutObj.instance.tempData = this.tempData;
        }
        if (this.initValue) {
            this._layoutObj.instance.initData = this.initData;
        }
        this._layoutObj.instance.dataServe = this.dataServe;
    }

    private buildLayoutRows(layoutObj: any) {
        // console.log('buildLayoutRows Receive message --', this.initData, this.tempData);
        const cmpt = this._resolver.resolveComponentFactory<any>(CnDynamicLayoutComponent);
        this._container.clear();
        this._rowsObj = this._container.createComponent(cmpt);
        this._rowsObj.instance.layoutObj = layoutObj;
        if (this.tempValue) {
            this._rowsObj.instance.tempData = this.tempData;
        }
        if (this.initValue) {
            this._rowsObj.instance.initData = this.initData;
        }
        this._rowsObj.instance.dataServe = this.dataServe;
    }

    // private buildTabsLayout(tabsObj: any) {
    //     // console.log('tabsObj Receive message --', this.initData, this.tempData);
    //     const cmpt = this._resolver.resolveComponentFactory<any>(SmtTabsComponent);
    //     this._container.clear();
    //     this._tabObj = this._container.createComponent(cmpt);
    //     this._tabObj.instance.tabsObj = tabsObj;
    //     if (this.tempValue) {
    //         this._tabObj.instance.tempData = this.tempData;
    //     }
    //     if (this.initValue) {
    //         this._tabObj.instance.initData = this.initData;
    //     }
    //     this._tabObj.instance.dataServe = this.dataServe ? this.dataServe : this.pageService;
    // }

    // private buildCustomerLayout(customLayoutObj: any) {
    //     // console.log('customLayoutObj Receive message --', this.initValue, this.tempValue);
    //     const cmpt = this._resolver.resolveComponentFactory<any>(CnCustomLayoutComponent);
    //     this._container.clear();
    //     this._customObj = this._container.createComponent(cmpt);
    //     this._customObj.instance.config = customLayoutObj;
    //     if (this.tempValue) {
    //         this._customObj.instance.tempData = this.tempData;
    //     }
    //     if (this.initValue) {
    //         this._customObj.instance.initData = this.initData;
    //     }
    //     this._customObj.instance.dataServe = this.dataServe;
    // }

    public resolver(cfg) {
        let layoutMapping;
        let componentMapping;
        if (cfg['layoutJson']) {
            layoutMapping = cfg['layoutJson'][0];
            componentMapping = cfg['componentsJson'];
        } else {
            layoutMapping = cfg;
            componentMapping = this.originData;
        }
        return layoutMapping;
        // switch (layoutMapping.type) {
        //     case 'col':
        //         return this.buildLayoutObj(layoutMapping);
        //     // case 'customLayout':
        //     //     return this.buildCustomerObj(cfg);
        //     // case 'tab':
        //     //     return this.buildTabsObj(layoutMapping);
        //     //   case 'pageHeader':
        //     //     return this.buildPageHeaderObj(cfg.pageHeader);
        //     case 'layout':
        //         return this.buildLayoutObj(layoutMapping);
        // }
    }

    // private buildNormalObj(cfg): LayoutBase {
    //     const newLayout = new LayoutBase();
    //     newLayout.container = cfg.container;
    //     newLayout.originData = this.originData ? this.originData : originData;
    //     newLayout.layoutStructure = cfg;
    //     newLayout.type = cfg.type;
    //     newLayout.rows = [];
    //     if (Array.isArray(cfg.rows) && cfg.rows.length > 0) {
    //         for (const row of cfg.rows) {
    //             const newRow = new LayoutRow(row.id, row.type, row.title, '');
    //             newRow.cols = [];
    //             if (Array.isArray(row.cols) && row.cols.length > 0) {
    //                 for (const c of row.cols) {
    //                     const newCol = new LayoutColumn();
    //                     newCol.id = c.id;
    //                     newCol.type = c.type;
    //                     newCol.title = c.title;
    //                     newCol.span = c.span;
    //                     newCol.noBorder = c.noBorder ? true : false;
    //                     newCol.bodyStyle = c.bodyStyle;
    //                     newCol.size = new LayoutSize(c.size);
    //                     newCol.container = c.container;
    //                     c.header && (newCol.header = this.setHeader(c.header));
    //                     this.setContainer(newCol, c);
    //                     newRow.add(newCol);
    //                 }
    //             }
    //             newLayout.add(newRow);
    //         }
    //     }
    //     return newLayout;
    // }

    // private buildLayoutObj(cfg) {
    //     let newLayout = {};
    //     newLayout['container'] = cfg.container;
    //     newLayout['type'] = cfg.type;
    //     newLayout['rows'] = [];
    //     if (Array.isArray(cfg.children)) {
    //         for (const row of cfg.children) {
    //             // const newRow = new LayoutRow(row.id, row.type, row.title, cfg.children.find(e => e.id === row.id));
    //             let newRow = {
    //                 id: row.id,
    //                 type: row.type,
    //                 title: row.title,
    //             }
    //             newRow['cols'] = [];
    //             if (Array.isArray(row.children)) {
    //                 for (const c of row.children) {
    //                     const data = this.dataServe.componentsConfig[c.id];
    //                     let newCol = {
    //                         id: c.id,
    //                         type: data.type,
    //                         title: data.title,
    //                         noBorder: data.noBorder ? true : false,
    //                         bodyStyle: data.bodyStyle ? c.bodyStyle : { height: '450px' },
    //                         size: new LayoutSize(data.size),
    //                         span: data.span,
    //                         container: c.container,
    //                     }
    //                     // if (c.container === 'component') {
    //                     //     newCol['header'] = {};
    //                     //     if (c['children'].length > 0) {
    //                     //         c['children'].map(e => {
    //                     //             newCol['header']['title'] = e.title;
    //                     //             newCol['header']['toolbar'] = {};
    //                     //             if (e['children'].length > 0) {
    //                     //                 e['children'].map(h => {
    //                     //                     if (h['container'] === 'cnToolbar') {
    //                     //                         newCol['header']['toolbar'] = h;
    //                     //                     }
    //                     //                 })
    //                     //             }
    //                     //         })
    //                     //     }
    //                     // }
    //                     // newCol.layoutStructure = row['children'].find(e => e.id === c.id);
    //                     // this.setContainer(newCol, c);
    //                     newRow['cols'].push(newCol);
    //                 }
    //             }
    //             newLayout['rows'].push(newRow);
    //         }
    //     }
    //     return newLayout;
    // }

    private setContainer(containerObj, containerCfg) {
        switch (containerObj.container) {
            case 'tabs':
                containerObj.tabs = containerCfg.tabs;
                break;
            case 'component':
                containerObj.component = this.findComponentById(containerCfg.component.id);
                break;
            case 'rows':
                containerObj.rows = containerCfg.rows;
                break;
        }
    }

    private findComponentById(id) {
        // liu 20.11.12
        // return this.componentService.cacheService.getNone(id);
        return this.getMenuComponentConfigById(id);
        // return this.config.componentsJson.find(id);
    }

    private setHeader(headerCfg) {
        const header: any = headerCfg;
        if (headerCfg.id) {
            // header['toolbar'] = this.componentService.cacheService.getNone(headerCfg.id);

            header.toolbar = this.getMenuComponentConfigById(headerCfg.id);
        }

        return header;
    }

    // private buildCustomerObj(cfg): LayoutBase {
    //     const newLayout = new LayoutBase();
    //     newLayout.container = cfg.container;
    //     newLayout.customLayout = [];
    //     if (Array.isArray(cfg.customLayout) && cfg.customLayout.length > 0) {
    //         for (const c of cfg.customLayout) {
    //             const layout = new LayoutBase();
    //             layout.id = c.id;
    //             layout.type = c.type;
    //             layout.title = c.title;
    //             layout.span = c.span;
    //             layout.hidden = c.hidden;
    //             layout.container = c.container;
    //             layout.layoutType = c.layoutType;
    //             this.setContainer(layout, c);
    //             newLayout.add(layout);
    //         }
    //     }
    //     return newLayout;
    // }

    // private buildTabsObj(cfg): any {
    //     const newTabs = new LayoutTabs();
    //     newTabs.tabType = cfg.tabType;
    //     newTabs.tabPosition = cfg.tabPosition;
    //     newTabs.container = cfg.container;
    //     newTabs.tabContent = cfg.tabContent;
    //     newTabs.tabActiveMapping = cfg.tabActiveMapping;
    //     // if (Array.isArray(cfg.container) && cfg.container.length > 0) {
    //     //     for (const tab of cfg.container) {
    //     //         const newTab = new LayoutTab();
    //     //         newTab.active = tab.active;
    //     //         newTab.id = tab.id;
    //     //         newTab.title = tab.title;
    //     //         newTab.type = tab.type;
    //     //         newTab.container = tab.container;
    //     //         if(tab.tabContent) {
    //     //             newTab.tabContent = tab.tabContent;
    //     //         }
    //     //         newTab.layout = this.resolver(tab.layout);
    //     //         newTabs.add(newTab);
    //     //     }
    //     // }
    //     return newTabs;
    // }

    //   private buildPageHeaderObj(cfg): any {
    //     const newPageHeader = new LayoutPageHeader();
    //     newPageHeader.container = 'pageHeader';
    //     newPageHeader.title = cfg.title;
    //     newPageHeader.breadcrumb = cfg.breadcrumb;
    //     newPageHeader.type = cfg.type;
    //     newPageHeader.subTitle = cfg.subTitle;
    //     newPageHeader.tagColor = cfg.tagColor;
    //     newPageHeader.tagText = cfg.tagText;
    //     newPageHeader.descColumnsCount = cfg.descColumnsCount;
    //     newPageHeader.operations = cfg.operations;
    //     newPageHeader.contentItems = cfg.contentItems;
    //     newPageHeader.extraItems = cfg.extraItems;
    //     newPageHeader.ajaxConfig = cfg.ajaxConfig;
    //     newPageHeader.cascade = cfg.casacde;
    //     newPageHeader.headerMapping = cfg.headMapping;
    //     newPageHeader.contentMapping = cfg.contentMapping;
    //     newPageHeader.footMapping = cfg.footMapping;
    //     newPageHeader.extraMapping = cfg.extraMapping;
    //     newPageHeader.defaultLoading = cfg.defaultLoading;
    //     newPageHeader.layout = cfg.layout;
    //     return newPageHeader;
    //   }
}
