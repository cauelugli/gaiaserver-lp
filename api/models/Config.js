const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  customer: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  users: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  departments: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  requests: {
    requestsNeedApproval: {
      type: Boolean,
      default: true,
    },
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
    canCreate: {
      type: Array,
    },
  },

  quotes: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  services: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  stock: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  finance: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  files: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
