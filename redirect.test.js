import http from 'k6/http';
import { check } from 'k6';

export let options = {
    scenarios: {
        load_test: {
            executor: 'constant-arrival-rate',
            rate: 100, // 100 requests per second
            timeUnit: '1s', // Over a time unit of 1 second
            duration: '1s', // Total duration for the test
            preAllocatedVUs: 1, // Pre-allocate VUs
            maxVUs: 1, // Max VUs to use during the test
        },
    },
};

// Base URL for the redirection
const baseUrl = 'http://host.docker.internal:3000/shortener/redirect/';

// List of short URLs to test the redirection
const shortUrls = [
    "013dda7639",
    "01487309bc",
    "060d6786ca",
    "084fdb82d8",
    "09994e3aec",
    "0a46777639",
    "0e1c18eb0f",
    "0e3aad2f2c",
    "0e3ef3619e",
    "0e8b9e46a3",
    "0f1f5ce99e",
    "0fe9aef3bd",
    "132a0aaac1",
    "1381cea623",
    "149028c9d2",
    "15cd31ec30",
    "1ab147e195",
    "21c3b0b93d",
    "23f83e626b",
    "2400cb941a",
    "2461f8ec20",
    "250c8cdd98",
    "25eddbd937",
    "29caff380e",
    "2a46544300",
    "2be2694589",
    "2d3603ede1",
    "30be50de5d",
    "3182e25485",
    "326395e029",
    "33516a712c",
    "33fdeb48d9",
    "3497c9b442",
    "35292a8210",
    "382685f043",
    "3aafabfee4",
    "3bbe753e4a",
    "3bfbf504ed",
    "3ce180b707",
    "3cea2b110a",
    "3e2f04e943",
    "3e74f1a773",
    "408ef5ad43",
    "40f9b46c58",
    "41118e2a27",
    "41d28403eb",
    "4344d1c798",
    "480512d640",
    "48951086ec",
    "4a155201c7",
    "4b9246007e",
    "4c0bd445a7",
    "4ebd5896fb",
    "4f203d2b98",
    "4f30f90b03",
    "544fb2583e",
    "547ae4fe3b",
    "5591a0c7f1",
    "55bc772497",
    "55fd700f5d",
    "5665027363",
    "5b21251305",
    "5ce57fce7b",
    "5e4ca2a657",
    "5eeed02422",
    "5f1bda38bc",
    "6138ebe0d0",
    "620cec6d5e",
    "63b1519e2e",
    "65543970ba",
    "65a8bf4899",
    "66638f6cd9",
    "68ccfe30cf",
    "6982ed14a2",
    "6edb6f93fd",
    "6f37515e83",
    "6fd8794f96",
    "7092eb05fd",
    "7123590845",
    "71c6221792",
    "7374cdf7fe",
    "7429bb12d5",
    "75372fe511",
    "779fe69917",
    "7825cb9ed9",
    "783f67c194",
    "79607511f1",
    "7a054401d7",
    "7b75a6c048",
    "7c708f10ef",
    "8144061036",
    "82adf95a22",
    "84e2a8dc92",
    "8552fdc3bf",
    "86bbe3257e",
    "88373837ee",
    "8893aaf803",
    "8a6e54c138",
    "8c04bbc5a3",
    "8ca2fa447a"
];


export default function () {
    // Randomly select a short URL from the list
    const shortUrl = shortUrls[Math.floor(Math.random() * shortUrls.length)];

    // Construct the full URL for the redirection
    const fullUrl = `${baseUrl}${shortUrl}`;

    // Send a request to the full URL
    let res = http.get(fullUrl, { redirect: true });

    // Check if the response status is 301 (Moved Permanently)
    check(res, {
        'is redirected': (r) => r.status === 301,
        // 'url is resolved': (r) => r.status === 200 -> if used as explained in ReadMe
    });
}