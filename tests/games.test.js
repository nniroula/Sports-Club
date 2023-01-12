process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');


let testGame;
beforeEach( async () => {
    const result = await db.query(`INSERT INTO games(game_date, venue, opposition_team, game_time)
    VALUES('05/24/2023', 'Great Plain', 'AECC B', '03:00') 
    RETURNING  game_date, venue, opposition_team, game_time`);
    testGame = result.rows[0];
})

/* Delete each user after it is created and each test runs */
afterEach(async () => {
    await db.query(`DELETE FROM games`);
})

/* test file keeps running continuously, use db.end to stop it.*/
afterAll(async () => {
    await db.end();
})

describe("This should render a game object", () => {
    test('First test Game', () => {
        expect(testGame).toStrictEqual(
            {
                game_date: '05/24/2023',
                venue: 'Great Plain',
                opposition_team: 'AECC B',
                game_time: '03:00'
            }
        )
    })
});

test('Get a list with games', async () => {
    const response = await request(app).get('/games');
    expect(response.statusCode).toBe(200);
})



