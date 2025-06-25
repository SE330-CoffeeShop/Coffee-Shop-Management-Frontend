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

export const ANavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Nhân viên",
      href: "/admin/employees",
      icon: isNavItemActive(pathname, "/admin/employees") ? (
        <RiUser3Line className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiUser3Line className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/employees"),
      group: "employees",
    },
    {
      name: "Lịch làm việc",
      href: "/admin/shifts",
      icon: isNavItemActive(pathname, "/admin/shifts") ? (
        <RiCalendarLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiCalendarLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/shifts"),
      group: "employees",
    },
    {
      name: "Chấm công",
      href: "/admin/checkin",
      icon: isNavItemActive(pathname, "/admin/checkin") ? (
        <RiCalendarCheckLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiCalendarCheckLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/checkin"),
      group: "employees",
    },
    {
      name: "Lương",
      href: "/admin/salary",
      icon: isNavItemActive(pathname, "/admin/salary") ? (
        <RiMoneyDollarBoxLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiMoneyDollarBoxLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/salary"),
      group: "employees",
    },
    {
      name: "Danh sách thức uống",
      href: "/admin/drinks",
      icon: isNavItemActive(pathname, "/admin/drinks") ? (
        <RiDrinksLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiDrinksLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/drinks"),
      group: "drinks",
    },
    {
      name: "Đơn hàng",
      href: "/admin/orders",
      icon: isNavItemActive(pathname, "/admin/orders") ? (
        <RiOrderPlayFill className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiOrderPlayFill className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/orders"),
      group: "orders",
    },
    {
      name: "Khuyến mãi",
      href: "/admin/discounts",
      icon: isNavItemActive(pathname, "/admin/discounts") ? (
        <RiDiscountPercentLine className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <RiDiscountPercentLine className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/discounts"),
      group: "discounts",
    },
    // {
    //   name: "Nhà kho",
    //   href: "/employee/warehouses",
    //   icon: isNavItemActive(pathname, "/employee/warehouses") ? (
    //     <MdOutlineWarehouse className="size-6 text-primary-700 text-sm-semibold" />
    //   ) : (
    //     <MdOutlineWarehouse className="size-6 text-primary-0 text-sm-semibold" />
    //   ),
    //   active: isNavItemActive(pathname, "/employee/warehouses"),
    //   group: "warehouses",
    // },
    {
      name: "Thông báo",
      href: "/admin/notifications",
      icon: isNavItemActive(pathname, "/admin/notifications") ? (
        <BellAlertIcon className="size-6 text-primary-700 text-sm-semibold" />
      ) : (
        <BellAlertIcon className="size-6 text-primary-0 text-sm-semibold" />
      ),
      active: isNavItemActive(pathname, "/admin/notifications"),
      group: "notifications",
    },
  ];
};
