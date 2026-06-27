import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RealtimeProvider } from './realtime/RealtimeProvider';
import { RealtimeToast } from './realtime/RealtimeToast';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RealtimeProvider>
            <RealtimeToast />
            <RouterProvider router={router} />
          </RealtimeProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
