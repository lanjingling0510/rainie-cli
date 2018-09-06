/**
 * @descrption Search List Model
 */

import { fetchConfig, invokeService } from '@alife/wdk-dva';
import potMiddleware from '@alife/puck-dot';
import {Feedback} from '@alife/next';
import { deepClone, isNotEmpty, parseDateString, isNotEmptyArray } from '../utils';
import service from '../service';
const {toast: Toast} = Feedback;
fetchConfig({
    service,
    puck: {
        middlewares: [potMiddleware]
    }
});

export default {
    namespace: 'page',
    state: {
        searchCriteria: {
            code: '',
            sourceCode: '', // 来源单号
            returnNoticeCode: '', // 退货通知单号
            returnWay: '', // 退货方式
            status: '', // 状态
            deptCode: '', // 部门
            itemCode: '', // 商品
            operatorId: '', // 操作用户
        },

        dialogVisible: false,

        departs: [],
        items: [],
        outStokOrderDetails: [],

        rowSelected: [],
        rowSelectedIndexs: [],

        table: {
            loading: false,
            dataList: [],
            pageSize: 10,
            page: 1,
            total: 0
        }
    },
    reducers: {
        /**
         * 设置表格loading
         * @method setTableLoading
         */
        setTableLoading(state, { type, data }) {
            const cloneState = deepClone(state);
            cloneState.table.loading = data;
            return cloneState;
        },

        /**
         * 设置搜索条件
         * @method setSearchCriteria
         */
        setSearchCriteria(state, { type, data }) {
            let cloneState = deepClone(state);
            let searchCriteria = cloneState.searchCriteria;
            let tdata = {};
            for (let field in data) {
                switch (field) {
                    case 'outorderCreateTime':
                    case 'outorderFinishTime':
                    case 'returnTime':
                        if (
                            isNotEmpty(data[field]) &&
                            Array.isArray(data[field])
                        ) {
                            tdata[field] = parseDateString(data[field]);
                        }
                        break;
                    default:
                        tdata = data;
                }
                break;
            }

            searchCriteria = {
                ...searchCriteria,
                ...tdata
            };
            cloneState = {
                ...cloneState,
                searchCriteria
            };
            return cloneState;
        },

        /**
         * 重置异常订单
         * @method resetSearchCriteria
         */
        resetSearchCriteria(state, { type, data }) {
            let cloneState = deepClone(state);
            cloneState = {
                ...cloneState,
                items: [],
                searchCriteria: {
                    code: '',
                    sourceCode: '', // 来源单号
                    returnNoticeCode: '', // 退货通知单号
                    returnWay: '', // 退货方式
                    status: '', // 状态
                    deptCode: '', // 部门
                    itemCode: '', // 商品
                    operatorId: '', // 操作用户
                },
            };
            return cloneState;
        },

        setItemList(state, { data }) {
            let newState = deepClone(state);
            newState.items = data.map(item => {
                return {
                    label: item.code + '  ' + item.name,
                    value: item.code
                };
            });
            return newState;
        },

        setDepartList(state, { type, data }) {
            const cloneState = deepClone(state);
            const departList = data.map(item => {
                return {
                    label: item.code + ' ' + item.value,
                    value: item.code
                };
            });
            cloneState.departs = departList;
            return cloneState;
        },

        setReturnNotice(state, { type, data }) {
            const cloneState = deepClone(state);
            cloneState.table.dataList = data.list;
            cloneState.table.total = data.totalNum;
            cloneState.table.loading = false;
            return cloneState;
        },

        setOutStokOrderDetails(state, { type, data }) {
            const cloneState = deepClone(state);
            cloneState.outStokOrderDetails = data;
            return cloneState;
        },

        /**
         * 设置分页大小
         * @method setPageSize
         */
        setPageSize(state, { type, data }) {
            const pageSize = data;
            const cloneState = deepClone(state);
            cloneState.table.pageSize = pageSize;
            return cloneState;
        },

        /**
         * 设置页数
         * @method getAuthorShops
         */
        setPageIndex(state, { type, data }) {
            const pageIndex = data;
            const cloneState = deepClone(state);
            cloneState.table.page = pageIndex;
            return cloneState;
        },

        toggleDialogShow(state) {
            const cloneState = deepClone(state);
            cloneState.dialogVisible = !state.dialogVisible;
            return cloneState;
        },
    },
    effects: {
        /**
         * 获得部门
         * @method getDepartList
         */
        *getDepartList(action, { call, put }) {
            const result = yield call(invokeService, 'getDepartList', {});
            yield put({ type: 'setDepartList', data: result.info });
        },

        *getItemList(action, { call, put }) {
            const result = yield call(invokeService, 'getItems', {
                searchValue: action.data
            });
            yield put({ type: 'setItemList', data: result.info });
        },

        *queryOutStokOrderDetails(action, { call, put }) {
            const result = yield call(
                invokeService,
                'queryOutStokOrderDetails',
                {outOrderId: action.id}
            );

            if (result.success) {
                if (isNotEmptyArray(result.info)) {
                    yield put({ type: 'setOutStokOrderDetails', data: result.info });
                    yield put({ type: 'toggleDialogShow' });
                } else {
                    Toast.error('暂无缺货明细');
                }

            } else {
                Toast.error(result.msg);
                yield put({ type: 'toggleDialogShow' });
            }
        },

        *confirmOutStokOrder(action, { call, put, select }) {
            const params = yield select(state => {
                return {
                    outOrderDetailIds: state.page.outStokOrderDetails.map(item => item.returnOutDetailId).join(','),
                    returnOutOrderId: state.page.outStokOrderDetails[0].returnOutId
                };
            });

            const result = yield call(
                invokeService,
                'confirmOutStokOrder',
                params
            );

            if (result.success) {
                if (result.info.success) {
                    Toast.success('确认缺货成功');
                    yield put({ type: 'queryReturnNotice' });
                } else {
                    Toast.error(result.info.message);
                }
            } else {
                Toast.error(result.msg);
            }
        },


        /**
         * 获得异常单
         * @method getAuthorShops
         */
        *queryReturnNotice(action, { call, put, select }) {
            yield put({type: 'setTableLoading', data: true});

            const params = yield select(state => {
                const { table, searchCriteria } = state.page;
                const parameter = {
                    index: (action.page || table.page) - 1,
                    num: table.pageSize,
                };

                for (let field in searchCriteria) {
                    if (
                        isNotEmpty(searchCriteria[field]) &&
                        searchCriteria[field] !== ''
                    ) {
                        switch (field) {
                            case 'outorderCreateTime':
                                if (
                                    Array.isArray(searchCriteria[field]) &&
                                    searchCriteria[field].length === 2
                                ) {
                                    parameter.outorderCreateTimeStart = searchCriteria[field][0];
                                    parameter.outorderCreateTimeEnd = searchCriteria[field][1];
                                }
                                break;
                            case 'outorderFinishTime':
                                if (
                                    Array.isArray(searchCriteria[field]) &&
                                    searchCriteria[field].length === 2
                                ) {
                                    parameter.outorderFinishTimeStart = searchCriteria[field][0];
                                    parameter.outorderFinishTimeEnd = searchCriteria[field][1];
                                }
                                break;
                            case 'returnTime':
                                if (
                                    Array.isArray(searchCriteria[field]) &&
                                    searchCriteria[field].length === 2
                                ) {
                                    parameter.startDate = searchCriteria[field][0];
                                    parameter.endDate = searchCriteria[field][1];
                                }
                                break;
                            default:
                                parameter[field] = searchCriteria[field];
                        }
                    }
                }
                return parameter;
            });
            const result = yield call(
                invokeService,
                'queryReturnNotice',
                params
            );

            if (result.success) {
                yield put({ type: 'setReturnNotice', data: result.info });
            } else {
                Toast.error(result.msg);
            }

            yield put({type: 'setTableLoading', data: false});
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/') {
                    dispatch({ type: 'getDepartList' });
                    dispatch({ type: 'queryReturnNotice' });
                }
            });
        }
    }
};
