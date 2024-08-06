<script lang="ts" context="module">
  import { setContext, type Snippet } from 'svelte';

  export interface Props {
    id: string;
    children?: Snippet<[]>;
  }
</script>

<script lang="ts">
  let { id, children: items }: Props = $props();

  setContext('accordion-id', id);
</script>

<div class="accordion accordion-flush" {id}>
  {#if items}
    {@render items()}
  {/if}
</div>

<style>
  .accordion {
    --bs-accordion-active-bg: rgba(0, 0, 0, 0.125);
  }
</style>
