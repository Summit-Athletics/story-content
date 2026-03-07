/* ========== TRIGGER POPUP MODAL ON PAGE LOAD ========== */
import Modal from "bootstrap/js/dist/modal";

export default function triggerPopup(modalId) {
    const popup = new Modal(modalId);
    popup.show();
}
