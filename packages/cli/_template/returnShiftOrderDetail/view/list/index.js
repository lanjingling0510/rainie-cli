/**
 * @desc
 * @author wb-cyt420097@alibaba-inc.com
 * @since 26/06/2018.
 */
'use strict';

import React from 'react';
import { connect } from '@alife/wdk-dva';
import HippoTable from '@alife/hippo-table';
import './index.scss';

const { Column } = HippoTable;

/**
 * ListView
 * @extends React
 */
class ListView extends React.Component {

    render() {
        const { code } = this.props;

        const { list } = this.props.table;

        return (
            <div className="hippo-search-list-page">
                <div className="next-dialog-header">
                    退货移库单:
                    {code}
                </div>
                <HippoTable dataSource={list}>
                    <Column
                        title="商品编码"
                        lock="left"
                        width={160}
                        dataIndex="itemCode"
                    />
                    <Column
                        title="商品条码"
                        dataIndex="itemBarcode"
                        width={100}
                    />
                    <Column title="商品名称" dataIndex="itemName" width={80} />
                    <Column title="退货单位" dataIndex="unit" width={50} />
                    <Column title="部门" dataIndex="deptName" width={50} />
                    <Column
                        title="供应商"
                        dataIndex="supplierGroup"
                        width={80}
                    />

                    <Column title="规格" dataIndex="itemSpec" width={80} />

                    <Column title="退货原因" dataIndex="reason" width={80} />
                    <Column
                        title="应退数量"
                        dataIndex="shouldQuantity"
                        width={80}
                    />
                    <Column
                        title="实退数量"
                        width={80}
                        dataIndex="actualQuantity"
                    />
                    <Column
                        title="待退数量"
                        width={80}
                        dataIndex="remainQuantity"
                    />
                    <Column
                        title="移出库位"
                        width={80}
                        dataIndex="shiftCabinetIds"
                    />
                    <Column title="目标库位" dataIndex="returnCabinetCode" width={80} />
                </HippoTable>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state.page;
}

export default connect(mapStateToProps)(ListView);
