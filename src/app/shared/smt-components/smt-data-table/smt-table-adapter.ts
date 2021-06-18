
export class SmtDataTableAdapter {
    public transformConfigToDataTbale(config) {
        const dataTableConfig = {};
        dataTableConfig['keyId'] = config.hasOwnProperty('keyId') ? config.keyId : 'ID';
        dataTableConfig['size'] = config.hasOwnProperty('size') ? config.size : 'default';
        dataTableConfig['isShowSizeChanger'] = config.hasOwnProperty('isShowSizeChanger') ? config.isShowSizeChanger : true;
        dataTableConfig['isFrontPagination'] = config.hasOwnProperty('isFrontPagination') ? config.isFrontPagination : false;
        dataTableConfig['isPagination'] = config.hasOwnProperty('isPagination') ? config.isPagination : true;
        dataTableConfig['showTotal'] = config.hasOwnProperty('showTotal') ? config.showTotal : false;
        dataTableConfig['isBordered'] = config.hasOwnProperty('isBordered') ? config.isBordered : false;
        dataTableConfig['showCheckBox'] = config.hasOwnProperty('showCheckBox') ? config.showCheckBox : false;
        dataTableConfig['scroll'] = config.hasOwnProperty('scroll') && Object.keys(config.scroll).length > 0 ? config.scroll : { y: '250px' };
        dataTableConfig['showCheckBoxConfig'] = config.hasOwnProperty('showCheckBoxConfig') ? config.showCheckBoxConfig : {};
        dataTableConfig['pageSize'] = config.hasOwnProperty('pageSize') ? config.pageSize : 10;
        dataTableConfig['pageSizeOptions'] = config.hasOwnProperty('pageSizeOptions') && config.pageSizeOptions.length > 0 ? config.pageSizeOptions : [10, 20, 50, 100];
        dataTableConfig['children'] = config.children.length > 0 ? config.children : [];
        dataTableConfig['columns'] = config.hasOwnProperty('columns') ? config.columns : [];
        dataTableConfig['customCommand'] = config.hasOwnProperty('customCommand') ? config.customCommand : [];
        dataTableConfig['eventConent'] = config.hasOwnProperty('componentEvent') ? config.componentEvent : [];
        dataTableConfig['mainSource'] = config.hasOwnProperty('mainSource') ? config.mainSource : [];
        dataTableConfig['loadingOnInit'] = config.hasOwnProperty('loadingOnInit') ? config.loadingOnInit : false;
        dataTableConfig['async'] = config.hasOwnProperty('async') ? config.async : false;
        return dataTableConfig;
    }
}