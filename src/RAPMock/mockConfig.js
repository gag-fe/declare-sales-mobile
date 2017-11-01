 let mockConfig = {
        modeStr:'',  // mode不同值的具体含义如下:
                        // 1 - 拦截全部
                        // 2 - 黑名单中的项不拦截
                        // 3 - 仅拦截白名单中的项
                        // 0 - 不拦截

        disableLog:false,  //true:静止日志输出
        projectId:3,        //工程id
        ROOT:"192.168.150.222", //项目域名
        blackList: [],
        whiteList:[
        "ds/mobile_report/getOrgInfo.json",
        "/ds/pc_report/getClaimData.json",
        "getUsers.json",
        "rapModalData.json",
        "tobeCopy.json",
        "ltq.json",
        "queryUserData",],
};
export default mockConfig;
