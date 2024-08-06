<script lang="ts" context="module">
  interface Options {
    enableAPI?: boolean;
    apiToken?: string;
  }
  interface Props {
    options: Options;
  }
</script>

<script lang="ts">
  import Input from '$lib/components/Input.svelte';
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
  >
    <Input title="API token" bind:value={options.apiToken} />
  </Item>
  <Item
    type="radio"
    bind:group={options.enableAPI}
    value={false}
    title="No"
    description="Disable the RESTful API."
  />
  {#snippet hint()}
    {#if options.enableAPI}
      <p>
        The RESTful API will be enabled. You can access the API at <code>/api</code>.
      </p>
      <p>
        The API token can also be changed later in the <code>mailu.env</code> file.
      </p>
    {:else}
      The RESTful API will be disabled.
    {/if}
  {/snippet}
</Step>
