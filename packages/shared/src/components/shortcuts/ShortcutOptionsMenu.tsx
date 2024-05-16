import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { ContextMenu as ContextMenuIds } from '../../hooks/constants';
import { MenuIcon } from '../MenuIcon';
import { EyeIcon, SettingsIcon } from '../icons';

const ContextMenu = dynamic(
  () => import(/* webpackChunkName: "contextMenu" */ '../fields/ContextMenu'),
  {
    ssr: false,
  },
);

export default function ShortcutOptionsMenu({
  isOpen,
  onHide,
  onManage,
}: {
  isOpen: boolean;
  onHide: () => void;
  onManage: () => void;
}): ReactElement {
  const options = [
    {
      icon: <MenuIcon Icon={EyeIcon} />,
      label: 'Hide',
      action: onHide,
    },
    {
      icon: <MenuIcon Icon={SettingsIcon} />,
      label: 'Manage',
      action: onManage,
    },
  ];

  return (
    <ContextMenu
      options={options}
      isOpen={isOpen}
      id={ContextMenuIds.ShortcutContext}
    />
  );
}
