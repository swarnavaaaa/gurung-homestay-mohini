// Three.js Background Setup with Mouse Parallax and Smooth Transitions
class WebGLBackground {
    constructor() {
        this.container = document.getElementById('canvas');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        this.textures = [
            'assets/bg1.jpg', // Mountain person
            'assets/bg2.jpg', // Panorama
            'assets/bg3.jpg'  // Misty rainforest
        ];

        this.uniforms = {
            uTime: { value: 0 },
            uTexture: { value: new THREE.TextureLoader().load(this.textures[0]) },
            uNextTexture: { value: new THREE.TextureLoader().load(this.textures[1]) },
            uTransition: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector4() }
        };

        this.addMesh();
        this.setupEvents();
        this.render();
    }

    addMesh() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform float uTransition;
                uniform sampler2D uTexture;
                uniform sampler2D uNextTexture;
                uniform vec2 uMouse;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    
                    // Parallax effect
                    uv += uMouse * 0.03;

                    // Displacement / Liquid effect
                    float noise = sin(uv.x * 10.0 + uTime) * 0.01 + cos(uv.y * 10.0 + uTime) * 0.01;
                    vec2 distortedUv = uv + noise;

                    vec4 tex1 = texture2D(uTexture, distortedUv);
                    vec4 tex2 = texture2D(uNextTexture, distortedUv);

                    vec4 finalColor = mix(tex1, tex2, uTransition);
                    
                    // Vignette and Subtle Darken for text readability
                    float vignette = distance(vUv, vec2(0.5));
                    finalColor.rgb *= (1.0 - vignette * 0.2); 
                    finalColor.rgb *= 0.85; // Less darkening to keep images clear

                    gl_FragColor = finalColor;
                }
            `
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
        this.resize();
    }

    setupEvents() {
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) - 0.5;
            this.targetMouse.y = (e.clientY / window.innerHeight) - 0.5;
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    updateTexture(index) {
        const nextTexture = new THREE.TextureLoader().load(this.textures[index]);
        this.uniforms.uNextTexture.value = nextTexture;

        gsap.to(this.uniforms.uTransition, {
            value: 1,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                this.uniforms.uTexture.value = nextTexture;
                this.uniforms.uTransition.value = 0;
            }
        });
    }

    render() {
        this.uniforms.uTime.value = this.clock.getElapsedTime();

        // Linear interpolation for mouse for smooth parallax
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        this.uniforms.uMouse.value.copy(this.mouse);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

// UI & Animation Controller
class App {
    constructor() {
        this.bg = new WebGLBackground();
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.container = document.getElementById('container');
        this.fill = document.querySelector('.fill');
        this.isAnimating = false;

        this.init();
        this.setupMenu();
    }

    init() {
        this.setupCursor();
        this.setupWheel();
        this.animateIn(0);
    }

    setupMenu() {
        const overlay = document.getElementById('menu-overlay');
        const trigger = document.getElementById('menu-trigger');
        const exploreTrigger = document.getElementById('explore-trigger');
        const close = document.getElementById('close-trigger');

        const toggleMenu = () => {
            overlay.classList.toggle('active');
        };

        trigger.addEventListener('click', toggleMenu);
        exploreTrigger.addEventListener('click', toggleMenu);
        close.addEventListener('click', toggleMenu);
    }

    setupCursor() {
        const cursor = document.querySelector('.cursor');
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX - 10,
                y: e.clientY - 10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    setupWheel() {
        let touchStartY = 0;

        window.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            if (Math.abs(e.deltaY) < 30) return;

            if (e.deltaY > 0 && this.currentSlide < this.slides.length - 1) {
                this.gotoSlide(this.currentSlide + 1);
            } else if (e.deltaY < 0 && this.currentSlide > 0) {
                this.gotoSlide(this.currentSlide - 1);
            }
        }, { passive: true });

        // Touch support
        window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
        window.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (this.isAnimating || Math.abs(diff) < 50) return;
            if (diff > 0 && this.currentSlide < this.slides.length - 1) this.gotoSlide(this.currentSlide + 1);
            else if (diff < 0 && this.currentSlide > 0) this.gotoSlide(this.currentSlide - 1);
        });
    }

    gotoSlide(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.animateOut(this.slides[this.currentSlide]);
        this.currentSlide = index;
        gsap.to(this.fill, { width: ((index + 1) / this.slides.length) * 100 + '%', duration: 1, ease: "expo.inOut" });
        this.bg.updateTexture(index);
        gsap.to(this.container, {
            x: -index * 100 + 'vw',
            duration: 1.5,
            ease: "expo.inOut",
            onComplete: () => {
                this.animateIn(index);
                this.isAnimating = false;
            }
        });
    }

    animateIn(index) {
        const slide = this.slides[index];
        const content = slide.querySelector('.content');
        gsap.set(content, { opacity: 1 });
        const tl = gsap.timeline();
        tl.fromTo(slide.querySelector('.sub-title'), { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1 })
            .fromTo(slide.querySelector('.main-title'), { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" }, "-=0.7")
            .fromTo(slide.querySelector('.description'), { opacity: 0, y: 20 }, { opacity: 0.8, y: 0, duration: 1 }, "-=1");
    }

    animateOut(slide) {
        gsap.to(slide.querySelector('.content'), { opacity: 0, x: 50, duration: 0.8, ease: "power2.in" });
    }
}

window.addEventListener('load', () => { new App(); });
