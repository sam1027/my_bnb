import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import About from '../pages/About';
import PrivateRoute from '../components/base/PrivateRoute';
import Write from '../pages/Write';
import RoomDetail from '../pages/RoomDetail';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/write" element={<Write />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
