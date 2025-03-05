document.getElementById('jobApplicationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const responseMessage = document.getElementById('responseMessage');

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            responseMessage.innerHTML = `CV uploaded successfully! Download link: <a href="${result.url}" target="_blank">${result.url}</a>`;
        } else {
            responseMessage.innerText = `Error: ${result.message}`;
        }
    } catch (error) {
        responseMessage.innerText = `Error: ${error.message}`;
    }
});