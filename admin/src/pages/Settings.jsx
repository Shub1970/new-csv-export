import React, { useState, useEffect } from 'react';
import {
  Box,
  HeaderLayout,
  ContentLayout,
  Button,
  Typography,
  Checkbox,
  Stack,
  Alert,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { useNotification, useFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';

const Settings = () => {
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toggleNotification = useNotification();
  const { get, put } = useFetchClient();

  // Fetch available content types and current settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch content types
        const { data: contentTypesData } = await get('/content-manager/content-types');
        const filteredTypes = contentTypesData.data.filter(
          (contentType) => !contentType.isComponent && !contentType.plugin
        );
        setContentTypes(filteredTypes);

        // Fetch current settings
        const { data: settings } = await get(`/${pluginId}/settings`);
        setSelectedTypes(settings.contentTypes || []);
      } catch (err) {
        setError('Failed to fetch settings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await put(`/${pluginId}/settings`, {
        data: { contentTypes: selectedTypes },
      });

      toggleNotification({
        type: 'success',
        message: 'Settings saved successfully',
      });
    } catch (err) {
      toggleNotification({
        type: 'error',
        message: 'Failed to save settings',
      });
    }
  };

  const handleToggleContentType = (uid) => {
    setSelectedTypes((prev) =>
      prev.includes(uid) ? prev.filter((type) => type !== uid) : [...prev, uid]
    );
  };

  if (isLoading) {
    return (
      <Box padding={8} background="neutral100">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <HeaderLayout
        title="CSV Export Settings"
        subtitle="Configure which collection types should have the export button"
        primaryAction={
          <Button onClick={handleSave} startIcon={<Check />} size="L" disabled={isLoading}>
            Save
          </Button>
        }
      />
      <ContentLayout>
        {error && (
          <Alert closeLabel="Close alert" title="Error" variant="danger">
            {error}
          </Alert>
        )}

        <Box padding={8} background="neutral0">
          <Stack spacing={4}>
            <Typography variant="beta">Enable CSV Export for:</Typography>

            {contentTypes.map((contentType) => (
              <Checkbox
                key={contentType.uid}
                value={selectedTypes.includes(contentType.uid)}
                onChange={() => handleToggleContentType(contentType.uid)}
              >
                {contentType.info.displayName}
              </Checkbox>
            ))}
          </Stack>
        </Box>
      </ContentLayout>
    </>
  );
};

export default Settings;
