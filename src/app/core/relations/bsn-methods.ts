import { IDataGridTrigger } from './bsn-trigger/data-grid.trigger.interface';
import { IToolbarTrigger } from './bsn-trigger/toolbar.trigger.interface';

export const CN_DATA_GRID_METHOD: IDataGridTrigger = {
    // state
    ADD_ROW: 'addRow',
    ADD_CHILD_ROW: 'addChildRow',
    EDIT_ROW: 'editRow',
    EDIT_ROWS: 'editRows',
    CANCEL_NEW_ROW: 'cancelNewRow',
    CANCEL_NEW_ROWS: 'cancelNewRows',
    CANCEL_EDIT_ROW: 'cancelEditRow',
    CANCEL_EDIT_ROWS: 'cancelEditRows',
    SEARCH_ROW: 'searchRow',
    CANCEL_SEARCH_ROW: 'cancelSearchRow',
    CHANGE_ADDED_ROWS_TO_TEXT: 'changeAddedRowsToText',
    CHANGE_EDITED_ROWS_TO_TEXT: 'changeEditedRowsToText',
    SHOW_INVALIDATE_ADDED_ROWS: 'showInvalidateAddedRows',
    SHOW_INVALIDATE_EDITED_ROWS: 'showInvalidateEditedRows',
    DOWN_XLSX: 'down_xlsx',
    // action

    DIALOG: 'showDialog',
    WINDOW: 'showWindow',
    UPLOAD: 'showUpload',
    DIALOG_BATCH: 'showBatchDialog',
    CONFIRM: 'showConfirm',
    CHECKED_ITEMS_IDS_CONFIRM: 'showCheckedItemsIdsConfirm',
    CHECKED_ITEMS_CONFIRM: 'showCheckedItems',

    MESSAGE: 'showMessage',
    DATA_CHECKED_STATUS_CHANGE: 'dataCheckedStatusChange',
    TRANSFER_VALUE: 'transferValue',
    CUSTOM_ACTION: 'component_customAction',

    // behavior
    REFRESH: 'load',
    HIDDEN: 'hidden',
    SHOW: 'show',
    EXPORT: 'export',
    IMPORT: 'import',
    DOWNLOAD: 'download',
    SELECT_ROW: 'selectRow',
    SET_SELECT_ROW: 'setSelectRow',
    CHECK_ROW: 'checkRow',
    REFRESH_AS_CHILD: 'load',
    LOAD_BY_FILTER: 'loadByFilter',
    LOAD_REFRESH_DATA: 'loadRefreshData',

    // command测试
    SEND_COMMAND: 'sendCommand',

    // 按钮操作状态
    STATE_TO_TEXT: 'stateToText',
    STATE_TO_EDIT: 'stateToEdit',



    // link
    LINK: 'link',
    LINK_TO: 'linkTo',

    // operation
    SAVE_ROW: 'saveRow',
    SAVE_ROWS: 'saveRows',
    DELETE_ROW: 'deleteRow',
    DELETE_CURRENT_ROW: 'deleteCurrentRow',
    DELETE_CHECKED_ROWS: 'deleteCheckedRows',
    EXECUTE_CURRENT_ROW: 'executeCurrentRow',
    EXECUTE_SELECTED_ROW: 'executeSelectRow',
    EXECUTE_CHECKED_ROWS: 'executeCheckedRows',
    EXECUTE_CHECKED_ROWS_IDS: 'executeCheckedRowsIds',
    EXECUTE_POPUP_CLOSE: 'executePopupClose',
    EXECUTE_DOWN_FILE: 'downFile',
    EXECUTE_ANALYSIS_LAYOUT: 'executeAnalysisLayout'
};
