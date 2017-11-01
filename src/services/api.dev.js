import nattyFetch from 'natty-fetch';
import defaultConfig from './defaultConfig';
import {goBackLogin} from '../actions';
import Rap from '../RAPMock/Rap';
let AJAXBefore=Rap.wrapAJAX();


let pageConfig = window.pageConfig || {};
    pageConfig=Object.assign(pageConfig,defaultConfig);
// if (window.pageConfig) {
//     window.pageConfig.urlPrefix = '/';
// }


nattyFetch.setGlobal({
    fit: function (response) {
      if(response.status.toLowerCase()=='t'||response.status.toLowerCase()=='timeout'){
        goBackLogin();
      }
        return {
            success: response.status.toLowerCase()=='s'||response.status.toLowerCase()=='success',
            content: response.data,
            error: {message: response.msg , status:response.status}
        }
    },
    ignoreSelfConcurrent: true,
    data:{
        //token:'1BG7VI6EU0OEQI001GKNO3G1GVCVCM09'
    },
    willFetch:function(vars,config){
        AJAXBefore(vars,config);
      },
})
let DBC = nattyFetch.context({
    urlPrefix: pageConfig.urlPrefix
});

DBC.create({
    'login.checkLogin': {
        // fit: function (response) {
        //   //debugger
        //     return {
        //         success: response.success,
        //         content: response.data,
        //         error: {message: !response.success ? response.msg : null}
        //     }
        // },
        url: pageConfig.checkLogin,
        method: pageConfig.methodPost,
        //header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
        withCredentials:false
    },
    'login.getOrgInfo': {
        url: pageConfig.getOrgInfo,
        method: pageConfig.methodGet,
    },
    'login.getUserInfo': {
        url: pageConfig.getUserInfo,
        method: pageConfig.methodGet,
    },
    'tenantsList.shopList':{
        url: pageConfig.getShopList,
        method: pageConfig.methodGet
    },
    'storeDetail.updateCommit':{
      willFetch:function(vars,config){
        //debugger
        if(config.url.search(/\?token=/)==-1){
          config.url=config.url+'?token='+window.TOKEN
        }
      },
      url: pageConfig.commit,
      method: pageConfig.methodPost,
      header: {
            'Content-Type': 'application/json'
        }
    },
    'storeDetail.uploadPictrue':{
      willFetch:function(vars,config){
        //debugger
        if(config.url.search(/\?token=/)==-1){
          config.url=config.url+'?token='+window.TOKEN
        }
      },
      header: {
            'Content-Type': 'multipart/form-data'
        },
      url: pageConfig.uploadPictrue,
      method: pageConfig.methodPost,
    },
    'storeDetail.getClaimDates':{
      url: pageConfig.getClaimDates,
      method: pageConfig.methodGet,
    },
    'modifyPassword.resetPassword':{
      url: pageConfig.resetPassword,
      method: pageConfig.methodPost
    },
    'historyDetail.claimDataHistory':{
      url: pageConfig.claimDataHistory,
      method: pageConfig.methodPost
    },
    'modifyPersonInfo.resetInfo':{
      url: pageConfig.resetInfo,
      method: pageConfig.methodPost
    }
});


module.exports = DBC.api;
