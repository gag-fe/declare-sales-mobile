import './TenantsList.less';
import React from 'react';
import ReactDOM from 'react-dom';
import List from '@gag/list';
import Flex from '@gag/flex';
import WhiteSpace from '@gag/white-space';
import WingBlank from '@gag/wing-blank';
//import NoticeBar from '@gag/notice-bar';
import Accordion from '@gag/accordion';
import Icon from '@gag/icon';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';
import {tenantsList,setStoreDetailValue,setDocumentTitle} from '../../actions'
import {TODAY} from '../../reducers/selectors'
const Item = List.Item;
const reviewStatus=['未上报','已上报','已审核','退回'];
const AccordionHeader =props => {
  if(props.title.rebuttedCount){
    return (
      <div className='notice-bar'>
        {props.title.shopName}
        <div className='notice-bar-icon'>
           <Icon type={require('images/trips.svg')} />
        </div>
        <span className="notice-bar-content" onClick={props.onClick}>
          {`退回(${props.title.rebuttedCount})`}
        </span>
      </div>
    );
  }
  return <span>{props.title.shopName}</span>;
}
class TenantsList extends React.Component {
  constructor(props) {
     super(props);
     }
     onRouteStoreDetail=(shopDataIndex,currentDefaultDate)=>{
       //debugger
       let t=this;
       const {router,setStoreDetailValue} = t.props;
       setStoreDetailValue({shopDataIndex:shopDataIndex});
       let state={currentDefaultDate:currentDefaultDate}
       router.push({pathname:'/storeDetail',state:state});
     }
     personalSetting(){
       let t=this;
       const {router,location} = t.props;
       router.push({pathname:'/personalSetting'});
     }
     onRouteHistoryDetail=(shopDataIndex)=>{
        let t=this;
        const {router,setStoreDetailValue} = t.props;
        let state={selectValue:3};
        setStoreDetailValue({shopDataIndex:shopDataIndex});
        router.push({pathname:'/historyDetail',state:state});
      }
     getStoreList(){
      //debugger
      let t=this;
       let list=t.props.tenantsList.map((item,index)=>{
           return (
             <Accordion.Panel header={<AccordionHeader title={item} onClick={t.onRouteHistoryDetail.bind(null,index)}/>}>
             <List className="my-list">
               {
                 item.claimDataList&&item.claimDataList.map((info,idx)=>{
                   let review=reviewStatus[info.reviewStatus];
                  return <Item arrow="horizontal" extra={review} onClick={t.onRouteStoreDetail.bind(null,index,info.claimDate)} >{TODAY==info.claimDate?'今天':'昨天'}</Item>
                 })
               }
             </List>
           </Accordion.Panel>);
       })
       return list;
     }
  render() {
    let t=this;
    //debugger
    let {defaultActiveKey,tenantsList}=t.props;
    defaultActiveKey=defaultActiveKey<=tenantsList.length?defaultActiveKey.toString():'0';
    return (
      <div id="tenants-list">
        <Flex>
         <Flex.Item><div className="store-choose-title">请选择您负责的店铺:</div></Flex.Item>
            <Flex.Item><div><Icon type={require('images/setting.svg')} /></div><span className="single-setting" onClick={t.personalSetting.bind(t)}>个人设置</span></Flex.Item>
        </Flex>
        <Accordion defaultActiveKey={defaultActiveKey}>
            {t.getStoreList()}
        </Accordion>
        {this.props.isLoading?
          <div style={{ padding: 30, textAlign: 'center' }}>加载中...</div>:null
        }
    </div>);
  }
  componentWillMount() {
    setDocumentTitle("商户列表");
    let {getTenantsList}= this.props;
    getTenantsList();
  }

  componentDidMount() {
    //debugger
  }

  componentWillReceiveProps(nextProps) {
    //debugger
  }

  shouldComponentUpdate(nextProps, nextState) {
    //debugger
      return true;
  }

  componentWillUpdate(nextProps, nextState) {
    //debugger
  }

  componentDidUpdate(prevProps, prevState) {
    //debugger
  }

  componentWillUnmount() {
    //debugger
  }
}
function mapStateToProps(state) {
  return {
    tenantsList:state.tenantsList.tenantsList,
    isLoading:state.tenantsList.isLoading,
    requestMessage:state.login,
    defaultActiveKey:state.storeDetail.shopDataIndex,

  }
}

export default connect(mapStateToProps, {
getTenantsList:tenantsList.request,
setStoreDetailValue:setStoreDetailValue
})(TenantsList)
