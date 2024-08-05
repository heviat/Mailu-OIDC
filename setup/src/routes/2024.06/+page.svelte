<script lang="ts" context="module">
  import { defaults, type MailuOptions } from './files/types';
</script>

<script lang="ts">
  import GeneratedFiles from '$lib/components/GeneratedFiles.svelte';
  import Setup from '$lib/components/Setup.svelte';
  import DockerOrgStep from '$lib/steps/DockerOrgStep.svelte';
  import EnableApiStep from '$lib/steps/EnableApiStep.svelte';
  import EnableStatsStep from '$lib/steps/EnableStatsStep.svelte';
  import MailDomainStep from '$lib/steps/MailDomainStep.svelte';
  import OptionalServicesStep from '$lib/steps/OptionalServicesStep.svelte';
  import RateLimitStep from '$lib/steps/RateLimitStep.svelte';
  import RootStep from '$lib/steps/RootStep.svelte';
  import TlsFlavorStep from '$lib/steps/TlsFlavorStep.svelte';
  import WebmailTypeStep from '$lib/steps/WebmailTypeStep.svelte';
  import { generateDockerComposeYml } from './files/docker-compose.yml/builder';
  import { generateMailuEnv } from './files/mailu.env/builder';

  let options: Partial<MailuOptions> = $state({
    ...defaults,
    rateLimit: {
      authIP: defaults.rateLimit?.authIP ?? 5,
      authUser: defaults.rateLimit?.authUser ?? 50,
      message: defaults.rateLimit?.message ?? 200,
    },
  });
  let inputs = $state({
    root: '/opt/mailu',
    rateLimit: {
      authIP: defaults.rateLimit?.authIP ?? 5,
      authUser: defaults.rateLimit?.authUser ?? 50,
      message: defaults.rateLimit?.message ?? 200,
    },
  });
</script>

<div class="container mt-5">
  <h1>Mailu Setup</h1>
  <Setup for={options}>
    <DockerOrgStep bind:options {defaults} />
    <RootStep bind:options bind:inputs />
    <MailDomainStep bind:options />
    <TlsFlavorStep bind:options />
    <RateLimitStep bind:options {defaults} bind:inputs />
    <EnableStatsStep bind:options />
    <WebmailTypeStep bind:options />
    <OptionalServicesStep bind:options />
    <EnableApiStep bind:options />
  </Setup>
  <div class="d-flex flex-column justify-content-center gap-5">
    <GeneratedFiles {generateDockerComposeYml} {generateMailuEnv} {options} />
  </div>
</div>
