let API_KEY;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkSpelling" && request.tabId) {
    chrome.tabs.sendMessage(request.tabId, { action: "checkSpelling" });
  }
  if (request.action === "checkFacts" && request.tabId) {
    chrome.tabs.sendMessage(request.tabId, { action: "checkFacts" });
  }
  if (request.action === "checkComments" && request.tabId) {
    chrome.tabs.sendMessage(request.tabId, { action: "checkComments" });
  }

  if (request.action === "keySet" && request.tabId) {
    chrome.storage.local.get('API_KEY', (result) =>  API_KEY = result.API_KEY);
  }

  if (request.action === "arrangeArticle" && request.tabId) {
     chrome.storage.local.get('textArticle', (result) => {
      if(chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError.message);
      } else if (result.textArticle) {
        arrangeArticle(result.textArticle);
      }
    })
  } 
})

chrome.storage.local.set({requestArticlePending: false});
  
async function arrangeArticle(textArticle) {
  chrome.storage.local.set({requestArticlePending: true});
  const text = textArticle;
  const prompt = "Среди овај новински текст на српском, у стилу чланака на сајту Радио-телевизије Србије. Немој да уклониш регуларан текст, само исправи шта је потребно. Уклони сувишне размаке између речи, направи пасусе, исправи словне грешке, али немој да изоставиш ниједан део регуларног текста. Имена и презимена треба само да почињу великим словом. Текст треба да буде на ћирилици. Измисли пет занимљивих наслова на основу текста. Ево текста: ";
  const description = 'Ви сте асистент за сређивање новинских текстова на српском језику за сајт Радио-телевизије Србије';

  let answer = await callChatGPT(text, prompt, description);

  try {
    if((!answer) || (answer == '')) {
        chrome.storage.local.set({requestArticlePending: false});
        chrome.runtime.sendMessage({ type: 'textArranged'});
        return
      }
        chrome.storage.local.set({textArticle: answer});
        chrome.runtime.sendMessage({ type: 'textArranged'});
        chrome.storage.local.set({requestArticlePending: false});
        return answer;

  } catch (error) {
    chrome.storage.local.set({requestArticlePending: false});
    chrome.runtime.sendMessage({ type: 'textArranged'});
    return
  }
 
}

/////////// funkcije 

  /* let API_KEY;
  chrome.storage.local.get('API_KEY', (result) =>  API_KEY = result.API_KEY); */

  
  async function callChatGPT(text, prompt, description) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: description},
              { role: 'user', content: prompt + text}
            ],
            temperature: 0.2,
            max_tokens: 3200,
            top_p: 1

          })
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        return data.choices[0].message.content; 
      } catch (error) {
        return error.message
      }

    }