
export interface IReportGridTrigger {
    REFRESH_AS_CHILD: string,
    VALIDATE: string,
    EXECUTE_MODAL: string,
    VALUE_CHANGE: string,
    LINK: string,
    LINK_TO: string,
    MESSAGE: string,
    WINDOW: string,
    TRANSFER_VALUE:string,
    REFRESH_CONTAINE:string
}

/**
 * 表单功能触发器
 */
export const BSN_REPORTGRID_TRIGGER: IReportGridTrigger = {
    // state
    REFRESH_AS_CHILD: 'REFRESH_AS_CHILD',
    VALIDATE: 'VALIDATE',
    EXECUTE_MODAL: 'EXECUTE_MODAL',
    VALUE_CHANGE: 'VALUE_CHANGE',
    LINK: 'LINK',
    LINK_TO: 'LINK_TO',
    MESSAGE:'MESSAGE',
    WINDOW: 'WINDOW',
    TRANSFER_VALUE:'TRANSFER_VALUE' ,
    REFRESH_CONTAINE:'REFRESH_CONTAINE'
}