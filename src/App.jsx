import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoutes'; 
import ServiceNavbar from './components/ServiceNavbar';
import ProviderRegistration from './pages/ProviderRegistration';
import UserRegistration from './pages/UserRegistration';
import Login from './pages/Login';
import Userdashboard from './pages/Userdashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Home from './pages/Home';
import CreateBooking from './pages/CreateBooking';
import ViewProviderProfile from './pages/ProviderPages/ViewProviderProfile';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ServiceNavbar />,   // navbar always visible
      children: [
        { path: "/", element: <Home /> },
        { path: "providerRegistration", element: <ProviderRegistration /> },
        { path: "userregistration", element: <UserRegistration /> },
        { path: "login", element: <Login /> }
      ]
    },

    // dashboards without navbar
    { path: "/userDashboard", element: <ProtectedRoute><Userdashboard /></ProtectedRoute>},
    { path: "/adminDashboard", element: <AdminDashboard /> },
    { path: "/providerDashboard", element: <ProviderDashboard />,
      children:[
            { path: "viewprovider", element: <ViewProviderProfile /> },

      ] 
    },
    { path: "/createbooking", element: <ProtectedRoute><CreateBooking/> </ProtectedRoute>}
  ]);

  return <RouterProvider router={router} />;
}

export default App;
