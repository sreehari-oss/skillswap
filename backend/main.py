from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from database import init_database, get_connection


app = FastAPI(title="SkillSwap API")


# Allow the deployed frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database
init_database()


# =========================
# DATA MODELS
# =========================

class GigCreate(BaseModel):
    title: str
    category: str
    rate: float
    description: str
    creator_name: str


class BookingCreate(BaseModel):
    gig_id: int
    client_name: str
    client_message: str = ""


# =========================
# BASIC ROUTES
# =========================

@app.get("/")
def home():
    return {
        "message": "SkillSwap backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# =========================
# GIGS
# =========================

@app.post("/gigs")
def create_gig(gig: GigCreate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO gigs
        (title, category, rate, description, creator_name)
        VALUES (?, ?, ?, ?, ?)
    """, (
        gig.title,
        gig.category,
        gig.rate,
        gig.description,
        gig.creator_name
    ))

    connection.commit()

    gig_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Gig created successfully",
        "gig_id": gig_id
    }


@app.get("/gigs")
def get_gigs(search: str = "", category: str = ""):

    connection = get_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gigs WHERE 1=1"
    parameters = []

    # Search by title or description
    if search:
        query += " AND (title LIKE ? OR description LIKE ?)"

        search_value = f"%{search}%"

        parameters.extend([
            search_value,
            search_value
        ])

    # Filter by category
    if category:
        query += " AND category = ?"
        parameters.append(category)

    # Decision Point 3:
    # Newest gigs appear first
    query += " ORDER BY created_at DESC"

    cursor.execute(query, parameters)

    gigs = cursor.fetchall()

    connection.close()

    return [dict(gig) for gig in gigs]


# =========================
# BOOKINGS
# =========================

@app.post("/bookings")
def create_booking(booking: BookingCreate):

    connection = get_connection()
    cursor = connection.cursor()

    # Check that gig exists
    cursor.execute(
        "SELECT id FROM gigs WHERE id = ?",
        (booking.gig_id,)
    )

    gig = cursor.fetchone()

    if gig is None:
        connection.close()

        return JSONResponse(
            status_code=404,
            content={
                "message": "Gig not found"
            }
        )

    # Decision Point 2:
    # Only ONE pending booking is allowed
    # for a gig at a time.
    cursor.execute("""
        SELECT id
        FROM bookings
        WHERE gig_id = ?
        AND status = 'Pending'
    """, (booking.gig_id,))

    pending_booking = cursor.fetchone()

    if pending_booking is not None:
        connection.close()

        return JSONResponse(
            status_code=409,
            content={
                "message": "This gig already has a pending booking."
            }
        )

    # Create new booking
    cursor.execute("""
        INSERT INTO bookings
        (gig_id, client_name, client_message, status)
        VALUES (?, ?, ?, ?)
    """, (
        booking.gig_id,
        booking.client_name,
        booking.client_message,
        "Pending"
    ))

    connection.commit()

    booking_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Booking created successfully",
        "booking_id": booking_id,
        "status": "Pending"
    }


# =========================
# GET ALL BOOKINGS
# =========================

@app.get("/bookings")
def get_bookings():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            bookings.id,
            bookings.gig_id,
            gigs.title AS gig_title,
            gigs.creator_name,
            bookings.client_name,
            bookings.client_message,
            bookings.status,
            bookings.created_at
        FROM bookings
        JOIN gigs ON bookings.gig_id = gigs.id
        ORDER BY bookings.created_at DESC
    """)

    bookings = cursor.fetchall()

    connection.close()

    return [dict(booking) for booking in bookings]


# =========================
# ACCEPT / DECLINE BOOKING
# =========================

@app.patch("/bookings/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    status: str
):

    # Only these two actions are allowed
    if status not in ["Accepted", "Declined"]:

        return JSONResponse(
            status_code=400,
            content={
                "error": "Status must be Accepted or Declined"
            }
        )

    connection = get_connection()
    cursor = connection.cursor()

    # Check booking exists
    cursor.execute(
        "SELECT id, status FROM bookings WHERE id = ?",
        (booking_id,)
    )

    booking = cursor.fetchone()

    if booking is None:

        connection.close()

        return JSONResponse(
            status_code=404,
            content={
                "error": "Booking not found"
            }
        )

    # Update booking status
    cursor.execute(
        """
        UPDATE bookings
        SET status = ?
        WHERE id = ?
        """,
        (
            status,
            booking_id
        )
    )

    connection.commit()

    connection.close()

    return {
        "message": f"Booking {status.lower()} successfully",
        "booking_id": booking_id,
        "status": status
    }