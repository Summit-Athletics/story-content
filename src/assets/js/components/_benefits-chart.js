import { html } from "../base/_utils";
import "bootstrap/js/dist/tab";

export default function benefitsChartInit() {
    const benefitsList = document.querySelector("#benefits-list");
    const benefitLevels = document.querySelectorAll(".list-group-item");
    const benefitsLevelTitle = document.querySelector("#benefits-level-title");

    // Set initial HTML of the .tab-content
    let tabContent = html`
        <div id="benefits-panel" class="tab-pane fade show active p-0" role="tabpanel" aria-labelledby="${benefitLevels[0].id}" aria-live="polite">
            <ul class="list-unstyled cols-1 cols-lg-3 pb-4">
                <!-- LEVEL 1-->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 included-benefit" data-sa-benefit-level="0">
                    <p class="benefit font-primary-bold mb-0">Benefit 1</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 included-benefit" data-sa-benefit-level="0">
                    <p class="benefit font-primary-bold mb-0">Benefit 2</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 included-benefit" data-sa-benefit-level="0">
                    <p class="benefit font-primary-bold mb-0">Benefit 3</p>
                </li>
                <!-- LEVEL 2 -->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="1">
                    <p class="benefit font-primary-bold mb-0">Benefit 4</p>
                </li>
                <!-- LEVEL 3 -->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="2">
                    <p class="benefit font-primary-bold mb-0">Benefit 5</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="2">
                    <p class="benefit font-primary-bold mb-0">Benefit 6</p>
                </li>
                <!-- LEVEL 4 -->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="3">
                    <p class="benefit font-primary-bold mb-0 pe-5 pe-sm-0">Benefit 7</p>
                </li>
                <!-- LEVEL 5 -->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="4">
                    <p class="benefit font-primary-bold mb-0 pe-5 pe-sm-0">Benefit 8</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="4">
                    <p class="benefit font-primary-bold mb-0 pe-5 pe-sm-0">Benefit 9</p>
                </li>
                <!-- LEVEL 6 -->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="5">
                    <p class="benefit font-primary-bold mb-0 pe-5 pe-sm-0">Benefit 10</p>
                </li>
                <!-- 7 -->
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="6">
                    <p class="benefit font-primary-bold mb-0 pe-5 pe-sm-0">Benefit 11</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="6">
                    <p class="benefit font-primary-bold mb-0">Benefit 12</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="6">
                    <p class="benefit font-primary-bold mb-0">Benefit 13</p>
                </li>
                <li class="benefit-wrapper mb-2 d-flex align-items-center p-2 unavailable-benefit" data-sa-benefit-level="6">
                    <p class="benefit font-primary-bold mb-0 pe-5 pe-sm-0">Benefit 14</p>
                </li>
            </ul>
        </div>
    `;

    /* ****************************************************** */
    /*                  RENDER & UPDATE LOGIC                 */
    /* ****************************************************** */
    // Render initial HTML of tabContent on first load
    benefitsList.innerHTML = tabContent;

    // Function to update the styles of benefit items based on the selected level
    function updateBenefitStyles(selected) {
        // Loop through all elements with 'data-sa-benefit-level' attribute
        document.querySelectorAll("[data-sa-benefit-level]").forEach((el) => {
            const level = Number(el.dataset.saBenefitLevel); // Get integer value from attribute

            // A benefit is "added" only when it matches the selected level (except level 0)
            const isAdded = level === selected && selected !== 0;

            // A benefit is "included" if it is below the selected level,
            // OR if level 0 is selected and this is level 0
            const isIncluded = level < selected || (selected === 0 && level === 0);

            // Apply classes based on derived state
            el.classList.toggle("added-benefit", isAdded);
            el.classList.toggle("included-benefit", isIncluded);
            el.classList.toggle("unavailable-benefit", !isAdded && !isIncluded);
        });
    }

    // Attach a click handler to each benefit level (benefit nav button)
    benefitLevels.forEach((level, i) => {
        level.addEventListener("click", () => {
            // Only update visual state when the clicked level is the active tab
            // (Bootstrap will toggle the 'active' class)
            if (level.classList.contains("active")) {
                // Update the benefits header/title based on the active level
                benefitsLevelTitle.innerHTML = html`${level.dataset.saBenefitTitle}`;

                // Loop through all levels and apply 'shown' styles based on their position
                // relative to the active level index
                benefitLevels.forEach((l, idx) => {
                    // add .shown to levels BELOW the active one (except the active itself)
                    l.classList.toggle("shown", idx < i && !l.classList.contains("active"));
                });
            }

            // Ensure the first level is always visually shown
            // (acts as a baseline / starting state)
            benefitLevels[0].classList.add("shown");

            // Inject the current tab’s benefit content
            benefitsList.innerHTML = tabContent;

            // Keep ARIA relationship in sync with the active tab
            document.querySelector(".tab-pane").setAttribute("aria-labelledby", level.id);

            // Apply any additional visual rules tied to the active index
            updateBenefitStyles(i);
        });
    });
}
