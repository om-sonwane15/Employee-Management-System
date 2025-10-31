import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Plus,
  Users,
  Trash2,
  Video,
  Loader2,
  X,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Meetings() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // {mode:'new'|'participants', data?}
  const [employees, setEmployees] = useState([]);

  /* ───────── fetch helpers ───────── */
  const loadMeetings = async () => {
    setLoading(true);
    const res = await api.get("/meetings");
    setMeetings(res.data);
    setLoading(false);
  };
  const loadEmployees = async () => {
    if (!isAdmin) return;
    const res = await api.get("/employee/all");
    setEmployees(res.data.employees);
  };

  useEffect(() => {
    loadMeetings();
    loadEmployees();
    // eslint-disable-next-line
  }, []);

  /* ───────── create meeting ───────── */
  const schedule = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target));
    if (!body.startTime) {
      toast.error("Select start time");
      return;
    }
    body.participants = [...e.target.participants]
      .filter((o) => o.selected)
      .map((o) => o.value);
    try {
      await api.post("/meetings", body);
      toast.success("Meeting scheduled");
      setModal(null);
      loadMeetings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  /* ───────── add participant ───────── */
  const addParticipant = async (id, userId) => {
    await api.post(`/meetings/${id}/participants`, { userId });
    toast.success("Added");
    loadMeetings();
  };

  const removeParticipant = async (id, userId) => {
    await api.delete(`/meetings/${id}/participants/${userId}`);
    loadMeetings();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <button
          onClick={() => setModal({ mode: "new" })}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          <Plus size={18} className="mr-1" />
          New / Instant
        </button>
      </div>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : meetings.length === 0 ? (
        <p className="text-gray-500">No meetings found</p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((m) => (
            <li
              key={m._id}
              className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-xs text-gray-500">
                    {dayjs(m.startTime).format("DD MMM YYYY, h:mm A")}
                  </p>
                  {m.agenda && (
                    <p className="text-gray-700 text-sm mt-1">{m.agenda}</p>
                  )}
                </div>

                {/* join button */}
                <a
                  href={m.joinLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  <Video size={16} className="mr-1" />
                  Join
                </a>
              </div>

              <div className="flex items-center text-sm text-gray-700">
                <Users size={16} className="mr-1" />
                {m.participants.map((p) => p.name).join(", ")}
                {isAdmin && (
                  <button
                    onClick={() => setModal({ mode: "participants", data: m })}
                    className="text-indigo-600 ml-3 underline text-xs"
                  >
                    Manage
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ───────── modal : schedule ───────── */}
      {modal?.mode === "new" && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModal(null)}
          />
          <form
            onSubmit={schedule}
            className="relative bg-white w-full max-w-md m-auto p-6 space-y-4 rounded shadow-lg"
          >
            <h2 className="font-semibold text-lg">Schedule / Instant Meeting</h2>

            <input
              required
              name="title"
              placeholder="Title"
              className="w-full border-gray-300 rounded px-3 py-2 text-sm"
            />

            <textarea
              name="agenda"
              placeholder="Agenda (optional)"
              className="w-full border-gray-300 rounded px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium">
              Start Time
              <input
                type="datetime-local"
                name="startTime"
                className="mt-1 w-full border-gray-300 rounded px-3 py-2 text-sm"
                defaultValue={dayjs().format("YYYY-MM-DDTHH:mm")}
              />
            </label>

            {isAdmin && (
              <label className="block text-sm font-medium">
                Participants
                <select
                  name="participants"
                  multiple
                  className="mt-1 w-full h-24 border-gray-300 rounded text-sm"
                >
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name} – {e.email}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-4 py-2 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setModal(null)}
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* ───────── modal : manage participants ───────── */}
      {modal?.mode === "participants" && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModal(null)}
          />
          <div className="relative bg-white w-full max-w-md m-auto p-6 rounded shadow-lg space-y-4">
            <h2 className="font-semibold text-lg mb-2">
              Manage Participants – {modal.data.title}
            </h2>

            <ul className="space-y-2">
              {modal.data.participants.map((p) => (
                <li key={p._id} className="flex justify-between items-center">
                  <span>{p.name}</span>
                  {p._id !== modal.data.organizer._id && (
                    <button
                      onClick={() =>
                        removeParticipant(modal.data._id, p._id)
                      }
                      className="text-red-600 text-xs flex items-center"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <label className="block">
              <span className="text-sm font-medium">Add employee</span>
              <select
                onChange={(e) => {
                  if (!e.target.value) return;
                  addParticipant(modal.data._id, e.target.value);
                  e.target.value = "";
                }}
                className="mt-1 w-full border-gray-300 rounded px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="">— select employee —</option>
                {employees
                  .filter(
                    (e) =>
                      !modal.data.participants.some((p) => p._id === e._id)
                  )
                  .map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </label>

            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setModal(null)}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
