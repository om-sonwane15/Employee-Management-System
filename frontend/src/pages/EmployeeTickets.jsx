import React, { useEffect, useState } from "react";
import { ticketAPI } from "../services/api";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // adjust as needed

export default function EmployeeTickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await ticketAPI.getMyTickets();
      setTickets(res.data.tickets);
    };
    fetchTickets();
    // Setup socket
    const s = io(SOCKET_URL, { auth: { token: localStorage.getItem("token") } });
    s.emit("join", { userId: user._id });
    s.on("newMessage", ({ ticketId, message }) => {
      if (selected && selected._id === ticketId) {
        setSelected(prev => ({ ...prev, messages: [...prev.messages, message] }));
      }
      // Optionally refresh ticket list!
    });
    setSocket(s);
    return () => { s.disconnect(); };
  }, [selected, user._id]);

  const handleSend = async () => {
    if (!msg) return;
    socket.emit("sendMessage", { ticketId: selected._id, content: msg, sender: user._id });
    setSelected(prev => ({
      ...prev, messages: [...prev.messages, { sender: user._id, content: msg, timestamp: new Date() }]
    }));
    setMsg("");
  };

  const handleTicketSubmit = async e => {
    e.preventDefault();
    const subject = e.target.subject.value;
    const message = e.target.message.value;
    const res = await ticketAPI.createTicket(subject, message);
    setTickets([res.data.ticket, ...tickets]);
    e.target.reset();
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Support Tickets</h2>

      <form onSubmit={handleTicketSubmit} className="mb-4">
        <input name="subject" placeholder="Subject" required className="border p-2 mr-2" />
        <input name="message" placeholder="Message" required className="border p-2 mr-2"/>
        <button type="submit" className="bg-blue-600 px-4 py-2 text-white">Raise Ticket</button>
      </form>

      <div className="flex">
        <div className="w-1/3 border-r mr-2">
          <h3 className="font-bold">My Tickets</h3>
          <ul>
            {tickets.map(t => (
              <li key={t._id}
                  onClick={() => setSelected(t)}
                  className={"p-2 " + (selected && selected._id === t._id ? "bg-gray-200" : "")}>
                {t.subject} - [{t.status}]
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
                  className="border flex-1 p-2" placeholder="Type message..." />
                <button onClick={handleSend} className="bg-green-600 px-2 text-white">Send</button>
              </div>
            </div>
          )}
          {!selected && <div>Select a ticket to view.</div>}
        </div>
      </div>
    </div>
  );
}
