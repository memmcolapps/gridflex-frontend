import { useState, useEffect, useCallback } from "react";

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
  serialNo?: string;
  assetId?: string; // Added assetId to FormData
}

export interface FormErrors {
  email: string;
  phoneNumber: string;
  id: string;
  assetId: string; // Added assetId to FormErrors
}

interface UseNodeFormValidationProps {
  formData: FormData;
  nodeType: string;
  isInitialValidation?: boolean;
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
    assetId: "",
  });
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback((data: FormData) => {
    const newErrors: FormErrors = { email: "", phoneNumber: "", id: "", assetId: "" };
    let allFieldsValid = true;

    const requiredFields: (keyof FormData)[] = [
      "name",
      "phoneNumber",
      "email",
      "contactPerson",
      "address",
    ];

    // Only require id for Root, Region, and Business Hub
    if (["Root", "Region", "Business Hub"].includes(nodeType)) {
      requiredFields.push("id");
    }

    // Require status, voltage, and assetId for non-Root, non-Region nodes
    if (nodeType !== "Root" && nodeType !== "Region") {
      requiredFields.push("status", "voltage", "assetId");
    }

    // Require longitude and latitude for Substation and Distribution Substation (DSS)
    if (nodeType === "Substation" || nodeType === "Distribution Substation (DSS)") {
      requiredFields.push("longitude", "latitude");
    }

    // Check for empty required fields
    requiredFields.forEach((field) => {
      if (!data[field]) {
        if (field in newErrors) {
          newErrors[field as keyof FormErrors] = `${field === "assetId" ? "Asset ID" : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
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

    // ID validation (only for Root, Region, Business Hub)
    if (["Root", "Region", "Business Hub"].includes(nodeType)) {
      const idRegex = /^[a-zA-Z0-9]+$/;
      if (data.id && !idRegex.test(data.id)) {
        newErrors.id = "ID must be alphanumeric";
        allFieldsValid = false;
      }
    }

    // Asset ID validation (for Substation, Feeder Line, Distribution Substation)
    if (["Substation", "Feeder Line", "Distribution Substation (DSS)"].includes(nodeType)) {
      const assetIdRegex = /^[a-zA-Z0-9]+$/;
      if (data.assetId && !assetIdRegex.test(data.assetId)) {
        newErrors.assetId = "Asset ID must be alphanumeric";
        allFieldsValid = false;
      }
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