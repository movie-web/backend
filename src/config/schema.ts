import { z } from 'zod';

const defaultBoolean = z
  .enum(['true', 'false'])
  .transform((val) => val === 'true');

export const configSchema = z.object({
  server: z
    .object({
      // port of web server
      port: z.coerce.number().default(8080),

      // space seperated list of allowed cors domains
      cors: z.string().default(''),

      // disable cross origin restrictions, allow any site.
      // overwrites the cors option above
      allowAnySite: defaultBoolean,

      // should it trust reverse proxy headers? (for ip gathering)
      trustProxy: defaultBoolean,

      // should it trust cloudflare headers? (for ip gathering, cloudflare has priority)
      trustCloudflare: defaultBoolean,

      // prefix for where the instance is run on. for example set it to /backend if you're hosting it on example.com/backend
      // if this is set, do not apply url rewriting before proxing
      basePath: z.string().default('/'),
    })
    .default({
      allowAnySite: 'false',
      trustProxy: 'false',
      trustCloudflare: 'false',
      port: 8080,
      cors: '',
      basePath: '/',
    }),
  logging: z
    .object({
      // format of the logs, JSON is recommended for production
      format: z.enum(['json', 'pretty']).default('pretty'),

      // show debug logs?
      debug: defaultBoolean,
    })
    .default({
      format: 'pretty',
      debug: 'false',
    }),
  postgres: z
    .object({
      // connection URL for postgres database
      connection: z.string(),

      // run all migrations on boot of the application
      migrateOnBoot: defaultBoolean,

      // try to sync the schema on boot, useful for development
      // will always keep the database schema in sync with the connected database
      // it is extremely destructive, do not use it EVER in production
      syncSchema: defaultBoolean,

      // Enable debug logging for MikroORM - Outputs queries and entity management logs
      // Do NOT use in production, leaks all sensitive data
      debugLogging: defaultBoolean,

      // Enable SSL for the postgres connection
      ssl: defaultBoolean,
    })
    .default({
      connection: '',
      migrateOnBoot: 'false',
      syncSchema: 'false',
      debugLogging: 'false',
      ssl: 'false',
    }),
  crypto: z
    .object({
      // session secret. used for signing session tokens
      sessionSecret: z.string().min(32),
    })
    .default({
      sessionSecret: 'ThisIsADefaultSecretSessionKeyPlaceholder',
    }),
  meta: z
    .object({
      // name and description of this backend
      // this is displayed to the client when making an account
      name: z.string().min(1),
      description: z.string().min(1).optional(),
    })
    .default({
      name: ' ',
    }),
  captcha: z
    .object({
      // enabled captchas on register
      enabled: defaultBoolean,

      // captcha secret
      secret: z.string().min(1).optional(),

      clientKey: z.string().min(1).optional(),
    })
    .default({
      enabled: 'false',
    }),
  ratelimits: z
    .object({
      // enabled captchas on register
      enabled: defaultBoolean,
      redisUrl: z.string().optional(),
    })
    .default({
      enabled: 'false',
      redisUrl: '',
    }),
});
