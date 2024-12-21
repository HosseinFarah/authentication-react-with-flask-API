import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Todos from './pages/Todos';
import HandleTodo from './Components/HandleTodo';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import ResendConfirmation from './pages/ResendConfirmation';
import Confirm from './pages/confirm';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './Components/PrivateRoute';
import RegisterForm from './pages/---RegisterForm';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="todos" element={<PrivateRoute><Todos /></PrivateRoute>} />
        <Route path="newtodo" element={<AdminRoute><HandleTodo /></AdminRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="resend-confirmation" element={<ResendConfirmation />} />
        <Route path="confirm" element={<Confirm />} />
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