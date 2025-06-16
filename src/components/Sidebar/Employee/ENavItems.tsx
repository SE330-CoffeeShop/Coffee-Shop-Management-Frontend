import { usePathname } from "next/navigation";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import {
  RiDrinksLine,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiMoneyDollarBoxLine,
  RiUser3Line,
  RiOrderPlayFill,
  RiDiscountPercentLine,
} from "react-icons/ri";
import { LuMoveDownRight } from "react-icons/lu";
import { MdOutlineWarehouse } from "react-icons/md";

export const ENavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Nhân viên",
      href: "/employee/list-employees",
      icon: isNavItemActive(pathname, "/employee/list-employees") ? (
        <RiUser3Line className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiUser3Line className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/list-employees"),
      group: "employees",
    },
    {
      name: "Lịch làm việc",
      href: "/employee/shifts",
      icon: isNavItemActive(pathname, "/employee/shifts") ? (
        <RiCalendarLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiCalendarLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/shifts"),
      group: "employees",
    },
    {
      name: "Chấm công",
      href: "/employee/checkin",
      icon: isNavItemActive(pathname, "/employee/checkin") ? (
        <RiCalendarCheckLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiCalendarCheckLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/checkin"),
      group: "employees",
    },
    {
      name: "Lương",
      href: "/employee/salary",
      icon: isNavItemActive(pathname, "/employee/salary") ? (
        <RiMoneyDollarBoxLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiMoneyDollarBoxLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/salary"),
      group: "employees",
    },
    {
      name: "Khách hàng",
      href: "/employee/customers",
      icon: isNavItemActive(pathname, "/employee/customers") ? (
        <RiUser3Line className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiUser3Line className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/customers"),
      group: "customers",
    },
    {
      name: "Danh sách thức uống",
      href: "/employee/drinks",
      icon: isNavItemActive(pathname, "/employee/drinks") ? (
        <RiDrinksLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiDrinksLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/drinks"),
      group: "drinks",
    },
    {
      name: "Đơn hàng",
      href: "/employee/orders",
      icon: isNavItemActive(pathname, "/employee/orders") ? (
        <RiOrderPlayFill className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiOrderPlayFill className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/orders"),
      group: "orders",
    },
    {
      name: "Tiếp nhận đơn hàng",
      href: "/employee/accept-orders",
      icon: isNavItemActive(pathname, "/employee/accept-orders") ? (
        <LuMoveDownRight className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <LuMoveDownRight className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/accept-orders"),
      group: "orders",
    },
    {
      name: "Khuyến mãi",
      href: "/employee/discounts",
      icon: isNavItemActive(pathname, "/employee/discounts") ? (
        <RiDiscountPercentLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiDiscountPercentLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/discounts"),
      group: "discounts",
    },
    {
      name: "Nhà kho",
      href: "/employee/warehouses",
      icon: isNavItemActive(pathname, "/employee/warehouses") ? (
        <MdOutlineWarehouse className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <MdOutlineWarehouse className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/warehouses"),
      group: "warehouses",
    },
    {
      name: "Thông báo",
      href: "/employee/notifications",
      icon: isNavItemActive(pathname, "/employee/notifications") ? (
        <BellAlertIcon className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <BellAlertIcon className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/employee/notifications"),
      group: "notifications",
    },
  ];
};
