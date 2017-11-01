import {MODIFY_PASSWORD} from '../actions'
export default function modifyPassword(state = {modifySuccess: false}, action) {
  switch (action.type) {
    case MODIFY_PASSWORD.REQUEST:
      return Object.assign({}, state,{modifySuccess:false})
    case MODIFY_PASSWORD.SUCCESS:
      return Object.assign({}, state,{modifySuccess:true})
    case MODIFY_PASSWORD.FAILURE:
        return Object.assign({}, state,{modifySuccess:false})
    default:
      return state
  }
}
