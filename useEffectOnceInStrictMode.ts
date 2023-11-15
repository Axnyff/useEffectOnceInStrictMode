import { useEffect, useRef } from 'react';

export const useEffectOnceInStrictMode = (effect: () => void, deps: Array<unknown> = []) => {
  const destroyFn = useRef();
  const depsRef = useRef(null);
  const rendered = useRef(false);

  if (depsRef.current) {
    rendered.current = true;
  }

  if (depsRef.current && (depsRef.current.length !== deps.length || !deps.every((dep, i) => depsRef.current[i] === dep))) {
    depsRef.current = null;
  }

  useEffect(() => {
    // we need to reset the rendering if effect changed
    if (depsRef.current && rendered.current) {
      depsRef.current = null;
    }
  }, [effect]);

  useEffect(() => {
    if (!depsRef.current) {
      destroyFn.current = effect();
      depsRef.current = deps;
    }

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!rendered.current) {
        return;
      }

      // otherwise this is not a dummy destroy, so call the destroy func
      if (destroyFn.current) {
        destroyFn.current();
      }
    };
  }, [...deps, effect]);
};
