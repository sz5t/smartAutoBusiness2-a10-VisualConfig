import { IDataFormTrigger } from '../bsn-trigger/data-form.trigger.interface';

export const CN_DATA_FORM_METHOD: IDataFormTrigger = {
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
  LOAD_BY_CONTAINERS: 'loadByContaines',
  SEND_VALUE: 'sendValue',
  MESSAGE_SEND_VALUE: 'messageSendValue',
  // link
  LINK: 'link',
  LINK_TO: 'linkTo',
  EXECUTE_POPUP_CLOSE: 'executePopupClose',
};
