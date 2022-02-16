const form = document.querySelector("form");
const numberOne = document.querySelector("#n1");
const numberTwo = document.querySelector("#n2");
const button = document.querySelector("button");

let numberOneValue = 0;
numberOne.value = numberOneValue;

numberOne.addEventListener("change", () => {
  numberOneValue = numberOne.value;
  numberOne.value = numberOneValue;
});

let numberTwoValue = 0;
numberTwo.value = numberTwoValue;

numberTwo.addEventListener("change", () => {
  numberTwoValue = numberTwo.value;
  numberTwo.value = numberTwoValue;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = `${window.location}?a=${numberOneValue}&b=${numberTwoValue}`;
  window.location = url;
});
