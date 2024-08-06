<script lang="ts" context="module">
  import { setContext, type Snippet } from 'svelte';

  export interface Props {
    for: Record<string, any>;
    children?: Snippet<[]>;
  }

  type Step = { id: string; hint?: Snippet<[]> };

  export class SetupContext {
    _currentStep = $state<Step | undefined>();
    _steps = $state<Step[]>([]);

    get currentStep() {
      return this._currentStep;
    }
    set currentStep(step: Step | undefined) {
      this._currentStep = step;
    }

    get steps() {
      return this._steps;
    }
  }
</script>

<script lang="ts">
  let { for: options, children: steps }: Props = $props();

  let prevButton = $state<HTMLButtonElement>();
  let nextButton = $state<HTMLButtonElement>();

  let step = $state(0);
  let ctx = new SetupContext();
  setContext('setup', ctx);

  $effect(() => {
    ctx.currentStep = ctx.steps[step];
  });

  let href = $derived.by(() => {
    if (step === ctx.steps.length - 1) {
      return '#finish'; // TODO: Construct the final URL
    }
    return '#';
  });
</script>

<svelte:document onkeydown={e => {
  const add = ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 1;

  console.log(e.key);

  if (['ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
    if (e.key !== 'Enter') e.preventDefault();
    if (step + add < 0 || step + add >= ctx.steps.length) return;
    if (document.activeElement !== prevButton && document.activeElement !== nextButton && document.activeElement?.tagName !== 'INPUT') return;

    step += add;

    requestAnimationFrame(() => {
      document.querySelector('input')?.focus();
    });
  } else if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
    const inputs = Array.from(document.querySelectorAll('input'));
    const index = inputs.indexOf(document.activeElement as HTMLInputElement);

    if (index >= 0) {
      if (index + add < 0 || index + add >= inputs.length) return;

      inputs[index + add]?.focus();
    } else {
      inputs[0]?.focus();
    }
  }
}} />

<div class="card p-5 text-center mt-5">
  {#if steps}
    {@render steps()}
  {/if}

  <div class="mt-3">
    {#if ctx.currentStep?.hint}
      <p class="opacity-75">
        {@render ctx.currentStep.hint()}
      </p>
    {/if}
    <div class="prevnext d-flex justify-content-between mt-4">
      <button
        bind:this={prevButton}
        class="btn btn-secondary px-4"
        disabled={step === 0}
        onclick={() => {
          step--;
        }}
        tabindex={0}>Back</button
      >
      <span class="opacity-50">Step {step + 1} of {ctx.steps.length}</span>
      {#if step === ctx.steps.length - 1}
        <a class="btn btn-primary px-4" {href}>Finish</a>
      {:else}
        <button
          bind:this={nextButton}
          class="btn btn-primary px-4"
          onclick={() => {
            step++;
          }}
          tabindex={0}>Next</button
        >
      {/if}
    </div>
  </div>
</div>
