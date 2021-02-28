const Student = require("../models/Student");
const sanitizeBody = require("../middleware/sanitizeBody");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.send({ data: students });
});

router.post("/", sanitizeBody, async (req, res) => {
  try {
    let newStudent = new Student(req.sanitizedBody);
    await newStudent.save();

    res.status(201).send({ data: newStudent });
  } catch (err) {
    if (err.message == "Resource not found") {
      sendResourceNotFound(req, res);
    } else {
      console.log("Error occurred " + err);
      if (err.message.toLowerCase().indexOf("validation") >= 0) {
        sendError(req, res, 422);
      } else {
        sendError(req, res, 400);
      }
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("classes");
    if (!student) throw new Error("Resource not found");
    res.send({ data: student });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", sanitizeBody, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...req.sanitizedBody },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!student) throw new Error("Resource not found");
    res.send({ data: student });
  } catch (err) {
    if (err.message == "Resource not found") {
      sendResourceNotFound(req, res);
    } else {
      console.log("Error occurred " + err);
      if (err.message.toLowerCase().indexOf("validation") >= 0) {
        sendError(req, res, 422);
      } else {
        sendError(req, res, 400);
      }
    }
  }
});

router.put("/:id", sanitizeBody, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...req.sanitizedBody },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!student) throw new Error("Resource not found");
    res.send({ data: student });
  } catch (err) {
    if (err.message == "Resource not found") {
      sendResourceNotFound(req, res);
    } else {
      console.log("Error occurred " + err);
      if (err.message.toLowerCase().indexOf("validation") >= 0) {
        sendError(req, res, 422);
      } else {
        sendError(req, res, 400);
      }
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) throw new Error("Resource not found");
    res.send({ data: student });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

function sendResourceNotFound(req, res) {
  sendError(req, res, 404);
}

function sendError(req, res, code) {
  switch (code) {
    case 404:
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${req.params.id}`,
          }
        ]
      });
      break;
    case 422:
      res.status(422).send({
        errors: [
          {
            status: "422",
            title: "Validation Error",
            description: `We could not update the student as the changes did not meet the validation requirements.`,
          }
        ]
      });
      break;
    default:
      res.status(400).send({
        errors: [
          {
            status: "400",
            title: "An error occurred",
            description: `We could not add student record.`,
          }
        ]
      });
      break;
  }
}

module.exports = router;
