
export interface ITimeLineTrigger {
    REFRESH_AS_CHILD: string;
    CLICK_NODE: string;
    TRANSFER_VALUE: string;
}

/**
 * 表单功能触发器
 */
export const BSN_DESCRIPTION_TRIGGER: ITimeLineTrigger = {
    // state
    REFRESH_AS_CHILD: 'REFRESH_AS_CHILD',
    CLICK_NODE: 'CLICK_STEP_NODE',
    TRANSFER_VALUE: 'TRANSFER_VALUE'
};