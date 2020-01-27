import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import Classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
  // state = {
  //   showSideDrawer: false
  // };
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const sideDrawerCloseHandler = () => {
    setShowSideDrawer(false);
  };

  const sideDrawerToggleHandler = () => {
    // this.setState(prevState => {
    //   return { showSideDrawer: !prevState.showSideDrawer };
    // });
    // setShowSideDrawer(prevState => {
    //   return {
    //     showSideDrawer: !prevState.showSideDrawer
    //   };
    // });
    setShowSideDrawer(!showSideDrawer);
  };

  // const { showSideDrawer } = this.state;
  const { isAuthenticated } = props;
  return (
    <Aux>
      <Toolbar
        isAuth={isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        open={showSideDrawer}
        clossed={sideDrawerCloseHandler}
        isAuth={isAuthenticated}
      />
      <main className={Classes.content}>{props.children}</main>
    </Aux>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps, null)(Layout);
