import app from './app.ts';
import config from './config/config.ts';

app.listen(config.PORT, () => {
  console.log('INFO: server is running at port:', config.PORT);
});
