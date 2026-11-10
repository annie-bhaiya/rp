const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /api[_-]?key/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /card[_-]?number/i,
  /cvv/i,
  /signature/i,
];

const CARD_NUMBER_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

export function redactSensitiveText(text: string, maskEmails: boolean = false): string {
  let redacted = text.replace(CARD_NUMBER_REGEX, '****-****-****-****');
  if (maskEmails) {
    redacted = redacted.replace(EMAIL_REGEX, (email) => {
      const [name, domain] = email.split('@');
      return `${name[0]}***@${domain}`;
    });
  }
  return redacted;
}

export function redactObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return redactSensitiveText(obj) as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
    if (isSensitiveKey) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = redactObject(value);
    }
  }
  return result as T;
}
