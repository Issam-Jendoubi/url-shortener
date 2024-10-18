import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  iterations: 500000,
  vus: 100,
  duration: '60m',
};

const url = 'http://host.docker.internal:3000/shortener/shorten';
const longUrl = 'https://www.example.com/' + 'a'.repeat(976); // max url length is 1000

export default function () {
  const payload = JSON.stringify({ longUrl });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    },
  };

  // Send the request to shorten the URL
  const res = http.post(url, payload, params);

  // Check if the response is successful
  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(0.1); // Brief pause between requests
}
