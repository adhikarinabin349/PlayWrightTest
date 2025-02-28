import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';

// Custom metrics for detailed performance tracking
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up to 5 users
    { duration: '30s', target: 10 },  // Hold at 10 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    'http_req_duration': [
      'p(70)<600',  // 70% of requests should be < 600ms
      'p(90)<800',  // 90% of requests should be < 800ms
      'p(95)<1000', // 95% of requests should be < 1000ms
    ],
    'http_req_failed': ['rate<0.01'],   // Less than 1% failure rate allowed
    'response_time': [
      'p(70)<600',
      'p(90)<800',
      'p(95)<1000',
      'p(99)<1200'
    ]
  },
};

export default function () {
  group('Visit Home Page', function () {
    const res = http.get('https://atroverse.com');

    responseTime.add(res.timings.duration); // Track response time

    check(res, {
      '✅ Status is 200': (r) => r.status === 200,
      '✅ Response time < 500ms': (r) => r.timings.duration < 500,
      '✅ Body contains "Atroverse"': (r) => typeof r.body === 'string' && r.body.includes('Atroverse'),
      '✅ Content-Type is text/html': (r) => r.headers['Content-Type'].includes('text/html'),
    });

    console.log(`📝 Response Time: ${res.timings.duration}ms | Status: ${res.status}`);
    sleep(1);
  });

  group('Check Login Page', function () {
    const loginRes = http.get('https://atroverse.com/login');

    responseTime.add(loginRes.timings.duration);

    check(loginRes, {
      '✅ Login Page Loads': (r) => r.status === 200,
      '✅ Contains login form': (r) => typeof r.body === 'string' && r.body.includes('<form'),
    });

    console.log(`🔑 Login Page Response Time: ${loginRes.timings.duration}ms`);
    sleep(1);
  });

  group('Simulate User Login', function () {
    const payload = JSON.stringify({ username: 'testuser', password: 'testpass' });
    const headers = { 'Content-Type': 'application/json' };

    const loginAttempt = http.post('https://atroverse.com/api/login', payload, { headers });

    responseTime.add(loginAttempt.timings.duration);

    check(loginAttempt, {
      '✅ Login API returns 200': (r) => r.status === 200,
      '✅ Login API responds in < 800ms': (r) => r.timings.duration < 800,
    });

    console.log(`🔐 Login Attempt Response Time: ${loginAttempt.timings.duration}ms`);
    sleep(1);
  });
}