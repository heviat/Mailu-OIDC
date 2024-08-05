<script lang="ts" context="module">
  interface Options {
    webmailType?: string;
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

<Step id="webmailType" title="Webmail" description="Which webmail client do you want to use?">
  {#snippet details()}
    <p>
      A webmail client is a web interface exposing an email client. Mailu webmails are bound to the
      internal IMAP and SMTP server for users to access their mailbox through the web. By exposing a
      complex application such as a webmail, you should be aware of the security implications
      caused, such as an increase of attack surface. Also, the resource usage will increase.
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
        <a href="https://www.thunderbird.net/en-US/" target="_blank">Mozilla Thunderbird</a> will be
        required to access your emails.
      </p>
    {/if}
  {/snippet}
</Step>
