import login from './login'
import tenantsList from './tenantsList'
import modifyPassword from './modifyPassword'
import storeDetail from './storeDetail'
import historyDetail from './historyDetail'
import modifyPersonInfo from './modifyPersonInfo'
import { combineReducers } from 'redux'
const rootReducer = combineReducers({
  login,
  tenantsList,
  modifyPassword,
  storeDetail,
  historyDetail,
  modifyPersonInfo,
  // router
});

export default rootReducer
