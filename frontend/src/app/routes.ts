import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Messages } from "./pages/Messages";
import { Profile } from "./pages/Profile";
import { Favorites } from "./pages/Favorites";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      {
        path: "/",
        Component: ProtectedRoute,
        children: [
          { path: "messages", Component: Messages },
          { path: "profile", Component: Profile },
          { path: "favorites", Component: Favorites },
        ],
      },
    ],
  },
]);

