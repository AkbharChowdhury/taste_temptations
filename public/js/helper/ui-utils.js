const PAYMENT_REQUIRED_CODE = 402;
export const paymentIsRequired = code => code === PAYMENT_REQUIRED_CODE;
export const errorMessageTag = message =>  /*html*/ `<div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Cannot fetch recipe details!</h4>
  <p>Please view message below for more details</p>
  <hr>
  <p class="mb-0">${message}</p>
</div>`;