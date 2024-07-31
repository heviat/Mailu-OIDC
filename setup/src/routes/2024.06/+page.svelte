<script lang="ts" context="module">
  import { defaults, type MailuOptions } from './files/types';
  import { createHighlighter } from 'shiki';

  type MailuStep<T extends keyof MailuOptions = any> = Omit<StepProps<MailuOptions, T>, 'stepNav' | 'storage'>;

  const steps = [
    {
      id: 'dockerOrg',
      title: 'OpenID Connect',
      description: "Do you want to use Heviat's OpenID Connect integration?",
      details: `
        <p>
          Enabling OIDC will allow you to use your existing login provider to authenticate users
          in Mailu without the need to create new accounts or passwords. This also allows you to
          use multi-factor authentication and other security features provided by your identity
          provider which are not otherwise available in Mailu.
        </p>
      `,
      options: [
        {
          value: 'ghcr.io/heviat',
          title: 'Yes, enable OIDC',
          description:
            'Set up <a href="https://github.com/heviat/Mailu-OIDC" target="_blank"><code>Mailu-OIDC</code></a> with OIDC support.',
        },
        {
          value: 'ghcr.io/mailu',
          title: 'No',
          description:
            'Set up <a href="https://github.com/Mailu/Mailu" target="_blank"><code>Mailu</code></a>.',
        },
      ],
      hint: value =>
        `The docker images will be downloaded from <code>${value}</code>.` +
        (value === defaults.dockerOrg
          ? ''
          : value === defaults.dockerOrg
            ? ''
            : '<br />Your configuration will still contain the OIDC settings, so you can easily switch to OIDC in the future.'),
    } as MailuStep<'dockerOrg'>,
    {
      id: 'root',
      title: 'Installation Directory',
      description: 'Where do you want to install Mailu to?',
      options: [
        {
          value: '/mailu',
          title: 'Default location',
          description: 'Install Mailu in <code>/mailu</code>.',
        },
        {
          value: new Input({
            input: 'text',
            id: 'customRoot',
            title: 'Custom location',
            value: '/opt/mailu',
          }),
          title: 'Custom location',
          description: 'Install Mailu in a custom directory.',
        },
      ],
      hint: value => `Mailu will be installed in <code>${value}</code>.` + (value && value.replace(/[^/]/g, '').length > 2 ? '<br /><span class="badge text-bg-warning">Warning</span> There is currently an <a href="https://github.com/Mailu/Mailu/issues/3164" target="_blank">open issue</a> with paths that use more than two subdirectories.' : ''),
    } as MailuStep<'root'>,
    {
      id: 'tlsFlavor',
      title: 'TLS Flavor',
      description: 'How do you want to handle TLS certificates?',
      details: `
        <p>
          TLS certificates are used to encrypt the connection between your users and the server.
          It is highly recommended to use TLS certificates.
        </p>
      `,
      options: [
        {
          value: 'letsencrypt',
          title: 'Auto-generated certificates',
          description:
            'Use <a href="https://letsencrypt.org" target="_blank">Let\'s Encrypt</a> to automatically generate TLS certificates.',
        },
        {
          value: 'cert',
          title: 'Custom certificates',
          description: 'Use your own TLS certificates.',
        },
        {
          value: 'notls',
          title: 'Disable TLS',
          description: 'Disable TLS encryption. <strong>Not recommended!</strong>',
        },
      ],
      hint: (value, storage) => {
        switch (value) {
          case 'letsencrypt':
            return "TLS certificates will be automatically generated and renewed using Let's Encrypt.";
          case 'cert':
            return `
              <p>
                You will need to set up the following files:<br />
                <code>${storage.root ?? '/mailu'}/certs/cert.pem</code> and <code>${storage.root ?? '/mailu'}/certs/key.pem</code>
              </p>
              <p>
                You can change the path of these files in <code>mailu.env</code> by overwriting<br />
                <code>TLS_CERT_FILENAME</code> and <code>TLS_KEYPAIR_FILENAME</code>.
              </p>
            `;
          case 'notls':
            return `
              <p>TLS encryption will be disabled.</p>
              <p>
                <span class="badge text-bg-danger">Danger</span> This is highly discouraged. You should only disable TLS<br />
                if you properly set up a reverse proxy with TLS termination.
              </p>
            `;
          default:
            return '';
        }
      },
    } as MailuStep<'tlsFlavor'>,
    {
      id: 'enableStats',
      title: 'Statistics',
      description: 'Do you want to opt-in to anonymous statistics?',
      details: `
        <p>
          A random UUID will be generated to identify your instance, and sent to the
          <code>STATS_ENDPOINT</code>. No other data will be sent. This helps Mailu developers to
          understand how often Mailu and its forks are used over time, and to rate its popularity.
        </p>
      `,
      options: [
        {
          value: true,
          title: 'Yes',
          description: 'Enable statistics to help improve Mailu.',
        },
        {
          value: false,
          title: 'No',
          description: 'Disable statistics.',
        },
      ],
      hint: value =>
        value
          ? `
            <p>
              Anonymous statistics will be collected to help improve Mailu.<br />
              You can opt-out at any time by setting the <code>DISABLE_STATISTICS</code> variable in <code>mailu.env</code>.
            </p>
          `
          : 'No statistics will be collected.',
    } as MailuStep<'enableStats'>,
    {
      id: 'webmailType',
      title: 'Webmail',
      description: 'Which webmail client do you want to use?',
      details: `
        A webmail client is a web interface exposing an email client. Mailu webmails are bound to
        the internal IMAP and SMTP server for users to access their mailbox through the web. By
        exposing a complex application such as a webmail, you should be aware of the security
        implications caused, such as an increase of attack surface. Also, the resource usage will
        increase.
      `,
      options: [
        {
          value: 'roundcube',
          title: 'Roundcube',
          description: 'Use <a href="https://roundcube.net" target="_blank">Roundcube</a> as the webmail client.',
        },
        {
          value: 'snappymail',
          title: 'SnappyMail',
          description: 'Use <a href="https://snappymail.app" target="_blank">SnappyMail</a> as the webmail client.',
        },
        {
          value: 'none',
          title: 'Disable webmail',
          description: 'Do not install a webmail client.',
        }
      ],
      hint: value => {
        switch (value) {
          case 'roundcube':
          case 'snappymail':
            const name = value === 'roundcube' ? 'Roundcube' : 'SnappyMail';
            return `
              <p>
                ${name} will be installed as the webmail client. You can access it at <code>/webmail</code>.
              </p>
            `;
          case 'none':
            return `
              <p>
                No webmail client will be installed. A third-party email client<br/>
                like <a href="https://www.thunderbird.net/en-US/ target="_blank">Mozilla Thunderbird</a> will be required to access your emails.
              </p>
            `;
          default:
            return '';
        }
      },
    } as MailuStep<'webmailType'>,
    {
      id: 'enableAPI',
      title: 'RESTful API',
      description: 'Do you want to enable the RESTful API?',
      details: `
        <p>
          The RESTful API allows you to interact with Mailu programmatically. You can use the API
          to perform the same actions as you would through the web interface. This is useful if you
          want to automate tasks or integrate Mailu with other services.
        </p>
      `,
      options: [
        {
          value: true,
          title: 'Yes, enable API',
          description: 'Enable the RESTful API.',
        },
        {
          value: false,
          title: 'No',
          description: 'Disable the RESTful API.',
        },
      ],
      hint: value =>
        value
          ? `
            <p>
              The RESTful API will be enabled. You can access the API at <code>/api</code>.
            </p>
          `
          : 'The RESTful API will be disabled.',
    } as MailuStep<'enableAPI'>
  ];

  const highlighter = await createHighlighter({
    themes: ['one-dark-pro', 'one-light'],
    langs: ['yaml', 'properties'],
  });
  const highlight = (code: string, lang: string) =>
    highlighter.codeToHtml(code, { themes: { light: 'one-light', dark: 'one-dark-pro' }, lang });
</script>

<script lang="ts">
  import { Input } from '$lib/components/Input.svelte';
  import { default as Step, type Props as StepProps } from '$lib/components/Step.svelte';
  import { stringify } from 'yaml';
  import { generateDockerComposeYml } from './files/docker-compose.yml/builder';
  import { generateMailuEnv } from './files/mailu.env/builder';

  let step: number = $state(0);
  let options: Partial<MailuOptions> = $state({ ...defaults });
</script>

<div class="container mt-5">
  <h1>Mailu Setup</h1>
  <div class="d-flex flex-column justify-content-center gap-5">
    <Step {...steps[step]} storage={options} bind:value={options[steps[step].id]}>
      {#snippet stepNav(type, label, stepAdd)}
        <button
          class="btn btn-{type} px-4"
          disabled={step + stepAdd < 0 || step + stepAdd >= steps.length}
          onclick={() => {
            step += stepAdd;
          }}>{label}</button
        >
      {/snippet}
    </Step>
    <div>
      <header class="py-2">
        <h3 class="fw-semibold">Generated Configuration</h3>
        <p class="opacity-75">
          Here you can check the generated files. When you completed all the steps, download links
          will be generated so you can download them directly from the server you're going to
          install Mailu to.
        </p>
      </header>

      <details class="d-none d-md-block">
        <summary>Included Docker containers</summary>
        ...
      </details>
      <details class="d-none d-md-block">
        <summary>Generated <code>docker-compose.yml</code></summary>
        {@html highlight(stringify(generateDockerComposeYml(options)), 'yaml')}
      </details>
      <details class="d-none d-md-block">
        <summary>Generated <code>mailu.env</code></summary>
        {@html highlight(generateMailuEnv(options), 'properties')}
      </details>
    </div>
  </div>
</div>

<style>
  :global(html[data-bs-theme='dark'] .shiki) {
    width: 100%;
    max-width: 460px;
    padding: 1rem;
  }
  :global(html[data-bs-theme='dark'] .shiki),
  :global(html[data-bs-theme='dark'] .shiki span) {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
</style>
