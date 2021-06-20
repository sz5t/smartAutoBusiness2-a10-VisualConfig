import internal from 'events';

export interface ISmtComponent {
  initEvent(_eventObjs: any[]);
  initCommand(_eventObjs: any[]);
}

export interface IExecuteResult {
  state?: number;
  error?: IError | IError[];
  validation?: IValidation | IValidation[];
  exception?: IException;
  data?: any | any[];
}

export interface IException {
  code: string;
  data: any | any[];
  message: string;
  params: any | any[];
}

export interface IError {
  code: string;
  data: any | any[];
  message: string;
  params: any | any[];
}

export interface IValidation {
  code: string;
  data: any | any[];
  message: string;
  params: any | any[];
  /**
   * 被验证的属性
   */
  field?: string;
}
