import { z } from 'zod'

// usando o zod para validar variáveis de ambiente
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  CLOUDFARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACESS_KEY_ID: z.string(),
  AWS_SECRET_ACESS_KEY: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_DB: z.coerce.number().optional().default(0),
  REDIS_PORT: z.coerce.number().optional().default(6379),
})

export type Env = z.infer<typeof envSchema>
