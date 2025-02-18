export function applyMaskIdentityDoc(inputDUI) {
  if (!inputDUI) return;

  inputDUI.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, 8) + "-" + value.slice(8, 9);
    }

    event.target.value = value;
  });
}

export function applyMaskOnlyLetters(inputText) {
  if (!inputText) return;

  inputText.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(
      /[^a-zA-ZÁÉÍÓÚáéíóúÑñ ]/g,
      ""
    );
  });
}

export function applyMaskAlphaNumeric(inputTransactionId) {
  if (!inputTransactionId) return;

  inputTransactionId.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    value = "TSC" + value.slice(0, 8);

    event.target.value = value;
  });
}
