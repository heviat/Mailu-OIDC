<script lang="ts" context="module">
  interface Options {
    domain?: string;
    postmaster?: string;
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
  id="mailDomain"
  title="Main Account"
  description="Define the main email domain and postmaster account."
>
  {#snippet details()}
    <p>
      The main email domain is the primary domain you want to use for your emails. You can add
      additional domains later. The main domain will be used as the display name of the server.
    </p>
    <p>
      The postmaster account is the first account that will be created. It is used as the admin
      account and is the default account for system notifications.
    </p>
  {/snippet}
  <Item title="Main Email Domain" description="The primary domain you want to use for your emails.">
    <Input bind:value={options.domain} />
  </Item>
  <Item title="Postmaster" description="The email address of the postmaster/administrator.">
    <Input bind:value={options.postmaster} />
  </Item>
  {#snippet hint()}
    A{#if ['a', 'e', 'i', 'o', 'u'].includes(options.postmaster?.charAt(0) ?? 'z')}n{/if}
    <code>{options.postmaster}@{options.domain}</code> account will be created.
  {/snippet}
</Step>
