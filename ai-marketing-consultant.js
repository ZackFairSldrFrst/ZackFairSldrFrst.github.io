const extpay = ExtPay('ai-marketing-consultant');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    
    document.getElementById('supportButton').addEventListener('click', function() {
        console.log("Support button clicked");
        extpay.openPaymentPage();
    });

    // Handling user status with ExtPay
    extpay.getUser().then(user => {
        console.log("User:", user);
        const now = new Date();
        const trialDuration = 1000 * 60 * 60 * 24 * 1; // 1 day in milliseconds
        const trialEnd = user.trialStartedAt ? new Date(user.trialStartedAt.getTime() + trialDuration) : null;
        const inTrial = trialEnd && now < trialEnd;
  
        if (user.paid || inTrial) {
            document.querySelector('.container').style.display = 'block';
            document.getElementById('supportScreen').style.display = 'none';
            if (inTrial) {
                alert("Enjoy your free trial! Your trial ends on " + trialEnd.toLocaleDateString());
            }
        } else if (!user.trialStartedAt) {
            document.getElementById('startTrialButton').style.display = 'block';
        } else {
            document.getElementById('supportScreen').style.display = 'block';
        }
    }).catch(err => {
        console.error("Error fetching user status:", err);
    });

    // Attaching event listener to the start trial button
    document.getElementById('startTrialButton').addEventListener('click', function() {
        console.log("Start trial button clicked");
        extpay.openTrialPage();
    });

    // Handling trial start with ExtPay
    extpay.onTrialStarted.addListener(user => {
        console.log("Trial started event:", user);
        alert("Your free trial has started!");
        document.querySelector('.container').style.display = 'block';
        document.getElementById('supportScreen').style.display = 'none';
    });

    const apiKey = "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";

    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");

    // Function to append a message to the chat screen
    function appendMessage(role, content) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", role);
        if (role === "system" && content.includes("Schedule Discovery Call")) {
            // Convert link to a button
            const button = document.createElement("button");
            button.innerHTML = "Schedule Discovery Call";
            button.onclick = function() {
                window.open("https://calendly.com/ai-marketing-consultant/discovery-call", "_blank");
            };
            messageDiv.appendChild(button);
        } else {
            messageDiv.innerHTML = content;
        }
        chatMessages.appendChild(messageDiv);
    }

    // Function to handle form submission (sending user messages)
    chatForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage !== "") {
            appendMessage("user", userMessage);
            userInput.value = ""; // Clear input field after sending message

            // Send user message to OpenAI API
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-0125",
                    messages: [{ role: "user", content: userMessage }],
                    max_tokens: 400,
                    temperature: 0.7
                })
            })
            .then(response => response.json())
            .then(data => {
                const aiResponse = data.choices[0].message.content;
                appendMessage("AI", aiResponse);

                // Check if user message indicates a need to connect with a human marketer
                if (
                    userMessage.includes("human") || 
                    userMessage.includes("hire") || 
                    userMessage.includes("consultant") || 
                    userMessage.includes("consultation") || 
                    userMessage.includes("expert") || 
                    userMessage.includes("professional") || 
                    userMessage.includes("assistance") || 
                    userMessage.includes("help") || 
                    userMessage.includes("support") || 
                    userMessage.includes("talk to someone") || 
                    userMessage.includes("speak with someone") || 
                    userMessage.includes("reach out to someone") || 
                    userMessage.includes("connect with someone") || 
                    userMessage.includes("get in touch with someone") || 
                    userMessage.includes("engage a human") || 
                    userMessage.includes("find a person") || 
                    userMessage.includes("real person") || 
                    userMessage.includes("live person") || 
                    userMessage.includes("contact someone") || 
                    userMessage.includes("meet someone") || 
                    userMessage.includes("speak to a real person") || 
                    userMessage.includes("speak to a live person") || 
                    userMessage.includes("talk to a real person") || 
                    userMessage.includes("talk to a live person") || 
                    userMessage.includes("marketing expert") || 
                    userMessage.includes("hire someone") || 
                    userMessage.includes("find an expert") || 
                    userMessage.includes("speak with an expert") || 
                    userMessage.includes("connect with an expert") || 
                    userMessage.includes("consult with an expert") || 
                    userMessage.includes("contact an expert") || 
                    userMessage.includes("get assistance") || 
                    userMessage.includes("support from an expert") || 
                    userMessage.includes("talk to an advisor") || 
                    userMessage.includes("speak with an advisor") || 
                    userMessage.includes("reach out to an advisor") || 
                    userMessage.includes("connect with an advisor") || 
                    userMessage.includes("get in touch with an advisor") || 
                    userMessage.includes("engage a consultant") || 
                    userMessage.includes("find a consultant") || 
                    userMessage.includes("speak with a consultant") || 
                    userMessage.includes("connect with a consultant") || 
                    userMessage.includes("consult with a consultant") || 
                    userMessage.includes("contact a consultant") || 
                    userMessage.includes("get help from a consultant") || 
                    userMessage.includes("talk to a professional") || 
                    userMessage.includes("speak with a professional") || 
                    userMessage.includes("reach out to a professional") || 
                    userMessage.includes("connect with a professional") || 
                    userMessage.includes("get in touch with a professional") || 
                    userMessage.includes("engage an advisor") || 
                    userMessage.includes("find an advisor") || 
                    userMessage.includes("consult with an advisor") || 
                    userMessage.includes("contact an advisor") || 
                    userMessage.includes("get help from an advisor") || 
                    userMessage.includes("hire an expert") || 
                    userMessage.includes("hire a professional") || 
                    userMessage.includes("hire an advisor") || 
                    userMessage.includes("hire a consultant") || 
                    userMessage.includes("talk to a specialist") || 
                    userMessage.includes("speak with a specialist") || 
                    userMessage.includes("reach out to a specialist") || 
                    userMessage.includes("connect with a specialist") || 
                    userMessage.includes("get in touch with a specialist") || 
                    userMessage.includes("find a specialist") || 
                    userMessage.includes("consult with a specialist") || 
                    userMessage.includes("contact a specialist") || 
                    userMessage.includes("get help from a specialist") || 
                    userMessage.includes("reach out to an expert") || 
                    userMessage.includes("get in touch with an expert") || 
                    userMessage.includes("connect with an expert") || 
                    userMessage.includes("find a professional") || 
                    userMessage.includes("consult with a professional") || 
                    userMessage.includes("contact a professional") || 
                    userMessage.includes("get help from a professional") || 
                    userMessage.includes("find an advisor") || 
                    userMessage.includes("connect with an advisor") || 
                    userMessage.includes("engage an expert") || 
                    userMessage.includes("find a marketing expert") || 
                    userMessage.includes("speak with a marketing expert") || 
                    userMessage.includes("connect with a marketing expert") || 
                    userMessage.includes("consult with a marketing expert") || 
                    userMessage.includes("contact a marketing expert") || 
                    userMessage.includes("get help from a marketing expert") || 
                    userMessage.includes("hire a marketing expert") || 
                    userMessage.includes("talk to a marketing expert") || 
                    userMessage.includes("reach out to a marketing expert") || 
                    userMessage.includes("get in touch with a marketing expert") || 
                    userMessage.includes("engage a marketing expert") || 
                    userMessage.includes("connect with a marketing professional") || 
                    userMessage.includes("speak with a marketing professional") || 
                    userMessage.includes("reach out to a marketing professional") || 
                    userMessage.includes("consult with a marketing professional") || 
                    userMessage.includes("contact a marketing professional") || 
                    userMessage.includes("get help from a marketing professional") || 
                    userMessage.includes("hire a marketing professional") || 
                    userMessage.includes("talk to a marketing professional") || 
                    userMessage.includes("find a marketing professional") || 
                    userMessage.includes("connect with a marketing consultant") || 
                    userMessage.includes("speak with a marketing consultant") || 
                    userMessage.includes("reach out to a marketing consultant") || 
                    userMessage.includes("consult with a marketing consultant") || 
                    userMessage.includes("contact a marketing consultant") || 
                    userMessage.includes("get help from a marketing consultant") || 
                    userMessage.includes("hire a marketing consultant") || 
                    userMessage.includes("talk to a marketing consultant") || 
                    userMessage.includes("find a marketing consultant") || 
                    userMessage.includes("connect with a marketing advisor") || 
                    userMessage.includes("speak with a marketing advisor") || 
                    userMessage.includes("reach out to a marketing advisor") || 
                    userMessage.includes("consult with a marketing advisor") || 
                    userMessage.includes("contact a marketing advisor") || 
                    userMessage.includes("get help from a marketing advisor") || 
                    userMessage.includes("hire a marketing advisor") || 
                    userMessage.includes("talk to a marketing advisor") || 
                    userMessage.includes("find a marketing advisor") || 
                    userMessage.includes("connect with a digital marketing expert") || 
                    userMessage.includes("speak with a digital marketing expert") || 
                    userMessage.includes("reach out to a digital marketing expert") || 
                    userMessage.includes("consult with a digital marketing expert") || 
                    userMessage.includes("contact a digital marketing expert") || 
                    userMessage.includes("get help from a digital marketing expert") || 
                    userMessage.includes("hire a digital marketing expert") || 
                    userMessage.includes("talk to a digital marketing expert") || 
                    userMessage.includes("find a digital marketing expert") || 
                    userMessage.includes("connect with a digital marketing professional") || 
                    userMessage.includes("speak with a digital marketing professional") || 
                    userMessage.includes("reach out to a digital marketing professional") || 
                    userMessage.includes("consult with a digital marketing professional") || 
                    userMessage.includes("contact a digital marketing professional") || 
                    userMessage.includes("get help from a digital marketing professional") || 
                    userMessage.includes("hire a digital marketing professional") || 
                    userMessage.includes("talk to a digital marketing professional") || 
                    userMessage.includes("find a digital marketing professional") || 
                    userMessage.includes("connect with a digital marketing consultant") || 
                    userMessage.includes("speak with a digital marketing consultant") || 
                    userMessage.includes("reach out to a digital marketing consultant") || 
                    userMessage.includes("consult with a digital marketing consultant") || 
                    userMessage.includes("contact a digital marketing consultant") || 
                    userMessage.includes("get help from a digital marketing consultant") || 
                    userMessage.includes("hire a digital marketing consultant") || 
                    userMessage.includes("talk to a digital marketing consultant") || 
                    userMessage.includes("find a digital marketing consultant") || 
                    userMessage.includes("connect with a digital marketing advisor") || 
                    userMessage.includes("speak with a digital marketing advisor") || 
                    userMessage.includes("reach out to a digital marketing advisor") || 
                    userMessage.includes("consult with a digital marketing advisor") || 
                    userMessage.includes("contact a digital marketing advisor") || 
                    userMessage.includes("get help from a digital marketing advisor") || 
                    userMessage.includes("hire a digital marketing advisor") || 
                    userMessage.includes("talk to a digital marketing advisor") || 
                    userMessage.includes("find a digital marketing advisor") || 
                    userMessage.includes("connect with a social media expert") || 
                    userMessage.includes("speak with a social media expert") || 
                    userMessage.includes("reach out to a social media expert") || 
                    userMessage.includes("consult with a social media expert") || 
                    userMessage.includes("contact a social media expert") || 
                    userMessage.includes("get help from a social media expert") || 
                    userMessage.includes("hire a social media expert") || 
                    userMessage.includes("talk to a social media expert") || 
                    userMessage.includes("find a social media expert") || 
                    userMessage.includes("connect with a social media professional") || 
                    userMessage.includes("speak with a social media professional") || 
                    userMessage.includes("reach out to a social media professional") || 
                    userMessage.includes("consult with a social media professional") || 
                    userMessage.includes("contact a social media professional") || 
                    userMessage.includes("get help from a social media professional") || 
                    userMessage.includes("hire a social media professional") || 
                    userMessage.includes("talk to a social media professional") || 
                    userMessage.includes("find a social media professional") || 
                    userMessage.includes("connect with a social media consultant") || 
                    userMessage.includes("speak with a social media consultant") || 
                    userMessage.includes("reach out to a social media consultant") || 
                    userMessage.includes("consult with a social media consultant") || 
                    userMessage.includes("contact a social media consultant") || 
                    userMessage.includes("get help from a social media consultant") || 
                    userMessage.includes("hire a social media consultant") || 
                    userMessage.includes("talk to a social media consultant") || 
                    userMessage.includes("find a social media consultant") || 
                    userMessage.includes("connect with a social media advisor") || 
                    userMessage.includes("speak with a social media advisor") || 
                    userMessage.includes("reach out to a social media advisor") || 
                    userMessage.includes("consult with a social media advisor") || 
                    userMessage.includes("contact a social media advisor") || 
                    userMessage.includes("get help from a social media advisor") || 
                    userMessage.includes("hire a social media advisor") || 
                    userMessage.includes("talk to a social media advisor") || 
                    userMessage.includes("find a social media advisor") 
                                ) {
                    appendMessage("system", "Would you like to schedule a discovery call with a human marketer?");
                    // Offer to schedule a discovery call
                    appendMessage("system", `<button id="scheduleCallBtn">Schedule Discovery Call</button>`);
                    document.getElementById('scheduleCallBtn').addEventListener('click', function() {
                        window.open("https://calendly.com/ai-marketing-consultant/discovery-call", "_blank");
                    });
                }
                // Check if AI response suggests connecting with a human marketer
                else if (aiResponse.includes("human marketer")) {
                    appendMessage("system", "Would you like to speak to a human marketer?");
                    // Offer to schedule a discovery call
                    appendMessage("system", `<button id="scheduleCallBtn">Schedule Discovery Call</button>`);
                    document.getElementById('scheduleCallBtn').addEventListener('click', function() {
                        window.open("https://calendly.com/ai-marketing-consultant/discovery-call", "_blank");
                    });
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Initial system message
    appendMessage("system", "Welcome! I'm here to help you with your marketing questions and challenges. Feel free to ask anything!");
});
