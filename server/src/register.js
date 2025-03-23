const register = ({ strapi }) => {
  // register phase
  strapi.admin.services.permission.actionProvider.register({
    section: 'plugins',
    displayName: 'Access CSV Export Settings',
    uid: 'settings.read',
    pluginName: 'csv-export',
  });
};

export default register;
