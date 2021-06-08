import { CommonUtils } from "src/app/core/utils/common-utils";
import { getYear, getISOWeek, getMonth, getDate } from 'date-fns';
import { ActivatedRoute } from "@angular/router";

export interface ParametersResolverModel {
    params: any[]; // 参数配置
    tempValue?: any; // 临时变量
    componentValue?: any; // 组件值
    initValue?: any; // 初始值
    cacheValue?: any; // 缓存值
    cascadeValue?: any; // 级联值
    returnValue?: any; // 存储过程返回值
    addedItems?: any[]; // 添加的元素值，包括行和节点
    editedItems?: any[]; // 编辑的元素值，包括行和节点
    checkedItems?: any; // 勾选中的元素值，包括行和节点
    selectedItems?: any; // 选中的元素值，包括行和节点
    currentItems?: any; // 当前元素值，包括行和节点
    userValue?: any; // 当前用户的缓存信息
    menuValue?: any; // 菜单值
    router?: ActivatedRoute; // 路由参数
}

export interface IParameter {
    buildParameter(): any;
}

export class SmtParameterResolver {
    public static resolve(model: ParametersResolverModel) {
        const showNull = false;
        const result: any = {};
        if (Array.isArray(model.params)) {
            for (const param of model.params) {
                const paramType = param.type;
                if (paramType) {
                    const val = this[paramType](param, model, showNull);
                    if (param.dataType && (val || val === 0 || val === '')) {
                        result[param.name] = CommonUtils.getResultByDataType(val, param.dataType);
                    } else if (param.dataType === 'nullable') {
                        result[param.name] = CommonUtils.getResultByDataType(val, param.dataType);
                    } else {
                        (val || val === 0) && (result[param.name] = val);
                    }
                }
            }
        }
        return result;
    }

    public static bodyParamsResovel(model: ParametersResolverModel) {
        const showNull = true;
        const result: any = {};
        if (Array.isArray(model.params)) {
            for (const param of model.params) {
                const paramType = param.type;
                if (paramType) {
                    const val = this[paramType](param, model, showNull);
                    if (param.dataType && (val || val === 0 || val === '')) {
                        result[param.name] = CommonUtils.getResultByDataType(val, param.dataType);
                    } else if (param.dataType === 'nullable') {
                        result[param.name] = CommonUtils.getResultByDataType(val, param.dataType);
                    } else {
                        (val || val === 0) && (result[param.name] = val);
                    }
                }
            }
        }
        return result;
    }

    private static tempValue(param, model, parseNull) {
        return new TempValueParameter(param, model, parseNull).buildParameter();
    }

    private static value(param, model, parseNull) {
        return new ValueParamParameter(param, model, parseNull).buildParameter();
    }

    private static systemValue(param, model, parseNull) {
        return new systemValueParameter(param, model, parseNull).buildParameter();
    }

    private static componentValue(param, model, parseNull) {
        return new ComponentValueParameter(param, model, parseNull).buildParameter();
    }

    private static checkedItems(param, model, parseNull) {
        return new CheckedItemsParameter(param, model, parseNull).buildParameter();
    }

    private static selectedItems(param, model, parseNull) {
        return new SelectedItemsParameter(param, model, parseNull).buildParameter();
    }

    private static currentItems(param, model, parseNull) {
        return new CurrentItemsParameter(param, model, parseNull).buildParameter();
    }

    private static userValue(param, model, parseNull) {
        return new UserValueParameter(param, model, parseNull).buildParameter();
    }

    private static menuValue(param, model, parseNull) {
        return new MenuValueParameter(param, model, parseNull).buildParameter();
    }

    private static cacheValue(param, model, parseNull) {
        return new CacheValueParameter(param, model, parseNull).buildParameter();
    }

    private static initValue(param, model, parseNull) {
        return new InitValueParameter(param, model, parseNull).buildParameter();
    }

    private static cascadeValue(param, model, parseNull) {
        return new CascadeValueParameter(param, model, parseNull).buildParameter();
    }

    private static returnValue(param, model, parseNull) {
        return new ReturnValueParameter(param, model, parseNull).buildParameter();
    }

    private static router(param, model, parseNull) {
        return new RouterParameter(param, model, parseNull).buildParameter();
    }

    public static addedItems(param, model, parseNull) {
        return new AddedItems(param, model, parseNull).buildParameter();
    }

    public static editedItems(param, model, parseNull) {
        return new EditedItems(param, model, parseNull).buildParameter();
    }
}

class BaseParameter {
    // 构建匹配参数
    public getParameter(conditionType, value) {
        let strQ = '';
        if (!value) {
            // return strQ;
        }
        switch (conditionType) {
            case 'eq': // =
                // strQ = strQ + 'eq( '+ value +' )';
                strQ = `${strQ}eq(${value})`;
                break;
            case 'neq': // !=
                // strQ = strQ + '!eq( + value + )';
                strQ = `${strQ}!eq(${value})`;
                break;
            case 'ctn': // like
                // strQ = strQ + "ctn(%" + value + "%)";
                strQ = `${strQ}ctn(%${value}%)`;
                break;
            case 'nctn': // not like
                // strQ = strQ + "!ctn(%" + value + "%)";
                strQ = `${strQ}!ctn(%${value}%)`;
                break;
            case 'in': // in  如果是input 是这样取值，其他则是多选取值
                // strQ = strQ + 'in( + value + )';
                strQ = `${strQ}in(${value})`;
                break;
            case 'nin': // not in  如果是input 是这样取值，其他则是多选取值
                // strQ = strQ + '!in( + value + )';
                strQ = `${strQ}!in(${value})`;
                break;
            case 'btn': // between
                //  strQ = strQ + 'btn( + value + )';
                strQ = `${strQ}btn(${value})`;
                break;
            case 'ge': // >=
                // strQ = strQ + 'ge(' + value + ')';
                strQ = `${strQ}ge(${value})`;
                break;
            case 'gt': // >
                // strQ = strQ + 'gt(' + value + ')';
                strQ = `${strQ}gt(${value})`;
                break;
            case 'le': // <=
                // strQ = strQ + 'le(' + value + ')';
                strQ = `${strQ}le(${value})`;
                break;
            case 'lt': // <
                // strQ = strQ + 'lt(' + value + ')';
                strQ = `${strQ}lt(${value})`;
                break;
            case 'like':
                strQ = `like(%${value}%)`;
                break;
            default:
                strQ = value;
                break;
        }

        if (!value) {
            if (value !== 0) {
                strQ = null;
            }
        }
        return strQ;
    }

    // 获取默认时间(多语言存在问题)
    public getDefaultDate(dataType) {
        let dValue;
        switch (dataType) {
            case 'defaultWeek':
                dValue = `${getYear(Date.now())}-${getISOWeek(Date.now())}`;
                break;
            case 'defaultDate':
                dValue = `${getYear(Date.now())}-${getMonth(Date.now()) + 1}-${getDate(Date.now())}`;
                break;
            case 'defaultMonth':
                dValue = `${getYear(Date.now())}-${getMonth(Date.now()) + 1}`;
                break;
            case 'defaultYear':
                dValue = `${getYear(Date.now())}`;
                break;
        }
        return dValue;
    }
}

class TempValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const tempVal = this._model.tempValue;
            if (this._param.valueName) {
                this._result = tempVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const tempVal = this._model.tempValue;
            if (this._param.valueName) {
                const value = tempVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class ValueParamParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            if (this._param.value === 'null') {
                this._param.value = null;
            }
            this._result = this._param.value;
        } else {
            if (this._param.conditionType) {
                this._result = this.getParameter(this._param.conditionType, this._param.value);
            } else {
                this._result = this._param.value;
            }
        }
        return this._result;
    }
}

class systemValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            switch (this._param.valueName) {
                case 'GUID':
                    this._result = CommonUtils.uuID(36);
                    return this._result;
                case 'defaultWeek':
                    this._result = `${getYear(Date.now())}-${getISOWeek(Date.now())}`;
                    return this._result;
                case 'defaultDate':
                    this._result = `${getYear(Date.now())}-${getMonth(Date.now()) + 1}-${getDate(Date.now())}`;
                    return this._result;
                case 'defaultMonth':
                    this._result = `${getYear(Date.now())}-${getMonth(Date.now()) + 1}`;
                    return this._result;
                case 'defaultYear':
                    this._result = `${getYear(Date.now())}`;
                    return this._result;
            }
        } else {
            let dateValue;
            switch (this._param.valueName) {
                case 'GUID':
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, CommonUtils.uuID(36));
                    } else {
                        this._result = CommonUtils.uuID(36);
                    }
                    return this._result;
                case 'defaultWeek':
                    dateValue = `${getYear(Date.now())}-${getISOWeek(Date.now())}`;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, dateValue);
                    } else {
                        this._result = dateValue;
                    }
                    return this._result;
                case 'defaultDate':
                    dateValue = `${getYear(Date.now())}-${getMonth(Date.now()) + 1}-${getDate(Date.now())}`;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, dateValue);
                    } else {
                        this._result = dateValue;
                    }
                    return this._result;
                case 'defaultMonth':
                    dateValue = `${getYear(Date.now())}-${getMonth(Date.now()) + 1}`;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, dateValue);
                    } else {
                        this._result = dateValue;
                    }
                    return this._result;
                case 'defaultYear':
                    dateValue = `${getYear(Date.now())}`;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, dateValue);
                    } else {
                        this._result = dateValue;
                    }
                    return this._result;
            }
        }
    }
}

class ComponentValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const cmpVal = this._model.componentValue;
            if (this._param.valueName) {
                this._result = cmpVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const cmpVal = this._model.componentValue;
            if (this._param.valueName) {
                const value = cmpVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class CheckedItemsParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const checkedVal = this._model.checkedItems;
            if (this._param.valueName) {
                this._result = checkedVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const checkedVal = this._model.checkedItems;
            if (this._param.valueName) {
                const value = checkedVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class SelectedItemsParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const selectededVal = this._model.selectedItems;
            if (this._param.valueName) {
                this._result = selectededVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const selectededVal = this._model.selectedItems;
            if (this._param.valueName) {
                const value = selectededVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class CurrentItemsParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const currentVal = this._model.currentItems;
            if (this._param.valueName) {
                this._result = currentVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const currentVal = this._model.currentItems;
            if (this._param.valueName) {
                const value = currentVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class UserValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const userVal = this._model.userValue;
            if (this._param.valueName) {
                this._result = userVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const userVal = this._model.userValue;
            if (this._param.valueName) {
                const value = userVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class MenuValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const menuVal = this._model.menuValue;
            if (this._param.valueName) {
                this._result = menuVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const menuVal = this._model.menuValue;
            if (this._param.valueName) {
                const value = menuVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class CacheValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const cacheVal = this._model.cacheValue;
            if (this._param.valueName) {
                this._result = cacheVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const cacheVal = this._model.cacheValue;
            if (this._param.valueName) {
                const value = cacheVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class InitValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const initVal = this._model.initValue;
            if (this._param.valueName) {
                this._result = initVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const initVal = this._model.initValue;
            if (this._param.valueName) {
                const value = initVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class CascadeValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const cascadeVal = this._model.cascadeValue;
            if (this._param.valueName) {
                this._result = cascadeVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const cascadeVal = this._model.cascadeValue;
            if (this._param.valueName) {
                const value = cascadeVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class ReturnValueParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const returnVal = this._model.returnValue;
            if (this._param.valueName) {
                this._result = returnVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const returnVal = this._model.returnValue;
            if (this._param.valueName) {
                const value = returnVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class RouterParameter extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const routerVal = this._model.router;
            if (this._param.valueName) {
                this._result = routerVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const routerVal = this._model.router;
            if (this._param.valueName) {
                const value = routerVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class AddedItems extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const addedItemsVal = this._model.addedItems;
            if (this._param.valueName) {
                this._result = addedItemsVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const addedItemsVal = this._model.addedItems;
            if (this._param.valueName) {
                const value = addedItemsVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}

class EditedItems extends BaseParameter implements IParameter {
    private _result: any;
    constructor(private _param, private _model, private _parseNull) {
        super();
    }
    public buildParameter() {
        if (this._parseNull) {
            const editedItemsVal = this._model.editedItems;
            if (this._param.valueName) {
                this._result = editedItemsVal[this._param.valueName];
            } else {
                if (this._param.value) {
                    this._result = this._param.value === 'null' ? null : this._param.value
                }
            }
        } else {
            const editedItemsVal = this._model.editedItems;
            if (this._param.valueName) {
                const value = editedItemsVal[this._param.valueName];
                if (this._param.conditionType) {
                    this._result = this.getParameter(this._param.conditionType, value);
                } else {
                    this._result = value;
                }
            } else {
                if (this._param.value) {
                    const value = this._param.value === 'null' ? null : this._param.value;
                    if (this._param.conditionType) {
                        this._result = this.getParameter(this._param.conditionType, value);
                    } else {
                        this._result = value;
                    }
                }
            }
        }
        return this._result;
    }
}
