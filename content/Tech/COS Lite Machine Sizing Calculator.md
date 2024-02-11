---
---

<script type="text/javascript" src="/static/js/calculator.js">
</script>
<style>
    #metric-slider,
    #log-lines-slider {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        height: 22px; /* Specified height */
        padding: 8px;
        background: var(--lightgray); /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }
    #metric-datapoints,
    #log-lines {
      background: transparent;
      border: 2px solid #ccc;
      padding: 8px;
      height: 20px;
      font-size: 1.2em;
      width: 100px;
    }
    .controls {
        display: flex;
    }
</style>
<div>
  <label for="metric-slider" style="display: block">
    <h3>
        Max metric datapoints per minute
    </h3>
  </label>
  <div class="controls">
    <input 
      type="range" 
      id="metric-slider" 
      name="metric-slider" 
      min="0" max="6" 
      step="1" 
      value="1" 
      oninput="this.nextElementSibling.value = this.value + ' million'; recalculate()"
      style="width: 400px"
    />
    <output
      type="text"
      id="metric-datapoints"
      name="metric-datapoints"
      value="1 million"
    ></output>
  </div>
  <p>
    Ingesting metrics is CPU intensive
  </p>
</div>
<div>
  <label for="log-lines" style="display: block">
    <h3>
        Max log lines per minute
    </h3>
  </label>
  <div class="controls">
    <input 
      type="range" 
      id="log-lines-slider" 
      name="log-lines-slider" 
      min="0" max="360" 
      step="90" 
      value="90" 
      oninput="this.nextElementSibling.value = this.value + ' thousand'; recalculate()"
      style="width: 400px"
    />
    <output
      type="text"
      id="log-lines"
      name="log-lines"
      value="90 thousand"
    />
  </div>
  <p>
    Querying logs is memory intensive
  </p>
</div>

<div id="machine">
</div>

<script>
    recalculate()
</script>