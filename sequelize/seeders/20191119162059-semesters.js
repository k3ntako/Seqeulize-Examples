'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const semesterAttributes = [
      { name: "Fall 2020", startDate: new Date("08/15/2020"), endDate: new Date("12/31/2020") },
      { name: "Winter 2021", startDate: new Date("01/01/2021"), endDate: new Date("01/31/2021") },
      { name: "Spring 2021", startDate: new Date("02/01/2021"), endDate: new Date("05/31/2021") },
      { name: "Summer 2021", startDate: new Date("06/01/2021"), endDate: new Date("08/14/2021") },
    ].map(semester => ({
      name: semester.name,
      startDate: semester.startDate,
      endDate: semester.endDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkUpdate(
      'semesters',
      semesterAttributes,
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('semesters', null, {});

  }
};
