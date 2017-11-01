import {TENANTS_LIST} from '../actions'
export default function tenantsList(state = {tenantsList:[],isLoading:true}, action) {
  switch (action.type) {
    case TENANTS_LIST.REQUEST:
      return Object.assign({}, state,{isLoading:true})
    case TENANTS_LIST.SUCCESS:
      return Object.assign({}, state,{tenantsList:action.merchantInfoList},{isLoading:false})
    case TENANTS_LIST.FAILURE:
        return Object.assign({}, state,{isLoading:false})
    default:
      return state
  }
}
