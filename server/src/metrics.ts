import promClient from "prom-client";

// Create a Registry which registers the metrics
const register = new promClient.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "ecommerce-backend",
});

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Create custom metrics
export const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export const ordersProcessed = new promClient.Counter({
  name: "orders_processed_total",
  help: "Total number of orders processed",
});

export const usersRegistered = new promClient.Counter({
  name: "users_registered_total",
  help: "Total number of users registered",
});

// Register the metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(ordersProcessed);
register.registerMetric(usersRegistered);

export { register };
