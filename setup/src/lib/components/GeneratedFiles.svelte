<script lang="ts" context="module">
  import { createHighlighter } from 'shiki';

  const highlighter = await createHighlighter({
    themes: ['one-dark-pro', 'one-light'],
    langs: ['yaml', 'properties'],
  });
  const highlight = (code: string, lang: string) =>
    highlighter.codeToHtml(code, { themes: { light: 'one-light', dark: 'one-dark-pro' }, lang });

  export interface Props<T = any> {
    generateDockerComposeYml: (options: T) => object;
    generateMailuEnv: (options: T) => string;
    options: T;
  }
</script>

<script lang="ts">
  import { stringify } from 'yaml';

  let { generateDockerComposeYml, generateMailuEnv, options }: Props = $props();
</script>

<section>
  <header class="py-2">
    <h3 class="fw-semibold">Generated Configuration</h3>
    <p class="opacity-75">
      Here you can check the generated files. When you completed all the steps, download links will
      be generated so you can download them directly from the server you're going to install Mailu
      to.
    </p>
  </header>

  <details class="d-none d-md-block">
    <summary>Included Docker containers</summary>
    ...
  </details>
  <details class="d-none d-md-block">
    <summary>Generated <code>docker-compose.yml</code></summary>
    {@html highlight(stringify(generateDockerComposeYml(options)), 'yaml')}
  </details>
  <details class="d-none d-md-block">
    <summary>Generated <code>mailu.env</code></summary>
    {@html highlight(generateMailuEnv(options), 'properties')}
  </details>
</section>

<style>
  :global(.shiki) {
    width: 100%;
    max-width: 460px;
    padding: 1rem;
  }
  :global(html[data-bs-theme='dark'] .shiki),
  :global(html[data-bs-theme='dark'] .shiki span) {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
</style>
