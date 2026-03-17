document.addEventListener('DOMContentLoaded', () => {
  const domainInput = document.getElementById('domainInput');
  const addBtn = document.getElementById('addBtn');
  const domainList = document.getElementById('domainList');
  const toggleSwitch = document.getElementById('toggleSwitch'); // 스위치 요소 가져오기

  // 1. 초기 상태 불러오기 (스위치 상태 및 도메인 목록)
  function loadInitialState() {
    // isEnabled의 기본값을 true(켜짐)로 설정합니다.
    chrome.storage.local.get({ blockedDomains: [], isEnabled: true }, (result) => {
      // 스위치 상태 반영
      toggleSwitch.checked = result.isEnabled;
      
      // 도메인 목록 그리기
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

  // 2. 스위치 토글 시 상태 저장하기
  toggleSwitch.addEventListener('change', (e) => {
    chrome.storage.local.set({ isEnabled: e.target.checked });
  });

  // 3. 도메인 추가하기
  function addDomain() {
    const newDomain = domainInput.value.trim().toLowerCase();
    if (newDomain) {
      chrome.storage.local.get({ blockedDomains: [] }, (result) => {
        const domains = result.blockedDomains;
        if (!domains.includes(newDomain)) {
          domains.push(newDomain);
          chrome.storage.local.set({ blockedDomains: domains }, () => {
            domainInput.value = '';
            loadInitialState();
          });
        } else {
          alert('이미 추가된 도메인입니다.');
        }
      });
    }
  }

  // 4. 도메인 삭제하기
  function removeDomain(domainToRemove) {
    chrome.storage.local.get({ blockedDomains: [] }, (result) => {
      const domains = result.blockedDomains.filter(domain => domain !== domainToRemove);
      chrome.storage.local.set({ blockedDomains: domains }, () => {
        loadInitialState();
      });
    });
  }

  addBtn.addEventListener('click', addDomain);
  domainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addDomain();
  });

  // 실행 시 초기 상태 로드
  loadInitialState();
});