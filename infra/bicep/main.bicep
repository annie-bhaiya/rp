targetScope = 'resourceGroup'

@description('Environment name prefix')
param envName string = 'resolvepay-demo'

@description('Location for all resources (prefer low-cost eligible region)')
param location string = resourceGroup().location

@description('PostgreSQL administrator login')
param dbAdminLogin string = 'resolvepayadmin'

@secure()
@description('PostgreSQL administrator password')
param dbAdminPassword string

@description('Demo monthly budget limit in USD')
param budgetLimit int = 30

// 1. Container Apps Environment
resource containerAppEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${envName}-cae'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Minimal Log Analytics Workspace (30-day retention to strictly control budget)
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${envName}-law'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// 2. Azure Database for PostgreSQL Flexible Server (Burstable B1ms: lowest cost)
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: '${envName}-pg'
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: dbAdminLogin
    administratorLoginPassword: dbAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// 3. Azure Storage Account for Customer Photo Evidence
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '${replace(envName, '-', '')}sa'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
  }
}

// 4. API Container App (minReplicas: 0 to scale to zero and save budget)
resource apiApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${envName}-api'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3001
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: 'api'
          image: 'ghcr.io/resolvepay/api:latest'
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

// 5. Scheduled Background Worker Container Apps Job (Runs every 5 mins UTC)
resource workerJob 'Microsoft.App/jobs@2024-03-01' = {
  name: '${envName}-worker-job'
  location: location
  properties: {
    environmentId: containerAppEnv.id
    configuration: {
      triggerType: 'Schedule'
      scheduleTriggerConfig: {
        cronExpression: '*/5 * * * *'
      }
      replicaTimeout: 120
      replicaRetryLimit: 1
    }
    template: {
      containers: [
        {
          name: 'worker'
          image: 'ghcr.io/resolvepay/worker:latest'
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
    }
  }
}

output apiFqdn string = apiApp.properties.configuration.ingress.fqdn
output postgresFqdn string = postgresServer.properties.fullyQualifiedDomainName

