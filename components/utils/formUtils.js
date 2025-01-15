// import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { validateForm } from "./formValidation";
import * as SecureStore from "expo-secure-store";

export const handleSubmit = async ({
  formValues,
  rows,
  validationRules,
  apiEndpoint,
  setErrors,
  setIsFormValid,
  setLoading,
  setSuccessModalVisible,
  setErrorModalVisible,
  setErrorMessages,
  setIsSubmitted,
}) => {
  console.log("Submit button clicked");
  setIsSubmitted(true);
  const formData = {
    ...formValues,
    rows,
  };

  console.log("Form Data:", formData);

  const validationErrors = validateForm(formData, validationRules);
  setErrors(validationErrors);
  setIsFormValid(Object.keys(validationErrors).length === 0);

  if (Object.keys(validationErrors).length === 0) {
    console.log("Form validation passed");
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [day, month, year] = formValues.date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

    try {
      const response = await axios.post(
        apiEndpoint,
        {
          userId,

          ...formValues,
          date: isoDate,
          items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      console.log("Server Response:", response.data.message);

      if (response.status === 201) {
        console.log("Request successful");
        setSuccessModalVisible(true);
      } else {
        setErrorMessages([response.data.message || "Something went wrong."]);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error response:", error.response?.data?.message);
      if (error.response && error.response.data.message) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        backendErrors.forEach((err) => {
          formattedErrors[err.path] = err.msg;
        });
        setErrors(formattedErrors);
        setErrorMessages([
          error.response.data.message || "Something went wrong.",
        ]);
        setErrorModalVisible(true);
      } else if (error.request) {
        setErrorMessages(["No response received from server."]);
        setErrorModalVisible(true);
      } else {
        setErrorMessages(["An error occurred while setting up the request."]);
        setErrorModalVisible(true);
      }
    } finally {
      setLoading(false);
    }
  } else {
    console.log("Form validation failed");
    Alert.alert("Validation Error", "Please fix the errors and try again.");
  }
};
