import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'lifeadmin_pin';

export async function hasHardware(): Promise<boolean> {
  const compat = await LocalAuthentication.hasHardwareAsync();
  return compat;
}

export async function isEnrolled(): Promise<boolean> {
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function authenticateWithBiometrics(reason?: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason ?? 'Unlock LifeAdmin Pro',
    fallbackLabel: 'Use PIN',
  });
  return result.success;
}

export async function setPin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function getPin(): Promise<string | null> {
  return SecureStore.getItemAsync(PIN_KEY);
}

export async function hasPin(): Promise<boolean> {
  const pin = await getPin();
  return pin != null && pin.length > 0;
}

export async function verifyPin(input: string): Promise<boolean> {
  const stored = await getPin();
  return stored === input;
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function supportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
  return LocalAuthentication.supportedAuthenticationTypesAsync();
}
