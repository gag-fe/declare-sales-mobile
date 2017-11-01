import moment from 'moment';
export const getShopIdAndToken = (state,name ) => state.login[name]
export const getShopEntityId = (state,name) => {
let shopDataIndex=state.storeDetail.shopDataIndex;
let tenantsList=state.tenantsList.tenantsList;
return tenantsList[shopDataIndex][name];
}
export const LAST_MONTH=moment(new Date()).subtract(1,'months').format('YYYY-MM')+'-01';
export const TODAY=moment(new Date()).format('YYYY-MM-DD');
//export const getStarredByUser = (state, login) => state.pagination.starredByUser[login] || {}
//export const getStargazersByRepo = (state, fullName) => state.pagination.stargazersByRepo[fullName] || {}
