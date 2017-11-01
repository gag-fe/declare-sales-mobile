import {SET_STORE_DETAIL_VALUE,STORE_DETAIL_CLAIM_DATES} from '../actions'
const initialValue={
  canReportDate:[],
  shopDataIndex:0,
}
export default function storeDetail(state = initialValue, action) {
  switch (action.type) {
    case SET_STORE_DETAIL_VALUE:
        return Object.assign({}, state,action)
    case STORE_DETAIL_CLAIM_DATES.SUCCESS:
        return Object.assign({}, state,{canReportDate:action.canReportDate})
    default:
      return state
  }
}
