'use client';

import Link from 'next/link';
import React from 'react';
import { classNames } from '@/components/className';
import { Tooltip } from '@heroui/tooltip';

const SidebarItem = ({
  label,
  icon,
  path,
  active,
  isSidebarExpanded,
}: {
  label: string;
  icon: React.ReactNode;
  path: string;
  active: boolean;
  isSidebarExpanded: boolean;
}) => {
  return (
    <>
      {isSidebarExpanded ? (
        <Link
          href={path}
          className={classNames(
            'relative flex h-full items-center whitespace-nowrap rounded-[100px] px-3 py-3 text-sm-regular',
            active
              ? 'bg-primary-0 text-primary-700 font-semibold shadow-sm'
              : 'text-primary-0 hover:bg-primary-100 hover:text-primary-400'
          )}
        >
          <div className="relative flex flex-row items-center space-x-2 rounded-md duration-100">
            {icon}
            <span className="text-sm-semibold">{label}</span>
          </div>
        </Link>
      ) : (
        <Tooltip
          content={label}
          placement="right"
          color="foreground"
          delay={1000}
        >
          <Link
            href={path}
            className={classNames(
              'relative flex h-full items-center whitespace-nowrap rounded-md text-sm-regular',
              active
                ? 'bg-primary-600 text-bg-white font-semibold shadow-sm'
                : 'text-primary-0 hover:bg-primary-200 hover:text-primary-600'
            )}
          >
            <div className="relative flex flex-row items-center space-x-2 rounded-md p-2 duration-100">
              {icon}
            </div>
          </Link>
        </Tooltip>
      )}
    </>
  );
};

export default SidebarItem;