<script lang="ts" context="module">
  interface Options {
    enableAntivirus?: boolean;
    enableWebdav?: boolean;
    enableFetchmail?: boolean;
    enableOletools?: boolean;
    enableTika?: boolean;
  }
  interface Props {
    options: Options;
  }
</script>

<script lang="ts">
  import Item from '../components/Item.svelte';
  import Step from '../components/Step.svelte';

  let { options = $bindable() }: Props = $props();
</script>

<Step
  id="optionalServices"
  title="Optional Services"
  description="Enable optional services to extend the functionality of Mailu."
>
  {#snippet details()}
    <p>
      Optional services are additional services that can be enabled to extend the functionality of
      Mailu. These services are not required for Mailu to function, but they can be useful in
      certain scenarios.
    </p>
    <section>
      <h5>Optional services:</h5>
      <dl>
        <dt>Antivirus</dt>
        <dd>
          An antivirus server helps fighting large scale virus spreading campaigns that leverage
          e-mail for initial infection. Make sure that you have at least 1GB of memory for ClamAV to
          load its signature database.
        </dd>
        <dt>CalDAV/CardDAV</dt>
        <dd>
          CalDAV and CardDAV are protocols that allow you to synchronize your calendar and contacts
          with your devices. Enabling this service will allow you to use your Mailu account with
          calendar and contact apps that support these protocols.
        </dd>
        <dt>Email fetching</dt>
        <dd>
          Fetchmail is a utility that retrieves e-mail from a remote server and forwards it to your
          Mailu account. This can be useful if you have multiple e-mail accounts and want to
          consolidate them in one place.
        </dd>
        <dt>Macro scanning</dt>
        <dd>
          Oletools scans documents in email attachments for malicious macros. It has a much lower
          memory footprint than a full-fledged anti-virus.
        </dd>
        <dt>Full-text search</dt>
        <dd>
          Tika enables the functionality for searching through attachments. Tika scans documents in
          email attachments, process (OCR, keyword extraction) and then index them in a way they can
          be efficiently searched. This requires significant resources (RAM, CPU and storage).
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
        <span class="badge text-bg-warning">Warning</span> Make sure that you have at least 1GB of memory
        for ClamAV to load its signature database.
      {:else if options.enableTika}
        <span class="badge text-bg-warning">Warning</span> Enabling Tika will require significant resources
        (RAM, CPU and storage).
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
