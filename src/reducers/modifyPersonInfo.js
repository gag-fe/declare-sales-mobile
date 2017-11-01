import {MODIFY_PERSON_INFO} from '../actions'
export default function modifyPersonInfo(state = {modifySuccess: false}, action) {
  switch (action.type) {
    case MODIFY_PERSON_INFO.REQUEST:
      return Object.assign({}, state,{modifySuccess:false})
    case MODIFY_PERSON_INFO.SUCCESS:
      return Object.assign({}, state,{modifySuccess:true})
    case MODIFY_PERSON_INFO.FAILURE:
        return Object.assign({}, state,{modifySuccess:false})
    default:
      return state
  }
}
