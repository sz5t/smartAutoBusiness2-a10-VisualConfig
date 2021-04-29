import { BASE_PROPERTY } from './base-property';

export interface IFlowPreviewProperty {
  FORM_VALUE: any;
  FORM_STATE: any;
  FORM_VALID: any;
  INIT_VALUE: any;
  TEMP_VALUE: any;
}

// tslint:disable-next-line: one-variable-per-declaration
export const CN_FLOW_PREVIEW_PROPERTY: IFlowPreviewProperty = {
  ...BASE_PROPERTY,
  FORM_VALUE: 'FORM_VALUE',
  FORM_STATE: 'FORM_STATE',
  FORM_VALID: 'FORM_VALID',
};
