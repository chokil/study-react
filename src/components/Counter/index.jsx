import { memo } from "react";
import PropTypes from "prop-types";
import classes from "./Counter.module.css";

const CounterComponent = ({ count, isShow, handleClick, handleDisplay }) => {
  const handleKeyDown = (handler) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className={classes.counter}>
      {isShow ? <h2 tabIndex="0" aria-live="polite">{count}</h2> : null}
      <button 
        onClick={handleClick} 
        onKeyDown={handleKeyDown(handleClick)}
        aria-label="カウントを増やす"
      >
        ボタン
      </button>
      <button 
        onClick={handleDisplay} 
        onKeyDown={handleKeyDown(handleDisplay)}
        aria-label={isShow ? "カウントを非表示にする" : "カウントを表示する"}
      >
        {isShow ? "非表示" : "表示"}
      </button>
    </div>
  );
};

CounterComponent.propTypes = {
  count: PropTypes.number.isRequired,
  isShow: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDisplay: PropTypes.func.isRequired,
};

export const Counter = memo(CounterComponent);