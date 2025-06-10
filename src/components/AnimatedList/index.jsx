import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import classes from './AnimatedList.module.css';

const ListItem = memo(({ item, index, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item), 300);
  };

  return (
    <li
      className={`${classes.item} ${isRemoving ? classes.removing : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className={classes.dragHandle}>⋮⋮</span>
      <span className={classes.text}>{item}</span>
      <button
        className={classes.removeButton}
        onClick={handleRemove}
        aria-label={`Remove ${item}`}
      >
        ×
      </button>
    </li>
  );
});

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
  item: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export const AnimatedList = ({ items, onRemove }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = useCallback((e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>✨ Interactive List</h3>
      {items.length === 0 ? (
        <p className={classes.empty}>Add some items to see the magic! 🪄</p>
      ) : (
        <ul className={classes.list}>
          {items.map((item, index) => (
            <div
              key={item}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              className={draggedItem === item ? classes.dragging : ''}
            >
              <ListItem
                item={item}
                index={index}
                onRemove={onRemove}
              />
            </div>
          ))}
        </ul>
      )}
      <div className={classes.counter}>
        Total items: <span className={classes.count}>{items.length}</span>
      </div>
    </div>
  );
};

AnimatedList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemove: PropTypes.func.isRequired,
};