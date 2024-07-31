import type { DockerComposeYmlOptions } from '../types';

type YamlValue = string | boolean | undefined;

export const generateDockerComposeYml = (opt: DockerComposeYmlOptions) => {
  class ServiceBuilder {
    private readonly service: Record<string, unknown> = {};

    constructor(image: string, useTag = true) {
      this.service.image =
        (useTag ? `\${DOCKER_ORG:-${opt.dockerOrg ?? 'ghcr.io/heviat'}}/\${DOCKER_PREFIX:-}` : '') +
        image +
        (useTag ? `:\${MAILU_VERSION:-${opt.version}}` : '');
      this.service.restart = 'always';
    }

    if(condition: boolean, callback: (builder: ServiceBuilder) => ServiceBuilder) {
      return condition ? callback(this) : this;
    }

    env() {
      this.service.env_file = 'mailu.env';
      return this;
    }

    hostname(hostname: string) {
      this.service.hostname = hostname;
      return this;
    }

    logging(tag: string, driver = 'journald') {
      this.service.logging = {
        driver,
        options: {
          tag: `mailu-${tag}`,
        },
      };
      return this;
    }

    ports(ports: number[], assignedPorts?: number[], ips = ['127.0.0.1']) {
      this.service.ports = ips.flatMap(ip =>
        ports.map((port, i) => `${ip}:${port}:${assignedPorts?.[i] ?? port}`)
      );
      return this;
    }

    portsBind(...ports: number[]) {
      const ips: string[] = [];
      if (opt.bind4) ips.push(opt.bind4);
      if (opt.bind6) ips.push(`[${opt.bind6}]`);
      return this.ports(ports, undefined, ips);
    }

    private appendToList(list: 'networks' | 'depends_on', ...items: YamlValue[]) {
      const filteredItems = items.filter(item => typeof item === 'string') as string[];
      if (!this.service[list]) {
        this.service[list] = filteredItems.length === 1 ? filteredItems[0] : filteredItems;
      } else if (Array.isArray(this.service[list])) {
        this.service[list].push(...filteredItems);
      } else {
        this.service[list] = [this.service[list], ...filteredItems];
      }
      return this;
    }

    networks(...networks: YamlValue[]) {
      return this.appendToList('networks', ...networks);
    }

    networksObj(networks: Record<string, { ipv4_address: string }>) {
      this.service.networks = networks;
      return this;
    }

    dependsOn(...services: YamlValue[]) {
      return this.appendToList('depends_on', ...services);
    }

    dns() {
      if (!opt.dns) return this;
      this.dependsOn('resolver');
      this.service.dns = [opt.dns];
      return this;
    }

    volumes(...paths: string[]) {
      this.service.volumes = paths.map(path => `${opt.root}${path}`);
      return this;
    }

    healthcheck(
      test: string[],
      interval = '10s',
      timeout = '5s',
      retries = 3,
      startPeriod = '10s'
    ) {
      this.service.healthcheck = { test, interval, timeout, retries, startPeriod };
      return this;
    }

    build() {
      return this.service;
    }
  }

  return {
    services: {
      redis: new ServiceBuilder('redis:alpine', false).volumes('/redis:/data').dns().build(),
      front: new ServiceBuilder('nginx')
        .env()
        .logging('front')
        .portsBind(80, 443, 25, 465, 587, 110, 995, 143, 993, 4190)
        .volumes('/certs:/certs', '/overrides/nginx:/overrides:ro')
        .networks('default')
        .if(opt.webmailType !== 'none', srv => srv.networks('webmail'))
        .if(opt.enableWebdav, srv => srv.networks('radicale'))
        .dns()
        .build(),
      ...(opt.dns && {
        resolver: new ServiceBuilder('unbound')
          .env()
          .logging('resolver')
          .networksObj({ default: { ipv4_address: opt.dns } })
          .build(),
      }),
      admin: new ServiceBuilder('admin')
        .env()
        .logging('admin')
        .if(opt.enableAdmin, srv => srv.ports([8080], [80]))
        .volumes('/data:/data', '/dkim:/dkim')
        .dns()
        .build(),
      imap: new ServiceBuilder('dovecot')
        .env()
        .logging('imap')
        .volumes('/mail:/mail', '/overrides/dovecot:/overrides:ro')
        .networks('default')
        .dependsOn('front')
        .if(opt.enableTika, srv => srv.networks('fts_attachments').dependsOn('fts_attachments'))
        .dns()
        .build(),
      smtp: new ServiceBuilder('postfix')
        .env()
        .logging('smtp')
        .volumes('/mailqueue:/queue', '/overrides/postfix:/overrides:ro')
        .dependsOn('front')
        .dns()
        .build(),
      ...(opt.enableOletools && {
        oletools: new ServiceBuilder('oletools')
          .hostname('oletools')
          .logging('oletools')
          .networks('oletools')
          .dns()
          .build(),
      }),
      ...(opt.enableTika && {
        fts_attachments: new ServiceBuilder('apache/tika:2.9.2.1-full', false)
          .hostname('tika')
          .logging('tika')
          .networks('fts_attachments')
          .dns()
          .healthcheck([
            'CMD-SHELL',
            'wget -nv -t1 -O /dev/null http://127.0.0.1:9998/tika || exit 1',
          ])
          .build(),
      }),
      antispam: new ServiceBuilder('rspamd')
        .env()
        .hostname('antispam')
        .logging('antispam')
        .volumes('/filter:/var/lib/rspamd', '/overrides/rspamd:/overrides:ro')
        .networks('default')
        .dependsOn('front', 'redis')
        .if(opt.enableOletools, srv => srv.networks('oletools').dependsOn('oletools'))
        .if(opt.enableAntivirus, srv => srv.networks('clamav').dependsOn('antivirus'))
        .dns()
        .build(),
      ...(opt.enableAntivirus && {
        antivirus: new ServiceBuilder('clamav/clamav-debian:1.2.0-6', false)
          .logging('antivirus')
          .volumes('/filter:/var/lib/clamav')
          .networks('clamav')
          .healthcheck([
            'CMD-SHELL',
            'kill -0 `cat /tmp/clamd.pid` && kill -0 `cat /tmp/freshclam.pid`',
          ])
          .build(),
      }),
      ...(opt.enableWebdav && {
        webdav: new ServiceBuilder('radicale')
          .logging('webdav')
          .volumes('/dav:/data')
          .networks('radicale')
          .build(),
      }),
      ...(opt.enableFetchmail && {
        fetchmail: new ServiceBuilder('fetchmail')
          .env()
          .logging('fetchmail')
          .volumes('/data/fetchmail:/data')
          .dependsOn('admin', 'smtp', 'imap')
          .dns()
          .build(),
      }),
      ...(opt.webmailType !== 'none' && {
        webmail: new ServiceBuilder('webmail')
          .env()
          .logging('webmail')
          .volumes('/webmail:/data', `/overrides/${opt.webmailType}:/overrides:ro`)
          .networks('webmail')
          .dependsOn('front')
          .build(),
      }),
    },
    networks: {
      default: {
        driver: 'bridge',
        ...(opt.bind6 && { enable_ipv6: true }),
        ipam: {
          driver: 'default',
          config: opt.bind6
            ? [{ subnet: opt.subnet }, { subnet: opt.subnet6 }]
            : [{ subnet: opt.subnet }],
        },
      },
      ...(opt.enableWebdav && {
        radicale: { driver: 'bridge' },
      }),
      ...(opt.webmailType !== 'none' && {
        webmail: { driver: 'bridge' },
      }),
      ...(opt.enableAntivirus && {
        clamav: { driver: 'bridge' },
      }),
      ...(opt.enableOletools && {
        oletools: {
          driver: 'bridge',
          internal: true,
        },
      }),
      ...(opt.enableTika && {
        fts_attachments: {
          driver: 'bridge',
          internal: true,
        },
      }),
    },
  };
};
