/* ========================= NPM ======================== */
// jQuery
// import "./base/_jquery-global";

// Popper.js (* tooltip, popover, dropdown)
// import * as Popper from "@popperjs/core";

// Use following imports only where needed (not globally)
// Bootstrap modules (add as needed)
// import "bootstrap/js/dist/carousel";

// Glidejs
// import Glide from "@glidejs/glide";
// window.Glide = Glide;

/* ======================== BASE ======================== */
// Import utilities as needed
import {
    utl_keyboardFocusMode,
    utl_setFooterYear,
    utl_handleModalClose,
    // utl_ehElements,
    // utl_toggleCookiesAlert,
    // utl_anchorScrollOffset,
} from "./base/_utils";

// Call utility functions after imported
utl_keyboardFocusMode();
utl_setFooterYear();
utl_handleModalClose();
// utl_toggleCookiesAlert();
// utl_anchorScrollOffset();
// document.querySelector('.eh-container') && utl_ehElements();

/* ===================== COMPONENTS ===================== */
import navigationInit from "./components/_navigation";
navigationInit();

import carouselsInit from "./components/_carousels";
document.querySelector(".carousel") && carouselsInit();

/* ======================== PAGES ======================= */
// Individual page scripts are added in the header of specific page's index file
