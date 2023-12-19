import pino from 'pino';

let logger: pino.Logger;

if (process.env.NODE_ENV === 'development') {
	logger = pino({ level: 'debug' });
} else {
	logger = pino({ level: 'info' });
}

export default logger;
