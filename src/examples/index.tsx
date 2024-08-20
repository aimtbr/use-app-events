import React from 'react';
import ReactDOM from 'react-dom/client';
import { SharedHookStateParent as SharedHookState } from './shared-hook-state/SharedHookState';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <h1>Examples</h1>
    <hr />

    <SharedHookState />
  </React.StrictMode>
);
