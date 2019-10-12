module.exports = {
  parseName: (name) => {
    const names = name.split(" ");
    const firstName = names[0] && names[0].trim() || "Steve";
    const lastName = names[1] && names[1].trim() || "Gates";
    const email = (firstName + lastName + "@example.com").toLowerCase();
    return [firstName, lastName, email];
  },
}