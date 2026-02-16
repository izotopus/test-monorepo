import { signal } from "@preact/signals-core";

export const isAppBusy = signal(false);
export const toggleLoader = (state: boolean) => {
  isAppBusy.value = state;
};

export const isLoading = signal(false);
export const toggleIsLoading = (state: boolean) => {
  isLoading.value = state;
};

export const registrationPreview = signal({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  repassword: ''
});
export const updateRegistrationPreview = (data: any) => {
  registrationPreview.value = { ...registrationPreview.value, ...data };
};