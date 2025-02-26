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

export function applyMaskAlphaNumericOnly(inputElement) {
  if (!inputElement) return;

  inputElement.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(
      /[^a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ ]/g,
      ""
    );
  });
}

export function applyMaskOnlyNumbersWithDecimal(inputAmount) {
  if (!inputAmount) return;

  inputAmount.addEventListener("input", (event) => {
    event.target.value = event.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
  });
}

export function applyMaskEmail(inputEmail) {
  if (!inputEmail) return;

  inputEmail.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9@._-]/g, "");
  });
}

export function applyMaskDate(inputDate) {
  if (!inputDate) return;

  inputDate.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    event.target.value = value;
  });
}
