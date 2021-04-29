import { IStepsTrigger } from '../bsn-trigger/steps.trigger.interface';

export const CN_STEPS_METHOD: IStepsTrigger = {
    // state
    REFRESH_AS_CHILD: 'load',
    // behavior
    CLICK_STEP_NODE: 'onlyStepOnIndexChange',
    TRANSFER_VALUE: 'transferValue',
    NEXT: 'next',
    PREVIOUS: 'pre',
    FINISH: 'finish',
    NEXT_SEND_MESSAGE: 'nextSendMessage',
    LAST_SEND_MESSAGE: 'lastSendMessage',
    MESSAGE_SEND_VALUE: 'messageSendValue'
};
