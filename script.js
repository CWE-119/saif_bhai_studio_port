import { titles } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
	gsap.registerPlugin(CustomEase);
	gsap.registerPlugin(Draggable);
	CustomEase.create(
		"hop",
		"M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
	);

	const ease = "power4.inOut";
	setTimeout(function () {
		const menuToggle = document.querySelector(".menu-toggle");
		const blocks = document.querySelectorAll(".block");
		const menuToggleIcon = document.querySelector(".menu-toggle-icon");
		const menu = document.querySelector(".menu");
		const links = document.querySelectorAll(".link");
		const socialLinks = document.querySelectorAll(".socials p");

		let isAnimating = false;
		let isDragging = false;

		const sliderNav = document.querySelector(".slider-nav");
		const slidesContainer = document.querySelector(".slides");
		const bgOverlay = document.querySelector(".bg-overlay");
		const slideTitle = document.querySelector(".slide-title");

		const numberOfItems = 30;
		let currentIndex = 0;

		document.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", (event) => {
				event.preventDefault();
				const href = link.getAttribute("href");

				if (
					href &&
					!href.startsWith("#") &&
					href !== window.location.pathname
				) {
					animateTransition().then(() => {
						window.location.href = href;
					});
				}
			});
		});

		revealTransition().then(() => {
			gsap.set(".block", { visibility: "hidden" });
		});

		function revealTransition() {
			return new Promise((resolve) => {
				gsap.set(".block", { scaleY: 1 });
				gsap.to(".block", {
					scaleY: 0,
					duration: 1,
					stagger: {
						each: 0.1,
						from: "start",
						grid: "auto",
						axis: "x",
					},
					ease: ease,
					onComplete: resolve,
				});
			});
		}

		function animateTransition() {
			return new Promise((resolve) => {
				gsap.set(".block", { visibility: "visible", scaleY: 0 });
				gsap.to(".block", {
					scaleY: 1,
					duration: 1,
					stagger: {
						each: 0.1,
						from: "start",
						grid: [2, 5],
						axis: "x",
					},
					ease: ease,
					onComplete: resolve,
				});
			});
		}

		const splitTextIntoSpans = (selector) => {
			let elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				let text = element.innerText;
				let splitText = text
					.split("")
					.map(function (char) {
						return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
					})
					.join("");
				element.innerHTML = splitText;
			});
		};
		splitTextIntoSpans(".header h1");

		menuToggle.addEventListener("click", () => {
			if (isAnimating) return;

			if (menuToggle.classList.contains("closed")) {
				menuToggle.classList.remove("closed");
				menuToggle.classList.add("opened");

				isAnimating = true;

				gsap.to(menu, {
					clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					ease: "hop",
					duration: 1.5,
					onStart: () => {
						menu.style.pointerEvents = "all";
					},
					onComplete: () => {
						isAnimating = false;
					},
				});

				gsap.to(links, {
					y: 0,
					opacity: 1,
					stagger: 0.1,
					delay: 0.85,
					duration: 1,
					ease: "power3.out",
				});

				gsap.to(socialLinks, {
					y: 0,
					opacity: 1,
					stagger: 0.05,
					delay: 0.85,
					duration: 1,
					ease: "power3.out",
				});

				gsap.to(".video-wrapper", {
					clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					ease: "hop",
					duration: 1.5,
					delay: 0.5,
				});

				gsap.to(".header h1 span", {
					rotateY: 0,
					stagger: 0.05,
					delay: 0.75,
					duration: 1.5,
					ease: "power4.out",
				});

				gsap.to(".header h1 span", {
					y: 0,
					scale: 1,
					stagger: 0.05,
					delay: 0.5,
					duration: 1.5,
					ease: "power4.out",
				});
			} else {
				menuToggle.classList.remove("opened");
				menuToggle.classList.add("closed");

				isAnimating = true;

				gsap.to(menu, {
					clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
					ease: "hop",
					duration: 1.5,
					onComplete: () => {
						menu.style.pointerEvents = "none";
						gsap.set(menu, {
							clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
						});

						gsap.set(links, { y: 30, opacity: 0 });
						gsap.set(socialLinks, { y: 30, opacity: 0 });
						gsap.set(".video-wrapper", {
							clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
						});
						gsap.set(".header h1 span", {
							y: 500,
							rotateY: 90,
							scale: 0.75,
						});

						isAnimating = false;
					},
				});
			}
		});

		function getRandomColor() {
			const letters = "0123456789ABCDEF";
			let color = "#";
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		function updateTitle(newIndex, color) {
			const title = titles[newIndex];
			const titleRows = slideTitle.querySelectorAll(".slide-title-row");

			titleRows.forEach((row, rowIndex) => {
				row.querySelectorAll(".letter").forEach((letter, letterIndex) => {
					const existingSpan = letter.querySelector("span");
					if (existingSpan) {
						letter.removeChild(existingSpan);
					}

					const newSpan = document.createElement("span");
					const direction = newIndex > currentIndex ? 150 : -150;
					gsap.set(newSpan, {
						x: direction,
						color: color,
						filter: "brightness(0.75)",
					});
					newSpan.textContent = title[rowIndex][letterIndex] || "";
					letter.appendChild(newSpan);
					gsap.to(newSpan, {
						x: 0,
						duration: 1,
						ease: "power2.out",
						delay: 0.125,
					});
				});
			});
		}

		for (let i = 0; i < numberOfItems; i++) {
			const navItemWrapper = document.createElement("div");
			navItemWrapper.classList.add("nav-item-wrapper");
			if (i === 0) {
				navItemWrapper.classList.add("active");
			}

			const navItem = document.createElement("div");
			navItem.classList.add("nav-item");

			navItemWrapper.appendChild(navItem);
			sliderNav.appendChild(navItemWrapper);

			navItemWrapper.addEventListener("click", () => {
				if (i === currentIndex) {
					return;
				}

				document
					.querySelectorAll(".nav-item-wrapper")
					.forEach((nav) => nav.classList.remove("active"));
				navItemWrapper.classList.add("active");

				moveToSlide(i);
				// const translateXValue = -i * 100;
				// gsap.to(slidesContainer, {
				// 	x: `${translateXValue}vw`,
				// 	duration: 1.5,
				// 	ease: "hop",
				// });

				// const newColor = getRandomColor();
				// gsap.to([bgOverlay, menuToggleIcon], {
				// 	backgroundColor: newColor,
				// 	duration: 1.5,
				// 	ease: "hop",
				// });

				// updateTitle(i, newColor);
				// currentIndex = i;
			});

			const slide = document.createElement("div");
			slide.classList.add("slide");
			if (i === 0) {
				slide.classList.add("active");
			}

			const imgWrapper = document.createElement("div");
			imgWrapper.classList.add("img");

			const img = document.createElement("img");
			img.src = `./assets/img${i + 1}.jpg`;
			img.alt = "";

			imgWrapper.appendChild(img);
			slide.appendChild(imgWrapper);
			slidesContainer.appendChild(slide);
		}

		// Helper Functions
		function moveToSlide(index) {
			const translateXValue = -index * 100;
			gsap.to(slidesContainer, {
				x: `${translateXValue}vw`,
				duration: 1.5,
				ease: "hop",
			});

			const newColor = getRandomColor();
			gsap.to([bgOverlay, menuToggleIcon], {
				backgroundColor: newColor,
				duration: 1.5,
				ease: "hop",
			});

			updateTitle(index, newColor);
			currentIndex = index;
		}

		Draggable.create(slidesContainer, {
			type: "x",
			bounds: slidesContainer.parentElement,
			edgeResistance: 0.02, // Lower value for higher sensitivity near edges
			dragResistance: 0.01, // Lower value for more responsive dragging
			inertia: true, // Enables momentum effect
			snap: {
				x: (value) => {
					const slideWidth = slidesContainer.offsetWidth / numberOfItems;
					// const closestIndex = Math.round(value / -slideWidth);
					// return -closestIndex * slideWidth; // Snaps to the nearest slide
					return (
						Math.round(value / -(slideWidth * 0.025)) * (slideWidth * 0.025)
					);
				},
			},
			zIndexBoost: false,
			onDrgStart: function () {
					this.endDrag(); // End drag if it's not the right-clic
			},
			
			onDragEnd: function () {
				slidesContainer.classList.remove("dragging");
				const slideWidth = slidesContainer.offsetWidth / numberOfItems;
				const snappedIndex = Math.round(this.x / -slideWidth);

				// Clamp the index to valid range
				const clampedIndex = Math.max(
					0,
					Math.min(numberOfItems - 1, snappedIndex)
				);

				// Animate to the snapped slide
				moveToSlide(clampedIndex);

				// Update navigation items
				document.querySelectorAll(".nav-item-wrapper").forEach((nav, idx) => {
					nav.classList.toggle("active", idx === clampedIndex);
				});
				isDragging = false;
			},
		});

		updateTitle(
			0,
			getComputedStyle([bgOverlay, menuToggleIcon]).backgroundColor
		);
	}, 200);
});
