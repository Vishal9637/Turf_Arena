import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  XCircle,
} from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);

  if (!state) {
    return (
      <p className="text-center mt-20 text-zinc-400">
        No booking information found.
      </p>
    );
  }

  const {
    bookingId,
    turf,
    date,
    slot,
    players,
    totalPrice,
    status = "confirmed",
  } = state;

  const finalPrice = totalPrice ?? turf.price * players;

  /* ---------- CANCEL BOOKING ---------- */
  const cancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      setCancelling(true);

      await updateDoc(doc(db, "bookings", bookingId), {
        status: "cancelled",
        cancelledBy: "user",
        cancelledAt: serverTimestamp(),
      });

      alert("Booking cancelled successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-white space-y-10">
      {/* ---------- HEADER ---------- */}
      <div className="text-center space-y-3">
        {status === "confirmed" ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h1 className="text-4xl font-bold text-green-400">
              Booking Confirmed
            </h1>
            <p className="text-zinc-400">
              Your turf booking has been successfully confirmed
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h1 className="text-4xl font-bold text-red-400">
              Booking Cancelled
            </h1>
            <p className="text-zinc-400">
              This booking has been cancelled
            </p>
          </>
        )}
      </div>

      {/* ---------- TURF CARD ---------- */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        {/* Cover Image (original size) */}
        <div className="bg-black flex justify-center items-center p-4">
          <img
            src={turf.coverImage}
            alt={turf.name}
            className="max-h-[420px] w-auto object-contain rounded-xl"
          />
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">{turf.name}</h2>

          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {turf.city}
            </div>

            <div className="flex items-center gap-1 text-green-400 font-semibold">
              <IndianRupee size={16} />
              ₹{turf.price} / player
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-green-400" size={16} />
              <b>Date:</b> {date}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-green-400" size={16} />
              <b>Time Slot:</b> {slot}
            </div>

            <div className="flex items-center gap-2">
              <Users className="text-green-400" size={16} />
              <b>Players:</b> {players}
            </div>

            {/* Price Summary */}
            <div className="pt-3 border-t border-zinc-800 space-y-1">
              <div className="flex justify-between">
                <span>Price per player</span>
                <span>₹{turf.price}</span>
              </div>

              <div className="flex justify-between">
                <span>Players</span>
                <span>× {players}</span>
              </div>

              <div className="flex justify-between text-green-400 font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              status === "confirmed"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-green-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-green-400 transition"
        >
          Go Home
        </button>

        {status === "confirmed" && (
          <button
            onClick={cancelBooking}
            disabled={cancelling}
            className="bg-red-600 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-red-500 transition"
          >
            <XCircle size={18} />
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
