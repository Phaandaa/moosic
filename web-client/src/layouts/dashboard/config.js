import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import AcademicCapIcon from '@heroicons/react/24/solid/AcademicCapIcon';
import FolderOpenIcon from '@heroicons/react/24/solid/FolderOpenIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Students',
    path: '/students',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Teachers',
    path: '/teachers',
    icon: (
      <SvgIcon fontSize="small">
        <AcademicCapIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Shop',
    path: '/shop',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Repository',
    path: '/repository',
    icon: (
      <SvgIcon fontSize="small">
        <FolderOpenIcon />
      </SvgIcon>
    ),
  },
];
