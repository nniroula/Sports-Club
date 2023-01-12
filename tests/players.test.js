process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');


let testPlayer;
beforeEach( async () => {
    const result = await db.query(`INSERT INTO players(first_name, last_name, email, birth_date, phone_number, 
        emergency_contact, registered_date)
    VALUES('John', 'Doe', 'jodo@gmail.com', '12/05/1988', '100-000-0070', 'No One', '05/24/2022') RETURNING 
    first_name, last_name, email, birth_date, phone_number, emergency_contact, registered_date`);
    testPlayer = result.rows[0];
})

/* Delete each user after it is created and each test runs */
afterEach(async () => {
    await db.query(`DELETE FROM players`);
})

/* test file keeps running continuously, use db.end to stop it.*/
afterAll(async () => {
    await db.end();
})

test('First test player', () => {
    expect(testPlayer).toStrictEqual(
        {
            first_name: 'John', 
            last_name: 'Doe', 
            email: 'jodo@gmail.com', 
            birth_date: '12/05/1988', 
            phone_number: '100-000-0070', 
            emergency_contact: 'No One', 
            registered_date: '05/24/2022'
        }
    )
})

test('Get a list with players', async () => {
    const response = await request(app).get('/players');
    expect(response.statusCode).toBe(200);
})



