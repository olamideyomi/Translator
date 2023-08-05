/**
 * Selects the input fields and buttons from the DOM
 * @type {HTMLInputElement} fromText - The input field for the text to be translated
 * @type {HTMLInputElement} toText - The input field for the translated text
 * @type {HTMLDivElement} exchageIcon - The button to exchange the input fields
 * @type {NodeListOf<HTMLSelectElement>} selectTag - The select tags for selecting the languages
 * @type {NodeListOf<HTMLElement>} icons - The icons for copying and speaking the text
 * @type {HTMLButtonElement} translateBtn - The button to translate the text
 */
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchageIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

/**
 * Populates the select tags with options for selecting the languages
 * @param {HTMLSelectElement} tag - The select tag to be populated
 * @param {number} id - The id of the select tag
 */
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "de-DE" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

/**
 * Exchanges the input fields and the selected languages
 */
exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

/**
 * Clears the translated text input field when the original text input field is empty
 */
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

/**
 * Translates the text using the selected languages and displays the translated text
 */
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if (data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});

/**
 * Copies or speaks the text depending on the clicked icon
 */
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});