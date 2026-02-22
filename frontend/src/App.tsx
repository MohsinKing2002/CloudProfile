import { Route, Routes } from "react-router-dom";
import { Navbar, Footer } from "./components";
import {
  DeleteProfile,
  EditProfile,
  Feedback,
  Home,
  LoginPage,
  NotFound,
  ProfilePage,
  SignupPage,
} from "./screens";
import { AuthProvider } from "./contexts/AuthProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <div className="flex justify-between flex-col min-h-screen bg-gray-200 dark:bg-[#192337]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/delete-profile" element={<DeleteProfile />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        <Toaster position="bottom-center" />
      </div>
    </AuthProvider>
  );
}

export default App;
