const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

const info = document.querySelector(".alert-info");
const verificationButton = document.querySelector("#verification")

verificationButton.addEventListener("click", (e) => {
    e.preventDefault();
    const phoneNumber = phoneInput.getNumber();
    console.log(phoneNumber)
    phoneInputField.value = phoneNumber

})