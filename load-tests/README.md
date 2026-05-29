# Locust Load Test

This folder contains a Locust load test for the Look-In API.

The current test file is:

- `locustfile.py`: Hiring Manager / HR API scenario.

## 1. Install Locust

Run this once:

```powershell
pip install locust
```

Check that Locust is available:

```powershell
locust --version
```

## 2. Start The Backend

In another terminal, start the Look-In backend and make sure it is listening on port `3000`.

The Locust command below targets:

```text
http://localhost:3000/api/v1
```

Quick backend check:

```powershell
Invoke-WebRequest http://localhost:3000
```

If the backend is not running, Locust will show 100% failures because every request cannot connect.

## 3. Prepare A Working Login

Locust logs in before it calls protected endpoints. If login returns `401 Unauthorized`, all useful testing stops.

First, use an account that can log in normally from the app. Then set it in PowerShell:

```powershell
$env:LOCUST_USERNAME="your-email-or-username"
$env:LOCUST_PASSWORD="your-password"
```

You can test the login directly:

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:3000/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"your-email-or-username","password":"your-password"}'
```

Expected result: HTTP `200` with an `access_token` inside `data`.

If you get `401`, fix the username/password first. Locust cannot test protected routes without a valid token.

## 4. Run Locust With The Web UI

From the project root:

```powershell
cd C:\Users\scree\look-in
locust -f .\load-tests\locustfile.py --host http://localhost:3000
```

Open:

```text
http://localhost:8089
```

Recommended first test:

- Number of users: `1`
- Spawn rate: `1`
- Run time: about `1` minute

If that works, increase slowly, for example:

- Number of users: `10`
- Spawn rate: `2`

## 5. Run Headless

After the web UI test works, you can run without the browser:

```powershell
locust -f .\load-tests\locustfile.py --host http://localhost:3000 --headless -u 20 -r 5 -t 2m
```

Meaning:

- `-u 20`: simulate 20 users
- `-r 5`: add 5 users per second
- `-t 2m`: run for 2 minutes

## 6. Optional Settings

The default API prefix is `/api/v1`. Override it only if the backend changes:

```powershell
$env:LOCUST_API_PREFIX="/api/v1"
```

Write tests are disabled by default. Enable them only against a development database because they create, update, and delete records:

```powershell
$env:LOCUST_ENABLE_WRITES="true"
```

Optional register test:

```powershell
$env:LOCUST_ENABLE_WRITES="true"
$env:LOCUST_ENABLE_REGISTER="true"
```

`POST /auth/register` creates Hiring Manager users, so keep it disabled unless you want that data.

## Troubleshooting 100% Failures

Most common causes:

- `401 Unauthorized` on `POST /auth/login`: wrong `LOCUST_USERNAME` or `LOCUST_PASSWORD`.
- Connection errors: backend is not running on `http://localhost:3000`.
- `404 Not Found`: wrong `LOCUST_API_PREFIX`.
- Many `403 Forbidden` responses: the account role is not allowed to access one or more endpoints.

For your latest check, this default credential failed:

```text
hiringmanager@gmail.com / asdqwe123
```

Use a real account from your local database or register a new Hiring Manager account through the app/API, then set `LOCUST_USERNAME` and `LOCUST_PASSWORD` to that account.
