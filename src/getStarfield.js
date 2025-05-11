import * as THREE from "three";

export default function getStarfield({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;

    const u = Math.random();
    const v = Math.random(); //generates two random numbers between 0 and 1, used to calculate spherical coordinates

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1); //theta is the horizontal angle, and phi is the vertical angle for spherical coordinates.

    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi); //converts spherical coords to Cartesian (x, y, z   )

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }

  const vertexPosition = [];
  const colors = [];
  const positions = [];
  
  let col;
  
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    vertexPosition.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }
  
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertexPosition, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); //adds vertex positions and colors as attributes with 3 components each (x, y, z) or (r, g, b).
  
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "./textures/stars/circle.png"
    ),
  });
  
  const points = new THREE.Points(geo, mat);
  return points;
}
