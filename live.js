window.addEventListener('load', function(){
  
  // Must have an odd number of steps in order for edges to display correctly
  const smoothness = 6;
  const num_steps = 2 ** smoothness + 1;

  // Generate our ranges of theta & phi values and compute their sines and cosines
  let theta = [...Array(num_steps).keys()].map(x => (x * Math.PI * 2) / (num_steps - 1) );
  let phi   = [...Array(num_steps).keys()].map(x => (x * Math.PI)     / (num_steps - 1) );

  let sin = {theta: theta.map(x => Math.sin(x)), phi: phi.map(x => Math.sin(x))};
  let cos = {theta: theta.map(x => Math.cos(x)), phi: phi.map(x => Math.cos(x))};

  // Compute the x, y, z coordinates for a given p-value
  function unitball3d(p) {

    let x = [...Array(num_steps)].map( () => Array(num_steps));
    let y = [...Array(num_steps)].map( () => Array(num_steps));
    let z = [...Array(num_steps)].map( () => Array(num_steps));

    let r = {phi: Array(num_steps), theta: Array(num_steps)};
  
    // Calculate our rho values
    for (let i = 0; i < num_steps; i++) {
      r.phi[i] = (Math.abs(sin.phi[i])**p + Math.abs(cos.phi[i])**p)**(-1/p);
      r.theta[i] = (Math.abs(sin.theta[i])**p + Math.abs(cos.theta[i])**p)**(-1/p);
    }
  
    // Create a mesh grid of Cartesian points
    for (let i = 0; i < num_steps; i++) {
      for (let j = 0; j < num_steps; j++) {
        x[i][j] = sin.phi[i] * r.phi[i] * cos.theta[j] * r.theta[j];
        y[i][j] = sin.phi[i] * r.phi[i] * sin.theta[j] * r.theta[j];
        z[i][j] = cos.phi[i] * r.phi[i];
      }
    }
  
    return {x, y, z};
  }

  // Initialize the plot with p = 2
  let p = 2;
  let layout = {autosize: true, height: 430, margin: {l: 10, r: 10, b: 10, t: 10, pad: 4}};
  let data_options = {type: 'surface', colorscale: 'Viridis', showscale: false};
  let data = [{...unitball3d(p), ...data_options}];

  Plotly.newPlot('plot', data, layout, {responsive: true});

  // Update the plot when the user updates the p input field
  let number = document.getElementById('number');
  
  number.addEventListener("change", function(){
    // Only update the plot if the user-entered p-value is valid
    if (number.checkValidity()) {
      p = parseFloat(number.value);
      data = [{...unitball3d(p), ...data_options}];
      Plotly.react('plot', data, layout, {responsive: true});
    }
    else {
      alert("Please choose a p-value between 0.5 and 999.");
    }
  });
});
