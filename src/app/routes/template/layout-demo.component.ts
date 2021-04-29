import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { BusinessObjectBase } from 'src/app/shared/business/business-object.base';
import { CnComponentBase } from 'src/app/shared/components/cn-component.base';
import { BeforeOperationResolver } from 'src/app/shared/resolver/beforeOperation/before-operation.resolver';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-layout-resolver',
  templateUrl: './layout-demo.component.html',
  styles: [
    `
      :host ::ng-deep .ant-card-head {
        min-height: 36px;
      }

      .trigger {
        font-size: 20px;
        padding: 0 5px;
        cursor: pointer;
        transition: color 0.3;
        right: 0px;
        position: relative;
        z-index: 8;
        padding-top: 8px;
      }
      .trigger:hover {
        color: #1890ff;
      }

      .collapsedArea {
        position: relative;
      }
    `,
  ],
})
export class LayoutDemoComponent extends CnComponentBase implements OnInit {
  public config = {
    id: '4K0naM',
    type: 'layout',
    title: '布局4K0naM',
    container: 'rows',
    rows: [
      {
        cols: [
          {
            id: 'r5zDHB2-1',
            col: 'cc',
            type: 'col',
            title: '',
            span: 24,
            container: 'component',
            size: {
              nzXs: 24,
              nzSm: 24,
              nzMd: 24,
              nzLg: 24,
              nzXl: 24,
              nzXXl: 24,
            },
            component: {
              id: 'toolbar_001',
              component: 'cnToolbar',
              size: 'default',
              cascade: {
                messageSender: [
                  {
                    id: 'toolbar_01',
                    senderId: 'view_01',
                    triggerType: 'OPERATION',
                    trigger: 'EXECUTE_CHECKED_ROWS',
                    triggerMoment: 'after',
                    sendData: [
                      {
                        beforeSend: [],
                        reveicerId: '',
                        receiverTriggerType: 'BEHAVIOR',
                        receiverTrigger: 'REFRESH_AS_CHILD',
                        params: [
                          {
                            name: 'parent_id',
                            type: 'item',
                            valueName: 'id',
                          },
                          {
                            name: 'parent_name',
                            type: 'item',
                            valueName: 'name',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              condition: [
                {
                  id: 'add_state_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                        {
                          type: 'element',
                          name: 'name',
                          matchValue: '1',
                          match: 'eq',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'edit_state_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'add_save_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                    {
                      type: 'component',
                      valueName: 'ROWS_ADDED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'edit_save_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_EDITED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                  ],
                },
              ],
              ajaxConfig: [
                {
                  id: 'add_save_1',
                  url: 'information/test2',
                  urlType: 'inner',
                  ajaxType: 'post',
                  params: [
                    {
                      name: 'state',
                      type: 'value',
                      value: 'DVM',
                    },
                  ],
                  outputParameters: [],
                  result: [
                    {
                      name: 'data',
                      showMessageWithNext: 0,
                      message: 'message.ajax.state.success',
                      senderId: 'toolbar_01',
                    },
                    {
                      name: 'validation',
                      senderId: 'toolbar_01',
                    },
                    {
                      name: 'error',
                      senderId: 'toolbar_01',
                    },
                  ],
                },
                {
                  id: 'edit_save_1',
                  url: 'information/test2',
                  urlType: 'inner',
                  ajaxType: 'put',
                  params: [
                    {
                      name: 'state',
                      type: 'value',
                      value: 'DVM',
                    },
                  ],
                  outputParameters: [],
                  result: [],
                },
              ],
              beforeTrigger: [],
              afterTrigger: [
                {
                  id: '',
                  senderId: 'view_01',
                  sendData: [
                    {
                      beforeSend: [],
                      reveicerId: '',
                      receiverTriggerType: 'BEHAVIOR',
                      receiverTrigger: 'REFRESH_AS_CHILD',
                      params: [
                        {
                          name: 'parent_id',
                          type: 'item',
                          valueName: 'id',
                        },
                        {
                          name: 'parent_name',
                          type: 'item',
                          valueName: 'name',
                        },
                      ],
                    },
                  ],
                },
              ],
              toolbar: [
                {
                  targetViewId: 'view_01',
                  group: [
                    {
                      id: 'M_refresh',
                      text: '刷新',
                      icon: 'reload',
                      color: 'text-primary',
                      hidden: false,
                      disabled: false,
                      execute: [
                        {
                          triggerType: 'BEHAVIOR',
                          trigger: 'REFRESH',
                        },
                      ],
                    },
                    {
                      id: 'M_addRow',
                      text: '新增',
                      icon: 'plus',
                      color: 'text-primary',
                      hidden: false,
                      disabled: false,
                      execute: [
                        {
                          triggerType: 'STATE',
                          trigger: 'ADD_ROW',
                          // "conditionId": "add_state_1"
                        },
                      ],
                    },
                    {
                      id: 'M_updateRow',
                      text: '修改',
                      icon: 'edit',
                      color: 'text-success',
                      hidden: false,
                      disabled: false,
                      state: 'edit',
                      execute: [
                        {
                          triggerType: 'STATE',
                          trigger: 'EDIT_ROW',
                          // "conditionId": "edit_state_1"
                        },
                      ],
                      toggle: {
                        type: 'state',
                        toggleProperty: 'hidden',
                        values: [
                          {
                            name: 'edit',
                            value: true,
                          },
                          {
                            name: 'text',
                            value: false,
                          },
                        ],
                      },
                    },
                    {
                      id: 'M_deleteRow',
                      text: '删除',
                      icon: 'delete',
                      color: 'text-red-light',
                      hidden: false,
                      disabled: false,
                      execute: [
                        {
                          triggerType: 'OPERATION',
                          trigger: 'EXECUTE_CHECKED_ROWS_IDS',
                          conditionId: 'delete_operation_1',
                          ajaxId: 'delete_row_1',
                        },
                      ],
                    },
                    {
                      id: 'M_saveRow',
                      text: '保存',
                      icon: 'save',
                      color: 'text-primary',
                      hidden: true,
                      disabled: false,
                      execute: [
                        {
                          triggerType: 'OPERATION',
                          trigger: 'SAVE_ROW',
                          ajaxId: 'add_save_1',
                          stateId: 'add_save_1',
                          conditionId: 'add_save_1',
                        },
                        {
                          triggerType: 'OPERATION',
                          trigger: 'EDIT_ROW',
                          stateId: 'edit_save_1',
                          ajaxId: 'edit_save_1',
                          conditionId: 'edit_save_1',
                        },
                      ],
                      toggle: {
                        type: 'state',
                        toggleProperty: 'hidden',
                        values: [
                          {
                            name: 'edit',
                            value: false,
                          },
                          {
                            name: 'text',
                            value: true,
                          },
                        ],
                      },
                    },
                    {
                      id: 'M_cancelrow',
                      text: '取消',
                      triggerType: 'STATE',
                      trigger: 'CANCEL',
                      icon: 'rollback',
                      color: 'text-grey-darker',
                      hidden: true,
                      disabled: null,
                      execute: [
                        {
                          triggerType: 'STATE',
                          trigger: 'CANCEL',
                        },
                      ],
                      toggle: {
                        type: 'state',
                        toggleProperty: 'hidden',
                        values: [
                          {
                            name: 'edit',
                            value: false,
                          },
                          {
                            name: 'text',
                            value: true,
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  targetViewId: 'view_02',
                  group: [
                    {
                      name: 'M_addSearchRow',
                      text: '查询',
                      triggerType: 'STATE',
                      trigger: 'SEARCH_ROW',
                      actionName: 'addSearchRow',
                      icon: 'search',
                      color: 'text-primary',
                      hidden: false,
                      disabled: false,
                      execute: [
                        {
                          triggerType: 'STATE',
                          trigger: 'SEARCH_ROW',
                        },
                      ],
                    },
                    {
                      name: 'M_cancelSearchRow',
                      text: '取消查询',
                      icon: 'rollback',
                      triggerType: 'STATE',
                      trigger: 'CANCEL_SEARCH_ROW',
                      actionName: 'cancelSearchRow',
                      color: 'text-grey-darker',
                      hidden: false,
                      disabled: false,
                      execute: [
                        {
                          triggerType: 'STATE',
                          trigger: 'SEARCH_ROW',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          {
            id: 'r5zDHB',
            col: 'cc',
            type: 'col',
            title: '',
            span: 24,
            container: 'component',
            size: {
              nzXs: 24,
              nzSm: 24,
              nzMd: 24,
              nzLg: 24,
              nzXl: 24,
              nzXXl: 24,
            },
            component: {
              id: 'view_01',
              title: '主表',
              titleIcon: 'right-circle',
              component: 'cnDataTable',
              keyId: 'ID',
              size: 'middle',
              isBordered: true,
              isFrontPagination: false,
              isPagination: true,
              isShowSizeChanger: true,
              showTotal: true,
              pageSize: 5,
              showCheckBox: true,
              pageSizeOptions: [10, 20, 50, 100],
              loadingOnInit: true,
              // "scroll": {
              //     "y": "300px"
              // },
              spanWidthConfig: ['50px', '100px', '200px', '200px', '200px'],
              loadingConfig: {
                url: 'information/page',
                method: 'get',
                params: [],
                filter: [],
              },
              spanHeader: [
                [
                  {
                    title: 'CODE',
                    spanType: 'row',
                    span: 3,
                  },
                  {
                    title: 'INFO',
                    spanType: 'col',
                    span: 2,
                  },
                  {
                    title: 'ACTION',
                    spanType: 'row',
                    span: 3,
                  },
                ],
                [
                  {
                    title: 'MESSAGE',
                  },
                  {
                    title: 'LANGUAGE',
                  },
                ],
              ],
              columns: [
                {
                  title: 'id',
                  type: 'field',
                  field: 'ID',
                  hidden: true,
                  showFilter: false,
                  showSort: false,
                  isShowExpand: false,
                  width: '50px',
                  style: {},
                },
                {
                  title: 'code',
                  type: 'field',
                  field: 'CODE',
                  hidden: false,
                  showFilter: false,
                  showSort: false,
                  width: '50px',
                  style: {},
                },
                {
                  title: 'message',
                  type: 'field',
                  field: 'MESSAGE',
                  hidden: false,
                  showFilter: false,
                  showSort: false,
                  width: '150px',
                  style: {},
                },
                {
                  title: 'language',
                  type: 'field',
                  field: 'LANGUAGE',
                  hidden: false,
                  showFilter: false,
                  showSort: false,
                  isExpand: true,
                  width: '400px',
                  style: {},
                },
                {
                  title: 'ACTION',
                  type: 'action',
                  width: '150px',
                  actionIds: ['grid_edit', 'grid_cancel', 'grid_save', 'grid_delete', 'grid_new', 'grid_new_cancel'],
                },
              ],
              cascade: {
                messageSender: [
                  {
                    id: 'grid_sender_01',
                    senderId: 'view_01',
                    triggerType: 'OPERATION',
                    trigger: 'EXECUTE_CHECKED_ROWS',
                    triggerMoment: 'after',
                    sendData: [
                      {
                        beforeSend: [],
                        reveicerId: '',
                        receiverTriggerType: 'BEHAVIOR',
                        receiverTrigger: 'REFRESH_AS_CHILD',
                        params: [
                          {
                            name: 'parent_id',
                            type: 'item',
                            valueName: 'id',
                          },
                          {
                            name: 'parent_name',
                            type: 'item',
                            valueName: 'name',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'grid_sender_02',
                    senderId: 'view_01',
                    triggerType: 'BEHAVIOR',
                    trigger: 'SELECT_ROW',
                    triggerMoment: 'after',
                    sendData: [
                      {
                        beforeSend: [],
                        reveicerId: '',
                        receiverTriggerType: 'BEHAVIOR',
                        receiverTrigger: 'REFRESH_AS_CHILD',
                        data: {
                          params: [
                            {
                              name: 'accountId',
                              type: 'initValue',
                              valueName: 'accountId',
                            },
                            {
                              name: 'userId',
                              type: 'cacheValue',
                              valueName: '_createUserId',
                            },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    id: 'grid_sender_03',
                    senderId: 'view_01',
                    triggerType: 'BEHAVIOR',
                    trigger: 'SET_SELECT_ROW',
                    triggerMoment: 'after',
                    sendData: [
                      {
                        beforeSend: [],
                        reveicerId: '',
                        receiverTriggerType: 'BEHAVIOR',
                        receiverTrigger: 'REFRESH_AS_CHILD',
                        data: {
                          params: [
                            {
                              name: 'accountId',
                              type: 'initValue',
                              valueName: 'accountId',
                            },
                            {
                              name: 'userId',
                              type: 'cacheValue',
                              valueName: '_createUserId',
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
              rowActions: [
                {
                  id: 'grid_new',
                  state: 'new',
                  text: '保存',
                  icon: 'save',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  hidden: false,
                  execute: [
                    {
                      triggerType: 'STATE',
                      trigger: 'EDIT_ROW',
                      // "ajaxId": "add_save_1",
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                  toggle: {
                    type: 'state',
                    toggleProperty: 'hidden',
                    values: [
                      {
                        name: 'new',
                        value: false,
                      },
                      {
                        name: 'text',
                        value: true,
                      },
                    ],
                  },
                },
                {
                  id: 'grid_new_cancel',
                  state: 'new',
                  text: '取消',
                  icon: 'delete',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  hidden: false,
                  execute: [
                    {
                      triggerType: 'STATE',
                      trigger: 'EDIT_ROW',
                      // "ajaxId": "add_save_1",
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                  toggle: {
                    type: 'state',
                    toggleProperty: 'hidden',
                    values: [
                      {
                        name: 'new',
                        value: false,
                      },
                      {
                        name: 'text',
                        value: true,
                      },
                    ],
                  },
                },
                {
                  id: 'grid_edit',
                  state: 'text',
                  text: '编辑',
                  icon: 'edit',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  hidden: false,
                  execute: [
                    {
                      triggerType: 'STATE',
                      trigger: 'EDIT_ROW',
                      // "ajaxId": "add_save_1",
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                  toggle: {
                    type: 'state',
                    toggleProperty: 'hidden',
                    values: [
                      {
                        name: 'edit',
                        value: true,
                      },
                      {
                        name: 'text',
                        value: false,
                      },
                    ],
                  },
                },
                {
                  id: 'grid_cancel',
                  state: 'text',
                  text: '取消',
                  icon: 'rollback',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  hidden: true,
                  execute: [
                    {
                      triggerType: 'STATE',
                      trigger: 'CANCEL',
                      toggle: '1',
                      // "ajaxId": "add_save_1",
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                  toggle: {
                    type: 'state',
                    toggleProperty: 'hidden',
                    values: [
                      {
                        name: 'edit',
                        value: false,
                      },
                      {
                        name: 'text',
                        value: true,
                      },
                    ],
                  },
                },
                {
                  id: 'grid_save',
                  state: 'text',
                  text: '保存',
                  icon: 'save',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  hidden: true,
                  execute: [
                    {
                      triggerType: 'OPERATION',
                      trigger: 'SAVE_ROW',
                      ajaxId: 'add_save_1',
                      toggle: '1',
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                  toggle: {
                    type: 'state',
                    toggleProperty: 'hidden',
                    values: [
                      {
                        name: 'edit',
                        value: false,
                      },
                      {
                        name: 'text',
                        value: true,
                      },
                    ],
                  },
                },
                {
                  id: 'grid_delete',
                  state: 'text',
                  text: '删除',
                  icon: 'delete',
                  type: 'link',
                  color: 'primary',
                  size: 'small',
                  execute: [
                    {
                      triggerType: 'OPERATION',
                      trigger: 'EXECUTE_SELECTED_ROW',
                      // "conditionId": "delete_operation_1",
                      // "ajaxId": "delete_row_1"
                    },
                  ],
                },
              ],
              condition: [
                {
                  id: 'add_state_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                        {
                          type: 'element',
                          name: 'name',
                          matchValue: '1',
                          match: 'eq',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'edit_state_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'add_save_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                    {
                      type: 'component',
                      valueName: 'ROWS_ADDED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'edit_save_1',
                  state: [
                    {
                      type: 'component',
                      valueName: 'ROWS_EDITED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                    {
                      type: 'component',
                      valueName: 'ROWS_CHECKED',
                      expression: [
                        {
                          type: 'property',
                          name: 'length',
                          matchValue: 0,
                          match: 'gt',
                        },
                      ],
                    },
                  ],
                },
              ],
              ajaxConfig: [
                {
                  id: 'add_save_1',
                  url: 'information/test2',
                  urlType: 'inner',
                  ajaxType: 'post',
                  params: [
                    {
                      name: 'state',
                      type: 'value',
                      value: 'DVM',
                    },
                    {
                      name: 'LANGUAGE',
                      type: 'value',
                      value: 'scs',
                    },
                    {
                      name: 'CODE',
                      type: 'value',
                      value: 'scs.code',
                    },
                    {
                      name: 'MESSAGE',
                      type: 'value',
                      value: 'scs.message',
                    },
                    {
                      name: 'RN',
                      type: 'value',
                      value: 100,
                    },
                  ],
                  outputParameters: [],
                  result: [
                    {
                      name: 'data',
                      showMessageWithNext: 0,
                      message: 'message.ajax.state.success',
                      senderId: 'grid_sender_01',
                    },
                    // {
                    //     "name": "validation",
                    //     "senderId": "grid_sender_02"
                    // },
                    // {
                    //     "name": "error",
                    //     "senderId": "grid_sender_03"
                    // }
                  ],
                },
                {
                  id: 'edit_save_1',
                  url: 'information/test2',
                  urlType: 'inner',
                  ajaxType: 'put',
                  params: [
                    {
                      name: 'LANGUAGE',
                      type: 'value',
                      value: 'scs',
                    },
                    {
                      name: 'CODE',
                      type: 'value',
                      value: 'scs.code',
                    },
                    {
                      name: 'MESSAGE',
                      type: 'value',
                      value: 'scs.message',
                    },
                    {
                      name: 'RN',
                      type: 'value',
                      value: 100,
                    },
                  ],
                  outputParameters: [],
                  result: [],
                },
              ],
              beforeTrigger: [],
              afterTrigger: [
                {
                  id: '',
                  senderId: 'view_01',
                  sendData: [
                    {
                      beforeSend: [],
                      reveicerId: '',
                      receiverTriggerType: 'BEHAVIOR',
                      receiverTrigger: 'REFRESH_AS_CHILD',
                      params: [
                        {
                          name: 'parent_id',
                          type: 'item',
                          valueName: 'id',
                        },
                        {
                          name: 'parent_name',
                          type: 'item',
                          valueName: 'name',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          {
            id: 'r5zDHB2-1',
            col: 'cc',
            type: 'col',
            title: '',
            span: 24,
            container: 'component',
            size: {
              nzXs: 24,
              nzSm: 24,
              nzMd: 24,
              nzLg: 24,
              nzXl: 24,
              nzXXl: 24,
            },
            component: {
              id: 'view_02',
              title: '主表',
              titleIcon: 'right-circle',
              component: 'cnDataTable',
              keyId: 'ID',
              size: 'middle',
              isBordered: true,
              isFrontPagination: false,
              isPagination: true,
              isShowSizeChanger: true,
              showTotal: true,
              pageSize: 5,
              showCheckBox: true,
              pageSizeOptions: [10, 20, 50, 100],
              loadingOnInit: false,
              loadingConfig: {
                url: 'information/page',
                method: 'get',
                params: [],
                filter: [],
              },
              columns: [
                {
                  title: 'id',
                  type: 'field',
                  field: 'ID',
                  hidden: true,
                  showFilter: false,
                  showSort: false,
                  isShowExpand: false,
                  width: '50px',
                  style: {},
                },
                {
                  title: 'code',
                  type: 'field',
                  field: 'CODE',
                  hidden: false,
                  showFilter: false,
                  showSort: false,
                  width: '50px',
                  style: {},
                },
                {
                  title: 'message',
                  type: 'field',
                  field: 'MESSAGE',
                  hidden: false,
                  showFilter: false,
                  showSort: false,
                  width: '150px',
                  style: {},
                },
                {
                  title: 'language',
                  type: 'field',
                  field: 'LANGUAGE',
                  hidden: false,
                  showFilter: false,
                  showSort: false,
                  isExpand: true,
                  width: '400px',
                  style: {},
                },
                {
                  title: 'ACTION',
                  type: 'action',
                  width: '150px',
                  actionIds: ['grid_edit', 'grid_save', 'grid_delete'],
                },
              ],
              rowActions: [
                {
                  id: 'grid_edit',
                  text: '编辑',
                  icon: 'save',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  execute: [
                    {
                      triggerType: 'STATE',
                      trigger: 'EDIT_ROW',
                      // "ajaxId": "add_save_1",
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                },
                {
                  id: 'grid_save',
                  text: '保存',
                  icon: 'save',
                  color: 'text-primary',
                  type: 'link',
                  size: 'small',
                  execute: [
                    {
                      triggerType: 'OPERATION',
                      trigger: 'SAVE_ROW',
                      ajaxId: 'add_save_1',
                      // "stateId": "add_save_1",
                      // "conditionId": "add_save_1"
                    },
                  ],
                },
                {
                  id: 'grid_delete',
                  text: '删除',
                  icon: 'delete',
                  type: 'link',
                  color: 'primary',
                  size: 'small',
                  execute: [
                    {
                      triggerType: 'OPERATION',
                      trigger: 'EXECUTE_SELECTED_ROW',
                      // "conditionId": "delete_operation_1",
                      // "ajaxId": "delete_row_1"
                    },
                  ],
                },
              ],
              cascade: {
                messageReceiver: [
                  {
                    id: '',
                    senderId: 'view_01',
                    receiveData: [
                      {
                        beforeReceive: [],
                        triggerType: 'BEHAVIOR',
                        trigger: 'REFRESH_AS_CHILD',
                        params: [
                          {
                            pname: 'parent_id',
                            cname: '_parent_id',
                            valueTo: 'tempValue',
                          },
                          {
                            pname: 'parent_name',
                            cname: '_parent_name',
                            valueTo: 'tempValue',
                          },
                        ],
                      },
                      {
                        beforeReceive: [],
                        triggerType: 'BEHAVIOR',
                        trigger: 'REFRESH',
                        params: [
                          {
                            pname: 'parent_id',
                            cname: '__accountId',
                            valueTo: 'initValue',
                          },
                          {
                            pname: 'parent_name',
                            cname: '__userId',
                            valueTo: 'initValue',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        id: '3vlDRq',
        type: 'row',
      },
      {
        cols: [
          {
            id: 'yBBeRX',
            col: 'cc',
            type: 'col',
            title: '列yBBeRX',
            span: 12,
            container: 'tabs',
            size: {
              nzXs: 12,
              nzSm: 12,
              nzMd: 12,
              nzLg: 12,
              nzXl: 12,
              nzXXl: 12,
            },
            tabs: {
              id: '',
              type: 'tabs',
              title: '标签页布局',
              container: 'tabContent',
              tabContent: [
                {
                  id: 'icU1pr',
                  type: 'tab',
                  title: '标签u7kPRm',
                  container: 'layout',
                  layout: {
                    id: 'icU1pr',
                    type: 'layout',
                    title: '布局icU1pr',
                    container: 'rows',
                    rows: [
                      {
                        cols: [
                          {
                            id: 'nRhLot',
                            col: 'cc',
                            type: 'col',
                            title: '列nRhLot',
                            span: 24,
                            container: '',
                            size: {
                              nzXs: 24,
                              nzSm: 24,
                              nzMd: 24,
                              nzLg: 24,
                              nzXl: 24,
                              nzXXl: 24,
                            },
                          },
                        ],
                        id: 'gvF35B',
                        type: 'row',
                      },
                    ],
                  },
                },
                {
                  id: 'wixilN',
                  type: 'tab',
                  title: '标签llC6Ub',
                  container: 'layout',
                  layout: {
                    id: 'wixilN',
                    type: 'layout',
                    title: '布局wixilN',
                    container: 'rows',
                    rows: [
                      {
                        cols: [
                          {
                            id: 'nNNVng',
                            col: 'cc',
                            type: 'col',
                            title: '列nNNVng',
                            span: 24,
                            container: 'layout',
                            size: {
                              nzXs: 24,
                              nzSm: 24,
                              nzMd: 24,
                              nzLg: 24,
                              nzXl: 24,
                              nzXXl: 24,
                            },
                            layout: {},
                          },
                        ],
                        id: 'zByIiZ',
                        type: 'row',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: 'r5zDHB',
            col: 'cc',
            type: 'col',
            title: '列r5zDHB1-1',
            span: 24,
            container: 'layout',
            size: {
              nzXs: 12,
              nzSm: 12,
              nzMd: 12,
              nzLg: 12,
              nzXl: 12,
              nzXXl: 12,
            },
            layout: {
              id: 'r5zDHB1-2',
              col: 'cc',
              type: 'layout',
              title: '列r5zDHB',
              container: 'rows',
              rows: [
                {
                  cols: [
                    {
                      id: 'r5zDHB1-2-2',
                      col: 'cc',
                      type: 'col',
                      title: '222',
                      span: 24,
                      container: 'layout',
                      size: {
                        nzXs: 24,
                        nzSm: 24,
                        nzMd: 24,
                        nzLg: 24,
                        nzXl: 24,
                        nzXXl: 24,
                      },
                      layout: {},
                    },
                    {
                      id: 'r5zDHB1-2-1',
                      col: 'cc',
                      type: 'col',
                      title: '111',
                      span: 24,
                      container: 'layout',
                      size: {
                        nzXs: 24,
                        nzSm: 24,
                        nzMd: 24,
                        nzLg: 24,
                        nzXl: 24,
                        nzXXl: 24,
                      },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          },
        ],
        id: '3vlDRq',
        type: 'row',
      },
    ],
    customLayout: [
      {
        id: 'zh7DKEr3',
        type: 'customLayout',
        title: '左侧布局',
        layoutType: 'west',
        hidden: false,
        span: '1',
        container: 'layout',
        layout: {
          id: 'rT4miZtE',
          type: 'layout',
          title: '布局',
          container: 'rows',
          rows: [
            {
              cols: [
                {
                  id: '0rUTSi',
                  col: 'cc',
                  type: 'col',
                  title: '列0rUTSi',
                  span: 24,
                  container: 'layout',
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    nzXl: 24,
                    nzXXl: 24,
                  },
                  layout: {},
                },
              ],
              id: 'mfyPGP',
              type: 'row',
            },
          ],
        },
      },
      {
        id: 'OVl4EgIq',
        type: 'customLayout',
        title: '中间布局',
        layoutType: 'center',
        hidden: false,
        span: '2',
        container: 'layout',
        layout: {
          id: 'NjZSnNJP',
          type: 'layout',
          title: '布局',
          container: 'rows',
          rows: [
            {
              cols: [
                {
                  id: 'yBBeRX',
                  col: 'cc',
                  type: 'col',
                  title: '列yBBeRX',
                  span: 24,
                  container: 'tabs',
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    nzXl: 24,
                    nzXXl: 24,
                  },
                  tabs: {
                    id: '',
                    type: 'tabs',
                    title: '标签页布局',
                    container: 'tabContent',
                    tabContent: [
                      {
                        id: 'icU1pr',
                        type: 'tab',
                        title: '标签u7kPRm',
                        container: 'layout',
                        layout: {
                          id: 'icU1pr',
                          type: 'layout',
                          title: '布局icU1pr',
                          container: 'rows',
                          rows: [
                            {
                              cols: [
                                {
                                  id: 'nRhLot',
                                  col: 'cc',
                                  type: 'col',
                                  title: '列nRhLot',
                                  span: 24,
                                  container: 'layout',
                                  size: {
                                    nzXs: 24,
                                    nzSm: 24,
                                    nzMd: 24,
                                    nzLg: 24,
                                    nzXl: 24,
                                    nzXXl: 24,
                                  },
                                  layout: {},
                                },
                              ],
                              id: 'gvF35B',
                              type: 'row',
                            },
                          ],
                        },
                      },
                      {
                        id: 'wixilN',
                        type: 'tab',
                        title: '标签llC6Ub',
                        container: 'layout',
                        layout: {
                          id: 'wixilN',
                          type: 'layout',
                          title: '布局wixilN',
                          container: 'rows',
                          rows: [
                            {
                              cols: [
                                {
                                  id: 'nNNVng',
                                  col: 'cc',
                                  type: 'col',
                                  title: '列nNNVng',
                                  span: 24,
                                  container: 'layout',
                                  size: {
                                    nzXs: 24,
                                    nzSm: 24,
                                    nzMd: 24,
                                    nzLg: 24,
                                    nzXl: 24,
                                    nzXXl: 24,
                                  },
                                  layout: {},
                                },
                              ],
                              id: 'zByIiZ',
                              type: 'row',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
              id: 'dPMuaH',
              type: 'row',
            },
          ],
        },
      },
      {
        id: 'KHdMtYyn',
        type: 'customLayout',
        title: '右侧布局',
        layoutType: 'east',
        hidden: true,
        span: '1',
        container: 'layout',
        layout: {
          id: 'e9LRuIMO',
          type: 'layout',
          title: '布局',
          container: 'rows',
          rows: [
            {
              cols: [
                {
                  id: 'odfGLU',
                  col: 'cc',
                  type: 'col',
                  title: '列odfGLU',
                  span: 24,
                  container: 'layout',
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    nzXl: 24,
                    nzXXl: 24,
                  },
                  layout: {},
                },
              ],
              id: 'r8N8t8',
              type: 'row',
            },
          ],
        },
      },
    ],
  };

  public beforeOperation = [
    {
      name: 'D_addRow',
      status: [
        {
          conditions: [
            [
              {
                name: '_recordstatus',
                value: 2,
                checkType: 'value',
              },
              {
                name: '_recods',
                value: 3,
                checkType: 'value',
              },
              {
                ajaxConfig: {
                  url: 'information/testList',
                  ajaxType: 'GET',
                  params: [
                    {
                      name: 'state',
                      type: 'value',
                      value: 'D',
                    },
                  ],
                },
                checkType: 'executeAjax',
              },
            ],
            [
              {
                name: '_recordstatus',
                value: 1,
                checkType: 'value',
              },
              {
                name: '_recods',
                value: 1,
                checkType: 'value',
              },
            ],
          ],
          action: {
            type: 'warning',
            message: '在当前状态下，无法新增',
            execute: 'prevent',
          },
        },
        {
          conditions: [
            [
              {
                name: '_resourcesreceiveid1',
                value: 'undefinded',
                checkType: 'value',
              },
            ],
          ],
          action: {
            type: 'info',
            message: '主表未选中数据，无法新增！',
            execute: 'prevent',
          },
        },
        {
          conditions: [
            [
              {
                tempValue: '_createUserId',
                cacheValue: 'accountId',
                checkType: 'innerValue',
              },
              // {
              //     "ajaxConfig": {
              //         "url": "https://jsonplaceholder.typicode.com/users",
              //         "ajaxType": "GET",
              //         "params": []
              //     },
              //     "checkType": "executeAjax"
              // }
            ],
          ],
          action: {
            type: 'info',
            message: '对他人创建的数据只有浏览权限，没有编辑权限',
            execute: 'prevent',
          },
        },
      ],
    },
  ];

  public dataConfig = {
    entity: 'CaseDemo',
    targetViewId: '',
    type: 'array',
    properties: [
      {
        name: 'id',
        field: 'id',
        text: 'entity.data.name',
        value: '1',
        dataType: 'string',
      },
      {
        name: 'code',
        field: 'code',
        text: 'entity.data.code',
        value: '',
        dataType: 'string',
      },
      {
        name: 'language',
        field: 'language',
        text: 'entity.data.language',
        value: '',
        dataType: 'string',
      },
      {
        name: 'message',
        field: 'message',
        text: 'entity.data.message',
        value: '',
        dataType: 'string',
      },
    ],
    children: [
      {
        entity: 'validation',
        targetViewId: '',
        type: 'array',
        properties: [
          {
            name: 'code',
            field: 'code',
            text: 'entity.data.code',
            value: '',
            dataType: 'string',
          },
          {
            name: 'msg',
            field: 'message',
            text: 'entity.data.message',
            value: '',
          },
        ],
        children: [
          {
            entity: 'data',
            targetViewId: '',
            properties: [
              {
                name: 'id',
                field: 'id',
                text: 'entity.data.name',
                value: '1',
                dataType: 'string',
              },
              {
                name: 'code',
                field: 'code',
                text: 'entity.data.code',
                value: '',
                dataType: 'string',
              },
              {
                name: 'language',
                field: 'language',
                text: 'entity.data.language',
                value: '',
                dataType: 'string',
              },
              {
                name: 'message',
                field: 'message',
                text: 'entity.data.message',
                value: '',
                dataType: 'string',
              },
            ],
          },
        ],
      },
      {
        entity: 'error',
        targetViewId: '',
        properties: [
          {
            name: 'code',
            field: 'code',
            text: 'entity.data.code',
            value: '',
            dataType: 'string',
          },
          {
            name: 'msg',
            field: 'message',
            text: 'entity.data.message',
            value: '',
          },
        ],
        children: [
          {
            entity: 'data',
            targetViewId: '',
            properties: [
              {
                name: 'id',
                field: 'id',
                text: 'entity.data.name',
                value: '1',
                dataType: 'string',
              },
              {
                name: 'code',
                field: 'code',
                text: 'entity.data.code',
                value: '',
                dataType: 'string',
              },
              {
                name: 'language',
                field: 'language',
                text: 'entity.data.language',
                value: '',
                dataType: 'string',
              },
              {
                name: 'message',
                field: 'message',
                text: 'entity.data.message',
                value: '',
                dataType: 'string',
              },
            ],
          },
        ],
      },
    ],
  };

  testResult: Observable<any>;

  constructor(@Inject(BSN_COMPONENT_SERVICES) private _componentServices: ComponentServiceProvider) {
    super(_componentServices);
  }

  public ngOnInit() {}

  public click() {
    this.load();
  }

  private load() {
    const beforeOperation = new BeforeOperationResolver(
      this.beforeOperation,
      {},
      {
        accountId: 'user1',
      },
      {
        _createUserId: 'user1',
      },
      this._componentServices.apiService,
      this._componentServices.modalService,
      this._componentServices.msgService,
    );
    beforeOperation.operationItemData = {
      _recordstatus: 1,
      _recods: 1,
      _resourcesreceiveid1: 'undefined',
      _createUserId: '1',
    };
    this.testResult = beforeOperation.buildStatusObservableByStatusCfg({ name: 'D_addRow' }).pipe(reduce((a, b) => a || b));

    const s = new BusinessObjectBase();
    // console.log(s.resolver(s.dataConfig));
    const t = s.resolver(this.dataConfig);
    t.addProperty('caseText', '123456');
    t.editProperty('caseText', '67890');
    // t.removeProperty('caseText');

    t.addChildren('validation', { code: '2', msg: '2', data: {} });
    t.addChildren('error', [
      { code: '3', msg: '3', data: {} },
      { code: '4', msg: '4', data: {} },
    ]);
    // t.orderChange({ groupName: '2', id: '2' }, { groupName: '4', id: '4' }, 'group');

    console.log(t);
  }
}
