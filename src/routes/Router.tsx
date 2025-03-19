import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import About from '../pages/About';
import Layout from '../layouts/Layout';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
