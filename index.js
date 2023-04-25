const express = require('express');
const puppeteer = require('puppeteer');

// Prepare Express.js
const app = express();
app.use(express.json());

app.post('/', async (req, res, next) => {
	// Open browser
	const browser = await puppeteer.launch({
		headless: !!process.env.NODE_ENV,
		args: ['--window-size=1680,1050'],
	});

	// Open page
	const page = await browser.newPage();
	await page.setJavaScriptEnabled(true);
	await page.goto('https://auth.uber.com/v2', {
		waitUntil: 'load',
	});

	//  fillinput
	await page.waitForSelector('#PHONE_NUMBER_or_EMAIL_ADDRESS');
	await page.type('#PHONE_NUMBER_or_EMAIL_ADDRESS', 'test@gmail.com', {
		delay: 100,
	});

	// click next
	await page.keyboard.press('Enter');
	console.log('reached next page');
	await page.waitForTimeout(3000);
	await browser.close();

	res.status(200).json({ message: 'Done' });
});

// Health check
app.get('/', (_req, res) => {
	res.status(200).end();
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
