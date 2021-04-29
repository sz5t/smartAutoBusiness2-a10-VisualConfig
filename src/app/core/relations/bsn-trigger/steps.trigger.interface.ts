
export interface IStepsTrigger {
    REFRESH_AS_CHILD: string;
    CLICK_STEP_NODE: string;
    TRANSFER_VALUE: string;
    PREVIOUS: string;
    NEXT: string;
    FINISH: string;
    NEXT_SEND_MESSAGE: string;
    LAST_SEND_MESSAGE: string;
    MESSAGE_SEND_VALUE: string;
}

/**
 * 表单功能触发器
 */
export const BSN_DESCRIPTION_TRIGGER: IStepsTrigger = {
    // state
    REFRESH_AS_CHILD: 'REFRESH_AS_CHILD',
    CLICK_STEP_NODE: 'CLICK_STEP_NODE',
    TRANSFER_VALUE: 'TRANSFER_VALUE',
    PREVIOUS: 'PREVIOUS',
    NEXT: 'NEXT',
    FINISH: 'FINISH',
    NEXT_SEND_MESSAGE: 'NEXT_SEND_MESSAGE',
    LAST_SEND_MESSAGE: 'LAST_SEND_MESSAGE',
    MESSAGE_SEND_VALUE: 'MESSAGE_SEND_VALUE'
};
