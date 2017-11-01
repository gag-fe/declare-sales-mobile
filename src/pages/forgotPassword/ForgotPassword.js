import './ForgotPassWord.less';
import React from 'react';
import WingBlank from '@gag/wing-blank';
import WhiteSpace from '@gag/white-space';
import { connect } from 'react-redux';
import Icon from '@gag/icon';
import {setDocumentTitle} from '../../actions';
  //let index = data.length - 1;
class ForgotPassword extends React.Component {
    constructor(props) {
      super(props);
      //debugger
    }
    componentWillMount() {
      setDocumentTitle("忘记密码");
    }

    componentDidMount() {

    }

    render() {
      //debugger
      let {orgInfo}=this.props;
      let phone=orgInfo.tel||orgInfo.mail;
      return (
        <div id="forgot-password">
          <Icon type={require('images/question.svg')} className="icon" />
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
            <WingBlank size="lg">
              <WhiteSpace size="lg" />
              <h1>忘记密码 ？</h1>
              <WhiteSpace size="lg" />
              <div>
                <p>如您忘记密码，</p>
                <p>需要密码重置，或有其它疑问，</p>
                <p>可在周一至周五9:00-17:00</p>
                <p>{`与${orgInfo.contacts||''}联系，`}</p>
                <p>{`${phone||''}，`}</p>
                <p>谢谢！</p>
              </div>
              <WhiteSpace size="lg" />
            </WingBlank>
        </div>
      );
    }
  }
function mapStateToProps(state) {
  return {
    orgInfo: state.login.orgInfo,
  }
}

export default connect(mapStateToProps,null)(ForgotPassword)
