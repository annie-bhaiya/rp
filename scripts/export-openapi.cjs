/**
 * Export OpenAPI specification (JSON & YAML) to the docs/ and apimatic/ directories,
 * fully compliant with strict OpenAPI 3.0 validators (including APIMatic).
 */
process.env.DATABASE_URL = 'memory://';
process.env.APP_ENV = 'demo';

const fs = require('node:fs');
const path = require('node:path');

require('../apps/api/node_modules/reflect-metadata');
const { NestFactory } = require('../apps/api/node_modules/@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('../apps/api/node_modules/@nestjs/swagger');
const { AppModule } = require('../apps/api/dist/app.module.js');

const OPERATION_META = {
  'get:/api/v1/auth/config': {
    summary: 'Get Authentication Configuration',
    description: 'Retrieves current authentication capability flags, including whether 1-click demo persona switching is enabled.',
  },
  'post:/api/v1/auth/customer/access/request': {
    summary: 'Request Customer Access Link',
    description: 'Generates and delivers a single-use access link for a customer based on normalized order reference and customer email.',
  },
  'post:/api/v1/auth/customer/access/redeem': {
    summary: 'Redeem Customer Access Link',
    description: 'Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly cookie.',
  },
  'post:/api/v1/auth/merchant/access/request': {
    summary: 'Request Merchant Access Link',
    description: 'Sends a magic sign-in link to a registered merchant user email for store workspace access.',
  },
  'post:/api/v1/auth/merchant/access/redeem': {
    summary: 'Redeem Merchant Access Link',
    description: 'Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant session.',
  },
  'post:/api/v1/auth/login-dev': {
    summary: 'Switch Development Persona',
    description: 'Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.',
  },
  'get:/api/v1/auth/session': {
    summary: 'Get Current Session',
    description: 'Validates and returns the active session actor, role, tenant, and expiration from the session cookie.',
  },
  'post:/api/v1/auth/logout': {
    summary: 'Sign Out',
    description: 'Revokes the active session token server-side and clears the resolvepay_session cookie.',
  },
  'get:/api/v1/catalog': {
    summary: 'Get Product Catalog',
    description: 'Retrieves active products, product variants, pricing, and available inventory for a merchant store.',
  },
  'post:/api/v1/checkout/orders': {
    summary: 'Create Checkout Order',
    description: 'Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.',
  },
  'post:/api/v1/checkout/orders/{id}/capture': {
    summary: 'Capture Checkout Order',
    description: 'Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.',
  },
  'get:/api/v1/orders/{id}': {
    summary: 'Get Order Details',
    description: 'Retrieves detailed order information including line items, capture IDs, and financial totals for an authorized order.',
  },
  'post:/api/v1/cases': {
    summary: 'Create Dispute Case',
    description: 'Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.',
  },
  'get:/api/v1/cases': {
    summary: 'List Dispute Cases',
    description: "Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.",
  },
  'get:/api/v1/cases/{id}': {
    summary: 'Get Case Details',
    description: 'Retrieves complete dispute case details, state machine status, and order metadata.',
  },
  'post:/api/v1/cases/{id}/messages': {
    summary: 'Send Case Message',
    description: 'Appends a verified customer or merchant message to the dispute case timeline.',
  },
  'get:/api/v1/cases/{id}/timeline': {
    summary: 'Get Case Timeline',
    description: 'Returns chronological audit events, messages, policy evaluations, and payment updates for a case.',
  },
  'post:/api/v1/cases/{id}/evidence/upload-intent': {
    summary: 'Create Evidence Upload Intent',
    description: 'Initializes an evidence upload slot and returns target upload metadata and hash requirements.',
  },
  'post:/api/v1/cases/{id}/evidence/{evidenceId}/upload': {
    summary: 'Upload Evidence File',
    description: 'Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.',
  },
  'post:/api/v1/cases/{id}/evidence/{evidenceId}/complete': {
    summary: 'Complete Evidence Upload',
    description: 'Marks evidence upload as completed and triggers policy validation checks.',
  },
  'get:/api/v1/cases/{id}/evidence/{evidenceId}/file': {
    summary: 'Download Evidence File',
    description: 'Downloads raw evidence file bytes for authorized merchant inspection.',
  },
  'get:/api/v1/cases/{id}/completeness': {
    summary: 'Assess Evidence Completeness',
    description: 'AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating targeted clarification questions.',
  },
  'post:/api/v1/cases/{id}/completeness/answers': {
    summary: 'Submit Completeness Answers',
    description: 'Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating remedy proposals.',
  },
  'post:/api/v1/cases/{id}/proposals': {
    summary: 'Generate Remedy Proposals',
    description: 'Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement, Exchange).',
  },
  'get:/api/v1/cases/{id}/plans': {
    summary: 'List Remedy Plans',
    description: 'Lists all proposed remedy plans with exact monetary calculations and return requirements.',
  },
  'post:/api/v1/plans/{id}/accept': {
    summary: 'Accept Remedy Plan',
    description: 'Records customer consent to a specific remedy proposal bound strictly to its canonical hash.',
  },
  'post:/api/v1/plans/{id}/approve': {
    summary: 'Approve Remedy Plan',
    description: 'Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.',
  },
  'post:/api/v1/plans/{id}/approve-and-execute': {
    summary: 'Approve and Execute Plan',
    description: 'Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.',
  },
  'post:/api/v1/plans/{id}/reject': {
    summary: 'Reject Remedy Plan',
    description: 'Rejects a proposed remedy plan and returns the case to manual review.',
  },
  'post:/api/v1/plans/{id}/execute': {
    summary: 'Execute Resolution Steps',
    description: 'Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).',
  },
  'get:/api/v1/cases/{caseId}/receipt': {
    summary: 'Get Resolution Receipt',
    description: 'Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and double-entry ledger citations.',
  },
  'get:/api/v1/returns/{id}/inspection': {
    summary: 'Get Return Inspection Details',
    description: 'Retrieves physical return tracking details and recorded inspection outcomes.',
  },
  'post:/api/v1/returns/{id}/inspection': {
    summary: 'Record Return Inspection',
    description: 'Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund disbursement.',
  },
  'get:/api/v1/merchant/recovery': {
    summary: 'List Operator Recovery Queue',
    description: 'Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.',
  },
  'post:/api/v1/merchant/recovery/{id}/reconcile': {
    summary: 'Reconcile Step State',
    description: 'Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.',
  },
  'get:/api/v1/merchant/policies': {
    summary: 'Get Merchant Policies',
    description: 'Retrieves active return, replacement, and exchange policy versions and structured rules.',
  },
  'post:/api/v1/merchant/policies/publish': {
    summary: 'Publish Policy Version',
    description: 'Publishes a new immutable policy version with SHA-256 integrity hash.',
  },
  'get:/api/v1/merchant/insights': {
    summary: 'Get Dispute Insights',
    description: 'Aggregates return rates, common defect categories, and resolution cost analytics.',
  },
  'get:/api/v1/merchant/reconciliation/export.csv': {
    summary: 'Export Subledger CSV',
    description: 'Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.',
  },
  'get:/api/v1/dev/failure-injection': {
    summary: 'Get Failure Injection Status',
    description: 'Returns currently active failure injection simulation mode and trigger count.',
  },
  'post:/api/v1/dev/failure-injection': {
    summary: 'Configure Failure Injection',
    description: 'Sets chaos simulation mode (PROVIDER_DROP_BEFORE_RESPONSE, PROVIDER_500, LEDGER_IMBALANCE) to test resilience.',
  },
  'get:/api/v1/dev/mailbox': {
    summary: 'View Development Mailbox',
    description: 'Inspects synthetic outbound transactional emails and customer access links captured locally.',
  },
  'get:/api/v1/dev/health': {
    summary: 'Check Service Health',
    description: 'Returns service operational status, database connectivity, and tenant count.',
  },
  'post:/api/v1/dev/seed': {
    summary: 'Seed Synthetic Fixtures',
    description: 'Populates database with synthetic products, policies, and demo orders.',
  },
  'post:/api/v1/webhooks/paypal': {
    summary: 'Handle Default PayPal Webhook',
    description: 'Processes inbound PayPal payment capture, authorization, and refund events.',
  },
  'post:/api/v1/webhooks/paypal/{connectionKey}': {
    summary: 'Handle Scoped PayPal Webhook',
    description: 'Processes inbound PayPal webhook events directed to a specific merchant connection key.',
  },
  'post:/api/v1/webhooks/email': {
    summary: 'Handle Default Inbound Email',
    description: 'Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.',
  },
  'post:/api/v1/webhooks/email/{connectionKey}': {
    summary: 'Handle Scoped Inbound Email',
    description: 'Processes inbound email webhooks for a specific store connection key.',
  },
};

const PARAM_META = {
  id: {
    description: 'Unique UUID identifier of the target resource',
    example: '70000000-0000-0000-0000-000000000001',
  },
  caseId: {
    description: 'Dispute case UUID identifier',
    example: '4c52b868-9844-41a3-b3d0-8de4f230fc06',
  },
  evidenceId: {
    description: 'Evidence item UUID identifier',
    example: '90000000-0000-0000-0000-000000000001',
  },
  connectionKey: {
    description: 'Webhook store connection identifier key',
    example: 'default',
  },
  tenantSlug: {
    description: 'Unique merchant store identifier slug',
    example: 'default-merchant',
  },
};

const TAG_DESCRIPTIONS = {
  Auth: 'Session management, persona authentication, and magic link access',
  Catalog: 'Store catalog, product variants, and checkout order lifecycle',
  Cases: 'Dispute case creation, messaging timeline, evidence uploads, and completeness checking',
  Plans: 'AI-assisted and policy-guided remedy plan proposals, acceptance, and approval',
  Resolutions: 'Physical return inspection gating, receipt generation, and resolution orchestration',
  Policies: 'Merchant policy versioning and structured rule management',
  Merchant: 'Operational recovery queue, policy publishing, analytics insights, and subledger reconciliation',
  Webhooks: 'PayPal Orders v2 and Resend inbound event processing',
  Dev: 'Development mailbox, health checks, seed fixtures, and failure injection simulator',
};

const RESPONSE_DESCRIPTIONS = {
  '200': 'Successful response',
  '201': 'Resource created or action completed successfully',
  '204': 'Operation completed successfully with no content returned',
  '400': 'Invalid request parameters or payload',
  '401': 'Authentication required or session expired',
  '403': 'Insufficient permissions or access forbidden',
  '404': 'Requested resource not found',
  '409': 'Conflict with current resource state',
  '429': 'Rate limit exceeded',
  '500': 'Internal server error',
  '502': 'Upstream service unavailable',
};

async function main() {
  console.log('[OpenAPI Export] Bootstrapping NestJS application...');
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('ResolvePay Rescue API')
    .setDescription('Autonomous commerce dispute, policy planning, and remedy resolution engine')
    .setVersion('1.0')
    .addServer('https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io', 'Production')
    .addServer('http://localhost:3001', 'Development')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Session bearer token or authorization credential',
    })
    .build();

  console.log('[OpenAPI Export] Generating base OpenAPI document...');
  const document = SwaggerModule.createDocument(app, config);

  // 1. APIMatic Server Configuration extension in info
  document.info['x-server-configuration'] = {
    'default-environment': 'Production',
    environments: [
      {
        name: 'Production',
        description: 'Live production and demo API gateway hosted on Azure Container Apps',
        servers: [
          {
            name: 'default',
            url: 'https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io',
            description: 'Production API Gateway',
          },
        ],
      },
      {
        name: 'Development',
        description: 'Local development server',
        servers: [
          {
            name: 'default',
            url: 'http://localhost:3001',
            description: 'Local NestJS Server',
          },
        ],
      },
    ],
  };

  // Standard OpenAPI servers array
  document.servers = [
    {
      url: 'https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io',
      description: 'Production',
    },
    {
      url: 'http://localhost:3001',
      description: 'Development',
    },
  ];

  // 2. Global security requirement
  document.security = [{ bearer: [] }];

  // 3. Ensure security scheme description
  if (document.components?.securitySchemes?.bearer) {
    document.components.securitySchemes.bearer.description = 'Session bearer token or authorization credential';
  }

  // 4. Track all tags used by operations
  const usedTags = new Set();

  // 5. Enrich every path and operation
  for (const [pathKey, pathItem] of Object.entries(document.paths || {})) {
    const pathMatches = pathKey.match(/\{([^}]+)\}/g) || [];
    const expectedPathParams = pathMatches.map((m) => m.slice(1, -1));

    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const operation = pathItem[method];
      if (!operation) continue;

      const metaKey = `${method}:${pathKey}`;
      const meta = OPERATION_META[metaKey] || {};

      // Ensure summary
      if (!operation.summary) {
        operation.summary = meta.summary || `${method.toUpperCase()} ${pathKey}`;
      }

      // Ensure description
      if (!operation.description) {
        operation.description = meta.description || operation.summary;
      }

      // Track tags
      if (operation.tags) {
        operation.tags.forEach((t) => usedTags.add(t));
      }

      // Ensure parameters list
      operation.parameters = operation.parameters || [];

      // Check and add missing path parameters
      for (const paramName of expectedPathParams) {
        let existing = operation.parameters.find(
          (p) => p.name === paramName && p.in === 'path'
        );
        if (!existing) {
          existing = {
            name: paramName,
            in: 'path',
            required: true,
            schema: { type: 'string' },
          };
          operation.parameters.push(existing);
        }
      }

      // Enrich all parameters with descriptions and examples
      for (const param of operation.parameters) {
        const pMeta = PARAM_META[param.name] || {
          description: `The ${param.name} parameter`,
          example: 'default',
        };

        if (!param.description) {
          param.description = pMeta.description;
        }

        param.example = pMeta.example;

        if (!param.schema) {
          param.schema = { type: 'string' };
        }

        if (!param.schema.description) {
          param.schema.description = param.description;
        }

        if (param.schema.example === undefined && param.schema.default === undefined) {
          param.schema.example = pMeta.example;
        }
      }

      // Ensure every response has a non-empty description
      if (operation.responses) {
        for (const [code, resp] of Object.entries(operation.responses)) {
          if (!resp.description || resp.description.trim() === '') {
            resp.description = RESPONSE_DESCRIPTIONS[code] || `Response for status code ${code}`;
          }
        }
      }
    }
  }

  // Set tags array to match all used tags
  document.tags = Array.from(usedTags).map((name) => ({
    name,
    description: TAG_DESCRIPTIONS[name] || `${name} operations`,
  }));

  // Target directories
  const docsDir = path.resolve(__dirname, '../docs');
  const apimaticSpecDir = path.resolve(__dirname, '../apimatic/src/spec');

  [docsDir, apimaticSpecDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Write JSON to docs and apimatic (single spec file in apimatic/src/spec to avoid multiple-spec warning)
  const jsonContent = JSON.stringify(document, null, 2);
  fs.writeFileSync(path.join(docsDir, 'openapi.json'), jsonContent, 'utf-8');
  fs.writeFileSync(path.join(apimaticSpecDir, 'openapi.json'), jsonContent, 'utf-8');

  // Clean up any extra yaml in apimatic/src/spec so apimatic only finds one main spec
  const apimaticYaml = path.join(apimaticSpecDir, 'openapi.yaml');
  if (fs.existsSync(apimaticYaml)) {
    fs.unlinkSync(apimaticYaml);
  }
  console.log(`[OpenAPI Export] Wrote enriched JSON spec to docs/ and apimatic/src/spec/ (${Object.keys(document.paths).length} endpoints)`);

  // Write YAML to docs/
  try {
    const swaggerDir = path.dirname(require.resolve('../apps/api/node_modules/@nestjs/swagger'));
    const yamlModulePath = require.resolve('js-yaml', { paths: [swaggerDir] });
    const yaml = require(yamlModulePath);
    const yamlContent = yaml.dump(document, { noRefs: true, lineWidth: -1 });
    fs.writeFileSync(path.join(docsDir, 'openapi.yaml'), yamlContent, 'utf-8');
    console.log('[OpenAPI Export] Wrote enriched YAML spec to docs/openapi.yaml');
  } catch (err) {
    console.warn('[OpenAPI Export] Could not export YAML (js-yaml not found):', err.message);
  }

  await app.close();
  console.log('[OpenAPI Export] Complete!');
}

main().catch((err) => {
  console.error('[OpenAPI Export] Failed:', err);
  process.exit(1);
});
