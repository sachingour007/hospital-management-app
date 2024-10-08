const { Schema, model, default: mongoose } = require("mongoose");
const validator = require("validator");

const appointmentSchem = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Provide A Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone Number Must Contain Exact 10 Digit"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digit"],
  },
  dob: {
    type: Date,
    required: [true, "DOB is Required!"],
  },
  nicNumber: {
    type: String,
    require: [true, "NIC is required!"],
    minLength: [5, "NIC Number Must Contain Exact 5 Digit"],
    maxLength: [5, "NIC Number Must Contain Exact 5 Digit"],
  },
  gender: {
    type: String,
    required: [true, "Gender is rquired!"],
    enum: ["Male", "Female"],
  },
  appointment_date: {
    type: String,
    required: [true, "Appointment Date is Required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name is Required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor Name is Required!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Address is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor id is Invalid!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient Id is Required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

const Appointment = model("Appointment", appointmentSchem);

module.export = Appointment;
