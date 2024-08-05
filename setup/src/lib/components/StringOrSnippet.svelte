<script lang="ts" context="module">
  import type { Snippet } from 'svelte';

  export interface Props {
    value: string | Snippet<[]>;
  }
</script>

<script lang="ts">
  let { value }: Props = $props();
</script>

{#if typeof value === 'string'}
  {value}
{:else}
  {@render value()}
{/if}
