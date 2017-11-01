import './Login.less';
import React from 'react';
import List from '@gag/list';
import InputItem from '@gag/input-item';
import Button from '@gag/button';
import WhiteSpace from '@gag/white-space';
import WingBlank from '@gag/wing-blank';
import Icon from '@gag/icon';
import Flex from '@gag/flex';
import Toast from '@gag/toast';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {login,orgInfo,setDocumentTitle} from '../../actions';
import {
  createForm
}
from 'rc-form';
class Login extends React.Component {
  constructor(props) {
    super(props);
    }
    componentWillMount() {
    let {params} = this.props;
    window.localStorage.setItem('LOGINURL',window.location.href);
    window.LOGINURL=window.location.href;
    if(!params.shopId){
      Toast.info('链接地址缺少shopId，请确认链接地址是否正确！',3,null,false);
      return ;
    }
     this.props.getOrgInfo(params.shopId);
    }
    componentDidMount() {
      setDocumentTitle("商户登录");
    }

    // routerWillLeave(nextLocation) {
    //   // 返回 false 会继续停留当前页面，
    //   // 否则，返回一个字符串，会显示给用户，让其自己决定
    //   //debugger
    //     return '确认要离开？';
    // }
  goAccountOrforgetPw=(type)=>{
    let t=this;
    if(type=='account'){
      t.props.router.push('/restrictAccount');
    }else {
      t.props.router.push('/forgotPassword');
    }
  }
  handleSubmit(e) {
    ////debugger
    let t = this;
    e.preventDefault();
    let callback=function(){
      ////debugger
      //let state = t.props.location.state||{};
      //window.TOKEN=data.token;
      //state=Object.assign(state,data,{userId:t.userId},{orgInfo:t.state.orgInfo});
      //if (location.state&&location.state.nextPathname) {
      //  t.props.router.replace({pathname:location.state.nextPathname});
      //} else {
      //  t.props.router.replace({pathname:'/tenantsList'});
      //}
      if(t.props.firstLogin=='Y'){
        Toast.info('首次登陆请修改密码',3,null,false);
        t.props.router.replace({pathname:'/modifyPassword'});
      }else{
        t.props.router.replace({pathname:'/tenantsList'});
      }
    }
    t.props.form.validateFields((error, values) => {
      if (!error) {
        ////debugger
        this.props.login(values.account,values.password,callback)
      } else {
        console.log('error', error, values);
      }
    });
  }

  render() {
    ////debugger
    let t=this;
    let {orgInfo}=this.props;
    let logo=orgInfo&&orgInfo.logo;
    const { getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const accountErrors = getFieldError('account');
    const passwordErrors = getFieldError('password');
    return (
    <div id="box-login">
      <div className="logo">
        <img  class="img" src={logo||require('images/default_logo.png')}></img>
      </div>
      < List>
      < InputItem
      {
        ...getFieldProps('account', {
            initialValue: t.props.loginAccount,
            validateFirst: true,
            rules:[{required: true, message: '账户不能为空',}],
            validateTrigger: 'onBlur',
          })
      }
            placeholder = "请输入账号" >
            <Icon type={require('images/people.svg')} size='md'/>
      < /InputItem>
      < InputItem {...getFieldProps('password', {
          initialValue: t.props.loginPassword,
          validateFirst: true,
          rules:[{required: true, message: '密码不能为空',}],
          validateTrigger: 'onBlur',
        })}
      type = "password"
      placeholder = "请输入密码" >
        <Icon type={require('images/safe.svg')} size='md'/>
      < /InputItem>
        <Flex>
          <Flex.Item><div  className="left-part" onClick={this.goAccountOrforgetPw.bind(this,'password')}>忘记密码？</div></Flex.Item>
          <Flex.Item><div  className="right-part" onClick={this.goAccountOrforgetPw.bind(this,'account')}>账号申请</div></Flex.Item>
        </Flex>
      <WhiteSpace size="xl" />
      <WhiteSpace size="xl" />
      <WingBlank size="md"><Button className="btn" type="primary" onClick={this.handleSubmit.bind(this)}>登录</Button></WingBlank>
      < /List>
      {
      accountErrors?<div className="error-style">
        { accountErrors.join(',')}
      </div> : null
      }
      {passwordErrors?
      <div className="error-style">
        {passwordErrors.join(',')}
      </div>: null
      }
    </div>
    )
  }
}

Login.propTypes = {
  orgInfo: PropTypes.object,
  // inputValue: PropTypes.string.isRequired,
  // navigate: PropTypes.func.isRequired,
  // updateRouterState: PropTypes.func.isRequired,
  // resetErrorMessage: PropTypes.func.isRequired,
  // // Injected by React Router
  // children: PropTypes.node
}

function mapStateToProps(state) {
  return {
    orgInfo: state.login.orgInfo,
    firstLogin:state.login.first,
    loginAccount:state.login.userId,
    loginPassword:state.login.passwd
  }
}

const ExportLogin=connect(mapStateToProps, {
  login:login.request,
  getOrgInfo:orgInfo.request,
})(Login)
export default createForm()(ExportLogin);
