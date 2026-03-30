import {
  AssessmentRounded as AssessmentRoundedIcon,
  CameraAltRounded as CameraAltRoundedIcon,
  CategoryRounded as CategoryRoundedIcon,
  DashboardRounded as DashboardRoundedIcon,
  DeliveryDiningRounded as DeliveryDiningRoundedIcon,
  ImageRounded as ImageRoundedIcon,
  Inventory2Rounded as Inventory2RoundedIcon,
  LocalOfferRounded as LocalOfferRoundedIcon,
  LocalShippingRounded as LocalShippingRoundedIcon,
  NotificationsRounded as NotificationsRoundedIcon,
  PaymentsRounded as PaymentsRoundedIcon,
  PhoneCallbackRounded as PhoneCallbackRoundedIcon,
  SettingsRounded as SettingsRoundedIcon,
  ShoppingCartRounded as ShoppingCartRoundedIcon,
} from "@mui/icons-material";
import { SHELL_DRAWER_WIDTH, SHELL_TOPBAR_HEIGHT } from "../../utils/adminShell";

export const SIDEBAR_WIDTH = SHELL_DRAWER_WIDTH;
export const TOPBAR_HEIGHT = SHELL_TOPBAR_HEIGHT;

export const STORE_MENU_GROUPS = [
  { type: "item", label: "Dashboard", icon: DashboardRoundedIcon, route: "dashboard", active: true },
  { type: "item", label: "Delivery Charges", icon: LocalShippingRoundedIcon, route: "delivery-charges" },
  {
    type: "group",
    key: "reports",
    label: "Reports",
    icon: AssessmentRoundedIcon,
    children: [
      { label: "Item Requirement", route: "reports/item-requirement" },
      { label: "Item Sale Report (Last 30 Days)", route: "reports/sales-report" },
    ],
  },
  {
    type: "group",
    key: "notifications",
    label: "Send Notifications",
    icon: NotificationsRoundedIcon,
    children: [
      { label: "Send Notification to Users", route: "notifications/users" },
      { label: "Send Notification to Driver", route: "notifications/driver" },
    ],
  },
  { type: "item", label: "Coupon", icon: LocalOfferRoundedIcon, route: "coupons" },
  { type: "item", label: "Send Payout Request", icon: PaymentsRoundedIcon, route: "payout-requests" },
  {
    type: "group",
    key: "banners",
    label: "Banners",
    icon: ImageRoundedIcon,
    children: [
      { label: "Category Banner", route: "banners/category" },
      { label: "Product Banner", route: "banners/product" },
    ],
  },
  { type: "item", label: "Products", icon: Inventory2RoundedIcon, route: "products" },
  {
    type: "group",
    key: "catalog",
    label: "Admin Category/Product",
    icon: CategoryRoundedIcon,
    children: [
      { label: "Add Products", route: "catalog/products" },
      { label: "Update Price/Mrp", route: "catalog/update-pricing" },
      { label: "Update Stock", route: "catalog/update-stock" },
      { label: "Update Order Quantity", route: "catalog/update-order-quantity" },
      { label: "Deal Products", route: "catalog/deals" },
      { label: "Add Spotlight", route: "catalog/spotlight" },
      { label: "Bulk Update Price/Stock/Order Quantity", route: "catalog/bulk-update" },
    ],
  },
  {
    type: "group",
    key: "orders",
    label: "Orders Management",
    icon: ShoppingCartRoundedIcon,
    children: [
      { label: "All orders", route: "orders/all" },
      { label: "Pending orders", route: "orders/pending" },
      { label: "Cancelled orders", route: "orders/cancelled" },
      { label: "Ongoing orders", route: "orders/confirmed" },
      { label: "Out For Delivery orders", route: "orders/out-for-delivery" },
      { label: "Payment Failed Orders", route: "orders/payment-failed" },
      { label: "Completed orders", route: "orders/completed" },
      { label: "Missed Orders", route: "orders/missed" },
      { label: "Day Wise Orders", route: "orders/day-wise" },
      { label: "Today Orders", route: "orders/today" },
      { label: "Next-Day Orders", route: "orders/next-day" },
    ],
  },
  { type: "item", label: "Order By Photo", icon: CameraAltRoundedIcon, route: "order-by-photo" },
  {
    type: "group",
    key: "delivery",
    label: "Delivery Boy",
    icon: DeliveryDiningRoundedIcon,
    children: [
      { label: "Delivery Boy", route: "delivery/boys" },
      { label: "Delivery Boy Incentive", route: "delivery/incentives" },
    ],
  },
  {
    type: "group",
    key: "callbacks",
    label: "Callback Requests",
    icon: PhoneCallbackRoundedIcon,
    children: [
      { label: "Users Callback Requests", route: "callback/users" },
      { label: "Delivery Boy Callback Requests", route: "callback/drivers" },
    ],
  },
];

export const STORE_SETTINGS_ITEMS = [
  { label: "Profile", icon: AssessmentRoundedIcon, route: "profile" },
  { label: "Settings", icon: SettingsRoundedIcon, route: "settings" },
];
