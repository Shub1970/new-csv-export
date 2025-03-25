import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import ExportButton from './components/ExportButton';

export default {
  register(app) {
    // Register menu link in Settings
    app.addMenuLink({
      to: `settings/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'CSV Export',
      },
      async Component() {
        const { default: App } = await import('./pages/App');
        return App;
      },
    });

    // Create a settings section
    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}`,
          defaultMessage: 'CSV Export',
        },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}`,
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `/settings/${PLUGIN_ID}`,
          async Component() {
            const { default: Settings } = await import('./pages/Settings');
            return Settings;
          },
        },
      ]
    );

    // Register the plugin
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    // ✅ Use the new Hook-based system for list view actions (Strapi v5)
    app.createHook('content-manager.listView.actions');

    app.registerHook('content-manager.listView.actions', (actions) => [
      ...actions,
      {
        label: 'Export to CSV',
        onClick: () => {
          console.log('Exporting CSV...');
          // Your CSV export logic here
        },
        icon: 'Download',
      },
    ]);
  },

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
