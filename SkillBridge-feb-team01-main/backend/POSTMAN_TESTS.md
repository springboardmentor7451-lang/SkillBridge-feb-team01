# Postman Test Scenarios — Opportunity CRUD APIs

Base URL: `http://localhost:5000/api`

---

## 1. Setup: Register & Login as NGO

### 1.1 Register NGO User
- **POST** `/auth/register`
- Body:
```json
{
  "name": "Test NGO",
  "email": "testngo@example.com",
  "password": "password123",
  "role": "ngo",
  "organization_name": "Test Organization"
}
```
- **Expected**: `201 Created` with JWT token

### 1.2 Login NGO User
- **POST** `/auth/login`
- Body:
```json
{
  "email": "testngo@example.com",
  "password": "password123"
}
```
- **Expected**: `200 OK` with JWT token
- **Save** the `token` value for subsequent requests

### 1.3 Register Volunteer User (for unauthorized tests)
- **POST** `/auth/register`
- Body:
```json
{
  "name": "Test Volunteer",
  "email": "volunteer@example.com",
  "password": "password123",
  "role": "volunteer"
}
```

---

## 2. Create Opportunity

### 2.1 Valid Create
- **POST** `/opportunities`
- Headers: `Authorization: Bearer <ngo_token>`
- Body:
```json
{
  "title": "Beach Cleanup Drive",
  "description": "Help us clean the local beach this weekend",
  "skillsRequired": ["teamwork", "physical fitness"],
  "location": "Marina Beach, Chennai",
  "duration": "1 day"
}
```
- **Expected**: `201 Created`
- **Save** the `opportunity._id` for later use

### 2.2 Missing Required Fields
- **POST** `/opportunities`
- Headers: `Authorization: Bearer <ngo_token>`
- Body:
```json
{
  "title": "Incomplete Opportunity"
}
```
- **Expected**: `400 Bad Request` with validation errors

### 2.3 Empty skillsRequired Array
- **POST** `/opportunities`
- Headers: `Authorization: Bearer <ngo_token>`
- Body:
```json
{
  "title": "Test",
  "description": "Test description",
  "skillsRequired": [],
  "location": "Test Location"
}
```
- **Expected**: `400 Bad Request`

---

## 3. Get My Opportunities

### 3.1 Fetch NGO's Opportunities
- **GET** `/opportunities/my`
- Headers: `Authorization: Bearer <ngo_token>`
- **Expected**: `200 OK` with array of opportunities (sorted by newest first)

### 3.2 Empty Result for New NGO
- Register a new NGO and fetch — should return `200 OK` with empty array `[]`

---

## 4. Update Opportunity

### 4.1 Valid Update
- **PUT** `/opportunities/<opportunity_id>`
- Headers: `Authorization: Bearer <ngo_token>`
- Body:
```json
{
  "title": "Updated Beach Cleanup Drive",
  "status": "closed"
}
```
- **Expected**: `200 OK` with updated document

### 4.2 Invalid ObjectId
- **PUT** `/opportunities/invalidid123`
- Headers: `Authorization: Bearer <ngo_token>`
- Body: `{ "title": "Test" }`
- **Expected**: `400 Bad Request` — "Invalid opportunity ID format"

### 4.3 Non-Existent ID
- **PUT** `/opportunities/64a1234567890abcdef12345`
- Headers: `Authorization: Bearer <ngo_token>`
- Body: `{ "title": "Test" }`
- **Expected**: `404 Not Found`

### 4.4 Attempt to Modify createdBy
- **PUT** `/opportunities/<opportunity_id>`
- Headers: `Authorization: Bearer <ngo_token>`
- Body:
```json
{
  "title": "Updated Title",
  "createdBy": "64a1234567890abcdef12345"
}
```
- **Expected**: `200 OK` — `createdBy` should remain unchanged (stripped by validator)

### 4.5 Unauthorized Update (Different NGO)
- Login as a different NGO user
- **PUT** `/opportunities/<other_ngo_opportunity_id>`
- **Expected**: `403 Forbidden`

---

## 5. Delete Opportunity

### 5.1 Valid Delete
- **DELETE** `/opportunities/<opportunity_id>`
- Headers: `Authorization: Bearer <ngo_token>`
- **Expected**: `200 OK` — "Opportunity deleted successfully"

### 5.2 Delete Non-Existent
- **DELETE** `/opportunities/64a1234567890abcdef12345`
- Headers: `Authorization: Bearer <ngo_token>`
- **Expected**: `404 Not Found`

### 5.3 Unauthorized Delete
- Login as a different NGO
- **DELETE** `/opportunities/<other_ngo_opportunity_id>`
- **Expected**: `403 Forbidden`

---

## 6. Auth & Authorization Tests

### 6.1 No Token
- **GET** `/opportunities/my` (no Authorization header)
- **Expected**: `401 Unauthorized` — "Not authorized, no token"

### 6.2 Invalid Token
- Headers: `Authorization: Bearer invalidtoken123`
- **Expected**: `401 Unauthorized` — "Not authorized, token failed"

### 6.3 Volunteer Role Blocked
- Login as volunteer user
- **POST** `/opportunities` with valid body
- Headers: `Authorization: Bearer <volunteer_token>`
- **Expected**: `403 Forbidden` — "Role 'volunteer' is not authorized..."

---

## Full CRUD Flow (End-to-End)

1. Register NGO → Login → Save token
2. **Create** opportunity → Save ID → Verify `201`
3. **Get My** opportunities → Verify array contains the created opportunity
4. **Update** the opportunity → Verify updated fields in response
5. **Get My** again → Verify changes persisted
6. **Delete** the opportunity → Verify `200`
7. **Get My** again → Verify array no longer contains deleted opportunity
