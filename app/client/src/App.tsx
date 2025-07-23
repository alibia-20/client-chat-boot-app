import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ProtectedRoute from "../components/ProtectedRoute";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Action lier au utilisateurs
import Users from "../components/pages/Users";
import FormEditeUser from "../components/FormEditeUser";
import FormAddUser from "../components/FormAddUser";
// Action lier au produits
import Products from "../components/pages/Products";
import FormEditeProduct from "../components/FormEditeProduct";
import FormAddProduct from "../components/FormAddProduct";
import AuthGuard from "../components/AuthGuard";
// FIN: Action lier au produits----
import FormEditQuestion from "../components/FormEditQuestion";
import QuestionsReponses from "../components/pages/QuestionsReponses";
import FormAddQuestion from "../components/FormAddQuestion";
import Stocks from "../components/pages/Stocks";
import Login from "../components/pages/Login";
import Dashbord from "../components/pages/Dashbord";
// import Contacts from "../components/pages/Contacts";
import PostsFacebook from "../components/pages/PostsFacebook";
import ShopifyOrders from "../components/pages/ShopifyOrders";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route accessible sans authentification */}
          <Route path="/" element={<Login />} />
          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashbord />
              </AuthGuard>
            }
          />
          {/* <Route
            path="/contacts"
            element={
              <AuthGuard>
                <Contacts />
              </AuthGuard>
            }
          /> */}
          <Route
            path="/stocks"
            element={
              <AuthGuard>
                <Stocks />
              </AuthGuard>
            }
          />

          <Route
            path="/shopifyorders"
            element={
              <AuthGuard>
                <ShopifyOrders />
              </AuthGuard>
            }
          />

          <Route
            path="/questionsreponses"
            element={
              <AuthGuard>
                <QuestionsReponses />
              </AuthGuard>
            }
          />
          <Route
            path="/questions-reponses/add"
            element={
              <AuthGuard>
                <FormAddQuestion />
              </AuthGuard>
            }
          />
          <Route
            path="/questions-reponses/edit/:id"
            element={
              <AuthGuard>
                <FormEditQuestion />
              </AuthGuard>
            }
          />
          <Route
            path="/users"
            element={
              <AuthGuard>
                <Users />
              </AuthGuard>
            }
          />
          <Route
            path="/users/add"
            element={
              <AuthGuard>
                <FormAddUser />
              </AuthGuard>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <AuthGuard>
                <FormEditeUser />
              </AuthGuard>
            }
          />
          <Route
            path="/products"
            element={
              <AuthGuard>
                <Products />
              </AuthGuard>
            }
          />
          <Route
            path="/products/add"
            element={
              <AuthGuard>
                <FormAddProduct />
              </AuthGuard>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <AuthGuard>
                <FormEditeProduct />
              </AuthGuard>
            }
          />
          <Route
            path="/facebookidpost"
            element={
              <AuthGuard>
                <PostsFacebook />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
