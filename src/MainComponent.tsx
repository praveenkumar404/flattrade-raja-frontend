import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import store from './redux/store';

const MainComponent = () => {
  return (
    <Provider store={store}>
        <App />
    </Provider>
  );
}

export default MainComponent;








// import React from 'react'
// import { Provider } from 'react-redux'
// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './App'
// import store from './redux/store'

// const MainComponent = () => {
//   return (
//     <div>
//         <Provider store={store}>
//             <Router>
//                 <App />
//             </Router>
//         </Provider>
//     </div>
//   )
// }

// export default MainComponent
