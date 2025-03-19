import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../../layouts/Layout';

const PrivateRoute = () => {
  return true ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : null;
};

export default PrivateRoute;
