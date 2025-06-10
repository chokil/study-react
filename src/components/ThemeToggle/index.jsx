import { useApp } from 'src/contexts/AppContext';
import classes from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { state, toggleTheme } = useApp();
  const { theme } = state;

  return (
    <button
      className={`${classes.toggle} ${theme === 'dark' ? classes.dark : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className={classes.icon}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className={classes.text}>
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
};