const exportController = ({ strapi }) => ({
  welcomeHome(ctx) {
    ctx.body = strapi
      .plugin('csv-export')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  getSettings(ctx) {
    ctx.body = strapi.plugin('csv-export').service('csvExport').getSettings();
  },
  saveSettings(ctx) {
    ctx.body = strapi.plugin('csv-export').service('csvExport').saveSettings(body);
  },
  async exportToCSV(ctx) {
    const { contentType } = ctx.params;
    try {
      const stream = await strapi
        .plugin('csv-export')
        .service('csvExport')
        .generateCSV(contentType);

      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename=${contentType}-export.csv`);
      ctx.body = stream;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },
});

export default exportController;
