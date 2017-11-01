import React from 'react';
import Container from 'components/container/src';
import { connect } from 'react-redux';
import attachFastClick from 'fastclick';
class App extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    }
    componentDidMount() {
      attachFastClick(document.body);
    }
    render() {
      const {
        location,
        params,
        children
        } = this.props;
      const transition =children.props.transition || 'fade';
      return ( < Container
        id = "sk-container"
        transition = {
          transition
        }
        // fade transition example
        // transition='fade'
        // transitionEnterTimeout={450}
        // transitionLeaveTimeout={300}
        >{React.cloneElement(children, {key: location.pathname})}
        < /Container>
      );
    }
  }
  function mapStateToProps(state) {
   window.localStorage.setItem('__INITIAL_STATE__',JSON.stringify(state));
  return {
  }
}

export default App=connect(mapStateToProps,null)(App)
