import { Navigate, Outlet } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';

const PrivateRoute = () => {
  return true ? (
    <BasicLayout>
      <Outlet />
    </BasicLayout>
  ) : null;
};

export default PrivateRoute;
