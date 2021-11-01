'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'config-sync' });
};

const getService = (name) => {
  return strapi.plugin('config-sync').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-config-sync]: ${msg}`;

const sortByKeys = (unordered) => {
  return Object.keys(unordered).sort().reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    },
    {}
  );
};

const dynamicSort = (property) => {
  let sortOrder = 1;

  if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }

  return (a, b) => {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

const sanitizeConfig = (config, relation, relationSortField) => {
  delete config._id;
  delete config.id;
  delete config.updatedAt;
  delete config.createdAt;

  if (relation) {
    const formattedRelations = [];

    config[relation].map((relationEntity) => {
      delete relationEntity._id;
      delete relationEntity.id;
      delete relationEntity.updatedAt;
      delete relationEntity.createdAt;
      relationEntity = sortByKeys(relationEntity);

      formattedRelations.push(relationEntity);
    });

    if (relationSortField) {
      formattedRelations.sort(dynamicSort(relationSortField));
    }

    config[relation] = formattedRelations;
  }

  return config;
};

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  sanitizeConfig,
  sortByKeys,
  dynamicSort,
};
