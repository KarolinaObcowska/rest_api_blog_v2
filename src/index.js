import { app } from './server.js';
import { connectDB } from './config/db.js';
import config from './utils/config.js';
import { info } from './utils/logger.js';

connectDB();

app.listen(config.PORT || 5000, () => {
  info('Server is running on', config.PORT);
});
