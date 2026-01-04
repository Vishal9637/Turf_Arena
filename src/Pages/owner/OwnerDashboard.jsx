import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Calendar, PlusSquare, List } from "lucide-react";

const OwnerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
      <p className="text-zinc-400 mb-8">
        Welcome, {user?.email}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Turf */}
        <Link
          to="/owner/add-turf"
          className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition space-y-2"
        >
          <PlusSquare className="text-green-400" />
          <h2 className="text-xl font-semibold">Add New Turf</h2>
          <p className="text-zinc-400 text-sm">
            Register a new turf for booking
          </p>
        </Link>

        {/* My Turfs */}
        <Link
          to="/owner/my-turfs"
          className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition space-y-2"
        >
          <List className="text-green-400" />
          <h2 className="text-xl font-semibold">My Turfs</h2>
          <p className="text-zinc-400 text-sm">
            View and manage your listed turfs
          </p>
        </Link>

        {/* Bookings */}
        <Link
          to="/owner/bookings"
          className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition space-y-2"
        >
          <Calendar className="text-green-400" />
          <h2 className="text-xl font-semibold">Bookings</h2>
          <p className="text-zinc-400 text-sm">
            View all turf bookings
          </p>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
