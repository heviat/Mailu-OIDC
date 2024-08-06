<script lang="ts" context="module">
  import { createHighlighter } from 'shiki';

  const highlighter = await createHighlighter({
    themes: ['one-dark-pro', 'one-light'],
    langs: ['yaml', 'properties'],
  });
  const highlight = (code: string, lang: string) =>
    highlighter.codeToHtml(code, { themes: { light: 'one-light', dark: 'one-dark-pro' }, lang });

  export interface Props<T = any> {
    generateDockerComposeYml: (options: T) => object;
    generateMailuEnv: (options: T) => string;
    options: T;
  }
</script>

<script lang="ts">
  import { stringify } from 'yaml';
  import Accordion from './Accordion.svelte';
  import AccordionItem from './AccordionItem.svelte';
  import Feature from './Feature.svelte';

  let { generateDockerComposeYml, generateMailuEnv, options }: Props = $props();
</script>

<section class="mt-5">
  <header class="py-2">
    <h2 class="fw-semibold">Generated Configuration</h2>
    <p class="opacity-75">
      Here you can check the generated files. When you completed all the steps, download links will
      be generated so you can download them directly from the server you're going to install Mailu
      to.
    </p>
  </header>

  <Accordion id="generatedContent">
    <AccordionItem title="Included Docker containers">
      <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <Feature title="redis" description="In-memory data structure store, used as a database, cache, and message broker." logo="/img/redis.svg" alt="Redis logo" />
        <Feature title="front (nginx)" description="Web server and reverse proxy server." logo="/img/nginx.svg" alt="Nginx logo" />
        {#if options.enableResolver}
          <Feature title="resolver (unbound)" description="Validating, recursive, and caching DNS resolver." logo="/img/unbound.svg" alt="Unbound logo" />
        {/if}
        <Feature title="admin" description="Mailu administration interface." logo="/img/flask.svg" alt="Admin logo" />
        <Feature title="imap (dovecot)" description="IMAP and POP3 server." logo="/img/dovecot.svg" alt="Dovecot logo" />
        <Feature title="smtp (postfix)" description="SMTP server." logo="/img/postfix.svg" alt="Postfix logo" />
        {#if options.enableOletools}
          <Feature title="oletools" icon="arrow-left-right" description="Macro scanning for malicious documents." />
        {/if}
        {#if options.enableTika}
          <Feature title="fts_attachments (tika)" description="Full-text search for attachments using Apache Tika." logo="/img/tika.svg" alt="Tika logo" />
        {/if}
        <Feature title="antispam (rspamd)" description="Fast, free, and open-source spam filtering system." logo="/img/rspamd.svg" alt="Rspamd logo" />
        {#if options.enableAntivirus}
          <Feature title="antivirus (clamav)" description="Open-source antivirus engine." logo="/img/clamav.svg" alt="ClamAV logo" />
        {/if}
        {#if options.enableWebdav}
          <Feature title="webdav (radicale)" description="CalDAV and CardDAV server." logo="/img/radicale.svg" alt="Radicale logo" />
        {/if}
        {#if options.enableFetchmail}
          <Feature title="fetchmail" description="Mail retrieval and forwarding utility." logo="/img/fetchmail.png" alt="Fetchmail logo" />
        {/if}
        {#if options.webmailType === 'roundcube'}
          <Feature title="webmail (roundcube)" description="Browser-based multilingual IMAP client." logo="/img/roundcube.svg" alt="Roundcube logo" />
        {/if}
        {#if options.webmailType === 'snappymail'}
          <Feature title="webmail (snappymail)" description="Modern webmail client." logo="/img/snappymail.svg" alt="Snappymail logo" />
        {/if}
      </div>
    </AccordionItem>
    <AccordionItem>
      {#snippet title()}
        <span>
          Generated <code>docker-compose.yml</code>
        </span>
      {/snippet}
      {@html highlight(stringify(generateDockerComposeYml(options)), 'yaml')}
    </AccordionItem>
    <AccordionItem>
      {#snippet title()}
        <span>
          Generated <code>mailu.env</code>
        </span>
      {/snippet}
      {@html highlight(generateMailuEnv(options), 'properties')}
    </AccordionItem>
  </Accordion>
</section>

<style>
  :global(.shiki) {
    width: 100%;
    padding: 1rem;
  }
  :global(html[data-bs-theme='dark'] .shiki),
  :global(html[data-bs-theme='dark'] .shiki span) {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
</style>
