import app from './app.js';
import config from './config/config.js';

app.listen(config.PORT, () => {
  console.log('INFO: server is running at port:', config.PORT);
});
