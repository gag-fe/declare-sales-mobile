import './HistoryDetail.less';
import React from 'react';
import ListView from '@gag/list-view';
import Flex from '@gag/flex';
import { connect } from 'react-redux';
import Select,{ Option }  from 'rc-select';
import 'rc-select/assets/index.css';
import {LAST_MONTH,TODAY} from '../../reducers/selectors'
import {historyDetail,setDocumentTitle} from '../../actions'
const pageSize =62;
const reviewStatus=['未上报','已上报','已审核','退回','审核中'];
class HistoryDetail extends React.Component {
    constructor(props) {
      super(props);
      const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
      const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
      const {state}=this.props.location;
      const dataSource = new ListView.DataSource({
        getRowData,
        getSectionHeaderData: getSectionData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });

      this.dataBlob = {};
      this.sectionIDs = [];
      this.rowIDs = [];
      this.genData = (pIndex =0,data) => {
          if(data.length<=(this.rowIDs.length*pageSize)){
            return ;
          }
          const sectionName = `Section ${pIndex}`;
          this.sectionIDs.push(sectionName);
          this.dataBlob[sectionName] = sectionName;
          this.rowIDs[pIndex] = [];

          for (let j = 0; j <pageSize; j++) {
            const rowName = `S${pIndex}, R${j}`;
            let index=pIndex*pageSize+j;
            this.rowIDs[pIndex].push(rowName);
            this.dataBlob[rowName] =data[index];
          }
        this.sectionIDs = [].concat(this.sectionIDs);
        this.rowIDs = [].concat(this.rowIDs);
      };
      let selectFormat='all';
      if(state&&state.selectValue){
        selectFormat=state.selectValue;
      }
      this.state = {
        dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        selectFormat:selectFormat,
      };
    }
    getSelectList=(data)=>{
        let list=data.map((item,index)=>{
        return (<Option value={index}>
                 {item}
              </Option>)
      });
      return list;
    }
    onSelectFormat= (e) => {
      let t=this;
      let selectFormat;
      if (e && e.target) {
        selectFormat = e.target.value;
      } else {
        selectFormat = e;
      }
      this.setState({
        selectFormat:selectFormat,
      });
      let {token,shopEntityId}=t.props;
      let postData={
        token:token,
        shopEntityId:shopEntityId,
        fromDay:LAST_MONTH,
        toDay:TODAY,
        reviewStatus:selectFormat=='all'?'':selectFormat,
      }
      t.props.claimDataHistory(postData,t.clearDataSource);
    }
    clearDataSource=()=>{
        this.dataBlob = {};
        this.sectionIDs = [];
        this.rowIDs = [];
      }
    componentWillMount() {
      let t=this;
      let {token,shopEntityId}=t.props;
      let postData={
        token:token,
        shopEntityId:shopEntityId,
        fromDay:LAST_MONTH,
        toDay:TODAY,
        reviewStatus:t.state.selectFormat=='all'?'':t.state.selectFormat,
      }
      t.props.claimDataHistory(postData,t.clearDataSource);
    }
    componentDidMount() {
      let t=this;
      setDocumentTitle(t.props.shopName);
    }

    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    componentWillReceiveProps(nextProps) {
      let t=this;
      if(nextProps.historyData){
        t.genData(0,nextProps.historyData);
        this.setState({
             dataSource: this.state.dataSource.cloneWithRowsAndSections(t.dataBlob, t.sectionIDs, t.rowIDs),
           });
      }
    }

    onEndReached = (event) => {
    }
    onRouteStoreDetail=(value)=>{
       let t=this;
       const {
         router,
         location
       } = t.props;
       let state={currentDefaultDate:value};
       router.push({pathname:'/storeDetail',query:location.query,state:state});
     }
    render=()=> {
      let t=this;
      const separator = (sectionID, rowID) => {
        if(!t.dataBlob[rowID]){
          return null;
        }
        return(<div key={`${sectionID}-${rowID}`} style={{
          backgroundColor: '#ECECED',
          height: 1
        }}
        />)
      }
      const row = (rowData, sectionID, rowID) => {
        console.log(rowData);
        if(!rowData){
          return null;
        }
        let review=reviewStatus[rowData.reviewStatus];
        return (
          <div key={rowID} className="row">
              <Flex>
                <Flex.Item>{rowData.saleTime}</Flex.Item>
                <Flex.Item>{rowData.reviewStatus==2?rowData.confirmMoney:'--'}</Flex.Item>
                <Flex.Item>{rowData.reviewStatus==0?'--':rowData.moneyTotal}</Flex.Item>

                <Flex.Item>{rowData.reviewStatus==3?<span style={{color:'blue'}} onClick={t.onRouteStoreDetail.bind(t,rowData.saleTime)}>{review}</span>:review}</Flex.Item>
              </Flex>
          </div>
        );
      };

      return (
        <ListView ref="lv"
          dataSource={t.state.dataSource}
          renderHeader={function(){return(<Flex>
            <Flex.Item>销售日期</Flex.Item>
            <Flex.Item>确认金额</Flex.Item>
            <Flex.Item>上报金额</Flex.Item>
            <Flex.Item>
              <Select
                  value={t.state.selectFormat}
                  placeholder="请下拉选择"
                  className="select-style"
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                  optionLabelProp="children"
                  showSearch={false}
                  onChange={t.onSelectFormat}
                >
                <Option value={'all'}>
                    <span>{'全部状态'}</span>
                </Option>
                {
                  t.getSelectList(reviewStatus)
                }
              </Select>
            </Flex.Item>
          </Flex>);} }
          renderFooter={
                () => {
                if(this.props.isLoading){
                  return(<div style={{ padding: 30, textAlign: 'center' }}>
                        加载中...
                 </div>)
                   }
                if(this.props.historyData.length<=0){
                  return(<div style={{ padding: 30, textAlign: 'center' }}>
                        没有找到匹配的数据
                 </div>)
                }
                return(<div style={{ padding: 30, textAlign: 'center' }}>
                        加载完毕
                 </div>)
                }
            }
          renderRow={row}
          renderSeparator={separator}
          className="history-detail-list"
          pageSize={pageSize}
          initialListSize={62}
          scrollEventThrottle={20}
          onScroll={() => { console.log('scroll'); }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          stickyHeader
          stickyProps={{
            stickyStyle: { zIndex: 999, WebkitTransform: 'none', transform: 'none' },
            // topOffset: -43,
            // isActive: false, // 关闭 sticky 效果
          }}
          stickyContainerProps={{
            className: 'for-stickyContainer',
          }}
        />
      );
    }
  }
  function mapStateToProps(state) {
    let {shopDataIndex}=state.storeDetail;
    let {tenantsList}=state.tenantsList;
    let {shopEntityId,shopName} =tenantsList[shopDataIndex];
    return {
      shopEntityId:shopEntityId,
      shopName:shopName,
      historyData:state.historyDetail.historyData,
      isLoading:state.historyDetail.isLoading,
      token:state.login.token
    }
  }

  export default connect(mapStateToProps, {
  claimDataHistory:historyDetail.request,
  })(HistoryDetail)
