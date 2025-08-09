export const createKeyDownHandler = (handler) => (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handler(event);
  }
};
