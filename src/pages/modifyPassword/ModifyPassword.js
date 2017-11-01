import React from 'react';
import List from '@gag/list';
import InputItem from '@gag/input-item';
import Button from '@gag/button';
import WhiteSpace from '@gag/white-space';
import Modal from '@gag/modal';
import Icon from '@gag/icon';
import { connect } from 'react-redux';
import {goBackLogin} from '../../actions'
import {modifyPassword,setDocumentTitle} from '../../actions'
import {
  createForm
}
from 'rc-form';
class ModifyPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state={
    }
    }
  handleSubmit(e) {
    //debugger
    let t=this;
    let {userId,token}=t.props.userMessage;
    e.preventDefault(); // 修复 Android 上点击穿透
    console.log(this.props.form.getFieldsValue());
    this.props.form.validateFields((error, values) => {
        if (!error) {
        let postData={
          token:token,
          userId:userId,
          oldPasswd:values.oldPassword,
          newPasswd:values.newPassword
        }
        //debugger
        t.props.modifyPassword(postData);
        console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
        //callback();
    });
  }

  onClose = () => {
    let t=this;
    t.props.close();
    goBackLogin();
   }
  validateNewOldPassword=(rule, value, callback)=>{
    //debugger
     console.log(rule,value,callback);
     let t=this;
     let values=t.props.form.getFieldsValue();
     value=value||' ';
     values.oldPassword=values.oldPassword||' ';
       if (value.trim()==values.oldPassword.trim()) {
         callback('新密码与旧密码不能相同');
       } else {
         callback();
       }
   }
   validatePasswordLength=(rule, value, callback)=>{
      value=value||' ';
        if (value.trim().length>16) {
          callback('密码过长');
        } else {
          callback();
        }
    }
   validateNewPassword=(rule, value, callback)=>{
     //debugger
      console.log(rule,value,callback);
      let t=this;
      let values=t.props.form.getFieldsValue();
      value=value||' ';
      values.newPassword=values.newPassword||' ';
        if (value.trim()!==values.newPassword.trim()) {
          callback('新密码与确认密码不相同');
        } else {
          callback();
        }
    }
  render() {
    //debugger
    let t=this;
    let {userId}=t.props.userMessage;
    const { getFieldProps,  getFieldError, isFieldValidating } = t.props.form;
    const oldPasswordErrors = getFieldError('oldPassword');
    const newPasswordErrors = getFieldError('newPassword');
    const confirmPasswordErrors = getFieldError('confirmPassword');
    return (
    <div id="modify-password">
      < List>
      < InputItem {...getFieldProps('name',{
          initialValue:userId
        })}
            editable={false}
            placeholder = "请输入用户名" >
            <Icon type={require('images/people.svg')} size='md'/>
      < /InputItem>
      < InputItem {...getFieldProps('oldPassword',{
        rules: [
          {
            required: true,
            min: 6,
            message: '密码过短'
        },
        t.validatePasswordLength
        ],
        validateTrigger: 'onBlur',
        })}
      type = "password"
      placeholder = "请填写原密码" > 旧密码< /InputItem>
      {
        oldPasswordErrors ?<div className="error-style">{ oldPasswordErrors.join(',')}</div> : null
      }
      < InputItem {...getFieldProps('newPassword',{
        rules: [
          {
            required: true,
            min: 6,
            message: '密码过短'
        },
        t.validatePasswordLength,
        t.validateNewOldPassword
        ],
        validateTrigger: 'onBlur',
        })}
      type = "password"
      placeholder = "6-16个字符，包含数字和大小写字母" > 新密码 < /InputItem>
      {
        newPasswordErrors ?<div className="error-style">{ newPasswordErrors.join(',')}</div> : null
      }
      < InputItem {...getFieldProps('confirmPassword',{
        rules: [
          {
            required: true,
            min: 6,
            message: '密码过短'
        },
        t.validatePasswordLength,
        t.validateNewPassword
        ],
        validateTrigger: 'onBlur',
        })}
      type = "password"
      placeholder = "6-16个字符，包含数字和大小写字母" > 确认密码 < /InputItem>
      {
        confirmPasswordErrors ?<div className="error-style">{ confirmPasswordErrors.join(',')}</div> : null
      }
      <WhiteSpace size="lg" />
      <Button className="btn" type="primary" onClick={t.handleSubmit.bind(t)}>提交</Button>
      < /List>
      <Modal
          title="提示信息"
          transparent
          maskClosable={false}
          visible={t.props.modifySuccess}
          onClose={t.onClose}
          footer={[{ text: '确定', onPress: () => { console.log('ok'); t.onClose(); } }]}
        >
          <p>密码修改成功！</p>
          <p>请使用新密码重新登录。</p>
        </Modal>
    </div>
    )
  }
  componentWillMount() {
      setDocumentTitle("修改密码");
    }
  componentWillUnmount() {
  }
}



function mapStateToProps(state) {
  return {
    userMessage: state.login,
    modifySuccess:state.modifyPassword.modifySuccess
  }
}

const ExportModifyPassword=connect(mapStateToProps, {
  modifyPassword:modifyPassword.request,
  close:modifyPassword.failure,
})(ModifyPassword)
export default createForm()(ExportModifyPassword);
