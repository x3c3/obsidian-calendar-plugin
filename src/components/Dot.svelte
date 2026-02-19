<script lang="ts">
  export let color: string | undefined = undefined;
  export let isFilled: boolean;
</script>

<svg
  class="dot"
 
  style="color:{color}"
  viewBox="0 0 6 6"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    stroke="{!isFilled ? 'currentColor' : 'none'}"
    fill="{isFilled ? 'currentColor' : 'none'}"
    cx="3"
    cy="3"
    r="2"></circle>
</svg>

<style>
  .dot {
    display: inline-block;
    height: 6px;
    width: 6px;
    margin: 0 1px;
  }
</style>
