document.addEventListener('DOMContentLoaded', () => {
    // ----- Preloader Handling -----
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelector('.preloader').classList.add('loaded');
            setTimeout(() => {
                document.querySelector('.preloader').style.display = 'none';
            }, 1000);
        }, 5000);
    });

    // ----- Smooth Navigation -----
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            link.classList.add('active');
        });
    });

    // ----- Theme Toggle -----
    const themeToggle = document.getElementById('theme-toggle');
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    themeToggle.addEventListener('click', toggleTheme);

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // ----- 3D Scene (Three.js) -----
    const init3DScene = () => {
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                alpha: true, 
                antialias: true 
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            const container = document.getElementById('3d-container');
            if (container) container.appendChild(renderer.domElement);

            // Geometry
            const geometry = new THREE.IcosahedronGeometry(2, 1);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0x6e45e2,
                emissive: 0x443344,
                shininess: 100
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Lighting
            const light = new THREE.PointLight(0xffffff, 1.5);
            light.position.set(5, 5, 5);
            scene.add(light);

            camera.position.z = 5;

            // Animation
            const animate = () => {
                requestAnimationFrame(animate);
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.005;
                renderer.render(scene, camera);
            };
            animate();

            // Handle window resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch (error) {
            console.error('3D Scene initialization error:', error);
        }
    };

    if (THREE) init3DScene();

    // ----- Voice Commands -----
    const voiceBtn = document.getElementById('voice-btn');
    const handleVoiceCommand = (command) => {
        if (command.includes('dark mode') || command.includes('light mode')) toggleTheme();
        if (command.includes('projects')) scrollToSection('#projects');
        if (command.includes('contact')) scrollToSection('#contact');
    };

    if (typeof webkitSpeechRecognition !== 'undefined') {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceBtn.addEventListener('click', () => {
            recognition.start();
            voiceBtn.classList.add('listening');
        });

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(transcript);
            voiceBtn.classList.remove('listening');
        };

        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
        };
    } else {
        voiceBtn.style.display = 'none';
    }

    // ----- Helper Functions -----
    const scrollToSection = (selector) => {
        const section = document.querySelector(selector);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    // ----- AI Assistant -----
    const aiAssistant = document.querySelector('.ai-assistant');
    document.addEventListener('keypress', (e) => {
        if (e.key === ';') {
            aiAssistant.classList.toggle('active');
            e.preventDefault();
        }
    });

    // ----- Intersection Observer -----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('show', entry.isIntersecting);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // ----- Particle Background -----
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'particles.json')
            .catch(error => console.error('Particles failed to load:', error));
    }
});

// Initialize after full load
window.onload = () => {
    // Additional load-time initialization if needed
};