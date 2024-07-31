<script lang="ts" context="module">
  import type { HTMLInputAttributes } from 'svelte/elements';

  export interface Props extends HTMLInputAttributes {
    input: HTMLInputAttributes['type'];
    id: string;
    title: string;
    description?: string;
    element?: HTMLInputElement;
    value: string | number;
  }

  export class Input {
    input: Props;
    _value = $state<string | number>('');
    _element = $state<HTMLInputElement | undefined>();

    constructor(input: Props) {
      this.input = input;
      this._value = input.value;
    }

    get value() {
      return this._value;
    }

    set value(value: string | number) {
      this._value = value;
    }

    set element(element: HTMLInputElement) {
      this._element = element;
    }

    focus() {
      if (this._element) {
        this._element.selectionStart = this._element.selectionEnd = this._element.value.length;
        this._element.focus();
      }
    }
  }
</script>

<script lang="ts">
  let {
    input,
    id,
    title,
    description,
    element = $bindable(),
    value = $bindable(),
    ...props
  }: Props = $props();
</script>

<div class="form-group">
  <label class="form-label" for={title}>{title}</label>
  <input
    bind:this={element}
    class="form-control"
    type={input}
    {id}
    placeholder={description}
    bind:value
    tabindex="0"
    {...props}
  />
</div>
