
export const validateStep = (step) => {
    let errors = [];
    
    if (step === 0) {
       errors.push({
           index: 0,
           message: 'Invalid Step value.'
       });
   }

    return errors;
};