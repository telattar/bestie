/**
 * calculates the age of a person based on the date of birth
 * @param birthday - the date of birth of the person
 * @returns {number} - the age of the person.
 */
export function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  return age;
}
