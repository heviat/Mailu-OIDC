<script lang="ts" context="module">
  import { getContext, type Snippet } from 'svelte';

  export type Props = {
    title: string;
    description?: string | Snippet<[]>;
    children?: Snippet<[]>;
  } & (
    | {
        type: 'radio';
        group: any;
        value: any;
      }
    | {
        type: 'checkbox';
        group?: true;
        value?: boolean;
      }
    | {
        type?: 'other';
        group?: true;
        value?: true;
      }
  );
</script>

<script lang="ts">
  import StringOrSnippet from './StringOrSnippet.svelte';

  let {
    type = 'other',
    group = $bindable(),
    value = $bindable(),
    title,
    description,
    children: inputs,
  }: Props = $props();

  const id = getContext<string>('step-id');
  const i = Math.floor(Math.random() * 10000);

  let inputsContainer = $state<HTMLDivElement>();
  export const focus = () => {
    const input = inputsContainer?.querySelector('input');
    if (!input) return;

    window.requestAnimationFrame(() => {
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    });
  };
  let hidden = $derived.by(() => {
    if (!inputs || !inputsContainer) return true;
    if (type === 'other') return false;

    const isActive = type === 'checkbox' ? value : value === group;
    const isFocused =
      !!document.activeElement &&
      inputsContainer.contains(document.activeElement) &&
      document.activeElement.tagName === 'INPUT';

    if (isActive && !isFocused) focus();

    return !isActive && !isFocused;
  });
</script>

{#snippet content()}
  <strong class="fw-semibold">{title}</strong>
  {#if description}
    <span class="d-block small opacity-75">
      <StringOrSnippet value={description} />
    </span>
  {/if}
  {#if inputs}
    <div bind:this={inputsContainer} class="px-2 py-4" class:d-none={hidden}>
      {@render inputs()}
    </div>
  {/if}
{/snippet}

<div class="position-relative text-start">
  {#if type === 'radio'}
    <input
      class="form-check-input position-absolute top-50 end-0 me-3 fs-5"
      type="radio"
      name={id}
      id="{id}{i}"
      {value}
      bind:group
      tabindex={0}
    />
  {:else if type === 'checkbox'}
    <input
      class="form-check-input position-absolute top-50 left-0 ms-3 fs-5"
      type="checkbox"
      name={id}
      id="{id}{i}"
      bind:checked={value}
      tabindex={0}
    />
  {/if}
  {#if type === 'radio' || type === 'checkbox'}
    <label class="list-group-item py-3 {type === 'radio' ? 'pe-5' : 'ps-5'}" for="{id}{i}">
      {@render content()}
    </label>
  {:else}
    <button class="w-100 list-group-item py-3" onclick={focus}>
      {@render content()}
    </button>
  {/if}
</div>

<style>
  .form-check-input {
    z-index: 2;
    margin-top: -0.5em;
  }
  .list-group-item {
    cursor: pointer;
    border-radius: 0.5rem;
  }
  .list-group-item:hover,
  .list-group-item:focus {
    background-color: var(--bs-secondary-bg);
  }
  .form-check-input:checked + .list-group-item {
    background-color: var(--bs-body);
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 2px var(--bs-primary);
  }
  .form-check-input:disabled + .list-group-item {
    pointer-events: none;
    filter: none;
    opacity: 0.5;
  }
</style>
