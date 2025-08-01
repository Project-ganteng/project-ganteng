import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ToastContext = createContext();

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }]
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: []
  });

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const addToast = useCallback((toast) => {
    const newToast = {
      id: Date.now() + Math.random(),
      ...toast
    };
    dispatch({ type: 'ADD_TOAST', payload: newToast });
    
    // Don't use setTimeout here since progress bar handles auto-remove
  }, []);

  const success = useCallback((message) => {
    addToast({ type: 'success', message });
  }, [addToast]);

  const error = useCallback((message) => {
    addToast({ type: 'error', message });
  }, [addToast]);

  const info = useCallback((message) => {
    addToast({ type: 'info', message });
  }, [addToast]);

  const warning = (message) => {
    addToast({ type: 'warning', message });
  };

  const value = {
    ...state,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
