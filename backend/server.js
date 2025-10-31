const express = require("express");
const mongoose = require('mongoose'); 
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io"); 
const employeeRoutes = require("./routes/employee.routes");
const filesupload = require("./routes/profilephoto");
const departmentRoutes = require("./routes/department.routes");
const authorizeRoutes = require("./routes/authorize.routes"); 
const payrollRoutes = require('./routes/payroll.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const ticketRoutes = require('./routes/ticket.routes');
const nodemailer = require("nodemailer");
const { verifyTokenSocket } = require('./middleware/socketmiddleware');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

io.use(verifyTokenSocket); 

io.on("connection", socket => {

  socket.on("join", ({ userId }) => {
    socket.join(userId); 
  });

  socket.on("sendMessage", async ({ ticketId, content, sender }) => {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      socket.emit("error", "Ticket not found");
      return;
    }
    ticket.messages.push({ sender, content });
    ticket.updatedAt = new Date();
    await ticket.save();
  
    io.to(ticket.employee.toString()).emit("newMessage", { ticketId, message: { sender, content, timestamp: new Date() } });
    io.to("admins").emit("newMessage", { ticketId, message: { sender, content, timestamp: new Date() } });
  });

  socket.on("joinAdmins", () => socket.join("admins"));

 
  socket.on("disconnect", () => {});
});
//middleware
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

//routes
app.get("/", (req, res)=>{
  res.send("Server is running");
});

app.use("/api/profilephoto", filesupload);
app.use("/api/authorize", authorizeRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api", departmentRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tickets", ticketRoutes);

server.listen(port, () => console.log(`Server is working at http://localhost:${port}`));

