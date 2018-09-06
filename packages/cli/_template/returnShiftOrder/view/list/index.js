'use strict';
import React from 'react';
import Common from 'utils/common';
import { connect } from '@alife/wdk-dva';
import HippoTable from '@alife/hippo-table';
import HippoSearch from '@alife/hippo-search';
import { Feedback, Button, Dialog } from '@alife/next';
import HippoOperation from '@alife/hippo-operation';
import HippoPagination from '@alife/hippo-pagination';
import { buttonList, searchFieldConfigs } from './constants/pageConfigs';
import {
    updateFormItemsAttribute,
    parseDateString
} from '../../utils/index.js';
import {
    returnWayDataSource,
    returnTypeDataSource,
    statusDataSource
} from './constants/dataSource';
import './index.scss';

const { toast: Toast } = Feedback;
const { Column } = HippoTable;
const { setOpenPageType } = Common;

/**
 * ListView
 * @extends React
 */
class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.onItemInputUpdate = this.onInputUpdate.bind(this, 'itemCode');
    }

    depRender = deptDetails => {
        return deptDetails.map(item => (
            <div key={item.deptCode}>
                {item.deptCode} {item.deptName}
            </div>
        ));
    };

    codeRender = (value, key, data) => {
        return (
            <Button
                type="primary"
                shape="text"
                onClick={this.showDetail.bind(this, data)}
            >
                {value}
            </Button>
        );
    };

    showDetail(data) {
        setOpenPageType(
            '退货出库单明细',
            true,
            '//portal.hemaos.com/pages/outStorage/returnOut/returnShiftOrderDetail.html?' +
                'id=' + data.id + '&code=' + data.code
        );
    }

    operateRender = (value, key, data) => {
        return (
            <Button
                type="primary"
                shape="text"
                onClick={this.queryOutStokOrderDetails.bind(this, data.id)}
            >
                缺货
            </Button>
        );
    };

    queryOutStokOrderDetails = id => {
        this.props.dispatch({ type: 'page/queryOutStokOrderDetails', id: id });
    };

    confirmOutStokOrder = () => {
        this.props.dispatch({ type: 'page/confirmOutStokOrder' });
        this.toggleDialogShow();
    }

    render() {
        const {
            dataList = [],
            page,
            total,
            pageSize,
            loading,
        } = this.props.table;

        /**
         * 分页器的设置文档
         */
        const pageSetting = {
            current: page,
            total,
            pageSize
        };

        // 更新查询的默认值
        updateFormItemsAttribute(
            searchFieldConfigs,
            this.props.searchCriteria,
            'value'
        );

        // 更新查询的下拉选项
        updateFormItemsAttribute(
            searchFieldConfigs,
            {
                deptCode: this.props.departs,
                itemCode: this.props.items,
                returnWay: returnWayDataSource,
                returnType: returnTypeDataSource,
                status: statusDataSource
            },
            'dataSource'
        );

        // 调用模糊查询
        updateFormItemsAttribute(
            searchFieldConfigs,
            {
                itemCode: this.onItemInputUpdate
            },
            'onInputUpdate'
        );

        const dialogFooter = [
            <Button key="cancel" onClick={this.toggleDialogShow}>取消</Button>,
            <Button key="ok" type="primary" onClick={this.confirmOutStokOrder}>确认缺货</Button>
        ];


        return (
            <div className="hippo-search-list-page">
                <div className="hippo-page">
                    <div className="hippo-page-searchpart">
                        <HippoSearch
                            dataSource={searchFieldConfigs}
                            onChange={this.onHandleChange}
                            onSearch={this.onSearch}
                            onReset={this.onReset}
                        />
                    </div>
                    <div className="hippo-table-area-container">
                        <div className="hippo-table-area-part">
                            <HippoOperation
                                total={total}
                                onClick={this.operateClick}
                                buttonList={buttonList}
                                isSticky={true}
                            />
                            <HippoTable
                                dataSource={dataList}
                                isStickyHead={true}
                                stickyTop={56}
                                isLoading={loading}
                            >
                                <Column
                                    title="退供移库单号"
                                    dataIndex="code"
                                    width={200}
                                    lock="left"
                                    cell={this.codeRender}
                                />
                                <Column
                                    title="来源单号"
                                    dataIndex="sourceCode"
                                    width={100}
                                />
                                <Column
                                    title="退货通知单"
                                    dataIndex="noticeCode"
                                    width={100}
                                />
                                <Column
                                    title="退货方式"
                                    dataIndex="returnWayText"
                                    width={100}
                                />

                                <Column
                                    title="部门"
                                    dataIndex="deptDetails"
                                    cell={this.depRender}
                                    width={100}
                                />

                                <Column
                                    title="状态"
                                    dataIndex="statusText"
                                    width={100}
                                />

                                <Column
                                    title="创建时间"
                                    dataIndex="gmtCreate"
                                    type="date"
                                    width={100}
                                />
                                <Column
                                    title="操作用户"
                                    dataIndex="operatorName"
                                    width={100}
                                />

                                <Column
                                    title="操作开始时间"
                                    dataIndex="operateStartTime"
                                    type="dateTime"
                                    width={100}
                                />

                                <Column
                                    title="操作结束时间"
                                    dataIndex="operateFinishTime"
                                    type="dateTime"
                                    width={100}
                                />
                                <Column
                                    title="操作"
                                    dataIndex="operate"
                                    cell={this.operateRender}
                                    width={100}
                                />
                            </HippoTable>
                            <div className="hippo-paginatioin-container">
                                <HippoPagination
                                    {...pageSetting}
                                    pageSizeList={[50, 100, 200]}
                                    pageSizeSelector={true}
                                    onChange={this.onPageChange}
                                    onPageSizeChange={this.onPageSizeChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="hippo-transparent-area" />
                </div>
                <Dialog
                    minMargin={50}
                    visible={this.props.dialogVisible}
                    footer={dialogFooter}
                    autoFocus={false}
                    title="缺货明细:"
                    footerAlign="center"
                    style={{ width: '50%' }}
                    footerActions={['取消', '确认缺货']}
                    shouldUpdatePosition={true}
                    onCancel={this.toggleDialogShow}
                    onClose={this.toggleDialogShow}
                >
                    <HippoTable isStickyHead={false} dataSource={this.props.outStokOrderDetails}>
                        <Column dataIndex="itemCode" title="商品编码" />
                        <Column dataIndex="itemBarcode" title="商品条码" />
                        <Column dataIndex="itemName" title="商品名称" />
                        <Column dataIndex="shouldQuantity" title="应退数量" />
                        <Column dataIndex="actualQuantity" title="实退数量" />
                        <Column dataIndex="lessQuantity" title="缺货数量" />
                    </HippoTable>
                </Dialog>
            </div>
        );
    }

    toggleDialogShow = () => {
        this.props.dispatch({ type: 'page/toggleDialogShow' });
    }

    /**
     * 字段改变事件
     * @method onHandleChange
     * @param  {string}       key   字段名称
     * @param  {any}          value 字段值
     */
    onHandleChange = (key, value) => {
        let data = {};
        switch (key) {
            case 'outorderCreateTime':
            case 'outorderFinishTime':
            case 'returnTime':
                data[key] = parseDateString(value);
                break;
            default:
                data[key] = value;
        }
        this.props.dispatch({ type: 'page/setSearchCriteria', data });
    };

    onInputUpdate = (type, value) => {
        switch (type) {
            case 'itemCode':
                this.props.dispatch({ type: 'page/getItemList', data: value });
                break;
        }

        this.props.dispatch({
            type: 'page/setSearchCriteria',
            data: { [type]: value }
        });
    };

    /**
     * 分页器分页大小改变事件
     * @method onPageSizeChange
     * @param  {number}         pageSize 分页大小
     */
    onPageSizeChange = pageSize => {
        this.props.dispatch({ type: 'page/setPageIndex', data: 1 });
        this.props.dispatch({ type: 'page/setPageSize', data: pageSize });
        this.props.dispatch({
            type: 'page/selectReturnNotice',
            data: {
                rowSelected: [],
                rowSelectedIndexs: []
            }
        });
        this.props.dispatch({ type: 'page/queryReturnNotice', page: 1 });
    };

    /**
     * 页码改变事件
     * @method onPageChange
     * @param  {number}     pageIndex 页码
     */
    onPageChange = pageIndex => {
        this.props.dispatch({ type: 'page/setPageIndex', data: pageIndex });
        this.props.dispatch({
            type: 'page/selectReturnNotice',
            data: {
                rowSelected: [],
                rowSelectedIndexs: []
            }
        });
        this.props.dispatch({ type: 'page/queryReturnNotice' });
    };

    onSearch = () => {
        this.props.dispatch({ type: 'page/setPageIndex', data: 1 });
        this.props.dispatch({ type: 'page/queryReturnNotice', page: 1 });
    };

    /**
     * 重制
     * @method onReset
     */
    onReset = () => {
        this.props.dispatch({ type: 'page/resetSearchCriteria' });
    };
}
function mapStateToProps(state) {
    return state.page;
}
export default connect(mapStateToProps)(ListView);
