function recalculate() {
    const base = {
        cpu: 2,
        mem: 8,
        disk: 0
    }

    let totals = { ...base };

    const lines = document.getElementById('log-lines-slider').value

    if (lines > 270) {
        totals.cpu += 2;
        totals.mem += 1;
        totals.disk += 126;
    } else if (lines > 180) {
        totals.cpu += 2;
        totals.mem += 1;
        totals.disk += 95;
    } else if (lines > 90) {
        totals.cpu += 1;
        totals.mem += 1;
        totals.disk += 63;
    } else if (lines > 0) {
        totals.disk += 32;
    } 

    const points = document.getElementById('metric-slider').value;

    if (points > 4) {
        totals.cpu += 1;
        totals.mem += 10;
        totals.disk += 22;
    } else if (points > 3) {
        totals.mem += 7;
        totals.disk += 17;
    } else if (points > 2) {
        totals.mem += 5;
        totals.disk += 11;
    } else if (points > 0) {
        totals.mem += 2;
        totals.disk += 6;
    }

    document.getElementById('machine').innerHTML = `
      <h3>
        System Requirements
      </h3>
      ${totals.cpu} Cores<br/>
      ${totals.mem} GB Memory<br/>
      ${totals.disk} GB Disk / Day
    `;
    

}