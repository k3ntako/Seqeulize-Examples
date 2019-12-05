'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const courseAttributes = ["Biochemistry I", "Computer Science I"].map(name => ({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert(
      'courses',
      courseAttributes,
      { returning: true }
    ).then(async courses => {
      const users = await queryInterface.sequelize.query(
        `SELECT id from USERS;`
      );

      const semesters = await queryInterface.sequelize.query(
        `SELECT id from SEMESTERS WHERE name='Fall 2020';`
      );
      const fall2020 = semesters[0][0];

      // In case you already have users in your database
      // Last two users in your database are probably the two users seeded in "20191119155624-user.js"
      const lastTwoUsers = users[0].slice(users[0].length - 2);

      const userCourseAttributes = lastTwoUsers.map((user, idx) => {
        return {
          user_id: user.id,
          course_id: courses[idx].id,
          semester_id: fall2020.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      return queryInterface.bulkInsert(
        'user_courses',
        userCourseAttributes,
        {}
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('courses', null, {});
  }
};
