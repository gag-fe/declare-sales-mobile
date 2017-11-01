
const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}

export const LOGIN = createRequestTypes('LOGIN')
export const ORG_INFO = createRequestTypes('ORG_INFO')
export const TENANTS_LIST = createRequestTypes('TENANTS_LIST')
export const STORE_DETAIL_CLAIM_DATES = createRequestTypes('STORE_DETAIL_CLAIM_DATES')
export const MODIFY_PASSWORD = createRequestTypes('MODIFY_PASSWORD')
export const MODIFY_PERSON_INFO = createRequestTypes('MODIFY_PERSON_INFO')
export const HISTORY_DETAIL = createRequestTypes('HISTORY_DETAIL')

export const SET_STORE_DETAIL_VALUE = 'SET_STORE_DETAIL_VALUE'
export const STORE_DETAIL_UPDATE_COMMIT = 'STORE_DETAIL_UPDATE_COMMIT'
export const LOGIN_GET_USER_INFO = 'LOGIN_GET_USER_INFO'

function action(type, payload = {}) {
  return {type, ...payload}
}

export const login = {
  request: (userId,passwd,callback) => action(LOGIN[REQUEST], {userId,passwd,callback}),
  success: (response,userId,passwd) => action(LOGIN[SUCCESS], {response,userId,passwd}),
  failure: (login, error) => action(LOGIN[FAILURE], {login, error}),
}

export const orgInfo = {
  request: shopId => action(ORG_INFO[REQUEST], {shopId}),
  success: (orgInfo) => action(ORG_INFO[SUCCESS], {orgInfo}),
  failure: (fullName, error) => action(ORG_INFO[FAILURE], {fullName, error}),
}

export const tenantsList = {
  request: () => action(TENANTS_LIST[REQUEST]),
  success: (merchantInfoList) => action(TENANTS_LIST[SUCCESS], {merchantInfoList}),
  failure: () => action(TENANTS_LIST[FAILURE]),
}
export const modifyPassword = {
  request: (postData) => action(MODIFY_PASSWORD[REQUEST],{postData}),
  success: (response) => action(MODIFY_PASSWORD[SUCCESS], {response}),
  failure: () => action(MODIFY_PASSWORD[FAILURE]),
}
export const modifyPersonInfo = {
  request: (postData) => action(MODIFY_PERSON_INFO[REQUEST],{postData}),
  success: (response) => action(MODIFY_PERSON_INFO[SUCCESS], {response}),
  failure: () => action(MODIFY_PERSON_INFO[FAILURE]),
}

export const storeDetailClaimDates = {
  request: () => action(STORE_DETAIL_CLAIM_DATES[REQUEST]),
  success: (response) => action(STORE_DETAIL_CLAIM_DATES[SUCCESS], response),
  failure: () => action(STORE_DETAIL_CLAIM_DATES[FAILURE]),
}

export const historyDetail = {
  request: (postData,callback) => action(HISTORY_DETAIL[REQUEST],{postData,callback}),
  success: (historyData) => action(HISTORY_DETAIL[SUCCESS], historyData),
  failure: () => action(HISTORY_DETAIL[FAILURE]),
}

export const setStoreDetailValue = data => action(SET_STORE_DETAIL_VALUE, data)
export const loginGetUserInfo = userInfo => action(LOGIN_GET_USER_INFO, {userInfo})
export const storeDetailUpdateCommit = (postData,callback) => action(STORE_DETAIL_UPDATE_COMMIT, {postData,callback})
export const setDocumentTitle=function(html){
  document.title=html;
}
export const goBackLogin=function(){
window.location.href=window.LOGINURL||window.localStorage.getItem('LOGINURL');
}
