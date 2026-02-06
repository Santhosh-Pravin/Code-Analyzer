import fetch from 'node-fetch';

async function test() {
    console.log("Starting test request...");
    try {
        const response = await fetch('http://localhost:8001/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code_text: 'print("Hello World")' })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Test Script Error:", e.message);
    }
}
test();
