import { loginSchema, registerSchema } from '@/lib/validations/authValidation';
import type { LoginFormValues, RegisterFormValues } from '@/lib/validations/authValidation';

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData: LoginFormValues = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email invalide');
        expect(result.error.issues[0].path).toEqual(['email']);
      }
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email invalide');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123', // Less than 4 characters
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Le mot de passe doit contenir au moins 4 caractères');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const validData: RegisterFormValues = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'REGULATEUR',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J', // Less than 2 characters
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'REGULATEUR',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Le nom doit contenir au moins 2 caractères');
        expect(result.error.issues[0].path).toEqual(['name']);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'REGULATEUR',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email invalide');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345', // Less than 6 characters
        confirmPassword: '12345',
        role: 'REGULATEUR',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Le mot de passe doit contenir au moins 6 caractères');
        expect(result.error.issues[0].path).toEqual(['password']);
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different123',
        role: 'REGULATEUR',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmPasswordError = result.error.issues.find(
          issue => issue.path.includes('confirmPassword')
        );
        expect(confirmPasswordError?.message).toBe('Les mots de passe ne correspondent pas');
      }
    });

    it('should reject invalid role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'INVALID_ROLE',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Veuillez sélectionner un rôle valide');
        expect(result.error.issues[0].path).toEqual(['role']);
      }
    });

    it('should accept all valid roles', () => {
      const roles = ['ADMIN', 'REGULATEUR', 'CHEF_DE_PARC'] as const;

      roles.forEach(role => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          role,
        };

        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email', // Invalid format
        password: '123', // Too short
        confirmPassword: 'different', // Doesn't match
        role: 'INVALID', // Invalid role
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);

        const errorMessages = result.error.issues.map(issue => issue.message);
        expect(errorMessages).toContain('Le nom doit contenir au moins 2 caractères');
        expect(errorMessages).toContain('Email invalide');
        expect(errorMessages).toContain('Le mot de passe doit contenir au moins 6 caractères');
      }
    });
  });
});
