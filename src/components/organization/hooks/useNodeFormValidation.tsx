import { useCallback } from "react";
import { useState, useEffect } from "react";

export interface FormData {
  name: string;
  id: string;
  phoneNumber: string;
  email: string;
  contactPerson: string;
  address: string;
  status?: string;
  voltage?: string;
  longitude?: string;
  latitude?: string;
  description?: string;
  serialNo?: string; // Potentially distinct from 'id' for API
}

export interface FormErrors {
  email: string;
  phoneNumber: string;
  id: string;
}

interface UseNodeFormValidationProps {
  formData: FormData;
  nodeType: string;
  isInitialValidation?: boolean; // For edit dialogs, validate on load
}

export const useNodeFormValidation = ({
  formData,
  nodeType,
  isInitialValidation = false,
}: UseNodeFormValidationProps) => {
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    phoneNumber: "",
    id: "",
  });
  const [isValid, setIsValid] = useState(false);


  const validateForm = useCallback((data: FormData) => {
    const newErrors: FormErrors = { email: "", phoneNumber: "", id: "" };
    let allFieldsValid = true;

    const requiredFields: (keyof FormData)[] = [
      "name",
      "id",
      "phoneNumber",
      "email",
      "contactPerson",
      "address",
    ];

    if (nodeType !== "Root" && nodeType !== "Region") {
      requiredFields.push("status", "voltage");
    }
    if (nodeType === "Substation" || nodeType === "Transformer") {
      requiredFields.push("longitude", "latitude");
    }

    requiredFields.forEach((field) => {
      if (!data[field]) {
        allFieldsValid = false;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      newErrors.email = "Invalid email format";
      allFieldsValid = false;
    }

    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,}$/;
    if (data.phoneNumber && !phoneRegex.test(data.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
      allFieldsValid = false;
    }

    // ID (serial number) validation
    const idRegex = /^[a-zA-Z0-9]+$/;
    if (data.id && !idRegex.test(data.id)) {
      newErrors.id = "ID must be alphanumeric";
      allFieldsValid = false;
    }

    setErrors(newErrors);
    setIsValid(allFieldsValid);
  }, [nodeType]);

  useEffect(() => {
    if (isInitialValidation) {
      validateForm(formData);
    }
  }, [formData, nodeType, isInitialValidation, validateForm]);

  return { errors, isValid, validateForm };
};
