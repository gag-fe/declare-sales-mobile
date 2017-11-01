/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all } from 'redux-saga/effects'
import api from '../services/api'
import Toast from '@gag/toast';
import * as actions from '../actions'
import { getShopIdAndToken, getShopEntityId,LAST_MONTH,TODAY} from '../reducers/selectors'

// each entity defines 3 creators { request, success, failure }
const {
  login,
  orgInfo,
  tenantsList,
  modifyPassword,
  storeDetailClaimDates,
  historyDetail,
  modifyPersonInfo,
  loginGetUserInfo
} = actions

// url for first page
// urls for next pages will be extracted from the successive loadMore* requests
const firstPageStarredUrl = login => `users/${login}/starred`
const firstPageStargazersUrl = fullName => `repos/${fullName}/stargazers`
const networkError=function(error){
  if(error.status==0){
    error.message='网络异常,请检查网络';
  }
}

/***************************** Subroutines ************************************/

// resuable fetch Subroutine
// entity :  user | repo | starred | stargazers
// apiFn  : api.fetchUser | api.fetchRepo | ...
// id     : login | fullName
// url    : next page url. If not provided will use pass id to apiFn
// function* fetchEntity(entity, apiFn, id, url) {
//   yield put( entity.request(id) )
//   const {response, error} = yield call(apiFn, url || id)
//   if(response)
//     yield put( entity.success(id, response) )
//   else
//     yield put( entity.failure(id, error) )
// }
//
// // yeah! we can also bind Generators
// export const fetchUser       = fetchEntity.bind(null, user, api.fetchUser)
// export const fetchRepo       = fetchEntity.bind(null, repo, api.fetchRepo)
// export const fetchStarred    = fetchEntity.bind(null, starred, api.fetchStarred)
// export const fetchStargazers = fetchEntity.bind(null, stargazers, api.fetchStargazers)

// load user unless it is cached
function* loadLogin(userId,passwd,callback) {
  try{
    const response=yield call(api.login.checkLogin,{userId,passwd});
    yield put( login.success(response,userId,passwd) );
    callback();
  }catch(error){
    networkError(error);
    Toast.info(error.message,3,null,false);
  }

  //}
}
function* storeDetailUpdateCommit(postData,callback) {
  //const user = yield select(getUser, login)
  //if (!user || requiredFields.some(key => !user.hasOwnProperty(key))) {
  try{
    yield call(api.storeDetail.updateCommit,postData);
    callback();
  }catch(error){
    networkError(error);
    Toast.info(error.message,3,null,false);
  }

  //}
}
function* loadHistoryDetail(postData,callback) {
  //const user = yield select(getUser, login)
  //if (!user || requiredFields.some(key => !user.hasOwnProperty(key))) {
  try{
    const historyData=yield call(api.historyDetail.claimDataHistory,postData);
    if(callback){
      callback();
    }
    yield put( historyDetail.success(historyData));
    callback();
  }catch(error){
    networkError(error);
    yield put( historyDetail.failure());
    Toast.info(error.message,3,null,false);
  }

  //}
}


// load repo unless it is cached
function* orgInfoRequest(shopId) {
  //const repo = yield select(getRepo, fullName)
  //if (!repo || requiredFields.some(key => !repo.hasOwnProperty(key)))
  try{
    const response=yield call(api.login.getOrgInfo, {shopId:shopId});
    yield put( orgInfo.success(response) )
  }catch(error){
    networkError(error);
    Toast.info(error.message,3,null,false);
  }
}

function* loadTenantsList() {
  try{
    const shopId = yield select(getShopIdAndToken,'shopId');
    const token = yield select(getShopIdAndToken,'token');
    //const data=yield call(api.storeDetail.getClaimDates, {shopId,token});//获取商铺列表查询时间;
    const response=yield call(api.tenantsList.shopList,{shopId,token,fromDay:LAST_MONTH,toDay:TODAY})
    yield put( tenantsList.success(response.merchantInfoList) )
  }catch(error){
    networkError(error);
    yield put( tenantsList.failure() )
    Toast.info(error.message,3,null,false);
  }
}
function* loadModifyPassword(postData) {
  try{
    const data=yield call(api.modifyPassword.resetPassword,postData);
    yield put( modifyPassword.success(data) )
  }catch(error){
    networkError(error);
    yield put( modifyPassword.failure())
    Toast.info(error.message,3,null,false);
  }
}
function* loadModifyPersonInfo(postData) {
  try{
    const data=yield call(api.modifyPersonInfo.resetInfo,postData);
    const token = yield select(getShopIdAndToken,'token');
    yield put( modifyPersonInfo.success())
    const userInfo=yield call(api.login.getUserInfo,{token:token})
    yield put( loginGetUserInfo(userInfo))
  }catch(error){
    networkError(error);
    yield put( modifyPersonInfo.failure())
    Toast.info(error.message,3,null,false);
  }
}
function* loadStoreDetailClaimDates() {
  try{
    const shopId = yield select(getShopIdAndToken,'shopId');
    const token = yield select(getShopIdAndToken,'token');
    const shopEntityId=yield select(getShopEntityId,'shopEntityId');
    let postData={
        token:token,
        shopId:shopId,
        shopEntityId:shopEntityId
      }
    const data=yield call(api.storeDetail.getClaimDates, postData);
    yield put( storeDetailClaimDates.success({canReportDate:data}) )
  }catch(error){
    networkError(error);
    Toast.info(error.message,3,null,false);
  }
}

// // load next page of users who starred this repo unless it is cached
// function* loadStargazers(fullName, loadMore) {
//   const stargazersByRepo = yield select(getStargazersByRepo, fullName)
//   if (!stargazersByRepo || !stargazersByRepo.pageCount || loadMore)
//     yield call(
//       fetchStargazers,
//       fullName,
//       stargazersByRepo.nextPageUrl || firstPageStargazersUrl(fullName)
//     )
// }

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// trigger router navigation via history
function* watchLogin() {
  while(true) {
    const {userId,passwd,callback} = yield take(actions.LOGIN.REQUEST)
    yield fork(loadLogin, userId,passwd,callback)
  }
}

// Fetches data for a User : user data + starred repos
function* watchOrgInfo() {
  while(true) {
    const {shopId} = yield take(actions.ORG_INFO.REQUEST)
    yield fork(orgInfoRequest,shopId);
  }
}

function* watchTenantsList() {
  while(true) {
    yield take(actions.TENANTS_LIST.REQUEST)
    yield fork(loadTenantsList)
  }
}
//
// Fetches more starred repos, use pagination data from getStarredByUser(login)
function* watchModifyPassword() {
  while(true) {
    const {postData} = yield take(actions.MODIFY_PASSWORD.REQUEST)
    yield fork(loadModifyPassword,postData)
  }
}
function* watchModifyPersonInfo() {
  while(true) {
    const {postData} = yield take(actions.MODIFY_PERSON_INFO.REQUEST)
    //debugger
    yield fork(loadModifyPersonInfo,postData)
  }
}

//
function* watchStoreDetailClaimDates() {
  while(true) {
    yield take(actions.STORE_DETAIL_CLAIM_DATES.REQUEST)
    yield fork(loadStoreDetailClaimDates)
  }
}
function* watchStoreDetailUpdateCommit() {
  while(true) {
    const {postData,callback}=yield take(actions.STORE_DETAIL_UPDATE_COMMIT)
    yield fork(storeDetailUpdateCommit,postData,callback)
  }
}
function* watchHistoryDetail() {
  while(true) {
  const {postData,callback}=yield take(actions.HISTORY_DETAIL.REQUEST)
    yield fork(loadHistoryDetail,postData,callback)
  }
}

export default function* root() {
  yield [
    fork(watchLogin),
    fork(watchOrgInfo),
    fork(watchTenantsList),
    fork(watchModifyPassword),
    fork(watchStoreDetailClaimDates),
    fork(watchStoreDetailUpdateCommit),
    fork(watchHistoryDetail),
    fork(watchModifyPersonInfo),
  ]
}
