<script lang="ts" context="module">
  import type { IconId } from './Icons.svelte';

  export interface Props {
    id: IconId;
    class?: string;
    block?: boolean;
  }
</script>

<script lang="ts">
  import { addIcon } from './Icons.svelte';

  let { id, class: className, block = false }: Props = $props();

  addIcon(id);
</script>

<svg class="bi {className}" width="1em" height="1em" style:display={block ? 'block!important' : ''}>
  <use href="#{id}"></use>
</svg>

<style>
  .bi {
    vertical-align: -0.125em;
    fill: currentColor;
  }
</style>
