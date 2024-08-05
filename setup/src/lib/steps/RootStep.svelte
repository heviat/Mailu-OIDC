<script lang="ts" context="module">
  interface Options {
    root?: string;
  }
  interface Props {
    options: Options;
    inputs: Options;
  }
</script>

<script lang="ts">
  import Input from '../components/Input.svelte';
  import Item from '../components/Item.svelte';
  import Step from '../components/Step.svelte';

  let { options = $bindable(), inputs = $bindable() }: Props = $props();
</script>

<Step id="root" title="Installation Directory" description="Where do you want to install Mailu to?">
  <Item type="radio" bind:group={options.root} value="/mailu" title="Default location">
    {#snippet description()}
      Install Mailu in <code>/mailu</code>.
    {/snippet}
  </Item>
  <Item type="radio" bind:group={options.root} bind:value={inputs.root} title="Custom location">
    {#snippet description()}
      Install Mailu in a custom directory.
    {/snippet}
    <Input title="Custom location" bind:group={options.root} bind:value={inputs.root} />
  </Item>
  {#snippet hint()}
    Mailu will be installed in <code>{options.root}</code>.
    {#if options.root && options.root.replace(/[^/]/g, '').length > 2}
      <br />
      <span class="badge text-bg-warning">Warning</span> There is currently an
      <a href="https://github.com/Mailu/Mailu/issues/3164" target="_blank">open issue</a> with paths
      that use more than two subdirectories.
    {/if}
  {/snippet}
</Step>
