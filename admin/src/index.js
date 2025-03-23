import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app) {
    app.addMenuLink({
      to: `settings/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'CSV Export',
      },
      Component: async () => {
        const App = await import('./pages/App');
        return App;
      },
    });

    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}`,
          defaultMessage: 'csv Export',
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
          Component: async () => {
            const component = await import('./pages/Settings');
            return component;
          },
        },
      ]
    );
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app) {
    // Add CSV export button to collection type list views
    app.injectContentManagerComponent('listView', 'actions', {
      name: 'csv-export-button',
      Component: async () => {
        const component = await import('./components/ExportButton');
        return component;
      },
    });
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
