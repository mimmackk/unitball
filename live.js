// Frankenstein conversion of the python plot to Javascript
// Definitely not its best form! But no nice way to do interactive python plotly on web

window.addEventListener('load', function(){
function unitball3d(p) {
  // Odd number in order to pick up edges in z-direction
  const smoothness = 6;
  const num_steps = 2 ** smoothness + 1;

  // Initialize theta, phi mesh grid
  // This looks horrific, but it reduces function calls to Math which makes things very fast
  // There's probably a much better way to do this in Javascript!!!!
  var theta = Array(num_steps);
  var phi   = Array(num_steps);
  var sintheta = Array(num_steps);
  var sinphi   = Array(num_steps);
  var costheta = Array(num_steps);
  var cosphi   = Array(num_steps);
  var x = Array(num_steps);
  var y = Array(num_steps);
  var z = Array(num_steps);

  // Initialization ctd
  for (var i = 0; i < num_steps; i++) {
    theta[i] = Array(num_steps);
    phi[i]   = Array(num_steps);
    sintheta[i] = Array(num_steps);
    sinphi[i]   = Array(num_steps);
    costheta[i] = Array(num_steps);
    cosphi[i]   = Array(num_steps);
    x[i] = Array(num_steps);
    y[i] = Array(num_steps);
    z[i] = Array(num_steps);
  }

  // Generate 2d mesh grid of phi and theta-values
  for (var i = 0; i < num_steps; i++) {
    var theta_i = (i * Math.PI * 2) / (num_steps - 1);
    var phi_i   = (i * Math.PI) / (num_steps - 1);

    var sintheta_i = Math.sin(theta_i);
    var costheta_i = Math.cos(theta_i);

    var sinphi_i = Math.sin(phi_i);
    var cosphi_i = Math.cos(phi_i);

    for (var j = 0; j < num_steps; j++) {
      theta[j][i] = theta_i;
      phi[i][j]   = phi_i;

      sintheta[j][i] = sintheta_i;
      sinphi[i][j]   = sinphi_i;

      costheta[j][i] = costheta_i;
      cosphi[i][j]   = cosphi_i;
    }
  }

  // Helper math function for computation below
  function rho(varb, i, j) {
    if (varb == "phi") {
      var sinx = sinphi[i][j];
      var cosx = cosphi[i][j];
    }
    else {
      var sinx = sintheta[i][j];
      var cosx = costheta[i][j];
    }
    return (Math.abs(sinx)**p + Math.abs(cosx)**p)**(-1/p)
  }

  // Generate Cartesian points
  for (var i = 0; i < num_steps; i++) {
    for (var j = 0; j < num_steps; j++) {
      var r_phi   = rho("phi", i, j);
      var r_theta = rho("theta", i, j);

      x[i][j] = sinphi[i][j] * r_phi * costheta[i][j] * r_theta;
      y[i][j] = sinphi[i][j] * r_phi * sintheta[i][j] * r_theta;
      z[i][j] = cosphi[i][j] * r_phi;
    }
  }

  return [x, y, z];
}

// Initialize with p = 2
var points = unitball3d(2);

// Put the data into the right format for Plotly
var data = [{
  x: points[0],
  y: points[1],
  z: points[2],
  type: 'surface',
  colorscale: 'Viridis',
  showscale: false,
}];

var layout = {
  autosize: true,
  height: 430,
  margin: {
    l: 10,
    r: 10,
    b: 10,
    t: 10,
    pad: 4
  }
};

// Generate the plot
Plotly.newPlot('plot', data, layout, {responsive: true});

// Tie the plot to the number field input to update plot when user updates p
var number = document.getElementById('number');
number.addEventListener("change", function(){
  // Only update the plot if user-entered number is valid
  if (number.checkValidity()) {
    p = parseFloat(number.value);
    points = unitball3d(p);
    data = [{
      x: points[0],
      y: points[1],
      z: points[2],
      type: 'surface',
      colorscale: 'Viridis',
      showscale: false,
    }];

    Plotly.react('plot', data, layout, {responsive: true});
  }
  else {
    alert("Please choose a p-value between 0.5 and 999.");
  }
});
});
