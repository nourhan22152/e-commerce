import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

import { Home } from './layout/home/home';
import { Products } from './layout/products/products';
import { Category } from './layout/category/category';
import { Cart } from './layout/cart/cart';
import { Order } from './layout/order/order';
import { Customer } from './layout/customer/customer';
import { Guest } from './layout/guest/guest';
import { ProductDetails } from './layout/product-details/product-details';

import { Dashboard } from './dashboard/dashboard';
import { Productdashboard } from './dashboard/productdashboard/productdashboard';
import { Homedashboard } from './dashboard/homedashboard/homedashboard';
import { Profile } from './layout/customer/profile/profile';
import { AuthGuard } from './auth-guard';
import { Login } from './layout/customer/login/login';
import { Register } from './layout/customer/register/register';
import { Addresses } from './layout/customer/addresses/addresses';
import { Customerdashboard } from './dashboard/customer-dashboard/customer-dashboard';
import { Orderdashboard } from './dashboard/orderdashboard/orderdashboard';
import { Categorydashboard } from './dashboard/categorydashboard/categorydashboard';
import { AdminGuard } from './guards/admin-guard';
import { OrderDetails } from './dashboard/order-details/order-details';
import { FeedbackDashboardComponent } from './dashboard/feedbackdashboard/feedbackdashboard';
import { Feedback } from './layout/shared/feedback/feedback';
import { EditProductsDashboard } from './dashboard/edit-products-dashboard/edit-products-dashboard';
import { UppdateproductDashboard } from './dashboard/uppdateproduct-dashboard/uppdateproduct-dashboard';
import { CustomerOrdersComponent } from './layout/customer-orders/customer-orders';

export const routes: Routes = [
  {
    path: "", component: Layout, children: [
      {
        path: "",
        redirectTo: "home", pathMatch: "full"
      },
      { path: "home", component: Home },
      { path: "products", component: Products },
      { path: "productsByCategory", component: Products },
      { path: "product/:id", component: ProductDetails },
      { path: "category", component: Category },
      { path: "cart", component: Cart },
      { path: "orders", component: Order },
      { path: 'customer-orders', component: CustomerOrdersComponent },
      { path: "customer", component: Customer },
      { path: "guest", component: Guest },
      { path: "feedback", component: Feedback },
      { path: 'profile', component: Profile, canActivate: [AuthGuard] },
    ]
  },
  {
    path: "dashboard",
    canActivate: [AdminGuard],
    component: Dashboard,
    children: [
      { path: "", redirectTo: "products", pathMatch: "full" },
      { path: "home", component: Home },
      { path: "products", component: Productdashboard },
      { path: "EditProductsDashboard", component: EditProductsDashboard },
      { path: 'edit/:id', component: UppdateproductDashboard },
      { path: "customer", component: Customerdashboard },
      { path: "orders", component: Orderdashboard },
      { path: "OrderDetails/:id", component: OrderDetails },
      { path: "categories", component: Categorydashboard },
      { path: "feedback", component: FeedbackDashboardComponent },
    ]
  },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'addresses', component: Addresses },



];

