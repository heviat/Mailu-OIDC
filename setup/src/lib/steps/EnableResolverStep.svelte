<script lang="ts" context="module">
  interface Options {
    enableResolver?: boolean;
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

<Step id="enableResolver" title="Internal Resolver" description="Do you want to enable the internal DNS resolver?">
  {#snippet details()}
    <p>
      The unbound resolver enables Mailu to do DNSSEC verification, DNS root lookups and caching.
      This also helps the antispam service not to get blocked by the public or ISP DNS servers.
    </p>
  {/snippet}
  <Item
    type="radio"
    bind:group={options.enableResolver}
    value={true}
    title="Yes, enable resolver"
    description="Enable the internal DNS resolver."
  />
  <Item
    type="radio"
    bind:group={options.enableResolver}
    value={false}
    title="No"
    description="Disable the internal DNS resolver."
  />
  {#snippet hint()}
    {#if options.enableResolver}
      An internal DNS resolver will be enabled.
    {:else}
      The DNS resolver of the server or ISP will be used.
    {/if}
  {/snippet}
</Step>
