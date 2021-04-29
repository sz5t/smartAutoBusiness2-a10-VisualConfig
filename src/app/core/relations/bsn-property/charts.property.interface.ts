import { BASE_PROPERTY } from './base-property';

export interface IChartsProperty {
    INIT_VALUE: any;
    TEMP_VALUE: any;
}

// tslint:disable-next-line: one-variable-per-declaration
export const CN_CHARTS_PROPERTY: IChartsProperty = {
    ...BASE_PROPERTY
};
