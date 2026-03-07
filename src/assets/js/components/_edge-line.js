export default function edgeLineInit() {
    // Get distance from element (w/ line) and set width of line to edge of screen
    function setLineWidth(el, line, direction) {
        const rect = el.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth; // Use clientWidth to avoid zoom issues
        const totalDistance = direction === "right" ? viewportWidth - rect.right : rect.left;
        line.style.width = `calc(${totalDistance}px)`;
    }

    const edgeLineWrappers = document.querySelectorAll(".edge-line-wrapper");

    function getAndSetLineWidths() {
        edgeLineWrappers.forEach((wrapper) => {
            const lines = wrapper.querySelectorAll(".line");

            lines.forEach((line) => {
                const direction = line.classList.contains("right-line") ? "right" : "left";
                setLineWidth(wrapper, line, direction);
            });
        });
    }

    getAndSetLineWidths();

    // Add resize event listener with throttling
    let resizeRaf;

    window.addEventListener("resize", () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
            getAndSetLineWidths();
            resizeRaf = null;
        });
    });
}
