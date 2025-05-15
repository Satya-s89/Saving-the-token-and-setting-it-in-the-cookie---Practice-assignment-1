// Helper function for base64 encoding (browser-compatible)
const base64Encode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
};

// Helper function for base64 decoding (browser-compatible)
const base64Decode = (str) => {
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

const encrypt = (payload) => {
  // Convert payload to string if it's an object
  const payloadStr = typeof payload === 'object' ? JSON.stringify(payload) : payload;

  // Base64 encode the payload
  const base64Payload = base64Encode(payloadStr);

  // Create a simple JWT structure (header.payload.signature)
  // Using a simple header for this exercise
  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

  // For this exercise, we'll use a simple signature (in real applications, use a proper signing algorithm)
  const signature = base64Encode('secret-key');

  // Combine to form the JWT token
  return `${header}.${base64Payload}.${signature}`;
};

const decrypt = (token) => {
  // Split the token into its components
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  // Extract the payload (middle part)
  const base64Payload = parts[1];

  // Decode the Base64 payload
  const payloadStr = base64Decode(base64Payload);

  // Parse the JSON if it's valid JSON
  try {
    return JSON.parse(payloadStr);
  } catch (e) {
    // If not valid JSON, return the string
    return payloadStr;
  }
};

// For browser environment
if (typeof window !== 'undefined') {
  window.jwtFunctions = {
    encrypt,
    decrypt
  };
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    encrypt,
    decrypt
  };
}
