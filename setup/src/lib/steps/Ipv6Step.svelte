<script lang="ts" context="module">
  interface Options {
    enableIpv6?: boolean;
    bind6?: string;
    subnet6?: string;
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
  id="ipv6"
  title="Experimental IPv6"
  description="Do you want to enable experimental IPv6 support?"
>
  {#snippet details()}
    <p>
      Choose the IP address the server should listen on. Usually, this should be the public IP
      address of the server. In case you need to specify a local IP address, please avoid using
      <code>::</code> or other addresses targeting multiple interfaces.
    </p>
    <p>
      The Docker subnet is used to create a private network for the containers. This should not
      conflict with other networks on the server. The default value is <code>fdf7:2c36:9328:beef::/64</code>.
    </p>
  {/snippet}
  <Item type="radio" bind:group={options.enableIpv6} value={true} title="Yes, enable IPv6">
    {#snippet description()}
      Enable IPv6 support. <strong>Not recommended!</strong>
    {/snippet}
    <Input title="IPv6 Address" bind:value={options.bind6} />
    <Input title="Docker Subnet" bind:value={options.subnet6} />
  </Item>
  <Item type="radio" bind:group={options.enableIpv6} value={false} title="No" description="Disable IPv6 support." />
  {#snippet hint()}
    {#if options.enableIpv6}
      <span class="badge text-bg-danger">Read this:</span> Docker currently does not expose the IPv6
      ports properly, as it does not interface with <code>ip6tables</code>. Read
      <a href="https://mailu.io/2024.06/faq.html#how-to-make-ipv6-work" target="_blank">FAQ section</a>
      and be very careful. We do <strong>NOT</strong> recommend that you enable this!
    {/if}
  {/snippet}
</Step>
