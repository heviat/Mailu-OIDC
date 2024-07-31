<script lang="ts" context="module">
  import type { Snippet } from 'svelte';
  import { default as Input, type Input as InputRune } from './Input.svelte';

  export interface Props<T, K extends keyof T> {
    id: K;
    title?: string;
    description?: string;
    details?: string;
    options: { value: T[K] | InputRune; title: string; description?: string }[];
    storage: T;
    hint?: (value: T[K] | undefined, storage: Partial<T>) => string;
    stepNav: Snippet<['primary' | 'secondary', string, number]>;
    value?: string | number | boolean;
  }
</script>

<script lang="ts">
  import ListGroup from "./ListGroup.svelte";
  import Icon from './Icon.svelte';

  let {
    id,
    title,
    description,
    details,
    options,
    storage = $bindable(),
    hint,
    stepNav,
    value = $bindable(),
  }: Props<Record<string, any>, any> = $props();

  $effect(() => {
    if (value !== undefined) {
      // Focus the input element if the new option has an input
      const input = options.find(
        option => typeof option.value === 'object' && option.value.value === value
      )?.value as InputRune;
      input?.focus();
    } else {
      // Set the default value
      value = typeof options[0].value === 'object' ? options[0].value.value : options[0].value;
    }
  });
</script>

<div class="card p-5 text-center mt-5">
  <header class="py-2">
    <h3 class="fw-semibold">
      {title}
      {#if details}
        &nbsp;<a class="info-button" data-bs-toggle="collapse" href="#moreDetails" role="button" aria-expanded="false" aria-controls="moreDetails"><Icon id="info-circle" /></a>
      {/if}
    </h3>
    {#if description}
      <p class="opacity-75">{description}</p>
    {/if}
    {#if details}
      <div class="collapse" id="moreDetails">
        <div class="card border-info text-start">
          <div class="card-header text-bg-info">More Details</div>
          <div class="card-body">
            {@html details}
          </div>
        </div>
      </div>
    {/if}
  </header>
<!--
  <div class="list-group list-group-radio d-grid gap-2 border-0">
    {#each options as { value: optionValue, title, description }, i}
      {@const inputValue = typeof optionValue === 'object' ? optionValue.value : optionValue}
      <div class="position-relative text-start">
        <input
          class="form-check-input position-absolute top-50 end-0 me-3 fs-5"
          type="radio"
          name={id}
          id="{id}{i + 1}"
          value={inputValue}
          bind:group={value}
        />
        <label class="list-group-item py-3 pe-5" for="{id}{i + 1}">
          <strong class="fw-semibold">{title}</strong>
          {#if description}
            <span class="d-block small opacity-75">{@html description}</span>
          {/if}
          {#if typeof optionValue === 'object'}
            <div class="px-2 py-4" class:d-none={value !== inputValue}>
              <Input
                {...optionValue.input}
                oninput={() => {
                  value = optionValue.value;
                }}
                bind:value={optionValue.value}
                bind:element={optionValue.element}
              />
            </div>
          {/if}
        </label>
      </div>
    {/each}
  </div>
-->
  <ListGroup type="radio" {id} bind:options bind:storage />

  <div class="mt-3">
    {#if hint}
      <p class="opacity-75">{@html hint(value, storage)}</p>
    {/if}
    <div class="prevnext d-flex justify-content-between mt-4">
      {@render stepNav('secondary', 'Back', -1)}
      {@render stepNav('primary', 'Next', 1)}
    </div>
  </div>
</div>

<style>
  .info-button {
    font-size: 1.5rem;
    width: 1.25em;
    height: 1.25em;
    margin: 0;
    padding: 0.1em;
    line-height: 1.15em;
    background-color: var(--bs-body);
    border: 0;
    border-radius: 50%;
    color: var(--bs-info);
    transition: background-color 0.15s;
  }

  .info-button:hover {
    background-color: var(--bs-secondary-bg);
  }

  #moreDetails {
    width: 100%;
    max-width: 640px;
    margin: 1rem auto;
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
