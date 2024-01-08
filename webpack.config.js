// webpack.config.js
const path = require("path");

module.exports = [
  {
    stats: {
      errorDetails: true,
    },
    mode: "production",
    entry: "./app/scripts/popup.js",
    output: {
      filename: "bundlePopup.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
  {
    stats: {
      errorDetails: true,
    },
    mode: "production",
    entry: "./app/scripts/sendInviteScript",
    output: {
      filename: "bundleNotif.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
  {
    stats: {
      errorDetails: true,
    },
    mode: "production",
    entry: "./app/scripts/loader.js",
    output: {
      filename: "bundleLoader.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
  {
    stats: {
      errorDetails: true,
    },
    mode: "production",
    entry: "./app/scripts/HeistSupervisor.js",
    output: {
      filename: "bundleHeistSupervisor.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
  {
    stats: {
      errorDetails: true,
    },
    mode: "production",
    entry: "./app/scripts/background.js",
    output: {
      filename: "bundleBackground.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
  {
    stats: {
      errorDetails: true,
    },
    mode: "production",
    entry: "./app/scripts/trackAuction.js",
    output: {
      filename: "bundleTrackAuction.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
];
