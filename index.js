// HTML의 모든 DOM 구조가 메모리에 로드된 후 스크립트 실행 보장
document.addEventListener('DOMContentLoaded', () => {
    
    // Lucide 아이콘 초기화 렌더링
    lucide.createIcons();

    // 1. 다크모드 관리자 설정
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function initTheme() {
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            themeIcon.setAttribute('data-lucide', 'moon');
        } else {
            document.documentElement.classList.remove('dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        }
        lucide.createIcons();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons();
        showToast('🎨 테마 모드가 변경되었습니다.');
    });

    initTheme();


    // 2. 모바일 내비게이션 드롭다운 제어 (터치 우회 차단)
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
    });

    // 아웃사이드 클릭 시 모바일 메뉴 자동 닫기 바인딩
    document.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });


    // 3. 스크롤 진행바 (Scroll Indicator) & 스크롤 등장 효과 (Reveal)
    const scrollBar = document.getElementById('scroll-bar');
    const reveals = document.querySelectorAll('.reveal');

    function onScroll() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        scrollBar.style.width = scrolled + "%";

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 80) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);


    // 4. 가상 토스트 팝업 알림 엔진
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastText = document.getElementById('toast-text');
        toastText.textContent = message;

        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        if (window.toastTimeout) clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 2800);
    }


    // 5. 게이미피케이션: 하태환 밸런스 퀴즈 엔진
    const quizList = [
        {
            q: "하태환의 배드민턴 플레이 스타일과 충전 주기는?",
            options: ["매주 1회 이상, 끈기 있게 집중하여 땀 흘리기", "한 달에 1회, 가벼운 산책 수준으로 즐기기", "주 5회 매일 아침 프로처럼 훈련하기", "운동은 쉬고 관람만 즐기기"],
            ans: 0
        },
        {
            q: "밴드 동아리 건반 연주자였던 하태환이 가장 짜릿한 희열을 느끼는 순간은?",
            options: ["혼자 피아노 독주를 완벽하게 해냈을 때", "세션들이 열심히 조율한 합이 단숨에 맞아떨어질 때", "티켓 판매량이 아주 많을 때", "곡을 완성하고 피아노 덮개를 닫을 때"],
            ans: 1
        },
        {
            q: "하태환이 리그 오브 레전드 협곡에서 가장 즐겨 픽하는 두 챔피언은?",
            options: ["탑 다리우스 & 정글 가렌", "미드 르블랑 & 정글 샤코", "원딜 이즈리얼 & 서폿 레오나", "미드 아리 & 탑 제이스"],
            ans: 1
        }
    ];

    let quizIdx = 0;
    let quizScore = 0;

    const quizBox = document.getElementById('quiz-box');
    const quizResult = document.getElementById('quiz-result');
    const quizStep = document.getElementById('quiz-step');
    const quizScoreText = document.getElementById('quiz-score');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');

    function loadQuiz() {
        if (quizIdx >= quizList.length) {
            showQuizResults();
            return;
        }

        const current = quizList[quizIdx];
        quizStep.textContent = `질문 ${quizIdx + 1} / ${quizList.length}`;
        quizScoreText.textContent = quizScore;
        quizQuestion.textContent = current.q;
        quizOptions.innerHTML = '';

        current.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full p-4 text-left text-xs sm:text-sm border border-warmgray-200 dark:border-warmgray-700 hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-brand-900/10 rounded-xl transition-all duration-300 font-medium flex items-center justify-between group active:scale-[0.98]";
            btn.innerHTML = `
                <span class="pr-2 leading-snug">${opt}</span>
                <i data-lucide="circle-dot" class="w-4 h-4 text-slate-300 group-hover:text-brand-500 flex-shrink-0 transition"></i>
            `;
            btn.onclick = () => selectOption(idx);
            quizOptions.appendChild(btn);
        });
        lucide.createIcons();
    }

    function selectOption(selected) {
        const current = quizList[quizIdx];
        if (selected === current.ans) {
            quizScore += Math.ceil(100 / quizList.length);
            showToast("✨ 정답입니다! 하태환을 잘 아시는군요!");
        } else {
            showToast("❌ 아쉽습니다! 오답입니다.");
        }
        quizIdx++;
        setTimeout(loadQuiz, 800);
    }

    function showQuizResults() {
        quizBox.classList.add('hidden');
        quizResult.classList.remove('hidden');

        const finalScore = document.getElementById('final-score');
        const badgeText = document.getElementById('badge-text');
        finalScore.textContent = quizScore;

        if (quizScore >= 90) {
            badgeText.textContent = "🏅 '스페셜 플래티넘 플레이어 뱃지'를 획득하셨습니다!";
        } else if (quizScore >= 60) {
            badgeText.textContent = "🥈 '골드 협력가 뱃지'를 획득하셨습니다!";
        } else {
            badgeText.textContent = "🥉 '실버 도전자 뱃지'를 획득하셨습니다!";
        }
    }

    window.restartQuiz = function() {
        quizIdx = 0;
        quizScore = 0;
        quizBox.classList.remove('hidden');
        quizResult.classList.add('hidden');
        loadQuiz();
    };

    loadQuiz();


    // 6. 롤링페이퍼 방명록 보드
    const guestForm = document.getElementById('guestbook-form');
    const guestName = document.getElementById('guest-name');
    const guestMsg = document.getElementById('guest-message');
    const commentsContainer = document.getElementById('comments-container');

    let listData = [
        { id: 1, name: "팀 리더", text: "태환 님, 협업을 정말 중요시하는 모습이 보기 좋습니다. 밴드 건반 이야기가 와닿네요!", date: "2026.07.09" },
        { id: 2, name: "롤 메이트", text: "샤코 미러전 한번 하시죠 ㅋㅋㅋ 포트폴리오 분위기가 따뜻하고 아주 예쁩니다.", date: "2026.07.10" }
    ];

    function drawComments() {
        commentsContainer.innerHTML = '';
        
        if (listData.length === 0) {
            commentsContainer.innerHTML = `
                <div class="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-warmgray-800 rounded-2xl border border-dashed border-warmgray-200 dark:border-warmgray-700">
                    첫 롤링페이퍼의 주인공이 되어주세요!
                </div>
            `;
            return;
        }

        [...listData].reverse().forEach(comment => {
            const div = document.createElement('div');
            div.className = "bg-white dark:bg-warmgray-800 p-4 rounded-2xl border border-warmgray-100 dark:border-warmgray-700 shadow-sm flex items-start justify-between gap-4 transition hover:shadow-md";
            div.innerHTML = `
                <div class="space-y-1 overflow-hidden">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">${comment.name}</span>
                        <span class="text-[9px] text-slate-400 flex-shrink-0">${comment.date}</span>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-all">${comment.text}</p>
                </div>
                <button onclick="removeComment(${comment.id})" class="p-1 text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0" aria-label="삭제">
                    <i data-lucide="x-circle" class="w-4 h-4"></i>
                </button>
            `;
            commentsContainer.appendChild(div);
        });
        lucide.createIcons();
    }

    guestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = guestName.value.trim();
        const msgVal = guestMsg.value.trim();

        if (!nameVal || !msgVal) return;

        const currentDay = new Date();
        const year = currentDay.getFullYear();
        const month = String(currentDay.getMonth() + 1).padStart(2, '0');
        const date = String(currentDay.getDate()).padStart(2, '0');

        const newItem = {
            id: Date.now(),
            name: nameVal,
            text: msgVal,
            date: `${year}.${month}.${date}`
        };

        listData.push(newItem);
        drawComments();

        guestName.value = '';
        guestMsg.value = '';

        showToast('💌 따뜻한 방명록이 무사히 접수되었습니다!');
    });

    window.removeComment = function(id) {
        listData = listData.filter(item => item.id !== id);
        drawComments();
        showToast('🗑️ 방명록 메시지가 안전하게 삭제되었습니다.');
    };

    drawComments();
});