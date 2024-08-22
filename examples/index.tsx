import ReactDOM from 'react-dom/client';
import { SharedHookStateParent as SharedHookState } from './shared-hook-state/SharedHookState';
import { GlobalCommunication } from './global-communication/GlobalCommunication';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <h1>Examples</h1>

    <div style={{ display: 'flex' }}>
      <SharedHookState />

      <GlobalCommunication />
    </div>
  </>
);
