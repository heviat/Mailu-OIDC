<script lang="ts" context="module">
  import type { Snippet } from 'svelte';
  import { default as Input, type Input as InputRune } from './Input.svelte';

  export interface Props {
    type: 'radio' | 'checkbox';
    name: string;
    index: number;
    itemValue?: string | number;
    value?: string | number | undefined;
    input?: InputRune;
    title: string;
    description?: string;
  }
</script>

<script lang="ts">
  let { type, name, index, itemValue, value = $bindable(), input, title, description }: Props = $props();
</script>

<div class="position-relative text-start">
  <input
    class="form-check-input position-absolute top-50 end-0 me-3 fs-5"
    {type}
    {name}
    id="{name}{index}"
    value={itemValue}
    onchange={(e: Event) => {
      const target = e.target as HTMLInputElement;
      value = target.checked ? target.value : undefined;
    }}
  />
  <label class="list-group-item py-3 pe-5" for="{name}{index}">
    <strong class="fw-semibold">{title}</strong>
    {#if description}
      <span class="d-block small opacity-75">{@html description}</span>
    {/if}
    {#if input}
      <div class="px-2 py-4" class:d-none={value !== itemValue}>
        <!-- TODO: Check if this works correctly -->
        <Input
          {...input.input}
          oninput={() => {
            value = itemValue = input.value;
          }}
          bind:value={input.value}
          bind:element={input.element}
        />
      </div>
    {/if}
  </label>
</div>