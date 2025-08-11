import 'dotenv/config';
import * as Joi from 'joi';

export interface envConfig {
  PORT: number;
  NATS_SERVERS: string[];
  // PRODUCT_MICROSERVICE_HOST: string;
  // PRODUCT_MICROSERVICE_PORT: number;
  // ORDER_MICROSERVICE_HOST: string;
  // ORDER_MICROSERVICE_PORT: number;
  // otros campos aquí...
}

// 2. Schema Joi
const envSchema = Joi.object({
  PORT: Joi.number().port().required(),
  NATS_SERVERS: Joi.array().items(Joi.string().required()),
  // PRODUCT_MICROSERVICE_HOST: Joi.string().hostname().required(),
  // PRODUCT_MICROSERVICE_PORT: Joi.number().port().required(),
  // ORDER_MICROSERVICE_HOST: Joi.string().hostname().required(),
  // ORDER_MICROSERVICE_PORT: Joi.number().port().required(),
  // otros campos con sus validaciones...
  // otros...
}).unknown(true);

// 3. Validación
const validated = envSchema.validate(
  {
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
  },
  {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  },
);

if (validated.error) {
  throw new Error(
    `❌ Error(s) en variables de entorno:\n${validated.error.details
      .map((d) => `- ${d.message}`)
      .join('\n')}`,
  );
}

const value = validated.value as Record<string, unknown>;

export const envs: envConfig = {
  PORT: Number(value.PORT),
  NATS_SERVERS: value.NATS_SERVERS as string[],
  // PRODUCT_MICROSERVICE_HOST: String(value.PRODUCT_MICROSERVICE_HOST),
  // PRODUCT_MICROSERVICE_PORT: Number(value.PRODUCT_MICROSERVICE_PORT),
  // ORDER_MICROSERVICE_HOST: String(value.ORDER_MICROSERVICE_HOST),
  // ORDER_MICROSERVICE_PORT: Number(value.ORDER_MICROSERVICE_PORT),
  // otros campos, asegurando el type
};
