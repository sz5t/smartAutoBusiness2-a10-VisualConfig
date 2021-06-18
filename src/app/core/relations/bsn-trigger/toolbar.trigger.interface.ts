
export interface IToolbarTrigger {
    STATE_TO_TEXT: string;
    STATE_TO_EDIT: string;
    EXECUTE_NONE: string;
    EXECUTE_NONE_EDIT: string;
    SET_OPERATION_DATA: string;
    EXECUTE: string;
    EXECUTE_ACTION: string;
    BUTTON_STATE_SWITCH: string;
    ACTION: string;
}

/**
 * 表格功能触发器
 */
export const BSN_TOOLBAR_TRIGGER: IToolbarTrigger = {
    // state
    STATE_TO_TEXT: 'STATE_TO_TEXT',
    STATE_TO_EDIT: 'STATE_TO_EDIT',
    EXECUTE_NONE: 'EXECUTE_NONE',
    EXECUTE_NONE_EDIT: 'EXECUTE_NONE_EDIT',
    SET_OPERATION_DATA: 'SET_OPERATION_DATA',
    EXECUTE: 'EXECUTE',
    EXECUTE_ACTION: 'EXECUTE_ACTION',
    BUTTON_STATE_SWITCH: 'BUTTON_STATE_SWITCH',

    ACTION: 'ACTION'
};
