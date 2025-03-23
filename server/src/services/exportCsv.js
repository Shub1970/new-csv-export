const exportCsv = ({ strapi }) => ({
  async getSettings() {
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'csv-export',
    });
    const settings = (await pluginStore.get({ key: 'settings' })) || { contentTypes: [] };
    return settings;
  },

  async saveSettings(settings) {
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'csv-export',
    });
    await pluginStore.set({ key: 'settings', value: settings });
    return settings;
  },

  async generateCSV(contentType) {
    const entries = await strapi.entityService.findMany(contentType, {
      populate: '*',
    });

    const csvStream = stringify({ headers: true });

    // Process entries and pipe them to CSV
    entries.forEach((entry) => {
      const flattenedEntry = this.flattenObject(entry);
      csvStream.write(flattenedEntry);
    });

    csvStream.end();
    return csvStream;
  },

  flattenObject(obj, prefix = '') {
    const flattened = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(flattened, this.flattenObject(obj[key], `${prefix}${key}_`));
      } else {
        flattened[`${prefix}${key}`] = obj[key];
      }
    }

    return flattened;
  },
});

export default exportCsv;
