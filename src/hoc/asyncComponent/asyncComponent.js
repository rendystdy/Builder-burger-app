// import React, { Component } from 'react';

// const asyncComponent = importComponent => {
//   return class extends Component {
//     state = {
//       component: null
//     };

//     componentDidMount() {
//       importComponent().then(cmp => {
//         this.setState({ component: cmp.default });
//       });
      
//     }

//     render() {
//       const { component } = this.state;
//       const C = component;

//       return C ? <C {...this.props} /> : null;
//     }
//   };
// };

// export default asyncComponent;