import fs from 'fs';
import romcal from 'romcal';

async function generate() {
  try {
    const cal = romcal.calendarFor({ year: 2026 });
    
    // Convert array to a more optimized format for the frontend (Map by date string)
    const optimizedCal = {};
    cal.forEach(event => {
      // event.moment is usually an ISO string like '2026-06-14T00:00:00.000Z' or a Date object
      // wait, moment might be a moment.js object in older romcal versions!
      // let's extract the date
      let dateStr = "";
      if (typeof event.moment === 'string') {
        dateStr = event.moment.split('T')[0];
      } else if (event.moment && typeof event.moment.format === 'function') {
        dateStr = event.moment.format('YYYY-MM-DD');
      } else if (event.moment instanceof Date) {
        dateStr = event.moment.toISOString().split('T')[0];
      }
      
      if (dateStr) {
        if (!optimizedCal[dateStr]) optimizedCal[dateStr] = [];
        optimizedCal[dateStr].push({
          name: event.name,
          color: event.data?.meta?.liturgicalColor?.key || 'green',
          type: event.type
        });
      }
    });

    fs.writeFileSync('./src/constants/liturgy.json', JSON.stringify(optimizedCal, null, 2));
    console.log("Berhasil membuat liturgy.json dengan " + Object.keys(optimizedCal).length + " hari.");
  } catch (err) {
    console.error("Gagal:", err);
  }
}

generate();
