export default [
  {
    method: 'GET',
    path: '/settings',
    handler: 'exportController.getSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'exportController.saveSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/csv/:contentType',
    handler: 'exportController.exportToCSV',
    config: {
      policies: [],
    },
  },
];
