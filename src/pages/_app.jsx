import PropTypes from "prop-types";
import "../styles/globals.css";
import { AppProvider } from "src/contexts/AppContext";
import { NotificationPortal } from "src/components/NotificationPortal";
import { ThemeToggle } from "src/components/ThemeToggle";
import { PerformanceMonitor } from "src/components/PerformanceMonitor";

const MyApp = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <NotificationPortal />
      <ThemeToggle />
      <PerformanceMonitor />
    </AppProvider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
