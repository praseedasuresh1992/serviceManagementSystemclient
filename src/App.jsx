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
import UpdateProviderProfile from './pages/ProviderPages/UpdateProviderProfile';
import CreateAvailability from './pages/ProviderPages/CreateAvailability';
import Logout from './components/Logout';
import ViewAllUsers from './pages/ViewAllUser';
import ViewAllProvider from './pages/ViewAllProvider';
import ViewAllComplaints from './pages/viewAllComplaints';
import ViewComplaintsById from './pages/ViewComplaintsById';

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
    { path: "/adminDashboard", element: <AdminDashboard /> ,children:[
      {path:"ViewAllUsers" ,element:<ProtectedRoute><ViewAllUsers/></ProtectedRoute>},
      {path:"ViewAllProviders" ,element:<ProtectedRoute><ViewAllProvider/></ProtectedRoute>},
      {path:"ViewAllComplaints" ,element:<ProtectedRoute><ViewAllComplaints/></ProtectedRoute>},
      {path:`ViewComplaintsById/${providerId} `,element:<ProtectedRoute><ViewComplaintsById/></ProtectedRoute>}


    ]},
    { path: "/providerDashboard", element:<ProtectedRoute><ProviderDashboard /></ProtectedRoute> ,
      children:[
            { path: "viewprovider", element: <ProtectedRoute><ViewProviderProfile /> </ProtectedRoute>},
            { path: "updateprovider", element: <ProtectedRoute><UpdateProviderProfile /> </ProtectedRoute>},
            { path: "create_availability", element: <ProtectedRoute><CreateAvailability/> </ProtectedRoute>},


      ] 
    },
    { path: "/createbooking", element: <ProtectedRoute><CreateBooking/> </ProtectedRoute>},
    { path: "/logout", element: <Logout/> }

  ]);

  return <RouterProvider router={router} />;
}

export default App;
