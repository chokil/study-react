import { lazy, Suspense, useState } from 'react';
import classes from './SuspenseDemo.module.css';

const LazyFeature = lazy(() => import('../LazyFeature'));

export const SuspenseDemo = () => {
  const [showLazy, setShowLazy] = useState(false);

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>⚡ React Suspense Demo</h3>
      <p className={classes.description}>
        Click the button to lazy load a component!
      </p>
      
      <button
        className={classes.loadButton}
        onClick={() => setShowLazy(!showLazy)}
      >
        {showLazy ? 'Hide' : 'Load'} Lazy Component
      </button>

      {showLazy && (
        <Suspense fallback={
          <div className={classes.loading}>
            <div className={classes.spinner}></div>
            <p>Loading component...</p>
          </div>
        }>
          <LazyFeature />
        </Suspense>
      )}
    </div>
  );
};