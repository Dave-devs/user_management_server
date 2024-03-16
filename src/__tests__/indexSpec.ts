import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test basic endpoint server', () => {
    it('should return 200', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
    })
})