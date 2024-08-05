<script lang="ts" context="module">
  interface Options {
    enableStats?: boolean;
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
