---
---

<script>
</script>

<div>
  <label for="metric-slider" style="display: block">
    <h3>
        Max metric datapoints per minute
    </h3>
  </label>
  <input 
    type="range" 
    id="metric-slider" 
    name="metric-slider" 
    min="0" max="100000000" 
    step="1000" 
    value="1000" 
    oninput="this.nextElementSibling.value = this.value"
    style="width: 400px"
  />
  <input
    type="text"
    id="metric-datapoints"
    name="metri-datapoints"
    value="1000"
    oninput="this.previousElementSibling.value = this.value"

  />
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
  <input 
    type="range" 
    id="log-lines" 
    name="log-lines" 
    min="0" max="100000000" 
    step="1000" 
    value="1000" 
    oninput="this.nextElementSibling.value = this.value"
    style="width: 400px"
  />
  <output>1000</output>
  <p>
    Querying logs is memory intensive
  </p>
</div>