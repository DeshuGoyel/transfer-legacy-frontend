import sodium from 'libsodium-wrappers-sumo';
import { api } from './api';
import { toBase64Url, fromBase64Url, getDeviceId } from './aeadClient';
import { getSecureItem, setSecureItem } from './secureKeyStore';

export async function registerDevice(userId: string): Promise<void> {
  await sodium.ready;
  const deviceId = getDeviceId();
  
  // Check if we have local device keys, if not generate them securely
  let pubKeyStr = await getSecureItem('tl_device_public_key');
  let privKeyStr = await getSecureItem('tl_device_private_key');
  
  let keypair;
  if (!pubKeyStr || !privKeyStr) {
    keypair = sodium.crypto_sign_keypair();
    pubKeyStr = toBase64Url(keypair.publicKey);
    privKeyStr = toBase64Url(keypair.privateKey);
    await setSecureItem('tl_device_public_key', pubKeyStr);
    await setSecureItem('tl_device_private_key', privKeyStr);
  } else {
    keypair = {
      publicKey: fromBase64Url(pubKeyStr),
      privateKey: fromBase64Url(privKeyStr)
    };
  }
  
  const ts = Math.floor(Date.now() / 1000);
  
  // Canonical JCS representation of device registration payload
  // Keys in alphabetical order: device_id, ts, user_id
  const jcsPayload = JSON.stringify({
    device_id: deviceId,
    ts: ts,
    user_id: userId
  });
  
  const digest = sodium.crypto_generichash(32, new TextEncoder().encode(jcsPayload), null);
  const sig = sodium.crypto_sign_detached(digest, keypair.privateKey);
  
  const registerPayload = {
    device_id: deviceId,
    user_id: userId,
    ts: ts,
    device_sig: toBase64Url(sig),
    ed25519_pubkey: pubKeyStr,
    device_meta: {
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Safari',
      location: 'Local Node'
    }
  };
  
  // POST /v1/devices/register is AEAD-encrypted (default api.post behavior)
  await api.post('/devices/register', registerPayload);
}
