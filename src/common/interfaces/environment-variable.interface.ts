import { ENV } from "@enums/environment-variable.enum";

export interface EnvironmentVariables {
  // GENERAL
  [ENV.NODE_ENV]: 'development' | 'production' | 'test';
  [ENV.PORT]: number;
  [ENV.APP_URL]: string;

  // DATABASE CONFIG
  [ENV.MONGO_URI]: string;
  [ENV.MONGO_DB_NAME]: string;
  [ENV.LOCAL_DATABASE_URL]?: string;
  [ENV.DATABASE_URL]?: string;
  [ENV.PG_HOST]: string;
  [ENV.PG_PORT]?: number;
  [ENV.PG_USER]: string;
  [ENV.PG_PASSWORD]: string;
  [ENV.PG_DATABASE]: string;

  // AUTHENTICATION / JWT
  [ENV.JWT_SECRET]: string;
  [ENV.JWT_REFRESH_SECRET]: string;
  [ENV.JWT_ACCESS_SECRET]: string;
  [ENV.JWT_REFRESH_EXPIRES]: string;
  [ENV.JWT_ACCESS_EXPIRES]: string;
  [ENV.HTTP_ONLY]: boolean;

  // EMAIL SERVICE
  [ENV.EMAIL_SERVICE]: string;
  [ENV.EMAIL_USERNAME]: string;
  [ENV.EMAIL_PASSWORD]: string;
  [ENV.EMAIL_FROM]: string;

  // THIRD PARTY API KEYS
  [ENV.GOOGLE_API_KEY]: string;
  [ENV.STRIPE_SECRET_KEY]: string;
  [ENV.STRIPE_PUBLIC_KEY]: string;
  [ENV.NAME_SPACE]: string;

  // FIREBASE
  [ENV.FIREBASE_API_KEY]: string;
  [ENV.FIREBASE_AUTH_DOMAIN]: string;
  [ENV.FIREBASE_PROJECT_ID]: string;
  [ENV.FIREBASE_STORAGE_BUCKET]: string;
  [ENV.FIREBASE_MESSAGING_SENDER_ID]: string;
  [ENV.FIREBASE_APP_ID]: string;

  // RAZORPAY
  [ENV.RAZORPAY_KEY_ID]: string;
  [ENV.RAZORPAY_KEY_SECRET]: string;

  // CORS
  [ENV.CORS_ORIGIN]: string;

  // REDIS
  [ENV.REDIS_HOST]?: string;
  [ENV.REDIS_PORT]?: number;
  [ENV.REDIS_PASSWORD]?: string;

  // NATS
  [ENV.NATS_URL]?: string;

  // DEBUG
  [ENV.DEBUG]?: string;

  // FILE UPLOAD
  [ENV.CLOUDINARY_URL]?: string;
  [ENV.CLOUDINARY_CLOUD_NAME]?: string;
  [ENV.CLOUDINARY_API_KEY]?: string;
  [ENV.CLOUDINARY_API_SECRET]?: string;

  // OTHERS
  [ENV.SESSION_SECRET]: string;
  [ENV.SESSION_COOKIE_SECURE]: boolean;
  [ENV.SESSION_COOKIE_MAXAGE]: number;
}
