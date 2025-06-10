import { useEffect, useState, useCallback, memo } from 'react';
import { useApp } from 'src/contexts/AppContext';
import classes from './CollaborativeCounter.module.css';

const Collaborator = memo(({ collaborator, isActive }) => (
  <div className={`${classes.collaborator} ${isActive ? classes.active : ''}`}>
    <div className={classes.avatar} style={{ backgroundColor: collaborator.color }}>
      {collaborator.name[0]}
    </div>
    <span className={classes.name}>{collaborator.name}</span>
  </div>
));

Collaborator.displayName = 'Collaborator';

export const CollaborativeCounter = () => {
  const { state, dispatch, addNotification } = useApp();
  const { sharedCounter, collaborators, isCollaborating } = state;
  const [activeCollaborator, setActiveCollaborator] = useState(null);

  const simulateCollaborator = useCallback(() => {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#5D5C61'];
    
    const newCollaborator = {
      id: Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    dispatch({ type: 'ADD_COLLABORATOR', payload: newCollaborator });
    addNotification(`${newCollaborator.name} joined the session!`);
    
    setTimeout(() => {
      dispatch({ type: 'REMOVE_COLLABORATOR', payload: newCollaborator.id });
      addNotification(`${newCollaborator.name} left the session`);
    }, 10000);
  }, [dispatch, addNotification]);

  useEffect(() => {
    if (isCollaborating) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7 && collaborators.length > 0) {
          const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
          setActiveCollaborator(randomCollaborator.id);
          dispatch({ type: 'UPDATE_SHARED_COUNTER', payload: sharedCounter + 1 });
          addNotification(`${randomCollaborator.name} incremented the counter!`);
          
          setTimeout(() => setActiveCollaborator(null), 500);
        }
      }, 2000);

      const joinInterval = setInterval(() => {
        if (Math.random() > 0.8 && collaborators.length < 5) {
          simulateCollaborator();
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(joinInterval);
      };
    }
  }, [isCollaborating, collaborators, sharedCounter, dispatch, addNotification, simulateCollaborator]);

  const handleToggleCollaboration = () => {
    dispatch({ type: 'TOGGLE_COLLABORATION' });
    if (!isCollaborating) {
      addNotification('Collaboration mode activated! 🎉');
      simulateCollaborator();
    } else {
      addNotification('Collaboration mode deactivated');
      collaborators.forEach(c => {
        dispatch({ type: 'REMOVE_COLLABORATOR', payload: c.id });
      });
    }
  };

  const handleIncrement = () => {
    dispatch({ type: 'UPDATE_SHARED_COUNTER', payload: sharedCounter + 1 });
    if (isCollaborating) {
      addNotification('You incremented the counter!');
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Collaborative Counter</h2>
      
      <div className={classes.counterDisplay}>
        <div className={classes.counter}>{sharedCounter}</div>
        <button 
          className={classes.incrementButton}
          onClick={handleIncrement}
        >
          +1
        </button>
      </div>

      <button 
        className={`${classes.collaborateButton} ${isCollaborating ? classes.active : ''}`}
        onClick={handleToggleCollaboration}
      >
        {isCollaborating ? '🛑 Stop Collaboration' : '🚀 Start Collaboration'}
      </button>

      {isCollaborating && (
        <div className={classes.collaborators}>
          <h3>Active Collaborators:</h3>
          <div className={classes.collaboratorsList}>
            {collaborators.map(collaborator => (
              <Collaborator
                key={collaborator.id}
                collaborator={collaborator}
                isActive={activeCollaborator === collaborator.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};