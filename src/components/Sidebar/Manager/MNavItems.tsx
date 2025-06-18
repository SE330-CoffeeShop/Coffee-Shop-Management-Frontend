import { usePathname } from 'next/navigation';
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
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { GoTasklist } from 'react-icons/go';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Self-study Program',
      href: '/manager/self-study-program',
      icon: <LightBulbIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/self-study-program'),
      group: 'program'
    },
    {
      name: 'Live Program',
      href: '/manager/live-program',
      icon: <VideoCameraIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/live-program'),
      group: 'program'
    },
    {
      name: 'Schedule',
      href: '/manager/schedule',
      icon: <CalendarDaysIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/schedule'),
      group: 'program'
    },
    {
      name: 'Courses',
      href: '/manager/courses',
      icon: <BookOpenIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/courses'),
      group: 'resources'
    },
    {
      name: 'Question Bank',
      href: '/manager/question-bank',
      icon: <BuildingLibraryIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/question-bank'),
      group: 'resources'
    },
    {
      name: 'Exams',
      href: '/manager/exams',
      icon: <GoTasklist className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/exams'),
      group: 'resources'
    },
    {
      name: 'Revenue Report',
      href: '/manager/revenue-report',
      icon: <DocumentChartBarIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/revenue-report'),
      group: 'system'
    },
    {
      name: 'Tuition Fees',
      href: '/manager/tuition-fees',
      icon: <BanknotesIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/tuition-fees'),
      group: 'system'
    },
    {
      name: 'Accounts',
      href: '/manager/accounts',
      icon: <UsersIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/accounts'),
      group: 'system'
    },
    {
      name: 'Permissions',
      href: '/manager/permissions',
      icon: <ClipboardDocumentIcon className="size-6 text-secondary-400" />,
      active: isNavItemActive(pathname, '/manager/permissions'),
      group: 'system'
    }
  ];
};