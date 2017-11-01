import {LOGIN,ORG_INFO,LOGIN_GET_USER_INFO} from '../actions'
export default function login(state = {orgInfo:{}}, action) {
  switch (action.type) {
    case LOGIN.SUCCESS:
      return Object.assign({}, state,action.response,{userId:action.userId,passwd:action.passwd})
    case LOGIN_GET_USER_INFO:
      return Object.assign({}, state,action.userInfo)
    case ORG_INFO.SUCCESS:
      return Object.assign({}, state,{orgInfo:action.orgInfo})
    default:
      return state
  }
}
