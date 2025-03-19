import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>이 페이지는 About 페이지입니다.</p>
      <nav>
        <Link to="/">홈으로 이동</Link>
      </nav>
    </div>
  );
};

export default About;
