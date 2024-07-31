<script lang="ts" context="module">
  import type { Snippet } from 'svelte';

  export interface Props {
    children: Snippet<[]>;
  }
</script>

<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

  let { children }: Props = $props();
</script>

<Icons />
<ThemeSwitcher />

{@render children()}
