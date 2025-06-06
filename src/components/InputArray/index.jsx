import PropTypes from "prop-types";
import classes from "./InputArray.module.css";

export const InputArray = ({ text, array, handleChange, handleAdd }) => {
  return (
    <div className={classes.inputArray}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        className={classes.input}
      />
      <button onClick={handleAdd} className="btn-center">
        追加
      </button>
      <ul className={classes.list}>
        {array.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

InputArray.propTypes = {
  text: PropTypes.string.isRequired,
  array: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};