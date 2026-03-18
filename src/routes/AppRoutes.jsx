import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

// Pages
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Payments from "../pages/Payments";
import Coupons from "../pages/Coupons";
import Reviews from "../pages/Reviews";
import Settings from "../pages/Settings";
import CancellingReasons from "../pages/CancellingReasons";
import EditCancellingReason from "../pages/EditCancellingReason";
import AddCancellingReason from "../pages/AddCancellingReason";
import Reports from "../pages/Reports";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Rejectedbystore from "../pages/Rejectedbystore";
import AllOrders from "../pages/AllOrders";
import PendingOrders from "../pages/PendingOrders";
import CancelledOrders from "../pages/CancelledOrders";
import OngoingOrders from "../pages/OngoingOrder";
import OutOFDeliveryOrders from "../pages/OutOFDeliveryOrders";
import PaymentFailedOrders from "../pages/PaymentFailedOrders";
import CompletedOrders from "../pages/CompletedOrders";
import DayWiseOrders from "../pages/DayWiseOrders";
import MissedOrders from "../pages/MissedOrders";

import StoresList from "../pages/StoresList";
import StoreEarningPaments from "../pages/StoreEarningPaments";
import StoreApproval from "../pages/StoreApproval";
import Cities from "../pages/Cties";

import AreaSociety from "../pages/AreaSociety";
import BulkUploadArea from "../pages/BulkUploadArea";
import UsersData from "../pages/UsersData";
import WalletHistory from "../pages/WalletHistroy";
import Taxes from "../pages/Taxes";
import Roles from "../pages/Roles";
import AddRole from "../pages/AddRole";
import EditRole from "../pages/EditRole";
import SubAdmin from "../pages/SubAdmin";
import AddSubAdmin from "../pages/AddSubAdmin";
import EditSubAdmin from "../pages/EditSubAdmin";
import Id from "../pages/Id";
import MembershipPlain from "../pages/MembershipPlain";
import AddMembership from "../pages/AddMembership";
import EditMembership from "../pages/EditMembership";
import ItemRequriment from "../pages/ItemRequriment";
import ItemSaleReport from "../pages/ItemSaleReport";
import TaxReports from "../pages/TaxReports";
import SendNotificationtonStore from "../pages/SendNotificationStore";
import SendNotificationDriver from "../pages/SendNotificationDriver";

import UserNotifications from "../pages/UserNotifications";
import StoreNotifications from "../pages/StoreNotifications";
import DriverNotifications from "../pages/DriverNotifications";
import ParentCategories from "../pages/ParentCategories";
import SubCategories from "../pages/SubCategories";
import BulkUpload from "../pages/BulkUpload";
import TrendingSearch from "../pages/TrendingSearch";
import StoreProducts from "../pages/StoreProducts";
import AdminProducts from "../pages/AdminProducts";
import PayoutRequests from "../pages/PayoutRequests";
import PayoutProcess from "../pages/PayoutProcess";
import PayoutDetails from "../pages/PayoutDetails";
import PayoutValidation from "../pages/PayoutValidation";
import Rewards from "../pages/Rewards";
import AddReward from "../pages/AddReward";
import EditReward from "../pages/EditReward";
import RedeemValues from "../pages/RedeemValues";
import AddRedeemValue from "../pages/AddRedeemValue";
import EditRedeemValue from "../pages/EditRedeemValue";
import DeliveryBoyIncentive from "../pages/DeliveryBoyIncentive";
import DeliveryBoy from "../pages/DeliveryBoy";
import AboutUs from "../pages/AboutUs";
import TermsAndConditions from "../pages/TermsAndConditions";
import UsersFeedback from "../pages/UsersFeedback";
import StoreFeedback from "../pages/StoreFeedback";
import DeliveryBoyFeedback from "../pages/DeliveryBoyFeedback";
import AddDeliveryBoy from "../pages/AddDeliveryBoy";
import EditDeliveryBoy from "../pages/EditDeliveryBoy";
import DeliveryBoyDetails from "../pages/DeliveryBoyDetails";
import DeliveryBoyOrders from "../pages/DeliveryBoyOrders";
import IncentivePayNow from "../pages/IncentivePayNow";
import IncentiveHistory from "../pages/IncentiveHistory";
import UsersCallbackRequests from "../pages/UsersCallbackRequests";
import AddUserCallbackRequest from "../pages/AddUserCallbackRequest";
import EditUserCallbackRequest from "../pages/EditUserCallbackRequest";
import StoresCallbackRequests from "../pages/StoresCallbackRequests";
import AddStoreCallbackRequest from "../pages/AddStoreCallbackRequest";
import EditStoreCallbackRequest from "../pages/EditStoreCallbackRequest";
import DeliveryBoyCallbackRequests from "../pages/DeliveryBoyCallbackRequests";
import AddDeliveryBoyCallbackRequest from "../pages/AddDeliveryBoyCallbackRequest";
import EditDeliveryBoyCallbackRequest from "../pages/EditDeliveryBoyCallbackRequest";
import SendNotificationUsers from "../pages/SendNotificationUsers";




const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}

      <Route path="/" element={<AdminLayout />}>

        <Route index element={<Dashboard />} />

        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<Settings />} />
        <Route path="cancelling-reasons" element={<CancellingReasons />} />
        <Route path="cancelling-reasons/add" element={<AddCancellingReason />} />
        <Route path="cancelling-reasons/edit/:id" element={<EditCancellingReason />} />
        <Route path="reports" element={<Reports />} />

        {/* sub admin management */}
        <Route path="roles" element={<Roles />}/>
        <Route path="roles/add" element={<AddRole />}/>
        <Route path="roles/edit/:id" element={<EditRole />}/>
        <Route path="sub-admin" element={<SubAdmin />}/>
        <Route path="sub-admin/add" element={<AddSubAdmin />}/>
        <Route path="sub-admin/edit/:id" element={<EditSubAdmin />}/>

        {/* ID`s */}
        <Route path="id" element={<Id />}/>

        {/* Membership plain */}
        <Route path="membership-plain" element={<MembershipPlain />}/>
        <Route path="membership-plain/add" element={<AddMembership />}/>
        <Route path="membership-plain/edit/:id" element={<EditMembership />}/>

        {/* reports */}
      <Route path="item-requirement" element={<ItemRequriment />}/>
      <Route path="sales-report" element={<ItemSaleReport />}/>
      <Route path="tax-reports" element={<TaxReports />}/>
      <Route path="reports" element={<Reports />}/>

      {/* send Notification */}
        <Route path="users-notification" element={<SendNotificationUsers />}/>
      <Route path="store-notification" element={<SendNotificationtonStore />}/>
        <Route path="driver-notification" element={<SendNotificationDriver />}/>

        {/* List notifications */}
         <Route path="user-notifications" element={<UserNotifications />}/>
      <Route path="store-notifications" element={<StoreNotifications />}/>
        <Route path="driver-notifications" element={<DriverNotifications />}/>

        {/*  Categories management */}
        <Route path="categories" element={<ParentCategories />}/>
        <Route path="sub-category" element={<SubCategories />}/>

      {/* Product catalog */}
      <Route path="products" element={<AdminProducts />}/>
   <Route path="store-products" element={<StoreProducts />}/>
     <Route path="trending-search" element={<TrendingSearch />}/>
       <Route path="bulk-upload-products" element={<BulkUpload />}/>

        
        {/*Payout  */}
        <Route path="payout-requests" element={<PayoutRequests />}/>
        <Route path="payout-requests/process/:id" element={<PayoutProcess />}/>
        <Route path="payout-requests/details/:id" element={<PayoutDetails />}/>
        <Route path="payout-validation" element={<PayoutValidation />}/>

{/* Rewards */}
<Route path="rewards-list" element={<Rewards />}/>
<Route path="rewards-list/add" element={<AddReward />}/>
<Route path="rewards-list/edit/:id" element={<EditReward />}/>
<Route path="redeem-value" element={<RedeemValues />}/>
<Route path="redeem-value/add" element={<AddRedeemValue />}/>
<Route path="redeem-value/edit/:id" element={<EditRedeemValue />}/>


{/* Delivery Boy */}
<Route path="delivery-boy-list" element={<DeliveryBoy />}/>
<Route path="delivery-boy-list/add" element={<AddDeliveryBoy />}/>
<Route path="delivery-boy-list/edit/:id" element={<EditDeliveryBoy />}/>
<Route path="delivery-boy-list/details/:id" element={<DeliveryBoyDetails />}/>
<Route path="delivery-boy-list/orders/:id" element={<DeliveryBoyOrders />}/>
<Route path="delivery-boy-incentive" element={<DeliveryBoyIncentive />}/>
<Route path="delivery-boy-incentive/pay/:id" element={<IncentivePayNow />}/>
<Route path="delivery-boy-incentive/history/:id" element={<IncentiveHistory />}/>


{/* Pages */}
<Route path="about-us" element={<AboutUs />}/>
<Route path="terms-conditions" element={<TermsAndConditions />}/>

{/* Feedback */}
<Route path="user-feedback" element={<UsersFeedback />}/>
<Route path="store-feedback" element={<StoreFeedback />}/>
<Route path="delivery-boy-feedback" element={<DeliveryBoyFeedback />}/>

{/* Callback Requests */}
<Route path="user-callback-request" element={<UsersCallbackRequests />} />
<Route path="user-callback-request/add" element={<AddUserCallbackRequest />} />
<Route path="user-callback-request/edit/:id" element={<EditUserCallbackRequest />} />

<Route path="store-callback-request" element={<StoresCallbackRequests />} />
<Route path="store-callback-request/add" element={<AddStoreCallbackRequest />} />
<Route path="store-callback-request/edit/:id" element={<EditStoreCallbackRequest />} />

<Route path="delivery-boy-callback-request" element={<DeliveryBoyCallbackRequests />} />
<Route path="delivery-boy-callback-request/add" element={<AddDeliveryBoyCallbackRequest />} />
<Route path="delivery-boy-callback-request/edit/:id" element={<EditDeliveryBoyCallbackRequest />} />



        {/* Order Management */}

        <Route path="all-orders" element={<AllOrders />} />
        <Route path="pending-orders" element={<PendingOrders />} />
        <Route path="cancelled-orders" element={<CancelledOrders />} />
        <Route path="ongoing-orders" element={<OngoingOrders />} />
        <Route path="out-of-delivery-orders" element={<OutOFDeliveryOrders />} />
        <Route path="payment-failed-orders" element={<PaymentFailedOrders />} />
        <Route path="completed-orders" element={<CompletedOrders />} />
        <Route path="day-wise-orders" element={<DayWiseOrders />} />
        <Route path="missed-orders" element={<MissedOrders />} />
        <Route path="rejected-by-store" element={<Rejectedbystore />} />

        {/* Stores */}

        <Route path="stores-list" element={<StoresList />} />
        <Route path="store-earnings" element={<StoreEarningPaments />}/>
        <Route path="store-approval" element={<StoreApproval />}/>

        {/* Area management */}
        <Route path="cities" element={<Cities />}/>
        <Route path="areas" element={<AreaSociety />}/>
        <Route path="bulk-upload-areas" element={<BulkUploadArea />}/>
        
        {/* users data */}
        <Route path="user-data" element={<UsersData />}/>
        <Route path="wallet-history" element={<WalletHistory />}/>

        {/*Taxes  */}
        <Route path="taxes" element={<Taxes />}/>

      </Route>

      {/* fallback route */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;