import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

const initialState = {
  theme: 'light',
  notifications: [],
  collaborators: [],
  sharedCounter: 0,
  isCollaborating: false,
  user: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, { 
          id: Date.now(), 
          message: action.payload.message || action.payload,
          type: action.payload.type || 'info',
          timestamp: new Date()
        }]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaborators: [...state.collaborators, action.payload]
      };
    
    case 'REMOVE_COLLABORATOR':
      return {
        ...state,
        collaborators: state.collaborators.filter(c => c.id !== action.payload)
      };
    
    case 'UPDATE_SHARED_COUNTER':
      return { ...state, sharedCounter: action.payload };
    
    case 'TOGGLE_COLLABORATION':
      return { ...state, isCollaborating: !state.isCollaborating };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'LOGOUT':
      return { ...state, user: null };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme class to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (state.theme) {
        document.body.classList.add(`theme-${state.theme}`);
      }
    }
  }, [state.theme]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const addNotification = useCallback((message) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: message });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // Helper to set page background class
  const setPageBackground = useCallback((pageName) => {
    if (typeof document !== 'undefined') {
      // Remove existing bg-* classes
      document.body.className = document.body.className
        .replace(/bg-\w+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (pageName) {
        document.body.classList.add(`bg-${pageName}`);
      }
    }
  }, []);

  const value = {
    state,
    dispatch,
    toggleTheme,
    addNotification,
    removeNotification,
    setPageBackground
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};