import { IFlowPreviewTrigger } from "../bsn-trigger/data-flow-preview.trigger.interface";

export const CN_FLOW_PREVIEW_METHOD: IFlowPreviewTrigger = {
  // state
  ADD_FORM: 'addForm',
  EDIT_FORM: 'editForm',
  CANCEL: 'cancel',
  EXECUTE: 'execute',
  REFRESH_AS_CHILD: 'load',
  LOAD_REFRESH_DATA: 'load',
  VALIDATE: 'validate',
  EXECUTE_MODAL: 'executeModal',
  VALUE_CHANGE: 'valueChange',
  MESSAGE: 'showMessage',
  WINDOW: 'showWindow',
  TRANSFER_VALUE: 'transferValue',
  FORM_STATE_SWITCH: 'formStateSwitch',
  // link
  LINK: 'link',
  LINK_TO: 'linkTo',
  EXECUTE_POPUP_CLOSE: 'executePopupClose',
  SELECT_NODE: 'nodeSelected',
  SELECT_EDGE: 'eageSelected'
};
