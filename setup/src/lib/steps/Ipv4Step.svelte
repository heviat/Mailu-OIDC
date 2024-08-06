<script lang="ts" context="module">
  interface Options {
    bind4?: string;
    subnet?: string;
  }
  interface Props {
    options: Options;
  }
</script>

<script lang="ts">
  import Input from '../components/Input.svelte';
  import Item from '../components/Item.svelte';
  import Step from '../components/Step.svelte';

  let { options = $bindable() }: Props = $props();
</script>

<Step
  id="ipv4"
  title="IP Address"
  description="Enter the IP address the server should listen on and the subnet for the docker network."
>
  {#snippet details()}
    <p>
      Choose the IP address the server should listen on. Usually, this should be the public IP
      address of the server. In case you need to specify a local IP address, please avoid using
      <code>0.0.0.0</code> or other addresses targeting multiple interfaces.
    </p>
    <p>
      The Docker subnet is used to create a private network for the containers. This should not
      conflict with other networks on the server. The default value is <code>192.168.203.0/24</code>.
    </p>
  {/snippet}
  <Item title="IPv4 Address" description="This should address only one network interface.">
    <Input bind:value={options.bind4} />
  </Item>
  <Item title="Docker Subnet" description="This should not conflict with other networks on the server.">
    <Input bind:value={options.subnet} />
  </Item>
  {#snippet hint()}
    {#if options.bind4 === '0.0.0.0'}
      <span class="badge text-bg-danger">Danger</span> Please use a specific IP address instead!
    {/if}
  {/snippet}
</Step>
