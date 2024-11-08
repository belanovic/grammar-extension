  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendText") {
        f();
    }
  });


async function f() {
    async function sendText() {
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        try {
            const response = await fetch('http://localhost:3000/chatGPT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set headers for JSON data
                  },
                body: JSON.stringify({text: document.getElementById('content').innerText})       

            });
            const responseBody = await response.json();
            return responseBody
        } catch (error) {
            alert(error.message);
            return
        }
    }

    function highlightTextByKeyword(keyword) {
        const bodyText = document.body.innerHTML;
        const regex = new RegExp(`(${keyword})`, "gi"); // Case-insensitive search for keyword
        const highlightedText = bodyText.replace(regex, '<span class="highlight">$1</span>');
    
        document.body.innerHTML = highlightedText;
    
        // Apply CSS style to the highlight class
        const style = document.createElement("style");
        style.innerHTML = `
        .highlight {
            background-color: yellow;
            color: black;
            font-weight: bold;
        }
        `;
        document.head.appendChild(style);
    }
    
    // Usage example: Call the function with your desired keyword
// Replace "example" with your desired keyword
 // Replace "example" with your desired keyword
    let answer = await sendText();
    answer = JSON.parse(answer);
    
    
    if((!answer) || (answer == []) || (answer == '')) {
        alert('ChatGPT није пронашао грешке');
        return
    };
    alert('ChatGPT је пронашао следеће грешке: ' + answer);
    answer.forEach((elem, i) => {
        highlightTextByKeyword(elem)
    });

}


  