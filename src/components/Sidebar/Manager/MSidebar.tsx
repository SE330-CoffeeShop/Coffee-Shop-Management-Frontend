"use client";

import { Fragment, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/components/className";
import { ENavItems } from "@/components/Sidebar/Employee/ENavItems";
import SidebarItem from "@/components/Sidebar/SidebarItem";

const ESidebar = () => {
  const navItems = ENavItems();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="font-montserrat">
      <div
        className={classNames(
          isSidebarExpanded ? "w-[228px]" : "w-[68px]",
          "hidden h-full transform border-primary-100 bg-primary-700 drop-shadow transition-all duration-300 ease-in-out sm:flex"
        )}
      >
        <aside className="flex h-full w-full columns-1 flex-col overflow-x-hidden break-words p-3">
          {/* Thức uống */}
          {isSidebarExpanded && (
            <span className="text-lg-semibold text-primary-0">Thức uống</span>
          )}
          <div className="relative mt-3 pb-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.group === "drinks") {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SidebarItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="mb-2 h-[1px] w-full bg-secondary-300"></div>
          {/* Đơn hàng */}
          {isSidebarExpanded && (
            <span className="text-lg-semibold text-primary-0">Đơn hàng</span>
          )}
          <div className="relative mt-3 pb-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.group === "orders") {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SidebarItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="mb-2 h-[1px] w-full bg-secondary-300"></div>
          {/* Discount */}
          {isSidebarExpanded && (
            <span className="text-lg-semibold text-primary-0">Khuyến mãi</span>
          )}
          <div className="relative mt-3 pb-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.group === "discounts") {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SidebarItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="mb-2 h-[1px] w-full bg-secondary-300"></div>
          {/* Shifts */}
          {isSidebarExpanded && (
            <span className="text-lg-semibold text-primary-0">Lịch hàm việc</span>
          )}
          <div className="relative mt-3 pb-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.group === "shifts") {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SidebarItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="mb-2 h-[1px] w-full bg-secondary-300"></div>
          {/* Notifications */}
          {isSidebarExpanded && (
            <span className="text-lg-semibold text-primary-0">Thông báo</span>
          )}
          <div className="relative mt-3 pb-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.group === "notifications") {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SidebarItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
        </aside>
        <div className="relative z-50 mt-[calc(calc(90vh)-40px)]">
          <button
            type="button"
            className="border-secondary-300 absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center rounded-full border bg-bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <ChevronLeftIcon className="size-4 text-secondary-400" />
            ) : (
              <ChevronRightIcon className="size-4 text-secondary-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ESidebar;
