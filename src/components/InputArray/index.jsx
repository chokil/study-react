import PropTypes from "prop-types";
import classes from "./InputArray.module.css";

export const InputArray = ({ text, array, error, handleChange, handleAdd }) => {
  return (
    <div className={classes.inputArray}>
      <div className={classes.inputGroup}>
        <label htmlFor="array-input" className={classes.visuallyHidden}>
          追加するテキスト
        </label>
        <input
          id="array-input"
          type="text"
          value={text}
          onChange={handleChange}
          className={classes.input}
          placeholder="テキストを入力"
          aria-describedby={error ? "input-error" : "input-help"}
          aria-invalid={!!error}
        />
        <button 
          onClick={handleAdd} 
          className={classes.button}
          disabled={!text.trim()}
          aria-label="リストに追加"
        >
          追加
        </button>
      </div>
      {error && (
        <p id="input-error" className={classes.error} role="alert">
          {error}
        </p>
      )}
      {!error && (
        <p id="input-help" className={classes.visuallyHidden}>
          テキストを入力して追加ボタンを押してください
        </p>
      )}
      <ul className={classes.list} role="list">
        {array.map((item, index) => (
          <li key={`${item}-${index}`} role="listitem">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

InputArray.propTypes = {
  text: PropTypes.string.isRequired,
  array: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};