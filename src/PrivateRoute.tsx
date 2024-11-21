import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from './redux/store';

interface PrivateRouteProps {
  component: React.FC;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const requestToken = useSelector((state: RootState) => state.auth.requestToken);
  return requestToken ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;















// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
// import { RootState } from './redux/store';

// interface PrivateRouteProps {
//   component: React.FC;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
//   const { token } = useSelector((state: RootState) => state.auth);

//   return token ? <Component /> : <Navigate to="/" />;
// };

// export default PrivateRoute;
