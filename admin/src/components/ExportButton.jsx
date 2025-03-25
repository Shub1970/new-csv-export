import React, { useEffect, useState } from 'react';
import { Button } from '@strapi/design-system';
import { Download } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';

const ExportButton = ({ contentType }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { get } = useFetchClient();

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const { data: settings } = await get(`/${PLUGIN_ID}/settings`);
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
      window.location.href = `/api/${PLUGIN_ID}/csv/${contentType}`;
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
