import { useEffect, useState } from "react";

interface AsyncState<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export function useAsync<T>(load: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ loading: true });

  useEffect(() => {
    let active = true;
    setState({ loading: true });
    load()
      .then((data) => {
        if (active) setState({ data, loading: false });
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            loading: false,
            error: err instanceof Error ? err.message : "Something went wrong",
          });
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
