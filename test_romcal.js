import pkg from 'romcal';
const { Romcal } = pkg;

async function test() {
  const romcal = new Romcal();
  const cal = await romcal.generateCalendar(2026);
  const keys = Object.keys(cal);
  console.log("Keys type:", typeof keys);
  console.log("First key:", keys[0]);
  console.log("Data for first key:", JSON.stringify(cal[keys[0]][0], null, 2));
}

test().catch(console.error);
