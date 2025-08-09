/**
 * Creates a keydown event handler that triggers on Enter and Space keys
 * @param {Function} handler - The callback function to execute when Enter or Space is pressed
 * @returns {Function} Event handler function for keydown events
 * @example
 * const handleKeyDown = createKeyDownHandler(() => console.log('activated'));
 * <button onKeyDown={handleKeyDown}>Click me</button>
 */
export const createKeyDownHandler = (handler) => {
  if (typeof handler !== 'function') {
    console.warn('createKeyDownHandler: handler must be a function');
    return () => {};
  }

  return (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler(event);
    }
  };
};
