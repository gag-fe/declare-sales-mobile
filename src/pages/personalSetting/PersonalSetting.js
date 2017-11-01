import './PersonalSetting.less';
import React from 'react';
import List from '@gag/list';
import { connect } from 'react-redux';
import {setDocumentTitle} from '../../actions';
class PersonalSetting extends React.Component{
  constructor(props) {
    super(props);
    this.state={
    };
    this.setGroup=[
      '联系人',
      '手机号',
      '电子邮箱',
      '修改密码'
    ]
    this.personInfo=[
      "contacts",
      "telephone",
      "mailbox",
      ''
    ]
    }
    fillPersonnalInfo(index){
      let t=this;
      const {router,location} = t.props;
      //debugger
      if(3==index){
      router.push('/modifyPassword');
      }else{
        let state={personnalInfo:index};
        router.push({pathname:'/modifyPersonInfo',query:location.query,state:state});
      }
    }
    render(){
      let t=this;
      //debugger
      let {PersonalMessage} = t.props;
      return(
        <div id="personalSetting">
          <List  className="my-list">
                {
                  t.setGroup.map(function(item,index){
                    return <List.Item arrow={"horizontal"} key={index} extra={PersonalMessage[t.personInfo[index]]} onClick={t.fillPersonnalInfo.bind(t,index)}>{item}</List.Item>
                  })
                }
          </List>
        </div>
      );
    }

    componentWillMount() {
      setDocumentTitle("个人设置");
    }
}
function mapStateToProps(state) {
  return {
    PersonalMessage:state.login,
  }
}

export default connect(mapStateToProps)(PersonalSetting)
