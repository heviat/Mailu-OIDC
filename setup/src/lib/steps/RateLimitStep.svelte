<script lang="ts" context="module">
  interface Options {
    rateLimit?: {
      authIP: number;
      authUser: number;
      message: number;
    };
  }
  interface Props {
    options: Options;
    defaults: Options;
    inputs: Required<Options>;
  }
</script>

<script lang="ts">
  import Input from '../components/Input.svelte';
  import Item from '../components/Item.svelte';
  import Step from '../components/Step.svelte';

  let { options = $bindable(), defaults, inputs = $bindable() }: Props = $props();
</script>

<Step
  id="rateLimit"
  title="Rate Limiting"
  description="Which rate limiting settings do you want to use?"
>
  {#snippet details()}
    <p>
      Rate limiting is a security feature that helps protect your server from abuse. It limits the
      number of requests a user can make in a certain amount of time. This helps prevent brute-force
      attacks and other types of abuse.
    </p>
  {/snippet}
  <Item
    type="radio"
    bind:group={options.rateLimit}
    value={defaults.rateLimit}
    title="Default settings"
  >
    {#snippet description()}
      Use the default rate limiting settings.
    {/snippet}
  </Item>
  <Item
    type="radio"
    bind:group={options.rateLimit}
    bind:value={inputs.rateLimit}
    title="Custom settings"
  >
    {#snippet description()}
      Use custom rate limiting settings.
    {/snippet}
    <Input title="Login attempts per IP (per hour)" bind:value={inputs.rateLimit.authIP} />
    <Input title="Login attempts per user (per hour)" bind:value={inputs.rateLimit.authUser} />
    <Input title="Messages sent per user (per day)" bind:value={inputs.rateLimit.message} />
  </Item>
  {#snippet hint()}
    <p>The following rate limiting settings will be used:</p>
    <dl>
      <dt>Login attempts per IP:</dt>
      <dd>{options.rateLimit?.authIP || 0} per hour</dd>
      <dt>Login attempts per user:</dt>
      <dd>{options.rateLimit?.authUser || 0} per hour</dd>
      <dt>Messages sent per user:</dt>
      <dd>{options.rateLimit?.message || 0} per day</dd>
    </dl>
  {/snippet}
</Step>

<style>
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    text-align: left;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
  }
  dt {
    font-weight: bold;
  }
  dd {
    margin: 0;
  }
</style>
