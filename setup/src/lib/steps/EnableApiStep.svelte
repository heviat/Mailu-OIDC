<script lang="ts" context="module">
  interface Options {
    enableAPI?: boolean;
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

<Step id="enableAPI" title="RESTful API" description="Do you want to enable the RESTful API?">
  {#snippet details()}
    <p>
      The RESTful API allows you to interact with Mailu programmatically. You can use the API to
      perform the same actions as you would through the web interface. This is useful if you want to
      automate tasks or integrate Mailu with other services.
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
