import app from './app';
import Schedule from './schedule/statsSchedule';

app.on('mongodb connected', () => {
  Schedule.init();

  app.listen('3000', () => {
    const msg = '> Server run on http://localhost:3000';
    console.log('\x1b[44m%s\x1b[37m', msg, '\x1b[0m');
  });
});
