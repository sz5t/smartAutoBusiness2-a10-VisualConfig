
export interface IChartTrigger {
    REFRESH_AS_CHILD: string;
    MESSAGE: string;
    REFRESH: string;
    LINK: string;
    LINK_TO: string;
}

/**
 * 表单功能触发器
 */
export const BSN_CHARTS_TRIGGER: IChartTrigger = {
    // state
    REFRESH_AS_CHILD: 'REFRESH_AS_CHILD',
    MESSAGE: 'MESSAGE',
    // behavior
    REFRESH: 'REFRESH',
    // link
    LINK: 'LINK',
    LINK_TO: 'LINK_TO'
};