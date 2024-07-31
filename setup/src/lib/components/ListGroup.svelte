<script lang="ts" context="module">
  import type { Snippet } from 'svelte';
  import { default as Input, Input as InputRune } from './Input.svelte';

  type Value = string | number | boolean | InputRune;
  type Option<T, K extends keyof T> = { value: T[K] | InputRune | (Partial<T> & Record<keyof T, InputRune>); title: string; description?: string };

  export interface Props<T, K extends keyof T> {
    type: 'radio' | 'checkbox' | 'checkbox-array';
    id?: K;
    options: (Option<T, K> & { id?: keyof T })[];
    storage: T;
  }
</script>

<script lang="ts">
  let {
    type,
    id,
    options = $bindable(),
    storage = $bindable(),
  }: Props<Record<string, Value>, any> = $props();
</script>

<div class="list-group d-grid gap-2 border-0" class:list-group-radio={type === 'radio'}>
  {#each options as { id: optionId, value: optionValue, title, description }, i}
    {@const inputValue = optionValue instanceof InputRune ? optionValue.value : optionValue}
    {$inspect(optionValue)}
    {@const theId = optionId ?? id}
    <div class="position-relative text-start">
      {#if type === 'radio' && id}
        <input
          class="form-check-input position-absolute top-50 end-0 me-3 fs-5"
          type="radio"
          name={id}
          id="{id}{i + 1}"
          value={inputValue}
          bind:group={storage[id]}
        />
      {:else if type === 'checkbox' && optionId}
        <input
          class="form-check-input position-absolute top-50 me-3 fs-5"
          type="checkbox"
          name={optionId}
          id="{optionId}{i + 1}"
          bind:value={storage[optionId]}
        />
      {:else if type === 'checkbox-array' && id}
        <input
          class="form-check-input position-absolute top-50 me-3 fs-5"
          type="checkbox"
          id="{id}{i + 1}"
          value={inputValue}
          bind:group={storage[id]}
        />
      {/if}
      <label class="list-group-item py-3 pe-5" for="{theId}{i + 1}">
        <strong class="fw-semibold">{title}</strong>
        {#if description}
          <span class="d-block small opacity-75">{@html description}</span>
        {/if}
        {#if typeof optionValue === 'object' && theId}
          <div class="px-2 py-4" class:d-none={storage[theId] !== inputValue}>
            <!-- TODO: Check if this works correctly -->
            {#snippet input(key: string, formInput: InputRune)}
              <Input
                {...formInput.input}
                oninput={() => {
                  storage[key] = formInput.value;
                }}
                bind:value={formInput.value}
                bind:element={formInput.element}
              />
            {/snippet}
            {#if optionValue instanceof InputRune}
              {@render input(theId, optionValue)}
            {:else}<!-- optionValue is Record<keyof T, Input> -->
              {#each Object.entries(optionValue) as [key, formInput]}
                {#if formInput instanceof InputRune}
                  {@render input(key, formInput)}
                {/if}
              {/each}
            {/if}
          </div>
        {/if}
      </label>
    </div>
  {/each}
</div>

<style>
  .list-group {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
  }

  .list-group-radio .list-group-item {
    cursor: pointer;
    border-radius: 0.5rem;
  }
  .list-group-radio .form-check-input {
    z-index: 2;
    margin-top: -0.5em;
  }
  .list-group-radio .list-group-item:hover,
  .list-group-radio .list-group-item:focus {
    background-color: var(--bs-secondary-bg);
  }

  .list-group-radio .form-check-input:checked + .list-group-item {
    background-color: var(--bs-body);
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 2px var(--bs-primary);
  }
  .list-group-radio .form-check-input:disabled + .list-group-item {
    pointer-events: none;
    filter: none;
    opacity: 0.5;
  }
</style>
