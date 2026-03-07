import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function gsapDataTrigger() {
    // Default settings
    const defaultSettings = {
        duration: 1.25,
        ease: "power2.inOut",
        overwrite: "auto",
        scrollTrigger: {
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none none none",
        },
    };

    const defaultTween = "from";

    // Utility function to parse animation properties
    function parseAnimationProps(el) {
        const animateData = el.dataset.saAnimate || "";
        const props = {};

        // Split the string into individual "key: value" pairs
        const items = animateData.split(",");

        items.forEach((item) => {
            // Split each pair into a key and a value
            const keyValuePairs = item.split(":");

            // Make sure we have both a key and a value
            if (keyValuePairs.length === 2) {
                const key = keyValuePairs[0].trim();
                let value = keyValuePairs[1].trim();

                // Convert numeric values to actual numbers
                if (!isNaN(value)) {
                    value = parseFloat(value);
                }

                // Add the key and value to the props object
                props[key] = value;
            }
        });

        return props;
    }

    // Initialize animations based on data-sa attributes
    function initGsapAnimations() {
        document.querySelectorAll('[data-sa-init="animate"]').forEach((el) => {
            // Animation properties
            const animationProps = {
                // Merge defaultSettings and user-added props
                ...defaultSettings,
                ...parseAnimationProps(el),
                // Overwrite any specific defaults with custom data attributes
                duration: parseFloat(el.dataset.saDuration) || defaultSettings.duration,
                delay: parseFloat(el.dataset.saDelay) || defaultSettings.delay,
                ease: el.dataset.saEase || defaultSettings.ease,
            };

            // console.log(animationProps);

            // ScrollTrigger properties
            const scrollTriggerProps = {
                // Merge default settings with any specific overwrites from user data attributes
                ...defaultSettings.scrollTrigger,
                start: el.dataset.saStart || defaultSettings.scrollTrigger.start,
                end: el.dataset.saEnd || defaultSettings.scrollTrigger.end,
                // Set scrub to true only if the data-sa-scrub attribute exists
                scrub: el.hasAttribute("data-sa-scrub"), // Check if data-sa-scrub is present
                trigger: el,
                toggleActions: el.dataset.saToggleActions || defaultSettings.scrollTrigger.toggleActions,
            };

            // Choose tween method
            const tweenMethod = el.dataset.saTween || defaultTween;

            // Apply animation with or without scrollTrigger
            // gsap[tweenMethod]() = gsap.to() or gsap.from() depending on value of tweenMethod
            gsap[tweenMethod](el, {
                ...animationProps,
                scrollTrigger: scrollTriggerProps, // Always include scrollTrigger props
            });
        });
    }

    // Initialize on page load (wait .5s if scrolling to anchor link)
    document.addEventListener("DOMContentLoaded", () => {
        if (window.location.hash) {
            setTimeout(() => {
                initGsapAnimations();
            }, 500);
        } else initGsapAnimations();
    });
}
