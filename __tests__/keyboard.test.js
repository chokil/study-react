import { createKeyDownHandler } from '../src/utils/keyboard'

describe('createKeyDownHandler', () => {
  let mockHandler;
  let mockEvent;

  beforeEach(() => {
    mockHandler = jest.fn();
    mockEvent = {
      key: '',
      preventDefault: jest.fn(),
    };
  });

  test('calls handler when Enter key is pressed', () => {
    const keyDownHandler = createKeyDownHandler(mockHandler);
    mockEvent.key = 'Enter';

    keyDownHandler(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith(mockEvent);
  });

  test('calls handler when Space key is pressed', () => {
    const keyDownHandler = createKeyDownHandler(mockHandler);
    mockEvent.key = ' ';

    keyDownHandler(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith(mockEvent);
  });

  test('does not call handler for other keys', () => {
    const keyDownHandler = createKeyDownHandler(mockHandler);
    mockEvent.key = 'Tab';

    keyDownHandler(mockEvent);

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockHandler).not.toHaveBeenCalled();
  });

  test('returns empty function when handler is not a function', () => {
    console.warn = jest.fn();
    const keyDownHandler = createKeyDownHandler('not a function');
    mockEvent.key = 'Enter';

    keyDownHandler(mockEvent);

    expect(console.warn).toHaveBeenCalledWith('createKeyDownHandler: handler must be a function');
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  test('handles null handler gracefully', () => {
    console.warn = jest.fn();
    const keyDownHandler = createKeyDownHandler(null);
    mockEvent.key = 'Enter';

    keyDownHandler(mockEvent);

    expect(console.warn).toHaveBeenCalledWith('createKeyDownHandler: handler must be a function');
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  test('handles undefined handler gracefully', () => {
    console.warn = jest.fn();
    const keyDownHandler = createKeyDownHandler(undefined);
    mockEvent.key = 'Enter';

    keyDownHandler(mockEvent);

    expect(console.warn).toHaveBeenCalledWith('createKeyDownHandler: handler must be a function');
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });
});