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
  if (request.action === "arrangeArticle" && request.tabId) {
     chrome.storage.local.get('textArticle', (result) => {
      if(chrome.runtime.lastError) {
        console.error('Error retrieving data:', chrome.runtime.lastError.message);
      } else if (result.textArticle) {
        arrangeArticle(result.textArticle, request.tabId);
      }
    })
  } 
})

chrome.storage.local.set({requestArticlePending: false});
  
async function arrangeArticle(textArticle, x) {
  chrome.storage.local.set({requestArticlePending: true});
  async function sendText() {
      
      try {
          const response = await fetch(/* 'http://localhost:3000/chatGPT/article'  */'https://grammar-backend.onrender.com/chatGPT/article', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
                },
              body: JSON.stringify({
                  text: textArticle,
                  prompt: "Среди овај новински текст на српском, у стилу чланака на сајту Радио-телевизије Србије. Немој да уклониш регуларан текст, само исправи шта је потребно. Уклони сувишне размаке између речи, направи пасусе, исправи словне грешке, али немој да изоставиш ниједан део регуларног текста. Имена и презимена треба само да почињу великим словом. Текст треба да буде на ћирилици. Измисли пет занимљивих наслова на основу текста. Ево текста: ",
                  description: 'Ви сте асистент за сређивање новинских текстова на српском језику за сајт Радио-телевизије Србије'
              })
          });
          const responseBody = await response.text();
          return responseBody
      } catch (error) {
          alert(error.message);
          return
      }
  }

  let answer = await sendText();

  answer = JSON.parse(answer);
  
  
  if((!answer) || (answer == []) || (answer == '')) {
      alert('ChatGPT није средио текст');
      chrome.storage.local.set({requestArticlePending: false});
      chrome.runtime.sendMessage({ type: 'textArranged'});
      return
  }
  chrome.storage.local.set({textArticle: answer});
  chrome.runtime.sendMessage({ type: 'textArranged'});
  chrome.storage.local.set({requestArticlePending: false});
  return answer;
}