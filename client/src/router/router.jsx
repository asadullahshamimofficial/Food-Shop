import { createBrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import LogIn from "../pages/page/LogIn";
import Register from "../pages/page/Register";
import AllFoods from "../pages/page/AllFoods";
import AddFood from "../pages/page/AddFood";
import UpdateFood from "../pages/page/UpdateFood";
import Gallery from "../pages/page/Gallery";
import MyFood from "../pages/page/MyFood";
import MyOrder from "../pages/page/MyOrder";
import Home from "../pages/page/Home/Home";
import Error from "../pages/page/Error";
import SingleFood from "../pages/page/SingleFood";
import FoodPurchase from "../pages/page/FoodPurchase ";
import PrivateRoute from "./PrivateRoute";

// My Foods Page, Add Food Page, My Orders

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRouter />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/allFoods",
        element: <AllFoods />,
      },
      {
        path: '/purchase/:id',
        element:
        // <PrivateRoute> 
          <FoodPurchase />
        // </PrivateRoute>,
      },
      {
        path: "/addFood",
        element: 
        // <PrivateRoute> 
          <AddFood /> 
        // </PrivateRoute>,
      },
      {
        path: "/updateFood",
        element: 
        // <PrivateRoute> 
          <UpdateFood /> 
        // </PrivateRoute>,
      },
      {
        path: "/myFood",
        element: 
        // <PrivateRoute> 
          <MyFood /> 
        // </PrivateRoute>,
      },
      {
        path: "/myOrder",
        element: 
        // <PrivateRoute> 
          <MyOrder />
        // </PrivateRoute>,
      },
      {
        path: "/singaleFood/:id",
        element: <SingleFood />,
        loader: ({params}) => fetch(`${import.meta.env.VITE_Server_Host_Link}/foods/${params.id}`)
      },
      {
        path: "/gallery",
        element: 
        // <PrivateRoute> 
          <Gallery /> 
        // </PrivateRoute>,
      },
      {
        path: "/logIn",
        element: <LogIn />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: '*',
        element: <Error />
      },
    ]
  },
  {
    path: '*',
    element: <Error />
  },
]);

export default router;