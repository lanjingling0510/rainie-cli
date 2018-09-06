import { getServices } from '../utils';

export default getServices(
    {
        queryReturnDetail: {
            url: '/out/newReturnOutOrderManager/queryReturnOutOrderDetail.json'
        },
    },
    '//ums.hemaos.com'
);
