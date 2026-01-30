<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Route Test</title>
  </head>
  <body>
    <h1>Route Test Page</h1>
    <p>If you can see this, the route is working ✅</p>

    <button onclick="testRoute()">Test API Route</button>

    <pre id="result"></pre>

    <script>
      function testRoute() {
        fetch("http://localhost:3000/test")
          .then((res) => res.text())
          .then((data) => {
            document.getElementById("result").textContent = data;
          })
          .catch((err) => {
            document.getElementById("result").textContent =
              "Error: " + err.message;
          });
      }
    </script>
  </body>
</html>
