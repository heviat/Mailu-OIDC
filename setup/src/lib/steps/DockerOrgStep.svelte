<script lang="ts" context="module">
  interface Options {
    dockerOrg?: string;
  }
  interface Props {
    options: Options;
    defaults: Options;
  }
</script>

<script lang="ts">
  import Item from '../components/Item.svelte';
  import Step from '../components/Step.svelte';

  let { options = $bindable(), defaults }: Props = $props();
</script>

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
  <Item type="radio" bind:group={options.dockerOrg} value="ghcr.io/heviat" title="Yes, enable OIDC">
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
      Your configuration will still contain the OIDC settings, so you can easily switch to OIDC in the
      future.
    {/if}
  {/snippet}
</Step>
