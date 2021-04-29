import { IDataListTrigger } from '../bsn-trigger/data-list.trigger.interface';

export const CN_DATA_LIST_METHOD: IDataListTrigger = {
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
    // action
    DIALOG: 'showDialog',
    WINDOW: 'showWindow',
    UPLOAD: 'showUpload',
    DIALOG_BATCH: 'showBatchDialog',
    LAYOUT_DIALOG: 'showLayoutDialog',
    CONFIRM: 'showConfirm',
    CHECKED_ITEMS_IDS_CONFIRM: "showCheckedItemsIdsConfirm",
    MESSAGE: 'showMessage',
    LOAD_REFRESH_DATA: 'loadRefreshData',


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
    ADD_LIST_ITEM: 'addListItem',
    EDIT_LIST_ITEM: 'editListItem',

    // link
    LINK: 'link',
    LINK_TO: 'linkTo',

    // operation
    SAVE_ROW: 'saveRow',
    SAVE_ROWS: 'saveRows',
    DELETE_CURRENT_ROW: 'deleteCurrentRow',
    DELETE_CHECKED_ROWS: 'deleteCheckedRows',
    EXECUTE_CURRENT_ROW: 'executeCurrentRow',
    EXECUTE_SELECTED_ROW: 'executeSelectRow',
    EXECUTE_CHECKED_ROWS: 'executeCheckedRows',
    EXECUTE_CHECKED_ROWS_IDS: 'executeCheckedRowsIds',
    EXECUTE_POPUP_CLOSE: 'executePopupClose'
}