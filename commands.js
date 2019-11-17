const crypto = require('crypto');
const db = require('./sequelize/models');
const User = db.User;
const UserAuth = db.UserAuth;
const Course = db.Course;
const Assignment = db.Assignment;
const { parseName } = require('./utilities');
const util = require('util');
// logs nested objects/arrays (use with nested association):
const logInstance = (text,  instance) => console.log(text, util.inspect(instance, { depth: null }));

module.exports = {
  usercreate: {
    name: "userCreate",
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    purpose: "Create and commit to db a User.",
    method: async (name) => {
      const [firstName, lastName, email] = parseName(name);

      const user = await User.create({
        firstName, lastName, email,
      });
      if (user) console.log('Created: ', user.dataValues);
    }
  },
  userfindbypk: {
    name: "userFindByPk",
    question: "User ID:",
    purpose: "Find user by primary key (pk) and return User and associated UserAuth and Courses.",
    method: async (id) => {
      const user = await User.findByPk(Number(id), {
        include: [
          { model: UserAuth, as: "auth" },
          {
            model: Course,
            as: "courses",
            include: { model: Assignment, as: "assignments" }, //includes assignments associated with user's courses
          },
        ]
      });

      if (user) {
        logInstance('Found: ', user.toJSON())
      } else {
        console.log('User not found by ID: ' + id);
      };
    }
  },
  userfindbyemail: {
    name: "userFindByEmail",
    question: "User email:",
    purpose: "Find user by email and return User.",
    method: async (email) => {
      const user = await User.findByEmail(email);

      if (user) {
        const courses = await user.getCourses();
        const coursesJson = courses.map(course => course.toJSON());

        logInstance('User found: ', user.toJSON());
        logInstance('Courses found: ', coursesJson);
      } else {
        console.log('User not found by email: ' + email);
      };
    }
  },
  authfindbyuserid: {
    name: "authFindByUserId",
    question: "User ID:",
    purpose: "Find user by primary key (pk) and return User and associated UserAuth.",
    method: async (id) => {
      const user = await User.findByPk(Number(id));
      const auth = await user.getAuth();

      if (auth) {
        console.log('Found: ', auth.toJSON());
      } else {
        console.log('Could not find Auth for user with ID: ' + id);
      };
    }
  },
  authcreate: {
    name: "authCreate",
    question: "User ID that you'd like to assign this auth to:",
    purpose: "Create and commit to db an UserAuth, with association to a User.",
    method: async (id) => {
      const user = await User.findByPk(Number(id));
      if (!user) throw new Error("No user with that id: " + id);

      const salt = crypto.randomBytes(16).toString('hex');

      const auth = await UserAuth.create({
        user_id: user.id,
        passhash: crypto.pbkdf2Sync("password", salt, 1000, 64, `sha512`).toString(`hex`), //password is alway "password"
        salt: salt,
      }, {
        include: [User]
      });

      if (auth) console.log('Created: ', auth.toJSON());
    }
  },
  useruserauthcreate: {
    name: "userUserAuthcreate",
    question: "Name of user, first and last name, split by a space (e.g, Steve Gates):",
    purpose: "Create and commit to db both a User and an associated UserAuth with one call.",
    method: async (name) => {
      const [firstName, lastName, email] = parseName(name);
      const salt = crypto.randomBytes(16).toString('hex');

      const user = await User.create({
        firstName, lastName, email,
        auth: {
          passhash: crypto.pbkdf2Sync("password", salt, 1000, 64, `sha512`).toString(`hex`), //password is always "password"
          salt: salt,
        }
      }, {
        include: [{
          association: User.associations.auth,
        }],
      });

      if (user) console.log('Created: ', user.toJSON());
    }
  },
  coursecreate: {
    name: "courseCreate",
    question: "Name of course:",
    purpose: "Create and commit to db a Course.",
    method: async (name) => {
      const course = await Course.create({ name });

      if (course) console.log('Created: ', course.toJSON());
    }
  },
  assignmentcreate: {
    name: "assignmentCreate",
    question: "Course ID and name of assignment (in that order separated by a comma - e.g., '1, First assignment'):",
    purpose: "Create and commit to db an Assignment.",
    method: async (input) => {
      const inputArr = input.split(",");
      const name = inputArr.slice(1).join(',');
      const courseID = parseInt(inputArr[0], 10);

      const assignment = await Assignment.create({
        name,
        due_date: Date.now(),
        course_id: courseID,
      });
      if (assignment) console.log('Created: ', assignment.toJSON());
    }
  },
  courseassignmentcreate: {
    name: "courseAssignmentCreate",
    question: "Name of course and name of assignment (in that order separated by a comma - e.g., 'Biology, First assignment'):",
    purpose: "Create course with an assignment.",
    method: async (inputRaw) => {
      const [courseName, assignmentName] = inputRaw.split(',');
      const course = await Course.create(
        {
          name: courseName,
          assignments: [{
            name: assignmentName,
            due_date: Date.now(),
          }],
        }, {
        include: [{
          association: Course.associations.assignments,
        }],
      });

      if (course) console.log('Created: ', course.toJSON());
    }
  },
  coursefindbypk: {
    name: "courseFindByPk",
    question: "Course ID:",
    purpose: "Find course by primary key (pk) and return Course and associated Assignemnts.",
    method: async (id) => {
      const course = await Course.findByPk(Number(id), { include: { model: Assignment, as: "assignments" } });

      if (course) {
        console.log('Found: ', course.toJSON());
      } else {
        console.log('Course not found by ID: ' + id);
      };
    }
  },
  addcoursetouser: {
    name: "addCourseToUser",
    question: "User and Course IDs (in that order separated by a comma - e.g., '1, 3'):",
    purpose: "Add user to a course using User and Course IDs",
    method: async (ids) => {
      const [userID, courseID] = ids.split(",").map(id => parseInt(id, 10));
      let user = await User.findByPk(userID, { include: { model: Course, as: "courses" } });

      const course = await Course.findByPk(courseID);
      await user.addCourse(course);
      user = await user.reload();

      if (user) {
        console.log('Found: ', user.toJSON());
      } else {
        console.log('Unable to add course to user');
      };
    }
  },
  deletecourse: {
    name: "deleteCourse",
    question: "ID of course you would like to delete:",
    purpose: "Delete course by ID",
    method: async (id) => {
      const courseID = parseInt(id, 10);
      const deleteCount = await Course.destroy({
        where: {
          id: courseID,
        }
      });

      if (deleteCount[0] === 1) {
        console.log('Deleted course with ID: ', courseID);
      } else {
        console.log(`Deleted ${deleteCount[0] || 0} courses. Should have deleted 1 course.`);
      };
    }
  },
}