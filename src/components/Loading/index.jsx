import classes from './Loading.module.css';

export const Loading = () => {
  return (
    <div className={classes.container}>
      <div className={classes.spinner} role="status" aria-label="読み込み中">
        <span className="sr-only">読み込み中...</span>
      </div>
    </div>
  );
};