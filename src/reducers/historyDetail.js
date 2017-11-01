import {HISTORY_DETAIL} from '../actions'
export default function historyDetail(state = {historyData:[],isLoading:true}, action) {
  switch (action.type) {
    case HISTORY_DETAIL.REQUEST:
      return Object.assign({}, state,{isLoading:true})
    case HISTORY_DETAIL.SUCCESS:
      return Object.assign({}, state,{historyData:action.history},{isLoading:false})
    case HISTORY_DETAIL.FAILURE:
        return Object.assign({}, state,{isLoading:false})
    default:
      return state
  }
}
