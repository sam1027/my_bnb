import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import About from '../pages/About';
import PrivateRoute from '../components/base/PrivateRoute';
import Write from '../pages/Write';
import RoomDetail from '../pages/RoomDetail';
import Test from 'src/pages/Test';
import BookingConfirm from 'src/pages/BookingConfirm';

const Router = () => {
  return (
    // <BrowserRouter basename="/my-bnb">
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/booking/:id" element={<BookingConfirm />} />
        <Route path="/write" element={<Write />} />
        <Route path="/about" element={<About />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/test" element={<Test />} />
      </Route>
    </Routes>
    // </BrowserRouter>
  );
};

export default Router;
