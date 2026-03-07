export default function responsiveVideo() {
    // Select all containers intended to house responsive videos
    const videoContainers = document.querySelectorAll(".responsive-video-container");

    // Determine the appropriate video size tier based on current window width
    const getVideoTier = () => {
        const width = window.innerWidth;
        if (width < 640) return "sm";
        if (width < 960) return "md";
        if (width < 1280) return "lg";
        return "xl";
    };

    // Create a new <video> element with standard attributes and a given source
    const createVideo = (src) => {
        const video = document.createElement("video");
        video.src = src;
        // Assign appropriate attributes to newly created <video>
        Object.assign(video, {
            autoplay: true,
            muted: true,
            loop: true,
            playsInline: true,
        });
        video.style.cssText = "transition: opacity 0.5s ease-in-out;";
        return video;
    };

    // Core logic: ensures each container displays the correct video based on screen size
    const setResponsiveVideos = () => {
        const tier = getVideoTier(); // Get current window size tier as string

        for (const container of videoContainers) {
            const currentTier = container.dataset.currentTier;

            // Only update if the screen has crossed into a new size tier
            if (currentTier !== tier) {
                container.dataset.currentTier = tier;

                // Get the appropriate video source for this tier from the container’s data attributes
                const src = container.getAttribute(`data-vid-${tier}`);

                // If a container is missing one of the tiers, skip to next container
                if (!src) continue;

                let videoToShow = null; // Will hold reference to the correct video (if it already exists)

                // Loop through all existing <video> elements in this container
                container.querySelectorAll("video").forEach((vid) => {
                    // If the video source matches, show this one
                    const vidSrc = vid.getAttribute("src"); // Get raw attribute value to ensure it checks relative path set in html
                    if (vidSrc === src) {
                        videoToShow = vid;
                        vid.style.opacity = "1";
                        vid.play();
                    } else {
                        vid.style.opacity = "0";
                        vid.pause(); // Pause any videos not currently needed
                    }
                });

                // If the correct video isn't already in the DOM, create and append it
                if (!videoToShow) {
                    const newVideo = createVideo(src);
                    container.appendChild(newVideo);
                }
            }
        }
    };

    // Initial run on page load
    setResponsiveVideos();

    // Add resize event listener with throttling
    let resizeRaf;

    window.addEventListener("resize", () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
            setResponsiveVideos();
            resizeRaf = null;
        });
    });
}
