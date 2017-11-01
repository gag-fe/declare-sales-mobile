
// @see https://github.com/JedWatson/react-container
// @license MIT Copyright (c) 2015 Jed Watson
import '../style';
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

function hasChildrenWithVerticalFill(children) {
  let result = false;

  React.Children.forEach(children, (child) => {
    if (result) {
      return; // early-exit
    }

    if (!child) {
      return;
    }

    if (!child.type) {
      return
    }

    result = !!child.type.shouldFillVerticalSpace;
  });

  return result;
}

function initScrollable(defaultPos) {
  if (!defaultPos) {
    defaultPos = {};
  }

  let pos;
  let scrollable = {
    reset() {
      pos = {left: defaultPos.left || 0, top: defaultPos.top || 0};
    },
    getPos() {
      return {left: pos.left, top: pos.top};
    },
    mount(element) {
      let node = React.findDOMNode(element);
      node.scrollLeft = pos.left;
      node.scrollTop = pos.top;
    },
    unmount(element) {
      let node = React.findDOMNode(element);
      pos.left = node.scrollLeft;
      pos.top = node.scrollTop;
    }
  };

  scrollable.reset();

  return scrollable;
}
const TRANSITION_TIMEOUT = 500;
const NAMESPACE = null; // 'am'
const CLASSNAMES = {
  disabled: 'disabled',
  active: 'active',
};
const namespace = (NAMESPACE ? NAMESPACE + '-' : '');


class Container extends React.Component{
  setClassNS(classPrefix) {
    const prefix = classPrefix || this.props.classPrefix || '';

    return namespace + prefix;
  }

  getClassSet(ignorePrefix) {
    let classNames = {};
    const {
      amSize,
      amStyle,
      hollow,
      radius,
      rounded,
      active,
      selected,
      disabled,
      inset,
      } = this.props;

    // uses `.am-` as prefix if `classPrefix` is not defined
    let prefix = namespace;

    if (this.props.classPrefix) {
      const classPrefix = this.setClassNS();

      prefix = classPrefix + '-';

      // don't return prefix if ignore flag set
      !ignorePrefix && (classNames[classPrefix] = true);
    }

    if (amSize) {
      classNames[prefix + amSize] = true;
    }

    if (amStyle) {
      classNames[prefix + amStyle] = true;
    }

    if (hollow) {
      classNames[prefix + 'hollow'] = true;
    }

    classNames[this.prefixClass('radius')] = radius;
    classNames[this.prefixClass('rounded')] = rounded;

    classNames[this.prefixClass('inset')] = inset;

    // state className
    // `selected` is an alias of active
    classNames[CLASSNAMES['active']] = active || selected;
    classNames[CLASSNAMES['disabled']] = disabled;

    // shape
    // classNames[constants.CLASSES.radius] = this.props.radius;
    // classNames[constants.CLASSES.round] = this.props.round;

    return classNames;
  }

  prefixClass(subClass) {
    return this.setClassNS() + '-' + subClass;
  }
  componentDidMount() {
    if (this.props.scrollable && this.props.scrollable.mount) {
      this.props.scrollable.mount(this);
    }
  }

  componentWillUnmount() {
    if (this.props.scrollable && this.props.scrollable.unmount) {
      this.props.scrollable.unmount(this);
    }
  }

  render() {
    let {
      className,
      component: Component,
      children,
      direction,
      fill,
      align,
      justify,
      scrollable,
      transition,
      ...props
    } = this.props;
    let classSet = this.getClassSet();

    delete props.classPrefix;

    // As view transition container
    if (transition) {
      return (
        <CSSTransitionGroup
          component="div"
          className={classNames(this.setClassNS('views'), className)}
          transitionName={this.setClassNS(`view-transition-${transition}`)}
          transitionEnterTimeout={TRANSITION_TIMEOUT}
          transitionLeaveTimeout={TRANSITION_TIMEOUT}
          {...props}
        >
          {children}
        </CSSTransitionGroup>
      );
    }

    if (!direction) {
      if (hasChildrenWithVerticalFill(children)) {
        direction = 'column';
      }
    }

    if (direction === 'column' || scrollable) {
      fill = true;
    }

    if (direction === 'column' && align === 'top') {
      align = 'start';
    }

    if (direction === 'column' && align === 'bottom') {
      align = 'end';
    }

    if (direction === 'row' && align === 'left') {
      align = 'start';
    }

    if (direction === 'row' && align === 'right') {
      align = 'end';
    }

    let classes = classNames(classSet, className, {
      [this.prefixClass('fill')]: fill,
      [this.prefixClass('column')]: direction === 'column',
      [this.prefixClass('row')]: direction === 'row',
      [this.prefixClass('align-center')]: align === 'center',
      [this.prefixClass('align-start')]: align === 'start',
      [this.prefixClass('align-end')]: align === 'end',
      [this.prefixClass('justify-center')]: justify === 'center',
      [this.prefixClass('justify-start')]: justify === 'start',
      [this.prefixClass('justify-end')]: justify === 'end',
      [this.prefixClass('justified')]: justify === true,
      [this.prefixClass('scrollable')]: scrollable
    });

    return (
      <Component
        className={classes}
        {...props}
      >
        {children}
      </Component>
    );
  }
}

Container.initScrollable = initScrollable;

Container.defaultProps = {
  classPrefix: 'container',
  component: 'div',
};
Container.propTypes = {
  classPrefix: React.PropTypes.string,
    component: React.PropTypes.node,
    align: React.PropTypes.oneOf(['end', 'center', 'start']),
    direction: React.PropTypes.oneOf(['column', 'row']),
    fill: React.PropTypes.bool,
    grow: React.PropTypes.bool,
    justify: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.oneOf(['end', 'center', 'start'])
    ]),
    scrollable: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.object
    ]),
    transition: React.PropTypes.string,
};
Container.displayName = "Container";
module.exports=Container;
