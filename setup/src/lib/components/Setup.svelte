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
        class="btn btn-secondary px-4"
        disabled={step === 0}
        onclick={() => {
          step--;
        }}>Back</button
      >
      <span class="opacity-50">Step {step + 1} of {ctx.steps.length}</span>
      {#if step === ctx.steps.length - 1}
        <a class="btn btn-primary px-4" {href}>Finish</a>
      {:else}
        <button
          class="btn btn-primary px-4"
          onclick={() => {
            step++;
          }}>Next</button
        >
      {/if}
    </div>
  </div>
</div>
