import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  Router,
  Route,
  IndexRoute,
}
from 'react-router';
 // import Login from 'pages/login';
 // import TenantsList from 'pages/tenantsList';
 // import HistoryDetail from 'pages/historyDetail';
 // import StoreDetail from 'pages/storeDetail';
 // import PersonalSetting from 'pages/personalSetting';
 // import FillPersonnalInfo from 'pages/fillPersonnalInfo';
 // import ModifyPassword from 'pages/modifyPassword';
 // import NotFound from 'pages/notFound/NotFound';
 // import ForgotPassword from 'pages/forgotPassword';
 // import RestrictAccount from 'pages/restrictAccount';

//import App from './App';
class Root extends React.Component {
    render() {
      const {store, history} = this.props;
      const routes={
          path:'/',
          getComponent(nextState,callback){
            require.ensure([],require=>{
              callback(null,require('./App'));
            },'App');
          },
          indexRoute:{
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/login'));
              },'login');
            }
          },
        childRoutes:[
          {
            path:'login/:shopId',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/login'));
              },'login');
             }
          },
          {
            path:'target/loginzd/id/:shopId',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/login'));
              },'login');
             }
          },
          {
            path:'tenantsList',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/tenantsList'));
              },'tenantsList');
             }
          },
          {
            path:'storeDetail',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/storeDetail'));
              },'storeDetail');
            }
          },
          {
            path:'historyDetail',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/historyDetail'));
              },'historyDetail')
            }
          },
          {
            path:'forgotPassword',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/forgotPassword'));
              },'forgotPassword')
            }
          },
          {
            path:'restrictAccount',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/restrictAccount'));
              },'restrictAccount')
            }
          },
          {
            path:'personalSetting',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/personalSetting'));
              },'personalSetting')
            }
          },
          {
            path:'modifyPassword',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/modifyPassword'));
              },'modifyPassword')
            }
          },
          {
            path:'modifyPersonInfo',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/modifyPersonInfo'));
              },'modifyPersonInfo')
            }
          },
          {
            path:'*',
            getComponent(nextState,callback){
              require.ensure([],require=>{
                callback(null,require('pages/notFound'));
              },'NotFound')
            }
          }
        ]
      };
      // const routes=(
      //   < Route path = "/" component = {App}>
      //     < IndexRoute component = {Login}/>
      //     < Route path = "/login/:shopId" component = {Login}/>
      //     < Route path = "/tenantsList" component = {TenantsList}/>
      //     < Route path = "/storeDetail"component = {StoreDetail}/>
      //     < Route path = "/historyDetail" component = {HistoryDetail}/>
      //     < Route path = "/forgotPassword" component = {ForgotPassword}/>
      //     < Route path = "/restrictAccount" component = {RestrictAccount}/>
      //     < Route path = "/personalSetting" component = {PersonalSetting}/>
      //     < Route path = "/modifyPassword"component = {ModifyPassword}/>
      //     < Route path = "/fillPersonnalInfo"component = {FillPersonnalInfo}/>
      //     < Route path = "*" component = {NotFound}/>
      //       {/*
      //       < Redirect from = "/" to = "/archives/posts"/>
      //       < Route path = "/fillPersonnalInfo/:id" component = {FillPersonnalInfo}/>
      //       < Route path = "about" component = {About}/>
      //       < Route onEnter = {this.requireAuth} path = "/archives" component = {Archives} >
      //       < Route path = "posts" components = {{original: Original,reproduce: Reproduce,}}/>
      //       < /Route>
      //       < Route path = ":page" component = {Page}/>*/}
      //   < /Route>
      // );
      return (
        <Provider store={store}>
            < Router history = {history} routes={routes}>
            < /Router>
        </Provider>
      );
    }
  }
  Root.displayName = "Root";
  Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }
module.exports =Root;
