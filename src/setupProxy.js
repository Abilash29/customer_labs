const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/webhook",
    createProxyMiddleware({
      target: "https://webhook.site",
      changeOrigin: true,
      pathRewrite: {
        "^/webhook": "",
      },
    })
  );
};
