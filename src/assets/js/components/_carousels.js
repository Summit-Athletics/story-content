import Carousel from "bootstrap/js/dist/carousel"; // For toggleCarouselPausePlayBtn()
import { html } from "../base/_utils";

export default function carouselsInit() {
    const carousels = document.querySelectorAll(".carousel");

    const toggleCarouselPausePlayBtn = (carousel) => {
        // Insert button
        const btnHTML = html`
            <button class="carousel-pause-play-btn p-0" type="button" aria-pressed="false" aria-label="Pause carousel autoplay">
                <i class="bi bi-pause fs-4"></i>
            </button>
        `;

        carousel.querySelector(".carousel-inner").insertAdjacentHTML("afterbegin", btnHTML);
        const btn = carousel.querySelector(".carousel-pause-play-btn");
        const icon = btn.querySelector(".bi");

        // Get or create carousel instance
        const carouselInstance = Carousel.getOrCreateInstance(carousel, {
            ride: "carousel",
            pause: "hover",
        });
        const originalInterval = carouselInstance._config.interval;

        // Initial start of cycling
        carouselInstance.cycle();

        function toggleCarouselCycle(cycleState, intervalValue, pauseValue, rideValue, btnState, activeIcon, inactiveIcon) {
            cycleState;
            carouselInstance._config.interval = intervalValue;
            carouselInstance._config.pause = pauseValue;
            carouselInstance._config.ride = rideValue;
            btn.setAttribute("aria-pressed", btnState);
            icon.classList.replace(inactiveIcon, activeIcon);
        }

        btn.addEventListener("click", () => {
            const isPaused = btn.getAttribute("aria-pressed") === "true";

            if (!isPaused) {
                // PAUSE
                toggleCarouselCycle(carouselInstance.pause(), false, false, false, "true", "bi-play", "bi-pause");
            } else {
                // PLAY
                toggleCarouselCycle(carouselInstance.cycle(), originalInterval, "hover", "carousel", "false", "bi-pause", "bi-play");
            }
        });
    };

    carousels.forEach((carousel) => {
        const carouselInner = carousel.querySelector(".carousel-inner");

        // Toggle aria-live to 'polite' while sliding
        carousel.addEventListener("slide.bs.carousel", () => carouselInner.setAttribute("aria-live", "polite"));
        carousel.addEventListener("slid.bs.carousel", () => carouselInner.setAttribute("aria-live", "off"));

        // If page has no auto sliding carousels exit function, else add pause/play button(s)
        if (carousel.getAttribute("data-sa-slide") !== "auto") return; // data-sa-slide replaces data-bs-ride
        toggleCarouselPausePlayBtn(carousel);
    });
}
