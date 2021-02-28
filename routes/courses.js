const Course = require("../models/Course");
const sanitizeBody = require("../middleware/sanitizeBody");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const course = await Course.find();
  res.send({ data: course });
});

router.post("/", sanitizeBody, async (req, res) => {
  try {
    const newCourse = new Course(req.sanitizedBody);
    await newCourse.save();
    res.status(201).send({ data: newCourse });
  } catch (err) {
    console.log("Error occurred " + err);
    if (err.message.startsWith("Validation failed")) {
      sendError(req, res, 422);
    } else {
      sendError(req, res, 400);
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("students");
    if (!course) throw new Error("Resource not found");
    res.send({ data: course });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", sanitizeBody, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...req.sanitizedBody },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!course) throw new Error("Resource not found");
    res.send({ data: course });
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
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...req.sanitizedBody },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!course) throw new Error("Resource not found");
    res.send({ data: course });
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
    const course = await Course.findByIdAndRemove(req.params.id);
    if (!course) throw new Error("Resource not found");
    res.send({ data: course });
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
            description: `We could not find a course with id: ${req.params.id}`,
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
            description: `We could not update the course as the changes did not meet the validation requirements.`,
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
            description: `We could not add course record.`,
          }
        ]
      });
      break;
  }
}

module.exports = router;
