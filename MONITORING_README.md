# Monitoring Setup

This project includes a complete monitoring stack with Prometheus, Grafana, Alertmanager, Loki, and Promtail for comprehensive observability.

## Services

- **Prometheus**: Metrics collection and storage (http://localhost:9090)
- **Grafana**: Visualization and dashboards (http://localhost:3001, admin/admin)
- **Alertmanager**: Alert management and notifications (http://localhost:9093)
- **Loki**: Log aggregation
- **Promtail**: Log shipping from containers

## Starting the Monitoring Stack

```bash
docker-compose up -d
```

## Accessing Dashboards

1. **Grafana**: Open http://localhost:3001

   - Username: admin
   - Password: admin
   - System Metrics dashboard: Pre-provisioned
   - Application Metrics dashboard: Pre-provisioned

2. **Prometheus**: Open http://localhost:9090

   - Query metrics and view targets

3. **Alertmanager**: Open http://localhost:9093
   - View and manage alerts

## Alerting Configuration

Alerts are configured to send notifications via email and Slack. Set the following environment variables:

```bash
# Email configuration
ALERT_EMAIL_FROM=your-email@gmail.com
ALERT_EMAIL_PASSWORD=your-app-password
ALERT_EMAIL_TO=alert-recipient@example.com

# Slack configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## Customizing Dashboards

### Adding New Panels

1. In Grafana, go to a dashboard
2. Click "Add panel"
3. Select data source (Prometheus)
4. Write PromQL queries
5. Configure visualization options

### Creating New Dashboards

1. Click "New" > "Dashboard" in Grafana
2. Add panels as needed
3. Save the dashboard

### Exporting/Importing Dashboards

- Export: Dashboard menu > Share > Export
- Import: Dashboard menu > Import

## Alert Rules

Alert rules are defined in `monitoring/alert_rules.yml`:

- High CPU Usage (>80%)
- High Memory Usage (>90%)
- Low Disk Space (<10%)
- Application Down
- High Response Time (>1s 95th percentile)
- High Error Rate (>5%)

## Metrics Exposed

### System Metrics (Node Exporter)

- CPU, memory, disk, network usage
- System load and uptime

### Application Metrics

- HTTP request rate and duration
- Error rates
- Custom business metrics (if implemented)

## Logs

Logs are collected via Promtail and stored in Loki. View logs in Grafana under "Explore" with Loki data source.

## Troubleshooting

- If services don't start, check Docker logs: `docker-compose logs <service>`
- Ensure ports 9090, 3001, 9093, 3100 are available
- For email alerts, use app passwords if 2FA is enabled

## Debugging the Monitoring Stack

### Step-by-Step Debugging Process

1. **Verify Service Status**

   - Check if all monitoring services are running:
     ```bash
     docker-compose ps
     ```
   - Expected: All services (prometheus, grafana, alertmanager, loki, promtail) should show "Up"

2. **Check Service Logs**

   - View logs for each service to identify errors:
     ```bash
     docker-compose logs prometheus
     docker-compose logs grafana
     docker-compose logs alertmanager
     docker-compose logs loki
     docker-compose logs promtail
     ```
   - Look for startup errors, configuration issues, or connection failures.

3. **Validate Configurations**

   - Ensure configuration files are syntactically correct:
     - Prometheus: Check `monitoring/prometheus.yml`
     - Grafana: Verify provisioning files in `monitoring/grafana/provisioning/`
     - Alertmanager: Check `monitoring/alertmanager.yml`
     - Loki: Check `monitoring/promtail.yml`
   - Use validation commands if available (e.g., `promtool check config monitoring/prometheus.yml`)

4. **Check Prometheus Targets**

   - Open Prometheus UI at http://localhost:9090
   - Go to Status > Targets
   - Verify all targets are "UP" and not showing errors

5. **Verify Grafana Data Sources**

   - Open Grafana at http://localhost:3001
   - Go to Configuration > Data Sources
   - Ensure Prometheus and Loki data sources are configured and "Connected"

6. **Test Metrics Collection**

   - In Prometheus, query a basic metric: `up`
   - Check if application metrics are appearing (e.g., from your app)

7. **Check Log Aggregation**

   - In Grafana, go to Explore > Select Loki data source
   - Query logs: `{job="promtail"}`
   - Verify logs are being ingested from containers

8. **Network and Port Checks**

   - Ensure required ports are open and not in use:
     ```bash
     netstat -tulpn | grep -E ':(9090|3001|9093|3100)'
     ```
   - Test connectivity between services if needed

9. **Restart Services**

   - If issues persist, restart the stack:
     ```bash
     docker-compose down
     docker-compose up -d
     ```

10. **Escalation Steps**
    - Check system resources (CPU, memory, disk) on the host
    - Update Docker and docker-compose to latest versions
    - Review alert rules in `monitoring/alert_rules.yml` for syntax errors
    - Check firewall settings blocking inter-service communication
    - If using custom networks, verify network configuration in docker-compose.yml
    - Consult official documentation for specific error messages
    - Open issues on GitHub repositories if bugs are suspected
