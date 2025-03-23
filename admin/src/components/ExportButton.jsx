import React, { useEffect, useState } from 'react';
import { Button } from '@strapi/design-system';
import { Download } from '@strapi/icons';
import { useFetchClient } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';

const ExportButton = ({ contentType }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { get } = useFetchClient();

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const { data: settings } = await get(`/${pluginId}/settings`);
        setIsEnabled(settings.contentTypes.includes(contentType));
      } catch (err) {
        console.error('Failed to fetch CSV export settings:', err);
      }
    };

    checkSettings();
  }, [contentType]);

  if (!isEnabled) {
    return null;
  }

  const handleExport = async () => {
    try {
      window.location.href = `/api/${pluginId}/csv/${contentType}`;
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  return (
    <Button onClick={handleExport} startIcon={<Download />} variant="secondary">
      Export CSV
    </Button>
  );
};

export default ExportButton;
