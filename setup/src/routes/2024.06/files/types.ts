export type MailuOptionsBase = {
  subnet: string;
  subnet6?: string;
  enableAdmin: boolean;
  enableAntivirus: boolean;
  enableFetchmail: boolean;
  dockerOrg: string;
  enableOletools: boolean;
  enableTika: boolean;
  enableWebdav: boolean;
  webmailType: 'roundcube' | 'snappymail' | 'none';
};

type DockerComposeYmlSpecificOptions = {
  version: string;
  root: string;
  bind4?: string;
  bind6?: string;
  dns?: string;
};

export type MailuEnvSpecificOptions = {
  secret: string;
  domain: string;
  hostnames: string;
  postmaster: string;
  tlsFlavor: 'letsencrypt' | 'cert' | 'notls' | 'mail' | 'mail-letsencrypt';
  rateLimit: {
    authIP: number;
    authUser: number;
    message: number;
  };
  messageSizeLimit?: string;
  enableAPI: boolean;
  enableStats: boolean;
  enableWelcome: boolean;
  relayHost?: string;
  fetchmailDelay?: string;
  fetchmailDelimiter?: string;
  dmarcRUA?: string;
  dmarcRUF?: string;
  welcomeSubject?: string;
  welcomeBody?: string;
  compression: string;
  compressionLevel: string;
  siteName: string;
  website: string;
  recaptchaSiteKey?: string;
  recaptchaSecretKey?: string;
  domainRegistration: boolean;
  composeProjectName?: string;
  realIpHeader?: string;
  realIpFrom?: string;
  rejectUnlistedRecipient: boolean;
  apiToken: string;
};

export type DockerComposeYmlOptions = MailuOptionsBase & DockerComposeYmlSpecificOptions;

export type MailuEnvOptions = MailuOptionsBase & MailuEnvSpecificOptions;

export type MailuOptions = MailuOptionsBase &
  DockerComposeYmlSpecificOptions &
  MailuEnvSpecificOptions;

export const defaults: Partial<MailuOptions> = {
  dockerOrg: 'ghcr.io/heviat',
  version: 'latest',
  root: '/mailu',
  domain: 'yourdomain.tld',
  postmaster: 'admin',
  tlsFlavor: 'letsencrypt',
  rateLimit: {
    authIP: 5,
    authUser: 50,
    message: 200,
  },
  enableStats: false,
  siteName: 'Mailu',
  website: 'https://mailu.io',
  enableAdmin: true,
  enableAPI: false,
  webmailType: 'none',
  enableAntivirus: false,
  enableWebdav: false,
  enableFetchmail: false,
  enableOletools: true,
  enableTika: false,
  bind4: '127.0.0.1',
  subnet: '192.168.203.0/24',
};
