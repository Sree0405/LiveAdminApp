import { useCallback, useState } from 'react';

export type ValidationRule<T = unknown> = {
  test: (value: T, all?: Record<string, unknown>) => boolean;
  message: string;
};

export function useValidation<T extends Record<string, unknown>>(rules: Partial<Record<keyof T, ValidationRule<any>[]>>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, value: unknown, all?: T): string | null => {
      const fieldRules = rules[name];
      if (!fieldRules) return null;
      for (const r of fieldRules) {
        if (!r.test(value, all)) return r.message;
      }
      return null;
    },
    [rules]
  );

  const validate = useCallback(
    (values: T): boolean => {
      const next: Partial<Record<keyof T, string>> = {};
      let valid = true;
      for (const key of Object.keys(rules) as (keyof T)[]) {
        const err = validateField(key, values[key], values);
        if (err) {
          next[key] = err;
          valid = false;
        }
      }
      setErrors(next);
      return valid;
    },
    [rules, validateField]
  );

  const setError = useCallback((name: keyof T, message: string | null) => {
    setErrors((prev) => (message ? { ...prev, [name]: message } : { ...prev, [name]: undefined }));
  }, []);

  const setTouchedField = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  return { errors, touched, validate, validateField, setError, setTouchedField, clearErrors };
}

export const rules = {
  required: (message = 'This field is required'): ValidationRule<string> => ({
    test: (v) => typeof v === 'string' && v.trim().length > 0,
    message,
  }),
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    test: (v) => typeof v === 'string' && v.trim().length >= min,
    message: message ?? `Min ${min} characters`,
  }),
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    test: (v) => typeof v === 'string' && v.length <= max,
    message: message ?? `Max ${max} characters`,
  }),
  positiveNumber: (message = 'Must be a positive number'): ValidationRule<unknown> => ({
    test: (v) => {
      if (v === '' || v == null) return true;
      const n = Number(v);
      return !isNaN(n) && n >= 0;
    },
    message,
  }),
  dateNotPast: (message = 'Date cannot be in the past'): ValidationRule<string> => ({
    test: (v) => {
      if (!v || typeof v !== 'string') return true;
      const d = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    },
    message,
  }),
  dateRequired: (message = 'Date is required'): ValidationRule<string> => ({
    test: (v) => typeof v === 'string' && v.length >= 10,
    message,
  }),
};
