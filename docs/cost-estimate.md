# Azure Cloud Cost & Budget Estimate (Plan §5.3)

ResolvePay is designed to run within an active Azure subscription with a strict monthly allocation target of **<= USD 30/month**.

## Monthly Resource Allocation

### Option A: Cloud Stack with Supabase PostgreSQL (Active Default)
| Resource | Service & Tier | Monthly Cost (Target) |
|---|---|---:|
| **Managed PostgreSQL** | **Supabase Free Tier** (PostgreSQL 17, 500 MB storage, Supavisor connection pooler) | **$0.00** |
| **Container Apps (Web & API)** | Azure Container Apps Consumption tier: 0 min replicas (scale-to-zero during inactivity). Uses monthly free tier | $3.50 |
| **Container Apps Scheduled Job** | Worker job running 120s batch every 5 mins | $1.50 |
| **Azure Blob Storage & Logging** | Evidence blob container (Hot LRS < 5 GB) + Log Analytics (30-day retention) | $2.00 |
| **Contingency / Network Egress** | Minor bandwidth and DNS | $3.50 |
| **Total Estimated Monthly Spend** | | **$10.50** |

### Option B: All-Azure Managed Stack (Alternative)
| Resource | Service & Tier | Monthly Cost (Target) |
|---|---|---:|
| **Managed PostgreSQL** | Azure Database for PostgreSQL Flexible Server (`Standard_B1ms` Burstable, 1 vCore, 2 GiB RAM, 32 GB Storage, 7-day backup, no HA) | $19.50 |
| **Container Apps (Web & API)** | Consumption tier: 0 min replicas (scale-to-zero) | $3.50 |
| **Container Apps Scheduled Job** | Worker job running 120s batch every 5 mins | $1.50 |
| **Azure Blob Storage & Logging** | Evidence container + Log Analytics | $2.00 |
| **Contingency / Network Egress** | Minor bandwidth and DNS | $3.50 |
| **Total Estimated Monthly Spend** | | **$30.00** |

## Cost Control Measures
1. **Scale-to-Zero**: Web and API container apps scale to 0 replicas when there is no active traffic.
2. **Log Retention**: Log Analytics workspace retention is capped at 30 days.
3. **Budget Alerts**: Azure Budget alerts configured at $15, $24, and $28 thresholds.
4. **No Paid AI Fallback**: Gemini uses free tier with local rate limits; `AI_PAID_FALLBACK=false`.

