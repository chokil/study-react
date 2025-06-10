import { useState } from 'react';
import classes from './LazyFeature.module.css';

export const LazyFeature = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>🎯 Lazy Loaded Feature</h3>
      <p className={classes.description}>
        This component was loaded on demand using React.lazy()!
      </p>
      <div className={classes.demo}>
        <p>Click counter: {count}</p>
        <button 
          className={classes.button}
          onClick={() => setCount(c => c + 1)}
        >
          Click me!
        </button>
      </div>
    </div>
  );
};