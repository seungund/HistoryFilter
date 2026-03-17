chrome.history.onVisited.addListener((historyItem) => {
  try {
    const visitedUrl = new URL(historyItem.url);
    
    // 방문 기록이 생길 때마다 크롬 로컬 저장소에서 차단 목록을 가져옵니다.
    chrome.storage.local.get({ blockedDomains: [] }, (result) => {
      const domains = result.blockedDomains;
      
      // 현재 URL에 차단 목록에 있는 도메인이 포함되어 있는지 확인합니다.
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