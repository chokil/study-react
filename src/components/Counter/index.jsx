import PropTypes from "prop-types";
import { memo } from "react";
import classes from "./Counter.module.css";

export const Counter = memo(({ count, isShow, handleClick, handleDisplay }) => {
  return (
    <div className={classes.counter}>
      {isShow ? (
        <h2 aria-live="polite" aria-label={`現在のカウント: ${count}`}>
          {count}
        </h2>
      ) : null}
      <button 
        onClick={handleClick} 
        aria-label="カウンターを増やす"
        className={classes.button}
      >
        カウントアップ
      </button>
      <button 
        onClick={handleDisplay}
        aria-label={isShow ? "カウンターを非表示" : "カウンターを表示"}
        className={classes.button}
      >
        {isShow ? "非表示" : "表示"}
      </button>
    </div>
  );
});

Counter.displayName = "Counter";

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  isShow: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDisplay: PropTypes.func.isRequired,
};