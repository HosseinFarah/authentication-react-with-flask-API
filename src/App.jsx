import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Todos from './pages/Todos';
import HandleTodo from './Components/HandleTodo';
import NotFound from './pages/NotFound';
import Login from './pages/login';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="todos" element={<PrivateRoute><Todos /></PrivateRoute>} />
        <Route path="newtodo" element={<PrivateRoute><HandleTodo /></PrivateRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
