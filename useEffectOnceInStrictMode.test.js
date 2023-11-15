import React, { useState } from 'react';

import { render, fireEvent, screen } from '@testing-library/react';

import { useEffectOnceInStrictMode } from './useEffectOnceInStrictMode';

describe('useEffectOnceInStrictMode (NonStrictMode)', () => {
  const doRender = Component => {
    render(<Component />);
  };

  it('should work correctly with no deps', () => {
    const mockedCall = jest.fn();
    const Component = () => {
      useEffectOnceInStrictMode(mockedCall);
      return null;
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
  });

  it('should work correctly if we change the function', () => {
    const mockedCall = jest.fn();
    const mockedCall2 = jest.fn();
    const Component = () => {
      const [toggled, setToggled] = useState(false);
      useEffectOnceInStrictMode(toggled ? mockedCall2 : mockedCall);
      return (
        <button type="button" onClick={() => setToggled(!toggled)}>
          Toggle
        </button>
      );
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Toggle'));
    expect(mockedCall2).toHaveBeenCalledTimes(1);
  });
  it('should work correctly with deps', () => {
    const mockedCall = jest.fn();
    const Component = () => {
      const [count, setCount] = useState(0);
      useEffectOnceInStrictMode(mockedCall, [count]);
      return (
        <button type="button" onClick={() => setCount(count + 1)}>
          Add
        </button>
      );
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(3);
  });
  it('should work correctly with deps and changing function', () => {
    const mockedCall = jest.fn();
    const mockedCall2 = jest.fn();
    const Component = () => {
      const [count, setCount] = useState(0);
      useEffectOnceInStrictMode(count !== 2 ? mockedCall : mockedCall2, [count]);
      return (
        <button type="button" onClick={() => setCount(count + 1)}>
          Add
        </button>
      );
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall2).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(3);
  });
});

describe('useEffectOnceInStrictMode (StrictMode)', () => {
  const doRender = Component => {
    render(
      <React.StrictMode>
        <Component />
      </React.StrictMode>,
    );
  };

  it('should work correctly with no deps', () => {
    const mockedCall = jest.fn();
    const Component = () => {
      useEffectOnceInStrictMode(mockedCall);
      return null;
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
  });

  it('should work correctly if we change the function', () => {
    const mockedCall = jest.fn();
    const mockedCall2 = jest.fn();
    const Component = () => {
      const [toggled, setToggled] = useState(false);
      useEffectOnceInStrictMode(toggled ? mockedCall2 : mockedCall);
      return (
        <button type="button" onClick={() => setToggled(!toggled)}>
          Toggle
        </button>
      );
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Toggle'));
    expect(mockedCall2).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Toggle'));
    expect(mockedCall).toHaveBeenCalledTimes(2);
  });

  it('should work correctly with deps', () => {
    const mockedCall = jest.fn();
    const Component = () => {
      const [count, setCount] = useState(0);
      useEffectOnceInStrictMode(mockedCall, [count]);
      return (
        <button type="button" onClick={() => setCount(count + 1)}>
          Add
        </button>
      );
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(3);
  });

  it('should work correctly with deps and changing function', () => {
    const mockedCall = jest.fn();
    const mockedCall2 = jest.fn();
    const Component = () => {
      const [count, setCount] = useState(0);
      useEffectOnceInStrictMode(count !== 2 ? mockedCall : mockedCall2, [count]);
      return (
        <button type="button" onClick={() => setCount(count + 1)}>
          Add
        </button>
      );
    };
    doRender(Component);
    expect(mockedCall).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall2).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Add'));
    expect(mockedCall).toHaveBeenCalledTimes(3);
  });
});
