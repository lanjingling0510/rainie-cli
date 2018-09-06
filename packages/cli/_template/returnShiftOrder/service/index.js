
import {getServices} from '../utils';

export default getServices({
    getItems: {url: '/base/itemManager/querySearchItem.json'},
    queryReturnNotice: {url: '/out/newReturnOutOrderManager/queryReturnOut.json', timeout: 20000},
    getDepartList: {url: '/base/departmentManager/queryAllForSelect.json'},
    queryOutStokOrderDetails: {url: '/out/newReturnOutOrderManager/queryOutStokOrderDetails.json'},
    confirmOutStokOrder: {url: '/out/newReturnOutOrderManager/confirmOutStokOrder.json'}
}, '//ums.hemaos.com');
