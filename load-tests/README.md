# Locust Load Test

This folder contains Locust load tests for the Look-In API.

- `locustfile.py`: Hiring Manager / HR scenario.
- `locustfile_employee.py`: Employee / Intern scenario.

## Install

```powershell
pip install locust
```

## Run

```powershell
cd C:\Users\scree\look-in
$env:LOCUST_USERNAME="hiringmanager@gmail.com"
$env:LOCUST_PASSWORD="asdqwe123"
locust -f .\load-tests\locustfile.py --host http://localhost:3000
```

Open `http://localhost:8089`, set the number of users and spawn rate, then start.

## Headless Example

```powershell
locust -f .\load-tests\locustfile.py --host http://localhost:3000 --headless -u 20 -r 5 -t 2m
```

If your API prefix is different:

```powershell
$env:LOCUST_API_PREFIX="/api/v1"
```

## Test POST / PUT / DELETE

Write tests are disabled by default. Enable them only against a development database because they create, update, and delete test records.

```powershell
$env:LOCUST_ENABLE_WRITES="true"
locust -f .\load-tests\locustfile.py --host http://localhost:3000
```

Covered write flows:

- `POST /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`
- `POST /attendance-settings`, `GET /attendance-settings/:id`, `PUT /attendance-settings/:id`, `DELETE /attendance-settings/:id`
- `POST /permits`, `GET /permits/:id`, `PUT /permits/:id`, `DELETE /permits/:id`

Optional register test:

```powershell
$env:LOCUST_ENABLE_WRITES="true"
$env:LOCUST_ENABLE_REGISTER="true"
```

`POST /auth/register` creates Hiring Manager users, so keep it disabled unless you really want that data.

## Employee / Intern Scenario

Use an existing employee or intern account:

```powershell
cd C:\Users\scree\look-in
$env:LOCUST_EMPLOYEE_USERNAME="employee@example.com"
$env:LOCUST_EMPLOYEE_PASSWORD="asdqwe123"
locust -f .\load-tests\locustfile_employee.py --host http://localhost:3000
```

Employee write tests are also disabled by default. Enable them only against a development database:

```powershell
$env:LOCUST_ENABLE_WRITES="true"
locust -f .\load-tests\locustfile_employee.py --host http://localhost:3000
```

Employee write flows:

- `PUT /users` to update own profile.
- `POST /permits`, `GET /permits/:id`, `PUT /permits/:id`, `DELETE /permits/:id`.
