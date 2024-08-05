<script lang="ts" context="module">
  import { getContext } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  export interface Props extends Omit<HTMLInputAttributes, 'id'> {
    type?: HTMLInputAttributes['type'];
    title?: string;
    description?: string;
    group?: string | number;
    value?: string | number;
  }
</script>

<script lang="ts">
  let {
    type = 'text',
    title,
    description,
    group = $bindable(),
    value = $bindable(),
    oninput,
    ...props
  }: Props = $props();

  const stepId = getContext<string>('step-id');
  const id = 'custom' + stepId.charAt(0).toUpperCase() + stepId.slice(1);
  const i = Math.floor(Math.random() * 10000);
</script>

<div class="form-group">
  {#if title}
    <label class="form-label" for="{id}{i}">{title}</label>
  {/if}
  <input
    {...props}
    class="form-control"
    {type}
    id="{id}{i}"
    placeholder={description}
    bind:value
    tabindex="0"
    oninput={event => {
      group = value;
      oninput?.(event);
    }}
  />
</div>
