import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyPassword from "../pages/VerifyPassword";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout/index";
import ForgotPassword from "../pages/ForgotPassword";
import ChatApp from "../components/ChatApp";
import ResetPassword from "../pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {
        path: "register",
        element: (
          <AuthLayouts>
            <RegisterPage />
          </AuthLayouts>
        ),
      },
      {
        path: "email",
        element: (
          <AuthLayouts>
            <VerifyEmail />
          </AuthLayouts>
        ),
      },
      {
        path: "password",
        element: (
          <AuthLayouts>
            <VerifyPassword />
          </AuthLayouts>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthLayouts>
            <ForgotPassword />
          </AuthLayouts>
        ),
      },
      {
        path: "forgot-password/:token",
        element: (
          <AuthLayouts>
            <ResetPassword />
          </AuthLayouts>
        ),
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
          {
            path: "/chat",
            element: <ChatApp />,
          },
        ],
      },
    ],
  },
  {
    path: "chatApp",
    element: <ChatApp />,
  },
]);

export default router;
