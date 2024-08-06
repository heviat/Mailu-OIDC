<script lang="ts" context="module">
  import { getContext, type Snippet } from 'svelte';

  export interface Props {
    title: string | Snippet<[]>;
    children?: Snippet<[]>;
  }
</script>

<script lang="ts">
  import StringOrSnippet from './StringOrSnippet.svelte';

  let { title, children: content }: Props = $props();

  const id = getContext<string>('accordion-id');
  const i = Math.floor(Math.random() * 10000);
</script>

<div class="accordion-item">
  <h2 class="accordion-header">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#{id}{i}" aria-expanded="false" aria-controls="{id}{i}">
      <StringOrSnippet value={title} />
    </button>
  </h2>
  <div id="{id}{i}" class="accordion-collapse collapse" data-bs-parent="#{id}">
    <div class="accordion-body">
      {#if content}
        {@render content()}
      {/if}
    </div>
  </div>
</div>