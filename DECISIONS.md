# SkillSwap Decision Points

## DP1 — What happens after a creator declines?

### Decision
A declined booking remains visible in My Bookings with the status `Declined`.

The client can submit a new booking request for the same gig.

The previous booking remains in the booking history and is not reverted.

### Why?
This keeps the booking history transparent while allowing the client to try booking the gig again.

---

## DP2 — Can a gig accept another booking while one is pending?

### Decision
A gig can have only one `Pending` booking at a time.

If another client tries to book the same gig while a booking is pending, the new request is blocked.

Once the existing booking is either `Accepted` or `Declined`, another booking request can be submitted.

### Why?
This prevents conflicting simultaneous booking requests and keeps the creator's workflow clear.

---

## DP3 — How are gigs ranked/discovered?

### Decision
Gigs are displayed with the newest gigs first.

Users can additionally discover gigs using:

- Search
- Category filtering

### Why?
New gigs are immediately visible while search and category filtering allow users to quickly find relevant skills.

---

## Summary

| Decision Point | Chosen Approach |
|---|---|
| DP1 — Rejection | Declined booking stays visible; client can rebook |
| DP2 — Double booking | Only one pending booking per gig |
| DP3 — Discovery | Newest first + search + category filtering |