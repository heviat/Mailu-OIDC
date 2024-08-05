<script lang="ts" context="module">
  import { defaults, type MailuOptions } from './files/types';
  import { createHighlighter } from 'shiki';

  const highlighter = await createHighlighter({
    themes: ['one-dark-pro', 'one-light'],
    langs: ['yaml', 'properties'],
  });
  const highlight = (code: string, lang: string) =>
    highlighter.codeToHtml(code, { themes: { light: 'one-light', dark: 'one-dark-pro' }, lang });
</script>

<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Step from '$lib/components/Step.svelte';
  import { stringify } from 'yaml';
  import { generateDockerComposeYml } from './files/docker-compose.yml/builder';
  import { generateMailuEnv } from './files/mailu.env/builder';
  import Setup from '$lib/components/Setup.svelte';
  import Item from '$lib/components/Item.svelte';

  let options: Partial<MailuOptions> = $state({ ...defaults });
  let inputs: Partial<MailuOptions> = $state({
    root: '/opt/mailu',
  });
</script>

<div class="container mt-5">
  <h1>Mailu Setup</h1>
  <Setup for={options}>
    <Step
      id="dockerOrg"
      title="OpenID Connect"
      description="Do you want to use Heviat's OpenID Connect integration?"
    >
      {#snippet details()}
        <p>
          Enabling OIDC will allow you to use your existing login provider to authenticate users in
          Mailu without the need to create new accounts or passwords. This also allows you to use
          multi-factor authentication and other security features provided by your identity provider
          which are not otherwise available in Mailu.
        </p>
      {/snippet}
      <Item
        type="radio"
        bind:group={options.dockerOrg}
        value="ghcr.io/heviat"
        title="Yes, enable OIDC"
      >
        {#snippet description()}
          Set up <a href="https://github.com/heviat/Mailu-OIDC" target="_blank"
            ><code>Mailu-OIDC</code></a
          > with OIDC support.
        {/snippet}
      </Item>
      <Item type="radio" bind:group={options.dockerOrg} value="ghcr.io/mailu" title="No">
        {#snippet description()}
          Set up <a href="https://github.com/Mailu/Mailu" target="_blank"><code>Mailu</code></a>.
        {/snippet}
      </Item>
      {#snippet hint()}
        The docker images will be downloaded from <code>{options.dockerOrg}</code>.
        {#if options.dockerOrg !== defaults.dockerOrg}
          <br />
          Your configuration will still contain the OIDC settings, so you can easily switch to OIDC in
          the future.
        {/if}
      {/snippet}
    </Step>
    <Step
      id="root"
      title="Installation Directory"
      description="Where do you want to install Mailu to?"
    >
      <Item type="radio" bind:group={options.root} value="/mailu" title="Default location">
        {#snippet description()}
          Install Mailu in <code>/mailu</code>.
        {/snippet}
      </Item>
      <Item type="radio" bind:group={options.root} bind:value={inputs.root} title="Custom location">
        {#snippet description()}
          Install Mailu in a custom directory.
        {/snippet}
        <Input title="Custom location" bind:group={options.root} bind:value={inputs.root} />
      </Item>
      {#snippet hint()}
        Mailu will be installed in <code>{options.root}</code>.
        {#if options.root && options.root.replace(/[^/]/g, '').length > 2}
          <br />
          <span class="badge text-bg-warning">Warning</span> There is currently an
          <a href="https://github.com/Mailu/Mailu/issues/3164" target="_blank">open issue</a> with paths
          that use more than two subdirectories.
        {/if}
      {/snippet}
    </Step>
    <Step
      id="mailDomain"
      title="Mail Domain"
      description="What domain do you want to use for your emails?"
    >
      <Item title="Mail Domain" description="The domain you want to use for your emails.">
        <Input bind:value={options.domain} />
      </Item>
      <Item title="Postmaster" description="The email address of the postmaster/administrator.">
        <Input bind:value={options.postmaster} />
      </Item>
      {#snippet hint()}
        A{#if ['a', 'e', 'i', 'o', 'u'].includes(options.postmaster?.charAt(0) ?? 'z')}n{/if} <code>{options.postmaster}@{options.domain}</code> account will be created.
      {/snippet}
    </Step>
    <Step
      id="tlsFlavor"
      title="TLS Flavor"
      description="How do you want to handle TLS certificates?"
    >
      {#snippet details()}
        <p>
          TLS certificates are used to encrypt the connection between your users and the server. It
          is highly recommended to use TLS certificates.
        </p>
      {/snippet}
      <Item
        type="radio"
        bind:group={options.tlsFlavor}
        value="letsencrypt"
        title="Auto-generated certificates"
      >
        {#snippet description()}
          Use <a href="https://letsencrypt.org" target="_blank">Let's Encrypt</a> to automatically generate
          TLS certificates.
        {/snippet}
      </Item>
      <Item type="radio" bind:group={options.tlsFlavor} value="cert" title="Custom certificates">
        {#snippet description()}
          Use your own TLS certificates.
        {/snippet}
      </Item>
      <Item type="radio" bind:group={options.tlsFlavor} value="notls" title="Disable TLS">
        {#snippet description()}
          Disable TLS encryption. <strong>Not recommended!</strong>
        {/snippet}
      </Item>
      {#snippet hint()}
        {#if options.tlsFlavor === 'letsencrypt'}
          TLS certificates will be automatically generated and renewed using Let's Encrypt.
        {:else if options.tlsFlavor === 'cert'}
          <p>
            You will need to set up the following files:<br />
            <code>{inputs.root ?? '/mailu'}/certs/cert.pem</code> and
            <code>{inputs.root ?? '/mailu'}/certs/key.pem</code>
          </p>
          <p>
            You can change the path of these files in <code>mailu.env</code> by overwriting<br />
            <code>TLS_CERT_FILENAME</code> and <code>TLS_KEYPAIR_FILENAME</code>.
          </p>
        {:else if options.tlsFlavor === 'notls'}
          <p>TLS encryption will be disabled.</p>
          <p>
            <span class="badge text-bg-danger">Danger</span> This is highly discouraged. You should only
            disable TLS if you properly set up a reverse proxy with TLS termination.
          </p>
        {/if}
      {/snippet}
    </Step>
    <Step
      id="enableStats"
      title="Statistics"
      description="Do you want to opt-in to anonymous statistics?"
    >
      {#snippet details()}
        <p>
          A random UUID will be generated to identify your instance, and sent to the
          <code>STATS_ENDPOINT</code>. No other data will be sent. This helps Mailu developers to
          understand how often Mailu and its forks are used over time, and to rate its popularity.
        </p>
      {/snippet}
      <Item
        type="radio"
        bind:group={options.enableStats}
        value={true}
        title="Yes"
        description="Enable statistics to help improve Mailu."
      />
      <Item
        type="radio"
        bind:group={options.enableStats}
        value={false}
        title="No"
        description="Disable statistics."
      />
      {#snippet hint()}
        {#if options.enableStats}
          <p>
            Anonymous statistics will be collected to help improve Mailu.<br />
            You can opt-out at any time by setting the <code>DISABLE_STATISTICS</code> variable in
            <code>mailu.env</code>.
          </p>
        {:else}
          No statistics will be collected.
        {/if}
      {/snippet}
    </Step>
    <Step id="webmailType" title="Webmail" description="Which webmail client do you want to use?">
      {#snippet details()}
        <p>
          A webmail client is a web interface exposing an email client. Mailu webmails are bound to
          the internal IMAP and SMTP server for users to access their mailbox through the web. By
          exposing a complex application such as a webmail, you should be aware of the security
          implications caused, such as an increase of attack surface. Also, the resource usage will
          increase.
        </p>
      {/snippet}
      <Item type="radio" bind:group={options.webmailType} value="roundcube" title="Roundcube">
        {#snippet description()}
          Use <a href="https://roundcube.net" target="_blank">Roundcube</a> as the webmail client.
        {/snippet}
      </Item>
      <Item type="radio" bind:group={options.webmailType} value="snappymail" title="SnappyMail">
        {#snippet description()}
          Use <a href="https://snappymail.eu" target="_blank">SnappyMail</a> as the webmail client.
        {/snippet}
      </Item>
      <Item type="radio" bind:group={options.webmailType} value="none" title="Disable webmail">
        {#snippet description()}
          Do not install a webmail client.
        {/snippet}
      </Item>
      {#snippet hint()}
        {#if options.webmailType === 'roundcube' || options.webmailType === 'snappymail'}
          {#if options.webmailType === 'roundcube'}
            <p>
              Roundcube will be installed as the webmail client. You can access it at <code
                >/webmail</code
              >.
            </p>
          {:else}
            <p>
              SnappyMail will be installed as the webmail client. You can access it at <code
                >/webmail</code
              >.
            </p>
          {/if}
        {:else if options.webmailType === 'none'}
          <p>
            No webmail client will be installed. A third-party email client like
            <a href="https://www.thunderbird.net/en-US/" target="_blank">Mozilla Thunderbird</a> will
            be required to access your emails.
          </p>
        {/if}
      {/snippet}
    </Step>
    <Step
      id="extraServices"
      title="Optional Services"
      description="Enable optional services to extend the functionality of Mailu."
    >
      {#snippet details()}
        <p>
          Optional services are additional services that can be enabled to extend the functionality
          of Mailu. These services are not required for Mailu to function, but they can be useful in
          certain scenarios.
        </p>
        <section>
          <h5>Optional services:</h5>
          <dl>
            <dt>Antivirus</dt>
            <dd>
              An antivirus server helps fighting large scale virus spreading campaigns that leverage
              e-mail for initial infection. Make sure that you have at least 1GB of memory for
              ClamAV to load its signature database.
            </dd>
            <dt>CalDAV/CardDAV</dt>
            <dd>
              CalDAV and CardDAV are protocols that allow you to synchronize your calendar and
              contacts with your devices. Enabling this service will allow you to use your Mailu
              account with calendar and contact apps that support these protocols.
            </dd>
            <dt>Email fetching</dt>
            <dd>
              Fetchmail is a utility that retrieves e-mail from a remote server and forwards it to
              your Mailu account. This can be useful if you have multiple e-mail accounts and want
              to consolidate them in one place.
            </dd>
            <dt>Macro scanning</dt>
            <dd>
              Oletools scans documents in email attachments for malicious macros. It has a much
              lower memory footprint than a full-fledged anti-virus.
            </dd>
            <dt>Full-text search</dt>
            <dd>
              Tika enables the functionality for searching through attachments. Tika scans documents
              in email attachments, process (OCR, keyword extraction) and then index them in a way
              they can be efficiently searched. This requires significant resources (RAM, CPU and
              storage).
            </dd>
          </dl>
        </section>
      {/snippet}
      <Item type="checkbox" bind:value={options.enableAntivirus} title="Antivirus">
        {#snippet description()}
          Helps fight large scale virus campaigns that leverage e-mail for initial infection. Uses <a
            href="https://www.clamav.net"
            target="_blank">ClamAV</a
          >.
        {/snippet}
      </Item>
      <Item type="checkbox" bind:value={options.enableWebdav} title="CalDAV/CardDAV">
        {#snippet description()}
          Allows you to synchronize your calendar and contacts with your devices. Uses <a
            href="https://radicale.org/v3.html"
            target="_blank">Radicale</a
          >.
        {/snippet}
      </Item>
      <Item type="checkbox" bind:value={options.enableFetchmail} title="Email fetching">
        {#snippet description()}
          Retrieves e-mail from a remote server and forwards it to your Mailu account. Uses <a
            href="https://www.fetchmail.info"
            target="_blank">Fetchmail</a
          >.
        {/snippet}
      </Item>
      <Item type="checkbox" bind:value={options.enableOletools} title="Macro scanning">
        {#snippet description()}
          Scans documents in email attachments for malicious macros. Uses <a
            href="https://rspamd.com/doc/modules/external_services.html#oletools-specific-details"
            target="_blank">Oletools</a
          >.
        {/snippet}
      </Item>
      <Item type="checkbox" bind:value={options.enableTika} title="Full-text search">
        {#snippet description()}
          Enables the functionality for searching through attachments. Uses <a
            href="https://tika.apache.org"
            target="_blank">Tika</a
          >.
        {/snippet}
      </Item>
      {#snippet hint()}
        {#if options.enableAntivirus || options.enableTika}
          {#if options.enableAntivirus && options.enableTika}
            <span class="badge text-bg-danger">Danger</span> Enabling both Antivirus and Tika will require
            significant resources (RAM, CPU and storage).
          {:else if options.enableAntivirus}
            <span class="badge text-bg-warning">Warning</span> Make sure that you have at least 1GB of
            memory for ClamAV to load its signature database.
          {:else if options.enableTika}
            <span class="badge text-bg-warning">Warning</span> Enabling Tika will require significant
            resources (RAM, CPU and storage).
          {/if}
        {:else if !options.enableAntivirus && !options.enableWebdav && !options.enableFetchmail && !options.enableTika}
          {#if options.enableOletools}
            The default configuration will be used.
          {:else}
            No optional services will be enabled.
          {/if}
        {/if}
      {/snippet}
    </Step>
    <Step id="enableAPI" title="RESTful API" description="Do you want to enable the RESTful API?">
      {#snippet details()}
        <p>
          The RESTful API allows you to interact with Mailu programmatically. You can use the API to
          perform the same actions as you would through the web interface. This is useful if you
          want to automate tasks or integrate Mailu with other services.
        </p>
      {/snippet}
      <Item
        type="radio"
        bind:group={options.enableAPI}
        value={true}
        title="Yes, enable API"
        description="Enable the RESTful API."
      />
      <Item
        type="radio"
        bind:group={options.enableAPI}
        value={false}
        title="No"
        description="Disable the RESTful API."
      />
      {#snippet hint()}
        {#if options.enableAPI}
          The RESTful API will be enabled. You can access the API at <code>/api</code>.
        {:else}
          The RESTful API will be disabled.
        {/if}
      {/snippet}
    </Step>
  </Setup>
  <div class="d-flex flex-column justify-content-center gap-5">
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
  :global(.shiki) {
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
