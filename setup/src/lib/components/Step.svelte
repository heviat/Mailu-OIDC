<script lang="ts" context="module">
  import { getContext, setContext, type Snippet } from 'svelte';

  export interface Props<T, K extends keyof T> {
    id: K;
    type?: 'radio' | 'checkbox';
    title?: string;
    description?: Snippet<[]> | string;
    details?: Snippet<[]> | string;
    hint?: Snippet<[]>;
    children?: Snippet<[]>;
  }
</script>

<script lang="ts">
  import Icon from './Icon.svelte';
  import type { SetupContext } from './Setup.svelte';
  import StringOrSnippet from './StringOrSnippet.svelte';

  let {
    id,
    type = 'radio',
    title,
    description,
    details,
    hint,
    children: items,
  }: Props<Record<string, any>, any> = $props();

  setContext('step-id', id);

  let ctx = getContext<SetupContext>('setup');
  ctx.steps.push({ id, hint });
</script>

{#if ctx.currentStep?.id === id}
  <header class="py-2">
    <h3 class="fw-semibold">
      {title}
      {#if details}
        &nbsp;<a
          class="info-button"
          data-bs-toggle="collapse"
          href="#moreDetails"
          role="button"
          aria-expanded="false"
          aria-controls="moreDetails"><Icon id="info-circle" /></a
        >
      {/if}
    </h3>
    {#if description}
      <p class="opacity-75">
        <StringOrSnippet value={description} />
      </p>
    {/if}
    {#if details}
      <div class="collapse" id="moreDetails">
        <div class="card border-info text-start">
          <div class="card-header text-bg-info">More Details</div>
          <div class="card-body">
            <StringOrSnippet value={details} />
          </div>
        </div>
      </div>
    {/if}
  </header>
  <div class="list-group d-grid gap-2 border-0">
    {#if items}
      {@render items()}
    {/if}
  </div>
{/if}

<style>
  .list-group {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
  }

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
</style>
