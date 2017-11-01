import React from 'react';
import {render} from 'react-dom';
import { hashHistory } from 'react-router';
import Root from './routes';
import configureStore from '../store/configureStore'
import rootSaga from '../sagas'
// withRouter HoC
// @see https://github.com/reactjs/react-router/blob/0616f6e14337f68d3ce9f758aa73f83a255d6db3/upgrade-guides/v2.4.0.md#v240-upgrade-guide/*<IndexRoute component={Index} />*/<Route path="signOut" component={SignOut}/>
let InitState=window.localStorage.getItem('__INITIAL_STATE__');
let store;
if(InitState){
    store = configureStore(JSON.parse(InitState));
}else{
    store = configureStore();
}
store.runSaga(rootSaga);
document.addEventListener('DOMContentLoaded', () => {
  render(
    <Root
    store={store}
    history={hashHistory}/>,
   document.getElementById('screen-check'));
});
