import { describe, it, expect } from 'vitest';
import {
  validateCPF,
  validateCNPJ,
  validateEmail,
  validatePhone,
  formatPhone,
  formatDocument,
  formatZipCode,
  validatePasswordStrength,
  tagsToString,
  stringToTagsPreview,
  validatePrompt,
  validateTagList,
} from './validators';

describe('validateCPF', () => {
  it('validates a correct CPF', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('rejects an invalid CPF', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('123.456.789-00')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(validateCPF('123')).toBe(false);
  });
});

describe('validateCNPJ', () => {
  it('validates a correct CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
  });

  it('rejects an invalid CNPJ', () => {
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(validateCNPJ('123')).toBe(false);
  });
});

describe('validateEmail', () => {
  it('validates correct emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('validates Brazilian phone numbers', () => {
    expect(validatePhone('11999887766')).toBe(true);
    expect(validatePhone('1133445566')).toBe(true);
  });

  it('rejects short numbers', () => {
    expect(validatePhone('123')).toBe(false);
  });
});

describe('formatPhone', () => {
  it('formats 11-digit mobile numbers', () => {
    expect(formatPhone('11999887766')).toBe('(11) 99988-7766');
  });

  it('formats 10-digit landline numbers', () => {
    expect(formatPhone('1133445566')).toBe('(11) 3344-5566');
  });

  it('returns original for other lengths', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('formatDocument', () => {
  it('formats CPF', () => {
    expect(formatDocument('52998224725')).toBe('529.982.247-25');
  });

  it('formats CNPJ', () => {
    expect(formatDocument('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('returns original for other lengths', () => {
    expect(formatDocument('123')).toBe('123');
  });
});

describe('formatZipCode', () => {
  it('formats 8-digit CEP', () => {
    expect(formatZipCode('01310100')).toBe('01310-100');
  });

  it('returns original for other lengths', () => {
    expect(formatZipCode('123')).toBe('123');
  });
});

describe('validatePasswordStrength', () => {
  it('returns invalid for short passwords', () => {
    const result = validatePasswordStrength('Ab1!');
    expect(result.isValid).toBe(false);
    expect(result.feedback.length).toBeGreaterThan(0);
  });

  it('returns valid for strong passwords', () => {
    const result = validatePasswordStrength('MyStr0ng!Pass');
    expect(result.isValid).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  it('respects custom minLength', () => {
    const result = validatePasswordStrength('Ab1!Ab1!', { minLength: 12 });
    expect(result.isValid).toBe(false);
  });
});

describe('tagsToString', () => {
  it('converts tag array to comma-separated string', () => {
    const tags = [
      { tagId: 1, title: 'react' },
      { tagId: 2, title: 'typescript' },
    ];
    expect(tagsToString(tags)).toBe('react, typescript');
  });

  it('returns empty string for empty array', () => {
    expect(tagsToString([])).toBe('');
  });
});

describe('stringToTagsPreview', () => {
  it('splits comma-separated string into array', () => {
    expect(stringToTagsPreview('react, typescript, vite')).toEqual(['react', 'typescript', 'vite']);
  });

  it('trims whitespace', () => {
    expect(stringToTagsPreview('  react ,  typescript  ')).toEqual(['react', 'typescript']);
  });

  it('filters empty entries', () => {
    expect(stringToTagsPreview(',react,,typescript,')).toEqual(['react', 'typescript']);
  });
});

describe('validatePrompt', () => {
  it('rejects short prompts', () => {
    const result = validatePrompt('short');
    expect(result.valid).toBe(false);
  });

  it('accepts valid prompts', () => {
    const result = validatePrompt('This is a valid prompt for AI generation');
    expect(result.valid).toBe(true);
  });

  it('rejects prompts over 2000 characters', () => {
    const result = validatePrompt('a'.repeat(2001));
    expect(result.valid).toBe(false);
  });
});

describe('validateTagList', () => {
  it('accepts valid tag list', () => {
    const result = validateTagList('react, typescript, vite');
    expect(result.valid).toBe(true);
    expect(result.tags).toEqual(['react', 'typescript', 'vite']);
  });

  it('accepts empty tag list', () => {
    const result = validateTagList('');
    expect(result.valid).toBe(true);
    expect(result.tags).toEqual([]);
  });

  it('rejects tags over 50 characters', () => {
    const result = validateTagList('a'.repeat(51));
    expect(result.valid).toBe(false);
  });
});
