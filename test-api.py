"""
Test script to verify all backend API endpoints.
"""
import requests
import json

BASE_URL = "http://localhost:8002"

def test_health():
    """Test health check endpoint."""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_signup():
    """Test signup endpoint."""
    print("\n=== Testing Signup ===")
    data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/api/auth/signup", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code == 201:
        return response.json().get("token")
    return None

def test_login():
    """Test login endpoint."""
    print("\n=== Testing Login ===")
    data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code == 200:
        return response.json().get("token")
    return None

def test_get_tasks_without_auth():
    """Test getting tasks without authentication."""
    print("\n=== Testing GET /tasks (No Auth) ===")
    response = requests.get(f"{BASE_URL}/tasks")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 401

def test_get_tasks_with_auth(token):
    """Test getting tasks with authentication."""
    print("\n=== Testing GET /tasks (With Auth) ===")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/tasks", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_create_task(token):
    """Test creating a task."""
    print("\n=== Testing POST /tasks ===")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Test Task",
        "description": "This is a test task"
    }
    response = requests.post(f"{BASE_URL}/tasks", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code == 201:
        return response.json().get("id")
    return None

def test_update_task(token, task_id):
    """Test updating a task."""
    print("\n=== Testing PUT /tasks/{id} ===")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Updated Test Task",
        "completed": True
    }
    response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_delete_task(token, task_id):
    """Test deleting a task."""
    print("\n=== Testing DELETE /tasks/{id} ===")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(f"{BASE_URL}/tasks/{task_id}", headers=headers)
    print(f"Status: {response.status_code}")
    return response.status_code == 204

def main():
    """Run all tests."""
    print("=" * 50)
    print("Backend API Test Suite")
    print("=" * 50)

    # Test health check
    if not test_health():
        print("\n[FAIL] Health check failed!")
        return

    # Test signup (or login if user exists)
    token = test_signup()
    if not token:
        print("\nUser might already exist, trying login...")
        token = test_login()

    if not token:
        print("\n[FAIL] Authentication failed!")
        return

    print(f"\n[OK] Got token: {token[:20]}...")

    # Test unauthorized access
    test_get_tasks_without_auth()

    # Test authorized access
    if not test_get_tasks_with_auth(token):
        print("\n[FAIL] Failed to get tasks with auth!")
        return

    # Test create task
    task_id = test_create_task(token)
    if not task_id:
        print("\n[FAIL] Failed to create task!")
        return

    print(f"\n[OK] Created task: {task_id}")

    # Test update task
    if not test_update_task(token, task_id):
        print("\n[FAIL] Failed to update task!")
        return

    # Test delete task
    if not test_delete_task(token, task_id):
        print("\n[FAIL] Failed to delete task!")
        return

    print("\n" + "=" * 50)
    print("[SUCCESS] All tests passed!")
    print("=" * 50)

if __name__ == "__main__":
    main()
