import PropTypes from "prop-types";
import classes from "./InputArray.module.css";

export const InputArray = ({ text, array, handleChange, handleAdd }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd();
  };

  return (
    <div className={classes.inputArray}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text-input" className="sr-only">
          テキストを入力
        </label>
        <input
          id="text-input"
          type="text"
          value={text}
          onChange={handleChange}
          className={classes.input}
          aria-label="追加するテキスト"
        />
        <button type="submit" className={classes.button}>
          追加
        </button>
      </form>
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