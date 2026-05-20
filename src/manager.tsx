import React from 'react';
import { addons, types, useParameter } from '@storybook/manager-api';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { Panel } from './Panel';

function PanelTitle() {
  const param = useParameter<{ panelTitle?: string } | undefined>(PARAM_KEY, undefined);
  return <>{param?.panelTitle ?? 'Story Code'}</>;
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: () => <PanelTitle />,
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <Panel active={!!active} />,
  });
});
