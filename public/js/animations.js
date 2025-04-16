// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const heroModel = document.getElementById('heroModel');

// Setup renderer
renderer.setSize(heroModel.clientWidth, heroModel.clientHeight);
renderer.setClearColor(0x000000, 0);
heroModel.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffd700, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create geometric bull
function createLowPolyBull() {
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(3, 2, 4);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        flatShading: true,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 0.5, 2.5);
    group.add(head);

    // Horns
    const hornGeometry = new THREE.ConeGeometry(0.2, 1, 4);
    const hornMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700,
        flatShading: true
    });

    const hornLeft = new THREE.Mesh(hornGeometry, hornMaterial);
    hornLeft.position.set(-0.7, 1.2, 2.5);
    hornLeft.rotation.set(0, 0, -Math.PI / 4);
    group.add(hornLeft);

    const hornRight = new THREE.Mesh(hornGeometry, hornMaterial);
    hornRight.position.set(0.7, 1.2, 2.5);
    hornRight.rotation.set(0, 0, Math.PI / 4);
    group.add(hornRight);

    return group;
}

const bull = createLowPolyBull();
scene.add(bull);

// Position camera
camera.position.z = 8;
camera.position.y = 2;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate bull slightly
    bull.rotation.y += 0.005;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = heroModel.clientWidth;
    const height = heroModel.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

// Initialize animations
animate();

// Add scroll animations using GSAP
gsap.registerPlugin(ScrollTrigger);

// Animate features on scroll
gsap.utils.toArray('.glass-effect').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: i * 0.1
    });
});

// Animate chart on scroll
gsap.from('#tradingChart', {
    scrollTrigger: {
        trigger: '#tradingChart',
        start: "top center+=100",
        toggleActions: "play none none reverse"
    },
    scaleY: 0,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
}); 