import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoutes';
import MainLayout from './components/MainLayout';

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
// import ViewAllComplaints from './pages/viewAllComplaints';
import ViewComplaintsById from './pages/ViewComplaintsById';
import UpdateUserProfile from './pages/UserPages/UpdateUserProfile';
import ViewMyBookings from './pages/UserPages/ViewMyBookings';
import CreateServiceCategory from './pages/adminpages/CreateServiceCategory';
import ViewAllServiceCategory from './pages/adminpages/ViewAllServiceCategory';
import PaymentPage from './pages/PaymentPage';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancel from './pages/BookingCancel';
import ViewAllRequest from './pages/ProviderPages/ViewAllRequest';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ProviderRating from './pages/ProviderPages/ProviderRating';
import AddComplaint from './pages/AddComplaint';
import ViewAllComplaints from './pages/adminpages/ViewAllComplaints';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,   // ✅ Navbar + Footer always visible
      children: [
        { index: true, element: <Home /> },
        { path: "providerRegistration", element: <ProviderRegistration /> },
        { path: "userregistration", element: <UserRegistration /> },
        { path: "login", element: <Login /> },
        { path: "/aboutUs", element: <AboutUs /> },
        { path: "/contactUs", element: <ContactUs /> },
        { path: "/addComplaint", element: <AddComplaint /> }

      ],
    },

    // dashboards without navbar & footer
    {
      path: "/userDashboard",
      element: (
        <ProtectedRoute>
          <Userdashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "createbooking", element: <CreateBooking /> },
        { path: "UpdateMyUserProfile", element: <UpdateUserProfile /> },
        { path: "ViewMyBookings", element: <ViewMyBookings /> },
        { path: "payment", element: <PaymentPage /> },
      ],
    },

    {
      path: "/adminDashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "ViewAllUsers", element: <ViewAllUsers /> },
        { path: "ViewAllProviders", element: <ViewAllProvider /> },
        // { path: "ViewAllComplaints", element: <ViewAllComplaints /> },
        { path: "ViewComplaintsById/:id", element: <ViewComplaintsById /> },
        { path: "CreateServiceCategory", element: <CreateServiceCategory /> },
        { path: "ViewAllServiceCategory", element: <ViewAllServiceCategory /> },
        { path: "ViewAllComplaints", element: <ViewAllComplaints /> }

      ],
    },

    {
      path: "/providerDashboard",
      element: (
        <ProtectedRoute>
          <ProviderDashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "viewprovider", element: <ViewProviderProfile />,
          children:[
        { path: "updateprovider", element: <UpdateProviderProfile /> }]},
        { path: "create_availability", element: <CreateAvailability /> },
        { path: "viewAllRequest", element: <ViewAllRequest /> },
        { path: "viewAllReview", element: <ProviderRating /> }
      ],
    },

    { path: "/booking-success", element: <BookingSuccess /> },
    { path: "/booking-cancel", element: <BookingCancel /> },
    { path: "/logout", element: <Logout /> }


  ]);

  return <RouterProvider router={router} />;
}

export default App;
