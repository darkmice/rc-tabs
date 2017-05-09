import React from 'react';
import Tappable from 'react-tappable';
import cn from 'classnames/bind';
import ReactSwipe from 'react-swipe';

class TabsBasic extends React.Component {
  constructor(props) {
    super(props);
    const {styles, defaultActiveKey = 0} = this.props;
    this.state = {
      activeKey: defaultActiveKey
    };
    this.cx = cn.bind(styles);
    this.onTabClick.bind(this);
  }

  onTabClick(curIdx) {
    const self = this;
    if(this.state.activeKey !== curIdx) {
      this.setState({
        activeKey: curIdx,
      },() => {
        self.props.onchange && self.props.onchange(curIdx);
        if (this.swipe) this.swipe.slide(curIdx);
      });
    }
  }

  renderTabList() {
    const {children} = this.props;
    const {activeKey} = this.state;
    const tablist = React.Children.map(children, (ele, idx) => (
      <Tappable
        className={this.cx('item', {active: activeKey === idx})}
        onTap={this.onTabClick.bind(this, idx)}
      >
        {ele.props.name}
      </Tappable>
    ));
    return tablist;
  }

  renderTabPanel() {
    const {children, mode} = this.props;
    const {activeKey} = this.state;
    const pannelStyle = {};
    const tabpanel = React.Children.map(children, (ele, idx) => {
      const eleProps = {
        cn: this.cx('panel', {active: activeKey === idx})
      };
      return (ele && React.cloneElement(ele, eleProps));
    });
    return tabpanel;
  }

  render() {
    const tablist = this.renderTabList();
    const tabpanel = this.renderTabPanel();
    const {mode, children, defaultActiveKey} = this.props;
    return (
      <div className={this.cx('tab', {fade: mode === 'mode', slide: mode === 'slide'})}>
        <div className={this.cx('tab-list')}>
          {tablist}
        </div>
        <div className={this.cx('tab-panels')}>
          {
            mode === 'slide' ? (
              <ReactSwipe
                ref={swipe => (this.swipe = swipe)}
                style={{
                  container: {
                    height: '100%'
                  },
                  wrapper: {
                    height: '100%'
                  },
                }}
                swipeOptions={{
                  continuous: false,
                  startSlide: defaultActiveKey,
                  transitionEnd: this.onTabClick,
                }}
              >
                {tabpanel}
              </ReactSwipe>
            ) : tabpanel
          }
        </div>
      </div>
    );
  }
}

TabsBasic.defaultProps = {
  mode: 'fade',
}

TabsBasic.propTypes = {
  children: React.PropTypes.node,
  defaultActiveKey: React.PropTypes.number,
  onchange: React.PropTypes.func,
  styles: React.PropTypes.object,
  mode: React.PropTypes.oneOf(['fade', 'slide']),
};

module.exports = TabsBasic;
