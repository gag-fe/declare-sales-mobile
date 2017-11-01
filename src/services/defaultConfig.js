
let defaultConfig = {
    //测试环境http://data.ds.test.goago.cn/  //上线环境http://data.ds.gooagoo.com/
    getOrgInfo:'ds/mobile_report/getOrgInfo.json',//查询机构信息
    checkLogin: 'ds/mobile_report/login.json',
    getShopList: 'ds/mobile_report/shopList.json',
    commit: 'ds/mobile_report/commit.json',//上报数据
    claimDataHistory: 'ds/mobile_report/claimDataHistory.json',
    resetPassword:'ds/mobile_report/resetPwd.json',
    resetInfo:'ds/mobile_report/resetUserInfo.json',
    getUserInfo:'ds/mobile_report/getUserInfo.json',
    getClaimDates: 'ds/mobile_report/getClaimDates.json',//查询上报日期列表
    uploadPictrue: 'ds/mobile_report/uploadPictrue.json',//上传图片
    methodPost:'POST',
    methodGet:'GET',
};
if(process.env.NODE_PUB){
  let ConfigProd={
    urlPrefix: 'http://data.ds.gooagoo.com/',
  }
  defaultConfig=Object.assign(defaultConfig,ConfigProd);
}else{
  let ConfigTest={
    urlPrefix: 'http://data.ds.test.goago.cn/',
  }
  defaultConfig=Object.assign(defaultConfig,ConfigTest);
}

export default defaultConfig;
