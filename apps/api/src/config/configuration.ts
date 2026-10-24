export const configuration = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  supabase: {
    url: process.env.SUPABASE_URL || 'https://mock.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'mock-anon-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || 'mock-jwt-secret-for-development',
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(','),
  },
  store: {
    name: 'Driptide',
    currency: 'USD',
    freeShippingThresholdMinor: 15000, // $150.00
    standardShippingMinor: 1500, // $15.00
    expressShippingMinor: 3000, // $30.00
  },
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: `${process.env.SMTP_FROM_NAME || 'Driptide'} <${process.env.SMTP_FROM_EMAIL || 'orders@driptide.com'}>`,
  },
});
