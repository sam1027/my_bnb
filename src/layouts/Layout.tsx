import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/about">소개</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet /> {/* 페이지 컴포넌트가 여기에 렌더링됨 */}
      </main>
    </div>
  );
};

export default Layout;
