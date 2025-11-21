import { generateCSV, downloadCSV, formatCurrency, formatDate } from '@/lib/utils/csv-generator';

describe('CSV Generator Utilities', () => {
  describe('generateCSV', () => {
    it('should generate CSV string from data array', () => {
      const data = [
        { name: 'John Doe', age: 30, email: 'john@example.com' },
        { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
      ];

      const csv = generateCSV(data, {
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'age', header: 'Age' },
          { key: 'email', header: 'Email' },
        ]
      });

      expect(csv).toContain('Name,Age,Email');
      expect(csv).toContain('John Doe,30,john@example.com');
      expect(csv).toContain('Jane Smith,25,jane@example.com');
    });

    it('should handle empty data array', () => {
      const data: any[] = [];

      const csv = generateCSV(data, {
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'age', header: 'Age' },
        ]
      });

      expect(csv).toBe('');
    });

    it('should escape commas in values', () => {
      const data = [
        { name: 'Doe, John', company: 'Acme, Inc.' },
      ];

      const csv = generateCSV(data, {
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'company', header: 'Company' },
        ]
      });

      expect(csv).toContain('"Doe, John"');
      expect(csv).toContain('"Acme, Inc."');
    });
  });

  describe('formatCurrency', () => {
    it('should format number as currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(2500.5)).toBe('$2,500.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-500)).toBe('-$500.00');
    });
  });

  describe('formatDate', () => {
    it('should format date string to ISO format', () => {
      const date = '2025-01-15';
      const formatted = formatDate(date);
      
      expect(formatted).toBe('2025-01-15');
    });

    it('should handle Date objects', () => {
      const date = new Date('2025-01-15');
      const formatted = formatDate(date);
      
      expect(formatted).toBe('2025-01-15');
    });
  });

  describe('downloadCSV', () => {
    it('should generate CSV content for download', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];

      const options = {
        filename: 'test-export',
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'age', header: 'Age' },
        ],
      };

      // Test that the function generates correct CSV content
      const csv = generateCSV(data, options);
      expect(csv).toContain('Name,Age');
      expect(csv).toContain('John,30');
      expect(csv).toContain('Jane,25');
    });
  });
});
