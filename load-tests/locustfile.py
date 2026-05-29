import os
import random
import time
from datetime import date, timedelta
from uuid import uuid4

from locust import HttpUser, between, events, task
from locust.exception import StopUser


API_PREFIX = os.getenv("LOCUST_API_PREFIX", "/api/v1")
LOGIN_USERNAME = os.getenv("LOCUST_USERNAME", "hiringmanager@gmail.com")
LOGIN_PASSWORD = os.getenv("LOCUST_PASSWORD", "asdqwe1234")
ENABLE_WRITES = os.getenv("LOCUST_ENABLE_WRITES", "false").lower() == "true"
ENABLE_REGISTER = os.getenv("LOCUST_ENABLE_REGISTER", "false").lower() == "true"


@events.init.add_listener
def validate_locust_config(environment, **kwargs):
    if not LOGIN_USERNAME or not LOGIN_PASSWORD:
        raise RuntimeError(
            "Set LOCUST_USERNAME and LOCUST_PASSWORD before starting Locust."
        )


class LookInApiUser(HttpUser):
    wait_time = between(1, 3)

    token: str | None = None
    created_user_ids: list[int]
    created_permit_ids: list[int]
    created_attendance_setting_ids: list[int]

    def on_start(self):
        self.created_user_ids = []
        self.created_permit_ids = []
        self.created_attendance_setting_ids = []
        self.login()

    @property
    def auth_headers(self):
        if not self.token:
            return {}

        return {"Authorization": f"Bearer {self.token}"}

    def login(self):
        with self.client.post(
            f"{API_PREFIX}/auth/login",
            json={
                "username": LOGIN_USERNAME,
                "password": LOGIN_PASSWORD,
            },
            name="POST /auth/login",
            catch_response=True,
        ) as response:
            if response.status_code not in (200, 201):
                response.failure(
                    f"Login failed: {response.status_code}. "
                    "Check LOCUST_USERNAME/LOCUST_PASSWORD and confirm this account can log in."
                )
                raise StopUser()

            try:
                data = response.json()
                self.token = data.get("data", {}).get("access_token")
                if not self.token:
                    response.failure("Login response missing access_token")
                    raise StopUser()
            except Exception as error:
                response.failure(f"Login response missing token: {error}")
                raise StopUser()

    def get_response_data(self, response):
        try:
            return response.json().get("data", {})
        except Exception:
            return {}

    def unique_suffix(self):
        return f"{int(time.time())}-{uuid4().hex[:8]}"

    @task(4)
    def get_profile(self):
        self.client.get(
            f"{API_PREFIX}/auth/profile",
            headers=self.auth_headers,
            name="GET /auth/profile",
        )

    @task(4)
    def get_attendance_history(self):
        today = date.today()
        start_date = today.replace(day=1).isoformat()
        end_date = today.isoformat()

        self.client.get(
            f"{API_PREFIX}/attendances/history",
            params={
                "start_date": start_date,
                "end_date": end_date,
            },
            headers=self.auth_headers,
            name="GET /attendances/history",
        )

    @task(3)
    def get_permits(self):
        self.client.get(
            f"{API_PREFIX}/permits",
            params={"limit": 10},
            headers=self.auth_headers,
            name="GET /permits",
        )

    @task(2)
    def get_users(self):
        self.client.get(
            f"{API_PREFIX}/users",
            params={"limit": 10},
            headers=self.auth_headers,
            name="GET /users",
        )

    @task(2)
    def get_datasets(self):
        self.client.get(
            f"{API_PREFIX}/datasets",
            params={"limit": 10},
            headers=self.auth_headers,
            name="GET /datasets",
        )

    @task(2)
    def get_attendance_settings(self):
        self.client.get(
            f"{API_PREFIX}/attendance-settings",
            headers=self.auth_headers,
            name="GET /attendance-settings",
        )

    @task(1)
    def get_notifications(self):
        self.client.get(
            f"{API_PREFIX}/notifications",
            params={"limit": 10},
            headers=self.auth_headers,
            name="GET /notifications",
        )

    @task(1)
    def write_user_flow(self):
        if not ENABLE_WRITES:
            return

        suffix = self.unique_suffix()
        payload = {
            "name": f"Locust Employee {suffix}",
            "username": f"locust_employee_{suffix}",
            "email": f"locust_employee_{suffix}@example.com",
            "password": "asdqwe123",
            "phone_no": "081234567890",
            "role": 2,
            "is_active": True,
        }

        with self.client.post(
            f"{API_PREFIX}/users",
            json=payload,
            headers=self.auth_headers,
            name="POST /users",
            catch_response=True,
        ) as response:
            if response.status_code not in (200, 201):
                response.failure(f"Create user failed: {response.status_code}")
                return

            user_id = self.get_response_data(response).get("id")
            if not user_id:
                response.failure("Create user response missing id")
                return

            self.created_user_ids.append(user_id)

        self.client.get(
            f"{API_PREFIX}/users/{user_id}",
            headers=self.auth_headers,
            name="GET /users/:id",
        )

        self.client.put(
            f"{API_PREFIX}/users/{user_id}",
            json={"phone_no": "089999999999", "is_active": True},
            headers=self.auth_headers,
            name="PUT /users/:id",
        )

        self.client.delete(
            f"{API_PREFIX}/users/{user_id}",
            headers=self.auth_headers,
            name="DELETE /users/:id",
        )

    @task(1)
    def write_attendance_setting_flow(self):
        if not ENABLE_WRITES:
            return

        payload = {
            "check_in_time": "08:00",
            "check_out_time": "17:00",
            "gps_lat": "-6.200000",
            "gps_lng": "106.816666",
            "radius_meter": 100,
        }

        with self.client.post(
            f"{API_PREFIX}/attendance-settings",
            json=payload,
            headers=self.auth_headers,
            name="POST /attendance-settings",
            catch_response=True,
        ) as response:
            if response.status_code not in (200, 201):
                response.failure(
                    f"Create attendance setting failed: {response.status_code}"
                )
                return

            setting_id = self.get_response_data(response).get("id")
            if not setting_id:
                response.failure("Create attendance setting response missing id")
                return

            self.created_attendance_setting_ids.append(setting_id)

        self.client.get(
            f"{API_PREFIX}/attendance-settings/{setting_id}",
            headers=self.auth_headers,
            name="GET /attendance-settings/:id",
        )

        self.client.put(
            f"{API_PREFIX}/attendance-settings/{setting_id}",
            json={"radius_meter": random.choice([100, 150, 200])},
            headers=self.auth_headers,
            name="PUT /attendance-settings/:id",
        )

        self.client.delete(
            f"{API_PREFIX}/attendance-settings/{setting_id}",
            headers=self.auth_headers,
            name="DELETE /attendance-settings/:id",
        )

    @task(1)
    def write_permit_flow(self):
        if not ENABLE_WRITES:
            return

        start = date.today() + timedelta(days=random.randint(1, 14))
        end = start + timedelta(days=random.randint(0, 2))
        payload = {
            "description": f"Locust permit test {self.unique_suffix()}",
            "type": 1,
            "status": 0,
            "date_start": start.isoformat(),
            "date_end": end.isoformat(),
        }

        with self.client.post(
            f"{API_PREFIX}/permits",
            data=payload,
            headers=self.auth_headers,
            name="POST /permits",
            catch_response=True,
        ) as response:
            if response.status_code not in (200, 201):
                response.failure(f"Create permit failed: {response.status_code}")
                return

            permit_id = self.get_response_data(response).get("id")
            if not permit_id:
                response.failure("Create permit response missing id")
                return

            self.created_permit_ids.append(permit_id)

        self.client.get(
            f"{API_PREFIX}/permits/{permit_id}",
            headers=self.auth_headers,
            name="GET /permits/:id",
        )

        self.client.put(
            f"{API_PREFIX}/permits/{permit_id}",
            data={"status": random.choice([1, 2])},
            headers=self.auth_headers,
            name="PUT /permits/:id",
        )

        self.client.delete(
            f"{API_PREFIX}/permits/{permit_id}",
            headers=self.auth_headers,
            name="DELETE /permits/:id",
        )

    @task(1)
    def register_hiring_manager(self):
        if not (ENABLE_WRITES and ENABLE_REGISTER):
            return

        suffix = self.unique_suffix()
        self.client.post(
            f"{API_PREFIX}/auth/register",
            json={
                "name": f"Locust Hiring Manager {suffix}",
                "username": f"locust_hr_{suffix}",
                "email": f"locust_hr_{suffix}@example.com",
                "password": "asdqwe123",
            },
            name="POST /auth/register",
        )
