import { useState, useEffect, useRef } from 'react';
import classes from './PerformanceMonitor.module.css';

export const PerformanceMonitor = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  useEffect(() => {
    let animationId;
    
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  const getFPSColor = () => {
    if (fps >= 50) return '#4ade80';
    if (fps >= 30) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className={classes.monitor}>
      <h4 className={classes.title}>⚡ Performance Monitor</h4>
      <div className={classes.stats}>
        <div className={classes.stat}>
          <span className={classes.label}>Renders:</span>
          <span className={classes.value}>{renderCount}</span>
        </div>
        <div className={classes.stat}>
          <span className={classes.label}>FPS:</span>
          <span 
            className={classes.value} 
            style={{ color: getFPSColor() }}
          >
            {fps}
          </span>
        </div>
      </div>
      <div className={classes.bar}>
        <div 
          className={classes.progress}
          style={{ 
            width: `${(fps / 60) * 100}%`,
            backgroundColor: getFPSColor()
          }}
        />
      </div>
    </div>
  );
};