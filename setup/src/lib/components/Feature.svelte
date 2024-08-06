<script lang="ts" context="module">
  import type { IconId } from './Icons.svelte';

  export interface Props {
    title: string;
    description: string;
    logo?: string;
    icon?: IconId;
    alt?: string;
  }
</script>

<script lang="ts">
  import Icon from './Icon.svelte';

  let { title, description, logo, icon, alt }: Props = $props();
</script>

<div class="col d-flex align-items-start">
  <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
    {#if icon}
      <Icon id={icon} />
    {/if}
    {#if logo}
      <img src={logo} {alt} />
    {/if}
  </div>
  <div>
    <h3 class="fs-5 text-body-emphasis">{title}</h3>
    <p>{description}</p>
  </div>
</div>

<style>
  img {
    min-height: 1px;
    min-width: 1px;
    max-height: 2rem;
    max-width: 2rem;
  }
  .icon-square {
    width: 3rem;
    height: 3rem;
    border-radius: .75rem;
  }
</style>
