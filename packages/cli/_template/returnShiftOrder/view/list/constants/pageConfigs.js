import HippoInput from '@alife/hippo-input';
import HippoSelect from '@alife/hippo-select';

/**
 * pageConfigs
 * @description 页面组件的配置JSON
 */
export const buttonList = [

];

/**
 * 查询字段设置数组
 * @type {Array}
 */
export const searchFieldConfigs = [
    {
        controllType: HippoInput,
        attributes: {
            label: '退货移库单号',
            id: 'code',
            placeholder: '请输入退货通知单',
            hasClear: true,
        }
    },

    {
        controllType: HippoInput,
        attributes: {
            label: '来源单号',
            id: 'sourceCode',
            placeholder: '请输入来源单号',
            hasClear: true,
        }
    },

    {
        controllType: HippoInput,
        attributes: {
            label: '退货通知单号',
            id: 'returnNoticeCode',
            placeholder: '请输入退货通知单号',
            hasClear: true,
        }
    },

    {
        controllType: HippoSelect,
        attributes: {
            label: '退货方式',
            id: 'returnWay',
            placeholder: '请选择退货方式',
            fillProps: 'label',
            hasClear: true,
        }
    },

    {
        controllType: HippoSelect,
        attributes: {
            label: '状态',
            id: 'status',
            placeholder: '请选择状态',
            fillProps: 'label',
            hasClear: true,
        }
    },


    {
        controllType: HippoSelect.Combobox,
        attributes: {
            label: '部门',
            id: 'deptCode',
            placeholder: '请输入编码/名称/条码',
            fillProps: 'label',
            filterLocal: false,
            hasClear: true,
        }
    },

    {
        controllType: HippoSelect.Combobox,
        attributes: {
            label: '商品',
            id: 'itemCode',
            placeholder: '请输入编码/名称/条码',
            fillProps: 'label',
            filterLocal: false,
            hasClear: true,
        }
    },

    {
        controllType: HippoInput,
        attributes: {
            label: '操作用户',
            id: 'operatorId',
            placeholder: '请输入操作用户',
            hasClear: true,
        }
    },

];
