# SkillSwap

SkillSwap is a peer-to-peer skill marketplace built for the Code2Career AI Hackathon.

## Hackathon Details

- Hackathon: Code2Career AI Hackathon
- Hackathon ID: AZIS-WNMU8P
- Track: Track 2 — SkillSwap

## Project Overview

SkillSwap allows users to offer skills as gigs and lets other users discover, search, book, and manage those gigs.

The platform focuses on a simple marketplace workflow without requiring login or signup.

## Core Features

### 1. Post a Gig
Creators can post a gig with:

- Title
- Category
- Rate
- Description
- Creator name

### 2. Browse & Search
Users can:

- Browse available gigs
- Search by title or description
- Filter gigs by category
- View the newest gigs first

### 3. Book a Gig
Clients can:

- Select a gig
- Enter their name
- Add a message
- Submit a booking request
- Receive booking confirmation

### 4. Creator Dashboard
Creators can:

- View incoming bookings
- Accept bookings
- Decline bookings

### 5. My Bookings
Clients can view their bookings and their current status:

- Pending
- Accepted
- Declined

## Decision Points

### DP1 — What happens after a creator declines?

A declined booking remains visible in My Bookings with the status `Declined`.

The client can submit a new booking request for the same gig.

The previous booking remains as history and is not reverted.

### DP2 — Can a gig accept another booking while one is pending?

Only one `Pending` booking is allowed for a gig at a time.

If another client tries to book the same gig while a booking is pending, the request is blocked.

Once the existing booking is either `Accepted` or `Declined`, another booking request can be submitted.

### DP3 — How are gigs ranked/discovered?

Gigs are displayed with the newest gigs first.

Users can additionally narrow discovery using:

- Search
- Category filtering

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- FastAPI
- Python
- Pydantic

### Database
- SQLite

### API
Standard REST API implemented using FastAPI.

## API Endpoints

### Gigs

`GET /gigs`

Returns available gigs with optional search and category filtering.

`POST /gigs`

Creates a new gig.

### Bookings

`GET /bookings`

Returns booking information.

`POST /bookings`

Creates a new booking request.

`PATCH /bookings/{booking_id}/status`

Updates a booking to `Accepted` or `Declined`.

### Health

`GET /health`

Returns the backend health status.

## No Login / Signup

The hackathon MVP does not require authentication, login, or signup.

Users provide their name when posting gigs or creating bookings.

## Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload