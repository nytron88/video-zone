import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { AuthLayout } from "./components/index.js";
import {
  Login,
  Signup,
  Home,
  EditProfile,
  ChangePassword,
  VideoUpload,
} from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route
        path="signup"
        element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        }
      />
      <Route
        path="login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="edit-profile"
        element={
          <AuthLayout authentication>
            <EditProfile />
          </AuthLayout>
        }
      />
      <Route
        path="change-password"
        element={
          <AuthLayout authentication>
            <ChangePassword />
          </AuthLayout>
        }
      />
      <Route
        path="upload"
        element={
          <AuthLayout authentication>
            <VideoUpload />
          </AuthLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);
