document.addEventListener('DOMContentLoaded', () => {
  const domainInput = document.getElementById('domainInput');
  const addBtn = document.getElementById('addBtn');
  const domainList = document.getElementById('domainList');

  // 1. 크롬 저장소에서 도메인 목록 불러와서 화면에 그리기
  function loadDomains() {
    chrome.storage.local.get({ blockedDomains: [] }, (result) => {
      domainList.innerHTML = '';
      result.blockedDomains.forEach(domain => {
        const li = document.createElement('li');
        li.textContent = domain;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => removeDomain(domain);
        
        li.appendChild(deleteBtn);
        domainList.appendChild(li);
      });
    });
  }

  // 2. 도메인 추가하기
  function addDomain() {
    // 입력값을 소문자로 변환하고 앞뒤 공백 제거
    const newDomain = domainInput.value.trim().toLowerCase();
    if (newDomain) {
      chrome.storage.local.get({ blockedDomains: [] }, (result) => {
        const domains = result.blockedDomains;
        if (!domains.includes(newDomain)) {
          domains.push(newDomain);
          // 변경된 목록을 저장소에 업데이트
          chrome.storage.local.set({ blockedDomains: domains }, () => {
            domainInput.value = '';
            loadDomains(); // 화면 새로고침
          });
        } else {
          alert('이미 추가된 도메인입니다.');
        }
      });
    }
  }

  // 3. 도메인 삭제하기
  function removeDomain(domainToRemove) {
    chrome.storage.local.get({ blockedDomains: [] }, (result) => {
      const domains = result.blockedDomains.filter(domain => domain !== domainToRemove);
      chrome.storage.local.set({ blockedDomains: domains }, () => {
        loadDomains(); // 화면 새로고침
      });
    });
  }

  // 이벤트 리스너 등록
  addBtn.addEventListener('click', addDomain);
  domainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addDomain();
  });

  // 팝업이 열릴 때 최초 1회 목록 불러오기
  loadDomains();
});