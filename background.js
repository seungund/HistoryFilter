chrome.history.onVisited.addListener((historyItem) => {
  try {
    const visitedUrl = new URL(historyItem.url);
    
    // 저장소에서 도메인 목록과 스위치 상태(isEnabled)를 함께 가져옵니다.
    chrome.storage.local.get({ blockedDomains: [], isEnabled: true }, (result) => {
      
      // 스위치가 꺼져있으면(false) 아무 작업도 하지 않고 종료합니다.
      if (!result.isEnabled) {
        return;
      }
      
      const domains = result.blockedDomains;
      const isBlocked = domains.some(domain => visitedUrl.hostname.includes(domain));

      if (isBlocked) {
        chrome.history.deleteUrl({ url: historyItem.url }, () => {
          console.log(`방문 기록에서 자동 삭제됨: ${historyItem.url}`);
        });
      }
    });
  } catch (error) {
    console.error("URL 분석 오류:", error);
  }
});