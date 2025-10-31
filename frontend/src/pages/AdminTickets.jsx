import React, { useEffect, useState } from "react";
import { ticketAPI } from "../services/api";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export default function AdminTickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await ticketAPI.getAllTickets();
      setTickets(res.data.tickets);
    };
    fetchTickets();
    // Setup socket
    const s = io(SOCKET_URL, { auth: { token: localStorage.getItem("token") } });
    s.emit("joinAdmins");
    s.on("newMessage", ({ ticketId, message }) => {
      if (selected && selected._id === ticketId) {
        setSelected(prev => ({ ...prev, messages: [...prev.messages, message] }));
      }
    });
    setSocket(s);
    return () => { s.disconnect(); };
  }, [selected]);

  const handleSend = async () => {
    if (!msg) return;
    socket.emit("sendMessage", { ticketId: selected._id, content: msg, sender: user._id });
    setSelected(prev => ({
      ...prev, messages: [...prev.messages, { sender: user._id, content: msg, timestamp: new Date() }]
    }));
    setMsg("");
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Employee Tickets</h2>
      <div className="flex">
        <div className="w-1/3 border-r mr-2">
          <h3 className="font-bold">Tickets</h3>
          <ul>
            {tickets.map(t => (
              <li key={t._id}
                  onClick={() => setSelected(t)}
                  className={"p-2 " + (selected && selected._id === t._id ? "bg-gray-200" : "")}>
                {t.subject} - [{t.status}] - {t.employee?.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          {selected && (
            <div>
              <h4 className="font-semibold">{selected.subject}</h4>
              <div style={{ maxHeight: 250, overflowY: "auto", border: "1px solid #ddd", margin: "8px 0" }}>
                {selected.messages.map((m, i) => (
                  <div key={i} className={m.sender === user._id ? "text-right" : ""}>
                    <span className="block">{m.content}</span>
                    <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input value={msg} onChange={e=>setMsg(e.target.value)}
                  className="border flex-1 p-2" placeholder="Reply..." />
                <button onClick={handleSend} className="bg-green-600 px-2 text-white">Send</button>
              </div>
            </div>
          )}
          {!selected && <div>Select a ticket to view/reply.</div>}
        </div>
      </div>
    </div>
  );
}
