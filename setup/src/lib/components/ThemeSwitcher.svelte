<!--
  @component
  Theme switcher

  Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)

  @copyright 2011-2024 The Bootstrap Authors
  @license Creative Commons Attribution 3.0 Unported License.
  @author Luca Bosin (https://bosin.ch) (adapted to Svelte+TS)

  @example
  ```svelte
  <ThemeSwitcher />
  ```

  @example
  ```svelte
  <ThemeSwitcher label="Change theme" />
  ```
-->

<script lang="ts" context="module">
  /**
   * Theme options
   *
   * - `light`: Light theme
   * - `dark`: Dark theme
   * - `auto`: Light or dark theme based on the user's system preferences
   */
  export type Theme = 'light' | 'dark' | 'auto';

  /**
   * Properties for the `ThemeToggle` component
   */
  export interface Props {
    /**
     * Label for the theme toggle button
     *
     * @default "Toggle theme"
     */
    label?: string;
  }
</script>

<script lang="ts">
  import Icon from './Icon.svelte';
  import type { IconId } from './Icons.svelte';

  const themeIcons: Record<Theme, IconId> = {
    light: 'sun-fill',
    dark: 'moon-stars-fill',
    auto: 'circle-half',
  };

  let { label = 'Toggle theme' }: Props = $props();
  let theme = $state<Theme>('auto');
  let themeSwitcher: HTMLButtonElement;
  let matcher: MediaQueryList;

  // This effect runs once when the component is created
  $effect(() => {
    matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const getStoredTheme = () => localStorage.getItem('theme') as Theme;
    const getPreferredTheme = () => ((getStoredTheme() ?? matcher.matches) ? 'dark' : 'light');

    theme = getPreferredTheme();

    const listener = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        theme = getPreferredTheme();
      }
    };
    matcher.addEventListener('change', listener);

    return () => {
      matcher.removeEventListener('change', listener);
    };
  });

  // This effect runs every time the theme changes
  $effect(() => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', matcher.matches ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }

    localStorage.setItem('theme', theme);
  });
</script>

<div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
  <button
    bind:this={themeSwitcher}
    class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
    id="bd-theme"
    aria-expanded="false"
    data-bs-toggle="dropdown"
    aria-label="{label} ({theme})"
  >
    <Icon id={themeIcons[theme]} class="my-1 theme-icon-active" />
    <span class="visually-hidden" id="bd-theme-text">{label}</span>
  </button>
  <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
    {#each Object.entries(themeIcons) as [value, icon]}
      <li>
        <button
          class="dropdown-item d-flex align-items-center"
          class:active={theme === value}
          data-bs-theme-value={value}
          aria-pressed={theme === value}
          onclick={() => {
            theme = value as Theme;
            themeSwitcher.focus();
          }}
        >
          <Icon id={icon} class="me-2 opacity-50" block={theme === value} />
          {value[0].toUpperCase() + value.slice(1)}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .btn-bd-primary {
    --bd-violet-bg: #712cf9;
    --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

    --bs-btn-font-weight: 600;
    --bs-btn-color: var(--bs-white);
    --bs-btn-bg: var(--bd-violet-bg);
    --bs-btn-border-color: var(--bd-violet-bg);
    --bs-btn-hover-color: var(--bs-white);
    --bs-btn-hover-bg: #6528e0;
    --bs-btn-hover-border-color: #6528e0;
    --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
    --bs-btn-active-color: var(--bs-btn-hover-color);
    --bs-btn-active-bg: #5a23c8;
    --bs-btn-active-border-color: #5a23c8;
  }

  .bd-mode-toggle {
    z-index: 1500;
  }
</style>
