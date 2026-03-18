import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 20 }, // Monte à 20 utilisateurs en 30s
        { duration: '1m', target: 20 },  // Reste à 20 utilisateurs pendant 1m
        { duration: '30s', target: 0 },  // Redescend à 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% des requêtes < 500ms
    },
};

const BASE_URL_CATALOGUE = __ENV.CATALOGUE_URL || 'http://localhost:3001';
const BASE_URL_USER = __ENV.USER_URL || 'http://localhost:3002';

export default function () {
    // 1. Charger les produits trending
    let res1 = http.get(`${BASE_URL_CATALOGUE}/products`);
    check(res1, {
        'status is 200 (Catalogue)': (r) => r.status === 200,
        'has products': (r) => r.json().length > 0,
    });

    sleep(1);

    // 2. Charger un produit specifique (item1)
    let res2 = http.get(`${BASE_URL_CATALOGUE}/products/item1`);
    check(res2, {
        'status is 200 (Product Detail)': (r) => r.status === 200,
    });

    sleep(1);

    // 3. Charger un profil utilisateur (u1)
    let res3 = http.get(`${BASE_URL_USER}/u1`);
    check(res3, {
        'status is 200 or 404 (User)': (r) => r.status === 200 || r.status === 404,
    });

    sleep(2);
}
