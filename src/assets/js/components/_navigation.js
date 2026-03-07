import Offcanvas from "bootstrap/js/dist/offcanvas";
import Dropdown from "bootstrap/js/dist/dropdown";

export default function navigationInit() {
    const mobileMenuToggle = document.querySelector(".animated-toggler");
    const bsOffcanvas = new Offcanvas("#offcanvas-navbar");
    const dropdownNavItems = document.querySelectorAll(".nav-item.dropdown"); // <li> containing dropdown item

    // Desktop breakpoint - update accordingly
    const mq = window.matchMedia("(min-width: 991.98px)");

    mobileMenuToggle.addEventListener("click", () => {
        mobileMenuToggle.classList.add("opened");
        // Delay mobile menu show until after toggle animation finishes
        setTimeout(() => {
            bsOffcanvas.show();
        }, 350);
    });

    // Remove .opened class from toggler after mobile menu finishes closing
    document.querySelector("#offcanvas-navbar").addEventListener("hidden.bs.offcanvas", () => {
        mobileMenuToggle.classList.remove("opened");
    });

    // Toggle open/close state of dropdown-menu (for hover on desktop)
    function toggleDropdown(e, action) {
        const item = e.currentTarget;
        const toggle = item.querySelector(".dropdown-toggle");
        const instance = Dropdown.getOrCreateInstance(toggle);

        instance[action](); // e.g. instance.show();
    }

    // Make menu item clickable (navigate to page for <a> dropdown-toggle)
    // Uncomment event listeners in enable*DropdownBehavior functions below to use
    const handleLinkToggle = (e) => {
        const item = e.currentTarget;

        if (item.tagName === "A") {
            window.location.href = e.currentTarget.href;
        }
    };

    // Toggle tabindex on dropdown items from -1 to 0 when dropdown menu is opened
    // (Not tabbable when closed/tabbable when open)
    dropdownNavItems.forEach((item) => {
        const dropdownItems = item.querySelectorAll(".dropdown-item");

        item.addEventListener("show.bs.dropdown", () => {
            dropdownItems.forEach((dropdownItem) => {
                dropdownItem.setAttribute("tabindex", "0");
            });
        });

        item.addEventListener("hidden.bs.dropdown", () => {
            dropdownItems.forEach((dropdownItem) => {
                dropdownItem.setAttribute("tabindex", "-1");
            });
        });
    });

    // Hovering logic (desktop)
    const handleMouseEnter = (e) => toggleDropdown(e, "show"); // Show the dropdown
    const handleMouseLeave = (e) => toggleDropdown(e, "hide"); // Hide the dropdown

    // Add hover state (desktop)
    function enableDesktopDropdownBehavior() {
        dropdownNavItems.forEach((item) => {
            item.querySelector(".dropdown-toggle").addEventListener("click", handleLinkToggle);
            item.addEventListener("mouseenter", handleMouseEnter);
            item.addEventListener("mouseleave", handleMouseLeave);
        });
    }

    // Remove hover state (mobile)
    function enableMobileDropdownBehavior() {
        dropdownNavItems.forEach((item) => {
            item.querySelector(".dropdown-toggle").removeEventListener("click", handleLinkToggle);
            item.removeEventListener("mouseenter", handleMouseEnter);
            item.removeEventListener("mouseleave", handleMouseLeave);
        });
    }

    // Responsively toggle dropdown behavior
    const updateDropdownBehavior = (e) => {
        e.matches ? enableDesktopDropdownBehavior() : enableMobileDropdownBehavior();
    };

    // Run once on load
    updateDropdownBehavior(mq);

    // Listen for breakpoint changes and update accordingly
    mq.addEventListener("change", updateDropdownBehavior);
}
