// DOM Elements - all the elements we need from HTML
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

function CharacterSets() {
  const temporaryCharacterSets = [
    {
      character: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      valueChecked: uppercaseCheckbox.checked,
    },
    {
      character: "abcdefghijklmnopqrstuvwxyz",
      valueChecked: lowercaseCheckbox.checked,
    },
    { character: "0123456789", valueChecked: numbersCheckbox.checked },
    {
      character: "!@#$%^&*()-_=+[]{}|;:,.<>?/",
      valueChecked: symbolsCheckbox.checked,
    },
  ];

  const stringCharacterSets = temporaryCharacterSets.reduce(
    (prevValue, currentValue) => {
      return currentValue.valueChecked
        ? prevValue + currentValue.character
        : prevValue;
    },
    ""
  );

  return stringCharacterSets
    ? stringCharacterSets
    : alert("Please select at least one char type.");
}

lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

function makePassword() {
  const length = Number(lengthSlider.value);
  createRandomPassword(CharacterSets(), length);
}

function createRandomPassword(allCharacter, length) {
  if (!allCharacter) return;

  let password = "";
  for (let i = 0; i <= length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacter.length);
    password += allCharacter[randomIndex];
  }

  passwordInput.value = password;
  updateStrengthMeter(password);
}

function updateStrengthMeter(password) {
  const passwordLength = password.length;
  const hasCharacter = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/.test(password),
  ];

  let strengthScore = 0;

  strengthScore += Math.min(passwordLength * 2, 40);

  strengthScore = hasCharacter.reduce((prevValue, currentValue) => {
    return currentValue ? prevValue + 15 : prevValue;
  }, strengthScore);

  if (passwordLength < 8) {
    strengthScore = Math.min(strengthScore, 40);
  }

  const safeScore = Math.max(5, Math.min(100, strengthScore));
  strengthBar.style.width = safeScore + "%";

  let strengthLabelText = "";
  let barColor = "";

  if (strengthScore < 40) {
    barColor = "#fc8181";
    strengthLabelText = "Weak";
  } else if (strengthScore < 70) {
    barColor = "#fbd38d";
    strengthLabelText = "Medium";
  } else {
    barColor = "#68d391";
    strengthLabelText = "Strong";
  }

  strengthBar.style.backgroundColor = barColor;
  strengthLabel.textContent = strengthLabelText;
  strengthLabel.style.color = barColor;
}

window.addEventListener("DOMContentLoaded", makePassword);

copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;

  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy:", error));
});

function showCopySuccess() {
  copyButton.classList.remove("far", "fa-copy");
  copyButton.classList.add("fas", "fa-check");
  copyButton.style.color = "#48bb78";

  setTimeout(() => {
    copyButton.classList.remove("fas", "fa-check");
    copyButton.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}
