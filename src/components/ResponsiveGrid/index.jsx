import PropTypes from 'prop-types';
import classes from './ResponsiveGrid.module.css';

export const ResponsiveGrid = ({ children }) => {
  return (
    <div className={classes.grid}>
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired
};