
export class SmtDataTableAdapter {
    public transformConfigToDataTbale(config) {
        const bindObj = {};
        bindObj['keyId'] = config.hasOwnProperty('keyId') ? config.keyId : 'ID';
        bindObj['size'] = config.hasOwnProperty('size') ? config.size : 'default';
        bindObj['isShowSizeChanger'] = config.hasOwnProperty('isShowSizeChanger') ? config.isShowSizeChanger : true;
        bindObj['isFrontPagination'] = config.hasOwnProperty('isFrontPagination') ? config.isFrontPagination : false;
        bindObj['isPagination'] = config.hasOwnProperty('isPagination') ? config.isPagination : true;
        bindObj['showTotal'] = config.hasOwnProperty('showTotal') ? config.showTotal : false;
        bindObj['isBordered'] = config.hasOwnProperty('isBordered') ? config.isBordered : false;
        bindObj['showCheckBox'] = config.hasOwnProperty('showCheckBox') ? config.showCheckBox : false;
        bindObj['scroll'] = config.hasOwnProperty('scroll') && Object.keys(config.scroll).length > 0 ? config.scroll : { y: '250px' };
        bindObj['showCheckBoxConfig'] = config.hasOwnProperty('showCheckBoxConfig') ? config.showCheckBoxConfig : {};
        bindObj['pageSize'] = config.hasOwnProperty('pageSize') ? config.pageSize : 10;
        bindObj['pageSizeOptions'] = config.hasOwnProperty('pageSizeOptions') && config.pageSizeOptions.length > 0 ? config.pageSizeOptions : [10, 20, 50, 100];
        bindObj['children'] = config.children.length > 0 ? config.children : [];
        bindObj['columns'] = config.hasOwnProperty('columns') ? config.columns : [];
        bindObj['customCommand'] = config.hasOwnProperty('customCommand') ? config.customCommand : [];
        bindObj['eventConent'] = config.hasOwnProperty('componentEvent') ? config.componentEvent : [];
        bindObj['mainSource'] = config.hasOwnProperty('mainSource') ? config.mainSource : [];
        bindObj['loadingOnInit'] = config.hasOwnProperty('loadingOnInit') ? config.loadingOnInit : false;
        bindObj['async'] = config.hasOwnProperty('async') ? config.async : false;
        return bindObj;
    }
}