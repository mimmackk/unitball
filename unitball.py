import numpy as np
import plotly.graph_objects as go

def unitball3d(p, smoothness = 6):
    # Odd number in order to pick up edges in z-direction
    num_steps = 2**smoothness + 1

    # Generate theta, phi mesh grid
    theta = np.linspace(0, np.pi * 2, num_steps)
    phi   = np.linspace(0, np.pi,     num_steps)

    theta, phi = np.meshgrid(theta, phi)

    rho = lambda x : (np.abs(np.sin(x))**p + np.abs(np.cos(x))**p)**(-1/p)

    # Generate Cartesian points
    x = np.sin(phi) * rho(phi) * np.cos(theta) * rho(theta)
    y = np.sin(phi) * rho(phi) * np.sin(theta) * rho(theta)
    z = np.cos(phi) * rho(phi)

    # Generate figure
    fig = go.Figure(go.Surface(x=x, y=y, z=z, colorscale='Viridis', showscale=False))
    fig.update_layout(showlegend=False, height=600)

    fig.show()

def unitball2d(p, smoothness = 8):
    # Odd number in order to pick up edges
    num_steps = 2**smoothness + 1

    # Polar coordinates
    theta = np.linspace(0, np.pi * 2, num_steps)
    r = (np.abs(np.sin(theta))**p + np.abs(np.cos(theta))**p)**(-1/p)

    # Convert to Cartesian
    x = r * np.cos(theta)
    y = r * np.sin(theta)

    # Generate figure
    fig = go.Figure(go.Scatter(x=x, y=y, mode='lines'))

    # Graph styling
    fig.update_layout(
        showlegend=False,
        width=500,
        height=500,
        yaxis = dict(
              scaleanchor = "x",
              scaleratio = 1
        ),
        plot_bgcolor = '#fff',
    )
    fig.update_xaxes(showgrid=False, zerolinecolor='Grey', showticklabels=False)
    fig.update_yaxes(showgrid=False, zerolinecolor='Grey', showticklabels=False)

    fig.show()
