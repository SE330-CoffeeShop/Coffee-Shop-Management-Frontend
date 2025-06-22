import { usePathname } from "next/navigation";
import {
  LightBulbIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  BellIcon,
  ClipboardDocumentIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { GoTasklist } from "react-icons/go";
import { LuMoveDownRight } from "react-icons/lu";
import { MdOutlineWarehouse } from "react-icons/md";
import {
  RiUser3Line,
  RiCalendarLine,
  RiCalendarCheckLine,
  RiMoneyDollarBoxLine,
  RiDrinksLine,
  RiOrderPlayFill,
  RiDiscountPercentLine,
} from "react-icons/ri";

export const MNavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Nhân viên",
      href: "/manager/employees",
      icon: isNavItemActive(pathname, "/manager/employees") ? (
        <RiUser3Line className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiUser3Line className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/employees"),
      group: "employees",
    },
    {
      name: "Lịch làm việc",
      href: "/manager/shifts",
      icon: isNavItemActive(pathname, "/manager/shifts") ? (
        <RiCalendarLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiCalendarLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/shifts"),
      group: "employees",
    },
    {
      name: "Chấm công",
      href: "/manager/checkin",
      icon: isNavItemActive(pathname, "/manager/checkin") ? (
        <RiCalendarCheckLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiCalendarCheckLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/checkin"),
      group: "employees",
    },
    {
      name: "Lương",
      href: "/manager/salaries",
      icon: isNavItemActive(pathname, "/manager/salaries") ? (
        <RiMoneyDollarBoxLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiMoneyDollarBoxLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/salaries"),
      group: "employees",
    },
    {
      name: "Khách hàng",
      href: "/manager/customers",
      icon: isNavItemActive(pathname, "/manager/customers") ? (
        <RiUser3Line className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiUser3Line className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/customers"),
      group: "customers",
    },
    {
      name: "Danh sách thức uống",
      href: "/manager/drinks",
      icon: isNavItemActive(pathname, "/manager/drinks") ? (
        <RiDrinksLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiDrinksLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/drinks"),
      group: "drinks",
    },
    {
      name: "Đơn hàng",
      href: "/manager/orders",
      icon: isNavItemActive(pathname, "/manager/orders") ? (
        <RiOrderPlayFill className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiOrderPlayFill className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/orders"),
      group: "orders",
    },
    {
      name: "Khuyến mãi",
      href: "/manager/discounts",
      icon: isNavItemActive(pathname, "/manager/discounts") ? (
        <RiDiscountPercentLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiDiscountPercentLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/discounts"),
      group: "discounts",
    },
    {
      name: "Nhà kho",
      href: "/manager/warehouses",
      icon: isNavItemActive(pathname, "/manager/warehouses") ? (
        <MdOutlineWarehouse className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <MdOutlineWarehouse className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/warehouses"),
      group: "warehouses",
    },
    {
      name: "Nhà nhà cung cấp",
      href: "/manager/suppliers",
      icon: isNavItemActive(pathname, "/manager/suppliers") ? (
        <MdOutlineWarehouse className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <MdOutlineWarehouse className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/suppliers"),
      group: "warehouses",
    },
    {
      name: "Thông báo",
      href: "/manager/notifications",
      icon: isNavItemActive(pathname, "/manager/notifications") ? (
        <BellAlertIcon className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <BellAlertIcon className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/manager/notifications"),
      group: "notifications",
    },
    {
      name: "Thống kê",
      href: "/manager/reports",
      icon: isNavItemActive(pathname, "/manager/reports") ? (
        <BellAlertIcon className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <BellAlertIcon className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname,"/manager/reports"),
      group: "reports",
    },
  ];
};
