const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use(
    "/api/orders-proxy",
    createProxyMiddleware({
      target: "https://backend-daycatch.onrender.com",
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        "^/api/orders-proxy": "/api/orders",
      },
    })
  );
};
