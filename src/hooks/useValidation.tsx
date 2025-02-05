import { useState } from 'react';
import { ValidationResult } from '@/lib/types/gen';

function useValidation(selectedFile: File | null) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target?.result;
      if (typeof fileContent === 'string') {
        const formData = new FormData();
        formData.append('data', fileContent);

        try {
          const response = await fetch('/api/validate', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          setValidationResult(result as ValidationResult);
        } catch (error) {
          setValidationResult({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          setLoading(false);
        }
      }
    };

    reader.readAsText(selectedFile);
  };

  return { validationResult, handleValidate, loading };
}

export default useValidation;
