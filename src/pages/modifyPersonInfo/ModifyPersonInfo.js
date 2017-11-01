import './ModifyPersonInfo.less';
import React from 'react';
import List from '@gag/list';
import { createForm } from 'rc-form';
import InputItem from '@gag/input-item';
import Button from '@gag/button';
import Modal from '@gag/modal';
import { connect } from 'react-redux';
import {setDocumentTitle,modifyPersonInfo} from '../../actions';
class ModifyPersonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.personnalInfo=[
      {name:'name',title:"姓名",rules:[{max:10,message: '不能大于10个字符'}],placeholder:"请填写姓名",type:'text'},
      {name:'mobile',title:"手机号码",rules:[this.checkMobile],placeholder:"请填写手机号码"},
      {name:'email',title:"邮箱",rules:[{type: 'email',message: '错误的 email 格式',}],placeholder:"请输入邮箱"},
    ]
    this.personInfo=[
      "contacts",
      "telephone",
      "mailbox",
    ]
    }
handleSubmit=(e)=>{
  let t=this;
  //this.props.form.submit((callback) => {
      //setTimeout(() => {
      let {userMessage,location,form} = t.props;
      let index=location.state&&location.state.personnalInfo;
      form.validateFields((error, values) => {
          if (!error) {
            let postData={
              token:userMessage.token,
              userId:userMessage.userId,
              field:t.personnalInfo[index].name,
              value:values[t.personnalInfo[index].name]
            }
            //debugger
            t.props.resetInfo(postData);
            console.log('ok', values);
          } else {
            console.log('error', error, values);
          }
        });
      //}, 1000);
//});
}
checkMobile(rule, value, callback) {
  console.log(rule,value,callback);
  let reg = /^1\d{10}$/i;
    if (value&&!reg.test(value)) {
      callback('请填写正确的手机号');
    } else {
      callback();
    }
}
  onClose = () => {
    let t=this;
    t.props.close();
    const {router} = t.props;
    router.push('/personalSetting');
   }
  render() {
    //debugger
    let t=this;
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    let {userMessage,location} = t.props;
    let index=location.state&&location.state.personnalInfo;
    let content=t.personnalInfo[index];
    const errors = getFieldError(content.name);
    return (
      <div id="modifyPersonInfo">
        <List>
          <InputItem
              {...getFieldProps(content.name, {
            initialValue: userMessage[t.personInfo[index]],
            validateFirst: true,
            rules:content.rules,
            validateTrigger: 'onBlur',
                })}
              clear
              type={content.type}
              autoFocus
              placeholder={content.placeholder}
            >{content.title}</InputItem>
        <div className="error-style">{errors ? errors.join(',') : null}</div>
        <Button className="btn" type="primary" onClick={t.handleSubmit.bind(t)}>确认</Button>
        </List>
        <Modal
          transparent
          maskClosable={false}
          visible={t.props.modifySuccess}
          onClose={t.onClose}
          footer={[{ text: '确定', onPress: () => { console.log('ok'); t.onClose(); } }]}>
          <p>{content.title}更改成功！</p>
        </Modal>
      </div>
    );
  }
  componentWillMount() {
    let state = this.props.location.state;
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

ModifyPersonInfo.propTypes = {
    initialValue: React.PropTypes.object,
    form: React.PropTypes.object
};
ModifyPersonInfo.displayName = "ModifyPersonInfo";
function mapStateToProps(state) {
  return {
    userMessage:state.login,
    modifySuccess:state.modifyPersonInfo.modifySuccess
  }
}
const ExportModifyPersonInfo=connect(mapStateToProps, {
  resetInfo:modifyPersonInfo.request,
  close:modifyPersonInfo.failure,
})(ModifyPersonInfo)
export default createForm()(ExportModifyPersonInfo);
