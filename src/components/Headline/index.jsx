import PropTypes from "prop-types";
import classes from "./Headline.module.css";
export const Headline = ({ page, children, handleReduce }) => {
  return (
    <div>
      <h1 className={classes.title}>{page} Page</h1>
      <p className={classes.description}>
        アイテムの数は{children}個です。
      </p>
      <button onClick={handleReduce} aria-label="アイテムを1つ減らす">
        減らす
      </button>
    </div>
  );
};

Headline.propTypes = {
  page: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  handleReduce: PropTypes.func.isRequired,
};
