import PropTypes from "prop-types";
import { Component } from "react";
import classes from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={classes.errorContainer}>
          <h2>エラーが発生しました</h2>
          <p>申し訳ございません。何か問題が発生しました。</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className={classes.retryButton}
          >
            もう一度試す
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};