process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testUser;
beforeEach( async () => {
    const result = await db.query(`INSERT INTO users(first_name, last_name, username, password, email, phone_number, 
        is_admin)
    VALUES('Nabin', 'Niroula', 'nn', 'happpyCoding', 'test@test.com', '720-000-1100', 'false') 
    RETURNING  first_name, last_name, username, email`);
    testUser = result.rows[0];
})

/* Delete each user after it is created and each test runs */
afterEach(async () => {
    await db.query(`DELETE FROM users`);
})

/* test file keeps running continuously, use db.end to stop it.*/
afterAll(async () => {
    await db.end();
})

describe("This should render a user object", () => {
    test('First test User', () => {
        expect(testUser).toStrictEqual(
            {
                first_name: 'Nabin',
                last_name: 'Niroula',
                username: 'nn',
                email: 'test@test.com'
            }
        )
    })
});

// describe('GET/users', () => {
    test('Get a list with one user', async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
        // expect(response.body).toStrictEqual([testUser]);
    })

    /*
    test('Get a user by its id', async () => {
        const res = await request(app).get(`/users/${testUser.id}`);
        expect(res.statusCode).toBe(200);
    })
    */
// })

