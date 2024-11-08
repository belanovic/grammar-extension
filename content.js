  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkSpelling") {
        checkSpelling();
    }if (request.action === "checkFacts") {
        checkFacts();
    }
  });


async function checkSpelling() {
    async function sendText() {
        
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        try {
            const response = await fetch('http://localhost:3000/chatGPT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    text: document.getElementById('content').innerText,
                    prompt: 'детаљно прегледај текст на српском, пронађи граматичке грешке. Стави те речи под наводнике и у низ [] и одговори ми само у том низу. Ако нема грешака, врати празан низ []. Ево текста: ',
                    description: 'Ви сте асистент за проверу граматике са знањем српског језика. Пажљиво анализирајте дати текст да ли постоје граматичке, правописне или стилске грешке'
                })
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



async function checkFacts() {
    async function sendText() {
        
        if(!window.confirm(`Да ли желите да пошаљете текст ChatGPT-ju?`)) return;
        try {
            const response = await fetch('http://localhost:3000/chatGPT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    text: document.getElementById('content').innerText,
                    prompt: 'детаљно прегледај новински чланак на српском, пронађи погрешне чињенице и информације. Стави те грешке под наводнике и у низ [] и одговори ми само у том низу. Ако нема грешака, врати празан низ []. Ево текста: ',
                    description: 'Ви сте асистент за проверу чињеница у новинским текстовима на српском језику. Пажљиво анализирајте дати текст да ли постоје чињеничне грешке или погрешне информације'
                })
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