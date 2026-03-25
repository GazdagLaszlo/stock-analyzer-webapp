import { COLORS } from '../../../constants/colors';
import './Footer.scss';

const Footer = () => {
  return (
    <div
      style={{ height: '10vh', backgroundColor: COLORS.background }}
      className="is-flex is-justify-content-center is-align-items-center"
    >
      <footer className="has-text-centered is-flex is-justify-content-center is-align-items-center">
        <p>© 2026 StockAnalyzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Footer;
