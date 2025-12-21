import './App.css';
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
import UpdateUserProfile from './pages/UserPages/UpdateUserProfile';
import ViewMyBookings from './pages/UserPages/ViewMyBookings';
import CreateServiceCategory from './pages/adminpages/CreateServiceCategory';
import ViewAllServiceCategory from './pages/adminpages/ViewAllServiceCategory';
import PaymentPage from './pages/PaymentPage';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancel from './pages/BookingCancel';
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
    {
      path: "/userDashboard", element: <ProtectedRoute><Userdashboard /></ProtectedRoute>,
      children: [
        { path: "createbooking", element: <ProtectedRoute><CreateBooking /> </ProtectedRoute> },
        { path: "UpdateMyUserProfile", element: <ProtectedRoute><UpdateUserProfile /></ProtectedRoute> },
        { path: "ViewMyBookings", element: <ProtectedRoute><ViewMyBookings /></ProtectedRoute> },
        { path: "payment", element: <PaymentPage /> },


      ]
    },
    {
      path: "/adminDashboard", element: <ProtectedRoute> <AdminDashboard /> </ProtectedRoute>, children: [
        { path: "ViewAllUsers", element: <ProtectedRoute><ViewAllUsers /></ProtectedRoute> },
        { path: "ViewAllProviders", element: <ProtectedRoute><ViewAllProvider /></ProtectedRoute> },
        { path: "ViewAllComplaints", element: <ProtectedRoute><ViewAllComplaints /></ProtectedRoute> },
        { path: "ViewComplaintsById/:id", element: <ProtectedRoute><ViewComplaintsById /></ProtectedRoute> },
        { path: "CreateServiceCategory", element: <ProtectedRoute><CreateServiceCategory /></ProtectedRoute> },
        { path: "ViewAllServiceCategory", element: <ProtectedRoute><ViewAllServiceCategory /></ProtectedRoute> }


      ]
    },
    {
      path: "/providerDashboard", element: <ProtectedRoute><ProviderDashboard /></ProtectedRoute>,
      children: [
        {
          path: "viewprovider", element: <ProtectedRoute><ViewProviderProfile /> </ProtectedRoute>,
          children: [
            { path: "updateprovider", element: <ProtectedRoute><UpdateProviderProfile /> </ProtectedRoute> }]
        },
        { path: "create_availability", element: <ProtectedRoute><CreateAvailability /> </ProtectedRoute> },


      ]
    },
    { path: "booking-success", element: <BookingSuccess /> },
    { path: "booking-cancel", element: <BookingCancel /> },
    { path: "/logout", element: <Logout /> }

  ]);

  return <RouterProvider router={router} />;
}

export default App;
