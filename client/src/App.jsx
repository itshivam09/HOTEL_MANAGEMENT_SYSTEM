import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/Hoteldetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/Verifyotp";
import OwnerDashboard from "./pages/OwnerDashboard";
import ManageHotel from "./pages/ManageHotel";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/hotels" element={<Hotels />} />

        <Route
          path="/hotels/:hotelId"
          element={<HotelDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/owner"
          element={<OwnerDashboard />}
        />

        <Route
          path="/owner/hotels/:hotelId"
          element={<ManageHotel />}
        />
        <Route
         path="/my-bookings"
         element={<MyBookings />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;