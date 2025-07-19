import React from 'react';
import PropTypes from 'prop-types';
import classes from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={classes.errorBoundary}>
          <h2 className={classes.title}>エラーが発生しました</h2>
          <p className={classes.message}>申し訳ございません。予期しないエラーが発生しました。</p>
          <button
            onClick={() => window.location.reload()}
            className={classes.reloadButton}
          >
            ページを再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export { ErrorBoundary };