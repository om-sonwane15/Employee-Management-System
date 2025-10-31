const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/middleware");
const Payroll = require("../models/payroll.model"); 
const User = require("../models/user.models");
const json2csv = require("json2csv").parse;
const fs = require('fs');
const path = require('path');

// Get all payrolls for all employees (admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate("employee").sort({releaseDate: -1});
    res.json({ payrolls });
  } catch (e) {
    res.status(500).json({ message: "Error fetching payrolls", details: e.message });
  }
});

// Create or edit payroll entry for an employee (admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { employeeId, month, year, amount, status } = req.body;
    let payroll = await Payroll.findOne({ employee: employeeId, month, year });
    if (payroll) {
      // Edit existing
      payroll.amount = amount;
      payroll.status = status || payroll.status;
      await payroll.save();
      return res.json({ message: "Payroll updated", payroll });
    }
    // New payroll
    payroll = new Payroll({ employee: employeeId, month, year, amount, status: status || "pending" });
    await payroll.save();
    res.status(201).json({ message: "Payroll created", payroll });
  } catch (e) {
    res.status(500).json({ message: "Error creating payroll", details: e.message });
  }
});

// Release payroll (admin)
router.post("/release/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id);
    if (!payroll) return res.status(404).json({ message: "Payroll entry not found" });
    payroll.status = "released";
    payroll.releaseDate = new Date();
    await payroll.save();
    res.json({ message: "Payroll released", payroll });
  } catch (e) {
    res.status(500).json({ message: "Error releasing payroll", details: e.message });
  }
});

// Export payrolls as CSV for a given month and year (admin)
router.get("/export", verifyToken, isAdmin, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if(month) query.month = month;
    if(year) query.year = year;
    const payrolls = await Payroll.find(query).populate("employee");
    const payrollArray = payrolls.map(p => ({
      name: p.employee.name,
      email: p.employee.email,
      month: p.month,
      year: p.year,
      amount: p.amount,
      status: p.status,
      releaseDate: p.releaseDate ? new Date(p.releaseDate).toLocaleDateString() : ""
    }));

    const csv = json2csv(payrollArray);
    const filename = `payroll_${year || "all"}_${month || "all"}.csv`;
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.set("Content-Type", "text/csv");
    res.status(200).end(csv);
  } catch (e) {
    res.status(500).json({ message: "Error exporting payroll", details: e.message });
  }
});


// EMPLOYEE: Get their own payrolls
router.get("/my", verifyToken, async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.user.id }).sort({ year: -1, month: -1 });
    res.json({ payrolls });
  } catch (e) {
    res.status(500).json({ message: "Error fetching your payrolls", details: e.message });
  }
});

// EMPLOYEE: Export their payroll as CSV
router.get("/my/export", verifyToken, async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.user.id }).populate("employee");
    const arr = payrolls.map(p => ({
      name: p.employee.name,
      email: p.employee.email,
      month: p.month,
      year: p.year,
      amount: p.amount,
      status: p.status,
      releaseDate: p.releaseDate ? new Date(p.releaseDate).toLocaleDateString() : "",
    }));
    const csv = require('json2csv').parse(arr);
    const filename = `mypayroll.csv`;
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.set("Content-Type", "text/csv");
    res.status(200).end(csv);
  } catch (e) {
    res.status(500).json({ message: "Error exporting payroll", details: e.message });
  }
});
module.exports = router;
