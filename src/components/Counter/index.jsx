import PropTypes from "prop-types";
import classes from "./Counter.module.css";

export const Counter = ({ count, isShow, handleClick, handleDisplay }) => {
  return (
    <div className={classes.counter}>
      {isShow ? <h2>{count}</h2> : null}
      <button onClick={handleClick} aria-label="カウントを増やす">
        ボタン
      </button>
      <button onClick={handleDisplay} aria-label={isShow ? "カウントを非表示にする" : "カウントを表示する"}>
        {isShow ? "非表示" : "表示"}
      </button>
    </div>
  );
};

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  isShow: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDisplay: PropTypes.func.isRequired,
};