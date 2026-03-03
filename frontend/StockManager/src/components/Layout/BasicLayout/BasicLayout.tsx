import Header from '../Header/Header.tsx';
import Footer from '../Footer/Footer.tsx';
import { Outlet } from 'react-router-dom';
import { COLORS } from '../../../constants/colors.ts';

const BasicLayout = () => {
  return (
    <div
      className="container is-fluid is-flex is-flex-direction-column p-0"
      style={{ minHeight: '100vh', backgroundColor: COLORS.background }}
    >
      <Header />

      <main className="is-flex-grow-1 px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default BasicLayout;
