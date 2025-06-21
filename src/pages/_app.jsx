import PropTypes from "prop-types";
import "../styles/globals.css";
import { AppProvider } from "src/contexts/AppContext";
import { NotificationPortal } from "src/components/NotificationPortal";
import { ThemeToggle } from "src/components/ThemeToggle";
import { PerformanceMonitor } from "src/components/PerformanceMonitor";
import { ErrorBoundary } from "src/components/ErrorBoundary";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Component {...pageProps} />
        <NotificationPortal />
        <ThemeToggle />
        <PerformanceMonitor />
      </AppProvider>
    </ErrorBoundary>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
