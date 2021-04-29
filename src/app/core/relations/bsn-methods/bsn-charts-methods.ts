import { IChartTrigger } from "../bsn-trigger/charts.trigger.interface";

export const CN_CHARTS_METHOD: IChartTrigger = {
    // action
    MESSAGE: 'showMessage',
    REFRESH_AS_CHILD: 'load',
    // behavior
    REFRESH: 'load',
    // link
    LINK: 'link',
    LINK_TO: 'linkTo'
}