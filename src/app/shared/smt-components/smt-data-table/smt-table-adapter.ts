
export class SmtDataTableAdapter {
    public transformConfigToDataTbale(config) {
        const dataTableConfig = {};
        dataTableConfig['KEY_ID'] = config.keyId ? config.keyId : 'ID';
        dataTableConfig['size'] = config.size ? config.size : 'default';
        dataTableConfig['isShowSizeChanger'] = config.isShowSizeChanger ? config.isShowSizeChanger : true;
        dataTableConfig['isFrontPagination'] = config.isFrontPagination ? config.isFrontPagination : false;
        dataTableConfig['isPagination'] = config.isPagination ? config.isPagination : true;
        dataTableConfig['showTotal'] = config.showTotal ? config.showTotal : false;
        dataTableConfig['isBordered'] = config.isBordered ? config.isBordered : false;
        dataTableConfig['showCheckBox'] = config.showCheckBox ? config.showCheckBox : false;
        dataTableConfig['scroll'] = Object.keys(config.scroll).length > 0 ? config.scroll : { y: '250px' };
        dataTableConfig['showCheckBoxConfig'] = config.showCheckBoxConfig ? config.showCheckBoxConfig : {};
        dataTableConfig['pageSize'] = config.pageSize ? config.pageSize : 10;
        dataTableConfig['pageSizeOptions'] = config.pageSizeOptions.length > 0 ? config.pageSizeOptions : [10, 20, 50, 100];
        dataTableConfig['children'] = config.children.length > 0 ? config.children : [];
        dataTableConfig['columns'] = config.columns ? config.columns : [];
        dataTableConfig['customCommand'] = config.customCommand ? config.customCommand : [];
        dataTableConfig['eventConent'] = config.eventConent ? config.eventConent : [];
        return dataTableConfig;
    }
}