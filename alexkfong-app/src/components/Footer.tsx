import { useTheme } from "../context/ThemeContext";
import './Footer.css'
import MoonIcon from './Moonicon'
import SunIcon from './Sunicon'

function Footer() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <footer className="FooterBar" >
      <div className='FooterText'>
        <p>© 2025 Alex Fong. All rights reserved.</p>
      </div>
      <button id="Theme" onClick={toggleTheme}>
        {isDarkMode ? (
          <>
            <SunIcon className="moonIcon" />
            Light Mode

          </>
        ) : (
          <>
            <MoonIcon className="sunIcon" />
            Dark Mode
          </>
        )}
      </button>

    </footer>
  );
}
export default Footer;