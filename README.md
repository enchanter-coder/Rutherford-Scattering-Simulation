# Rutherford-Scattering-Simulation

## Click the link below to directly run the simulation 👇
https://enchanter-coder.github.io/Rutherford-Scattering-Simulation/


<img width="2028" height="2048" alt="image" src="https://github.com/user-attachments/assets/c5856379-450d-48de-bec2-fadb261b9d10" />


An interactive web-based simulation of the famous Gold Foil Experiment (1909), demonstrating the discovery of the atomic nucleus. This project visualizes how alpha particles interact with atoms, comparing the **Rutherford Nuclear Model** against the disproven **Thomson Plum Pudding Model**.

## ⚙️ Features

  * **Dual Atomic Models:**
      * **Rutherford Atom:** Visualizes the small, dense, positively charged nucleus. shows alpha particles deflecting based on the inverse-square law of electrostatic repulsion.
      * **Plum Pudding Atom:** Visualizes J.J. Thomson's model where positive charge is diffuse, causing alpha particles to pass through with minimal deflection.
  * **Real-Time Physics Engine:**
      * Implements **Coulomb’s Law** ($F = k \frac{q_1 q_2}{r^2}$) to calculate particle trajectories dynamically.
      * Randomized "Impact Parameter" ($b$) to simulate a realistic beam of particles hitting the foil at different heights.
  * **Interactive Controls:**
      * **Energy Slider:** Adjust the kinetic energy (velocity) of the alpha particles.
      * **Proton/Neutron Count:** Change the size and charge of the nucleus to see how it affects scattering angles.
      * **Traces:** Toggle particle path tracing to visualize deflection angles clearly.
  * **Responsive Design:** Dark-themed, modern UI that works on different screen sizes.

## 🛠️ Technologies Used

  * **HTML5:** Structure and Canvas element.
  * **CSS3:** Styling, animations, and responsive layout (Flexbox/Grid).
  * **JavaScript (ES6):** Physics calculations, Canvas API rendering, and animation loop.

## 📂 File Structure

```text
/project-folder
│
├── Demo.mp4        # Shows the demo video of simulation, please use "View raw" option to see the video
├── README.md       # Project documentation
├── styles.css      # Dark theme styling, animations, and responsiveness
├── script.js       # Physics engine, particle logic, and canvas drawing
└── index.html      # Main structure and UI layout
```

## ⚛️ The Physics Behind It

The simulation demonstrates three key observations from Rutherford's experiment:

1.  **Most particles pass straight through:** Because the atom is mostly empty space.
2.  **Some deflect at small angles:** Due to the repulsive force as they pass near the positive nucleus.
3.  **Very few bounce back (\>90°):** Occurs only when an alpha particle approaches the nucleus head-on, encountering massive electrostatic repulsion.

## 👨‍💻 How to Run

1.  Download or clone the repository.
2.  Ensure `index.html`, `styles.css`, and `script.js` are in the same folder.
3.  Open **`index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari).

## 👥 Group Members

| Name | ID |
| :--- | :--- |
| **Sumit Shrivastava** | 25BAI10961 |
| **Ankit Sen** | 25BAI10915 |
| **Ishan Shrivas** | 25BAI10966 |
| **Pranshu Gupta** | 25BAI11057 |

-----
