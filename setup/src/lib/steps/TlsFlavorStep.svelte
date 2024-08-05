<script lang="ts" context="module">
  interface Options {
    root?: string;
    tlsFlavor?: string;
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

<Step id="tlsFlavor" title="TLS Flavor" description="How do you want to handle TLS certificates?">
  {#snippet details()}
    <p>
      TLS certificates are used to encrypt the connection between your users and the server. It is
      highly recommended to use TLS certificates.
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
        <code>{options.root ?? '/mailu'}/certs/cert.pem</code> and
        <code>{options.root ?? '/mailu'}/certs/key.pem</code>
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
