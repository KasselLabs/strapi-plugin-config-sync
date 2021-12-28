'use strict';

const fs = require('fs');

const ConfigType = require('./config/type');
const defaultTypes = require('./config/types');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  // Import on bootstrap.
  if (strapi.config.get('plugin.config-sync.importOnBootstrap')) {
    if (fs.existsSync(strapi.config.get('plugin.config-sync.syncDir'))) {
      await strapi.plugin('config-sync').service('main').importAllConfig();
    }
  }

  // Register config types.
  const registerTypes = () => {
    const types = {};

    defaultTypes(strapi).map((type) => {
      if (!strapi.config.get('plugin.config-sync.excludedTypes').includes(type.configName)) {
        types[type.configName] = new ConfigType(type);
      }
    });

    strapi.config.get('plugin.config-sync.customTypes').map((type) => {
      if (!strapi.config.get('plugin.config-sync.excludedTypes').includes(type.configName)) {
        types[type.configName] = new ConfigType(type);
      }
    });

    return types;
  };
  strapi.plugin('config-sync').types = registerTypes();

  // Register permission actions.
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the plugin settings',
      uid: 'settings.read',
      pluginName: 'config-sync',
    },
    {
      section: 'plugins',
      displayName: 'Menu link to plugin settings',
      uid: 'menu-link',
      pluginName: 'config-sync',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
