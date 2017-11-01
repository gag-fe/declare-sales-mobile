import  './NotFound.less';
import React from 'react';
import WhiteSpace from '@gag/white-space';
import Result from '@gag/result';
import Icon from '@gag/icon';
class NotFound extends React.Component {
  constructor(props) {
    super(props);
    }
  render() {
    return (
      <div id="not-found">
        <Result
            img={<Icon type="cross-circle-o" className="icon" style={{ fill: '#F13642' }} />}
            title="Not Found ."
            message="未找到访问的内容，请检查您的链接"
          />
          <WhiteSpace />
      </div>
    )
  }
}
export default NotFound;
