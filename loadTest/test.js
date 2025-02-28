(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // loadTest/k6test.ts
  var import_http = __toESM(__require("k6/http"));
  var import_k6 = __require("k6");
  var import_metrics = __require("k6/metrics");
  var responseTime = new import_metrics.Trend("response_time");
  var options = {
    stages: [
      { duration: "10s", target: 5 },
      // Ramp up to 5 users
      { duration: "30s", target: 10 },
      // Hold at 10 users
      { duration: "10s", target: 0 }
      // Ramp down
    ],
    thresholds: {
      "http_req_duration": [
        "p(70)<600",
        // 70% of requests should be < 600ms
        "p(90)<800",
        // 90% of requests should be < 800ms
        "p(95)<1000"
        // 95% of requests should be < 1000ms
      ],
      "http_req_failed": ["rate<0.01"],
      // Less than 1% failure rate allowed
      "response_time": [
        "p(70)<600",
        "p(90)<800",
        "p(95)<1000",
        "p(99)<1200"
      ]
    }
  };
  function k6test_default() {
    (0, import_k6.group)("Visit Home Page", function() {
      const res = import_http.default.get("https://atroverse.com");
      responseTime.add(res.timings.duration);
      (0, import_k6.check)(res, {
        "\u2705 Status is 200": (r) => r.status === 200,
        "\u2705 Response time < 500ms": (r) => r.timings.duration < 500,
        '\u2705 Body contains "Atroverse"': (r) => typeof r.body === "string" && r.body.includes("Atroverse"),
        "\u2705 Content-Type is text/html": (r) => r.headers["Content-Type"].includes("text/html")
      });
      console.log(`\u{1F4DD} Response Time: ${res.timings.duration}ms | Status: ${res.status}`);
      (0, import_k6.sleep)(1);
    });
    (0, import_k6.group)("Check Login Page", function() {
      const loginRes = import_http.default.get("https://atroverse.com/login");
      responseTime.add(loginRes.timings.duration);
      (0, import_k6.check)(loginRes, {
        "\u2705 Login Page Loads": (r) => r.status === 200,
        "\u2705 Contains login form": (r) => typeof r.body === "string" && r.body.includes("<form")
      });
      console.log(`\u{1F511} Login Page Response Time: ${loginRes.timings.duration}ms`);
      (0, import_k6.sleep)(1);
    });
    (0, import_k6.group)("Simulate User Login", function() {
      const payload = JSON.stringify({ username: "testuser", password: "testpass" });
      const headers = { "Content-Type": "application/json" };
      const loginAttempt = import_http.default.post("https://atroverse.com/api/login", payload, { headers });
      responseTime.add(loginAttempt.timings.duration);
      (0, import_k6.check)(loginAttempt, {
        "\u2705 Login API returns 200": (r) => r.status === 200,
        "\u2705 Login API responds in < 800ms": (r) => r.timings.duration < 800
      });
      console.log(`\u{1F510} Login Attempt Response Time: ${loginAttempt.timings.duration}ms`);
      (0, import_k6.sleep)(1);
    });
  }
})();
