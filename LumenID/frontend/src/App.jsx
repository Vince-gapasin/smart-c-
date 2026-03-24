import * as React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

/**
 * Main App Component
 * Uses React Router v7 with RouterProvider pattern
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;