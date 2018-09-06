/**
 * @descrption page Model
 */

import service from '../service';
import { fetchConfig, invokeService } from '@alife/wdk-dva';
import potMiddleware from '@alife/puck-dot';
import { getUrlParam } from 'utils/common.js';
import { deepClone, isNotEmpty } from '../utils';

fetchConfig({
    service,
    puck: {
        middlewares: [potMiddleware]
    }
});

export default {
    namespace: 'page',

    state: {
        id: getUrlParam('id'),
        code: getUrlParam('code'),
        table: {
            pageSize: 10,
            list: [],
            page: 1,
            total: 0
        }
    },

    reducers: {
        setArrivalNoticeDetail(state, { type, data }) {
            const cloneState = deepClone(state);
            cloneState.table.list = data;
            return cloneState;
        },

        /**
         * 设置分页大小
         * @method setPageSize
         */
        setPageSize(state, {type, data}) {
            const pageSize = data;
            const cloneState = deepClone(state);
            cloneState.table.pageSize = pageSize;
            return cloneState;
        },

        /**
         * 设置页数
         * @method setPageIndex
         */
        setPageIndex(state, {type, data}) {
            const pageIndex = data;
            const cloneState = deepClone(state);
            cloneState.table.page = pageIndex;
            return cloneState;
        }
    },

    effects: {
        /**
         * 获得配送站
         * @method queryArrivalNoticeDetail
         */
        *queryReturnDetail(action, { call, put, select }) {
            const id = yield select(state => {
                return state.page.id;
            });

            const result = yield call(
                invokeService,
                'queryReturnDetail',
                { outOrderId: id}
            );

            if (isNotEmpty(result.info)) {
                yield put({ type: 'setArrivalNoticeDetail', data: result.info });
            }
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/') {
                    dispatch({
                        type: 'queryReturnDetail'
                    });
                }
            });
        }
    }
};
