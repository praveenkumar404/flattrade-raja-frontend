import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormValues {
  call?: any;
  put?: any;
  basePrice?: any;
  resistance1?: any;
  resistance2?: any;
  support1?: any;
  support2?: any;
  amount?: any;
  expiry?: any;
  quantity?: any;
}

interface FormState {
  formValues: FormValues;
}

const formState = localStorage.getItem('formState')

const initialState: FormState = formState ? JSON.parse(formState) : {
  formValues: {
    call: "",
    put: "",
    basePrice: "",
    resistance1: "",
    resistance2: "",
    support1: "",
    support2: "",
    amount: "",
    expiry: "",
    quantity: "",
  },
};

const formValues = createSlice({
  name: 'formState',
  initialState,
  reducers: {
    setFormValues(state, action: PayloadAction<Partial<FormValues>>) {
      state.formValues = { ...state.formValues, ...action.payload };
      localStorage.setItem('formState', JSON.stringify(state));
    },
    // resetFormValues(state) {
    //   state.formValues = { ...initialState.formValues };
    //   localStorage.removeItem('formState');
    // },
    resetFormValues(state) {
        console.log('Resetting form values...');
        state.formValues = {
          call: "",
          put: "",
          basePrice: "",
          resistance1: "",
          resistance2: "",
          support1: "",
          support2: "",
          amount: "",
          expiry: "",
          quantity: "",
        };
        localStorage.removeItem('formState');
      },      
  },
});

export const { setFormValues, resetFormValues } = formValues.actions;
export default formValues.reducer;
