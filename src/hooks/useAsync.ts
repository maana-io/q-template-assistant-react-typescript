import React from "react";

/**
 * @param asyncFunction async function to wrap
 * @param immediate whether to immediately execute or not
 *
 * From: https://usehooks.com/useAsync/
 */
export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [pending, setPending] = React.useState(false);
  const [value, setValue] = React.useState<T | null>();
  const [error, setError] = React.useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = React.useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response) => setValue(response))
      .catch((error) => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
}
