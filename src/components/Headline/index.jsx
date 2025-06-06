import PropTypes from "prop-types";
import classes from "./Headline.module.css";
export const Headline = (props) => {
  return (
    <div>
      <h1 className={classes.title}>{props.page} Page</h1>
      <p className={classes.description}>
        アイテムの数は{props.children}個です。
      </p>
      <button onClick={props.handleReduce}>減らす</button>
    </div>
  );
};

Headline.propTypes = {
  page: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  handleReduce: PropTypes.func.isRequired,
};
