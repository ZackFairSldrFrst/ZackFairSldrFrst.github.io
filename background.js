// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Marketing Consultant.');
  // Perform some initialization if needed
});
// You can set up any background tasks or event listeners here if needed.
const extpay = ExtPay('ai-marketing-consultant')
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
	console.log(user)
})