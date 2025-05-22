import { faker } from '@faker-js/faker';

/**
 * Factory to create fake retail customer data
 */
export function makeFakeRetailCustomer(overrides = {}) {
  return {
    name: faker.person.fullName(),
    cpf: faker.string.numeric(11),   // Brazilian CPF has 11 digits
    rg: faker.string.alphanumeric(9), // RG is typically alphanumeric
    birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0], // 'YYYY-MM-DD'
    gender: faker.helpers.arrayElement(['M', 'F', 'O']),
    email: faker.internet.email(),
    ...overrides
  };
}

