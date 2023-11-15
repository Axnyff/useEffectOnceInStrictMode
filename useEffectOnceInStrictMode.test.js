import React, { useState } from "react";

import { render, fireEvent, screen } from "@testing-library/react";

import { useEffectOnceInStrictMode } from "./useEffectOnceInStrictMode";

describe("useEffectOnceInStrictMode", () => {
  const doRender = (mode, Component) => {
    if (mode === "StrictMode") {
      return render(
        <React.StrictMode>
          <Component />
        </React.StrictMode>
      );
    }
    return render(<Component />);
  };
  it.each(["StrictMode", "NonStrictMode"])(
    "should work correctly with no deps in %s",
    (mode) => {
      const mockedCall = jest.fn();
      const Component = () => {
        useEffectOnceInStrictMode(mockedCall);
        return null;
      };
      doRender(mode, Component);
      expect(mockedCall).toHaveBeenCalledTimes(1);
    }
  );

  it.each(["StrictMode", "NonStrictMode"])(
    "should work correctly if we change the function in %s",
    (mode) => {
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
      doRender(mode, Component);
      expect(mockedCall).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByText("Toggle"));
      expect(mockedCall2).toHaveBeenCalledTimes(1);
    }
  );
  it.each(["StrictMode", "NonStrictMode"])(
    "should work correctly with deps in %s",
    (mode) => {
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
      doRender(mode, Component);
      expect(mockedCall).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByText("Add"));
      expect(mockedCall).toHaveBeenCalledTimes(2);
      fireEvent.click(screen.getByText("Add"));
      expect(mockedCall).toHaveBeenCalledTimes(3);
    }
  );
  it.each(["StrictMode", "NonStrictMode"])(
    "should work correctly with deps and changing function in %s",
    (mode) => {
      const mockedCall = jest.fn();
      const mockedCall2 = jest.fn();
      const Component = () => {
        const [count, setCount] = useState(0);
        useEffectOnceInStrictMode(count !== 2 ? mockedCall : mockedCall2, [
          count,
        ]);
        return (
          <button type="button" onClick={() => setCount(count + 1)}>
            Add
          </button>
        );
      };
      doRender(mode, Component);
      expect(mockedCall).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByText("Add"));
      expect(mockedCall).toHaveBeenCalledTimes(2);
      fireEvent.click(screen.getByText("Add"));
      expect(mockedCall2).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByText("Add"));
      expect(mockedCall).toHaveBeenCalledTimes(3);
    }
  );
});
