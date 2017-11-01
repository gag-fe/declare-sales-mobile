import './StoreDetail.less';
import React from 'react';
import List from '@gag/list';
import Button from '@gag/button';
import WhiteSpace from '@gag/white-space';
import InputItem from '@gag/input-item';
import WingBlank from '@gag/wing-blank';
import TextareaItem from '@gag/textarea-item';
import Modal from '@gag/modal';
import ImagePicker from '@gag/image-picker';
import Popup from '@gag/popup';
import Icon from '@gag/icon';
import Flex from '@gag/flex';
import moment from 'moment';
import Toast from '@gag/toast';
import UploadIcon from './UploadIcon';
import { connect } from 'react-redux';
import DatePicker from '@gag/date-picker';
import {storeDetailClaimDates,storeDetailUpdateCommit,setDocumentTitle} from '../../actions';
import defaultConfig from '../../services/defaultConfig';
import {goBackLogin} from '../../actions';
const LAST_MONTH=moment(moment(new Date()).subtract(1,'months').format('YYYY-MM')+'-01',"YYYY-MM-DD");
const TODAY=moment(new Date());
const TODAY_FORMAT=moment(new Date()).format('YYYY-MM-DD');
const YESTERDAY=moment().add(-1,'days').format('YYYY-MM-DD');
const IS_NULL_VALUE='';
const  uploadPictrueUrl=defaultConfig.urlPrefix+defaultConfig.uploadPictrue;
import {
  createForm
}
from 'rc-form';
const Attentions =props => (
  <div className="attentions-label">
    <p className="attentions-required">{props.title}</p>
    <p className="attentions-content">{props.content}</p>
  </div>
);
const ReportConfirm =props => (
  <div className="report-confirm-label">
    <span className="report-confirm-required">{props.title}</span>
    <span className="report-confirm">{props.extra}</span>
  </div>
);
class StoreDetail extends React.Component{
  constructor(props) {
    super(props);
    this.checkHistory=this.checkHistory.bind(this);
    this.onReturnReason=this.onReturnReason.bind(this);
    this.reportCommit=this.reportCommit.bind(this);
    const {storeDetail,tenantsList,location}=props;
    let {shopDataIndex}=storeDetail;
    let currentDefaultDate=location.state&&location.state.currentDefaultDate;
    let goodsNoList=tenantsList[shopDataIndex]['goodsNoList'];
    this.state={
      uploadLoading:false,
      sales:0,
      salesOrder:0,
      visibleReason: false,
      selectValue:moment(currentDefaultDate),
      goodsNoList:goodsNoList,
      files:[],
    };
    }
  onChange = (files, type, index) => {
    let t=this;
      console.log(files, type, index);
      ////debugger
      if(type=='remove'){
        this.setState({
          files,
        });
        return ;
      }
      let callback=(data)=>{
        t.state.files.push(data);
        this.setState({
          files:t.state.files,
          uploadLoading:false
        });
      }
      if(window.FormData) {
         let formData = new FormData();
      　　　　// 建立一个upload表单项，值为上传的文件
         //for(let i=0;i<t.state.files;i++){
           formData.append('file', files[files.length-1].file);
         //}
         this.setState({
           uploadLoading:true
         });
          this.uploadPictrue(formData,callback);
      }
    }
  handleSubmit=()=>{
    ////debugger
      let t=this;
      const {router,token,tenantsList,shopId} = t.props;
      let {shopDataIndex}=t.props.storeDetail;
      let {shopEntityId} =tenantsList[shopDataIndex];
      let callback=()=>{
        t.setState({
          visible: false,
          files:[],
        });
        Toast.info("营业数据上报成功",1,null,false);
        t.props.form.resetFields();
      }
      let values=this.props.form.getFieldsValue();
      　　　　// 建立一个upload表单项，值为上传的文件
      let saleDate=t.state.selectValue.format('YYYY-MM-DD');
         let postData={
           shopId:shopId,
           shopEntityId:shopEntityId,
           moneyTotal:values.sales,
           billTotal:values.salesOrder,
           note:values.note,
           saleDate:saleDate,
           pictrueUrl:[],
           goodsNoList:[],
         };
         for(let i=0;i<t.state.files.length;i++){
           postData.pictrueUrl.push(t.state.files[i].url);
         }
         if(t.state.goodsNoList&&t.state.goodsNoList.length>0){
           for(let i=0;i<t.state.goodsNoList.length;i++){
             let goodsNoList={
                bill:0,
                goodsName:t.state.goodsNoList[i].goodsName,
                goodsNo:t.state.goodsNoList[i].goodsNo,
                money:values['a'+t.state.goodsNoList[i].goodsNo],
             }
             postData.goodsNoList.push(goodsNoList);
           }
         }
         window.TOKEN=token;
         t.props.updateCommit(postData,callback);
    }
uploadPictrue(formData,callback) {
      try{
          let t=this;
          const {token} = t.props;
          let url=uploadPictrueUrl+'?token='+token;
          let xmlHttpRequest=new XMLHttpRequest();
          xmlHttpRequest.onreadystatechange=function()
              {
                if (xmlHttpRequest.readyState == 4) {
                  try{
                      if(!xmlHttpRequest.response){
                        throw new Error('网络异常,请检查网络');
                      }
                      let response = JSON.parse(xmlHttpRequest.response);
                      if (xmlHttpRequest.status == 200) {
                        if(response.status.toLowerCase()=='t'||response.status.toLowerCase()==='timeout'){
                          goBackLogin();
                          return;
                        }
                      if(response.status.toLowerCase()=='s'||response.status.toLowerCase()=='success'){
                        callback({url:response.data});
                        return;
                      }
                      throw new Error(response.msg);
                    }
                  }catch(error){
                    debugger
                    t.setState({
                      uploadLoading:false
                    });
                  Toast.info(error.message,3,null,false);
                  }
                }
              }
        xmlHttpRequest.open("POST",url,true);
        xmlHttpRequest.send(formData);

      }catch(error){
        console.log('error',error)
      }
    }
    onReturnReason = (e) => {
      let t=this;
      this.setState({
        visibleReason: true,
      });
    }
    onCloseReturnReason = (e) => {
      this.setState({
        visibleReason: false,
      });
    }
    dropdownMenu=(value)=>{
      let date=value.format('YYYY-MM-DD');
      if(TODAY_FORMAT==date){
        return  <span>{date}<em>(今天)</em></span>
      }else if (YESTERDAY==date) {
        return <span>{date}<em>(昨天)</em></span>
      }
      return <span>{date}</span>
    }
    errorsInfoDisplay=(fieldName)=>{
      let t=this;
      const {getFieldError} = t.props.form;
      let errors=getFieldError(fieldName);
      if(errors){
        return <div className="error-style">{errors.join(',')}</div>
      }
      return null;
    }
    onGoodsSalesInputBlur=(value)=>{
      let values=this.props.form.getFieldsValue();
      let needSumFields=Object.keys(values).filter(function (elem) {
          return (['sales','salesOrder','note'].indexOf(elem)==-1);
        });
      let sumMoneyTotal=needSumFields.reduce(function (partial, value) {
          let num= parseFloat(values[value]);
           if(isNaN(num)){
             return partial +0;
           }
          return partial +num*10000;
      },0)
      this.props.form.setFieldsValue({
      sales: sumMoneyTotal/10000,
    });
    }
    showGoodsNoList=(goodsNoList)=>{
      ////debugger
      let t=this;
      const {getFieldProps} = t.props.form;
      if(!goodsNoList||goodsNoList.length==0){
        return null;
      }
      let list=[];
      list.push(
        <div className="goods-list">
          <div className="goods-list-number">货号条码</div>
          <div className="goods-list-name">货号名称</div>
          <div className="goods-list-value-title">上报金额</div>
        </div>
      )
      goodsNoList.forEach((item)=>{
        let goodsNo='a'+item.goodsNo;
        list.push(
          <div key={item.goodsNo} className="goods-list">
              <div className="goods-list-number">{item.goodsNo}</div>
              <div className="goods-list-name">{item.goodsName}</div>
              <div className="goods-list-value">
                <InputItem
                  {...getFieldProps(goodsNo,{
                  //initialValue:storeData.claimMoney,
                  rules:[{required: true,message: '销售额不能为空'},t.checkDecimal],
                  })}
                  placeholder="请填写金额"
                  onBlur={t.onGoodsSalesInputBlur}
                ></InputItem>
            </div>
          </div>
        );
        list.push(t.errorsInfoDisplay('a'+item.goodsNo));
      });
      return list;
    }
    checkHistory(){
      debugger
      let t=this;
      const {router} = t.props;
      router.push('/historyDetail');
      //router.push({pathname:'/historyDetail',query:{typeId:t.state.id},state:null});
    }
    reportCommit = (e) => {
      let t=this;
      e.preventDefault(); // 修复 Android 上点击穿透
      console.log(this.props.form.getFieldsValue());
      //this.props.form.submit((callback) => {
        //console.log(callback.toString());
          //setTimeout(() => {
            this.props.form.validateFields((error, values) => {
              //debugger
              if (!error) {
                t.setState({
                  sales:values.sales,
                  salesOrder:values.salesOrder,
                  visible: true,
                });
                console.log('ok', values);
              } else {
                console.log('error', error, values);
              }
              //callback();
            });
        //  }, 1000);
      //});

    }

    onSelectdateChange= (value) => {
      this.setState({
        selectValue:value,
      });
    }

    onClose = () => {
      this.setState({
        visible: false,
      });
    }
  checkDecimal(rule, value, callback) {
    console.log(rule,value,callback);
    let reg=/^-?\d+(\.\d{0,2})?$/i;
      if (!reg.test(value)) {
        callback('请填写数字,金额最多两位小数');
      } else {
        callback();
      }
  }
  checkNumber(rule, value, callback) {
    console.log(rule,value,callback);
    let reg=/^\d+$/i;
      if (!reg.test(value)) {
        callback('请填写整数');
      } else {
        callback();
      }
  }
  render(){
      let t=this;
      const { getFieldProps} = t.props.form;
      const {orgInfo,canReportDate}=t.props;
      const { files,selectValue,uploadLoading,goodsNoList} = this.state;
      let phone=orgInfo.tel||orgInfo.mail;
      let SelectedReportDateInfo={};
      let date=selectValue.format('YYYY-MM-DD');
      if(canReportDate.has(date)){
        SelectedReportDateInfo=canReportDate.get(date);
      };
      return(
        <div id="store-detail">
          <List className="my-list">
              <List.Item
                extra={<Button type="primary" inline size="small" onClick={t.checkHistory}>查看</Button>}>查看历史</List.Item>
              {SelectedReportDateInfo.reviewStatus==3?<List.Item extra={<Button type="primary" inline size="small" onClick={t.onReturnReason}>查看</Button>}>退回原因</List.Item>:null}
              <DatePicker
                mode="date"
                title="选择日期"
                onChange={this.onSelectdateChange}
                value={this.state.selectValue}
                maxDate={TODAY}
                minDate={LAST_MONTH}
              >
              <List.Item>销售日期</List.Item>
            </DatePicker>
              <InputItem
                {...getFieldProps('sales',{
                //initialValue:storeData.claimMoney,
                rules:[{required: true,message: '日销售额不能为空'},t.checkDecimal],
                validateTrigger: 'onBlur',
                })}
                editable={!(goodsNoList&&goodsNoList.length>0)}
                placeholder="请填写金额"
              >日销售额（元）</InputItem>
              {
                t.errorsInfoDisplay('sales')
              }
              {
                t.showGoodsNoList(goodsNoList)
              }
              <InputItem
                {...getFieldProps('salesOrder',{
                //initialValue:storeData.claimBill,
                rules:[{required: true,message: '销售单数据不能为空'},t.checkNumber],
                validateTrigger: 'onBlur',
                })}
                placeholder="请填写销售单数据"
              >日销售单（单）</InputItem>
            {
              t.errorsInfoDisplay('salesOrder')
            }

          </List>
          <p style={{margin:'12px'}}>备注<span className="remark-note">(日结单等证明材料)</span></p>
          <List>
            <TextareaItem
              {...getFieldProps('note')}
              placeholder="最多输入20个文字"
              rows={2}
              count={20}
            />
          </List>
          <ImagePicker
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 5}
        />{
          uploadLoading?<UploadIcon/>:null
        }

          <WhiteSpace size="xl" />
          <WingBlank>
            <Button className="btn" type="primary" onClick={t.reportCommit} disabled={!SelectedReportDateInfo.canReport}>上报营业数据</Button>
          </WingBlank>
          <WhiteSpace size="xl" />
          <Attentions
            title="手机上报营业规则："
            content={`${orgInfo.details||IS_NULL_VALUE}`}
            >
          </Attentions>
          <WhiteSpace size="md" />
          <Attentions
            title={`如有其它疑问,请联系${orgInfo.contacts||IS_NULL_VALUE}`}
            content={`${phone||IS_NULL_VALUE},谢谢！`}
            >
          </Attentions>
          <WhiteSpace size="xl" />
          <Modal
            transparent
            maskClosable={false}
            visible={t.state.visible}
            onClose={t.onClose}
            footer={[{text: '取消', onPress: t.onClose},{ text: '确定', onPress:t.handleSubmit}]}>
            <ReportConfirm
              extra={t.dropdownMenu(t.state.selectValue)}
              title={"销售日期："}>
            </ReportConfirm>
            <ReportConfirm
              extra={t.state.sales}
              title={"日销售额(元)："}>
            </ReportConfirm>
            <ReportConfirm
              extra={t.state.salesOrder}
              title={"日销售单(笔)："}>
            </ReportConfirm>
          </Modal>
          <Modal
            transparent
            visible={t.state.visibleReason}
            onClose={t.onClose}
            footer={[{ text: '确定', onPress:this.onCloseReturnReason }]}>
            <Attentions
              title="退回原因"
              content={SelectedReportDateInfo.note}
              >
            </Attentions>
          </Modal>
        </div>
      )
    }

  componentWillMount() {
    this.props.getClaimDates();
  }
  componentDidMount() {
    const {storeDetail,tenantsList}=this.props;
    let { shopDataIndex}=storeDetail;
    let title=tenantsList[shopDataIndex].shopName;
    setDocumentTitle(title);
  }
}

function mapStateToProps(state) {
  let {canReportDate}=state.storeDetail;
  let reportDateMap=new Map();
  canReportDate.forEach((item)=>{
    reportDateMap.set(item.saleDate,item);
  });
  return {
    canReportDate:reportDateMap,
    storeDetail: state.storeDetail,
    tenantsList:state.tenantsList.tenantsList,
    orgInfo: state.login.orgInfo,
    shopId:state.login.shopId,
    token:state.login.token
  }
}

const ExportStoreDetail=connect(mapStateToProps, {
  getClaimDates:storeDetailClaimDates.request,
  updateCommit:storeDetailUpdateCommit,
})(StoreDetail)
export default createForm()(ExportStoreDetail);
