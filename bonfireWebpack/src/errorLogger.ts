console.log("errorLogger initialized");

window.onerror = (err) => {
  handleError(err);
}

export function handleError(information: any) {
  console.log(information);
}
