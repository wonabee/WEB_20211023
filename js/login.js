const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
        // XSS 공격 가능성 발견 시 에러 처리
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    // Sanitized된 값 반환
    return sanitizedInput;
};
function session_set() {
    if (sessionStorage) {
        let session_id = document.getElementById("typeEmailX").value; // 로그인한 ID 저장
        sessionStorage.setItem("Session_Storage_test", session_id);
        alert("세션 스토리지 생성: " + session_id);
    } else {
        alert("세션 스토리지 지원하지 않는 브라우저입니다.");
    }
}
function session_check() {
    if (window.location.pathname.includes('index_login.html')) {
        if (localStorage.getItem("isLoggedOut") === "true") {
            localStorage.removeItem("isLoggedOut");
            return;
        }
        if (sessionStorage.getItem("Session_Storage_test")) {
            alert("이미 로그인 되었습니다.");
            location.href='../login/index_login.html';
        }
    }
}

function session_del() { // 세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        sessionStorage.clear(); // 추가: 모든 세션 클리어
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}
    
function logout(){
    localStorage.setItem("isLoggedOut", "true");
    session_del(); // 세션 삭제
    location.href='../index.html';
}


function login_failed() {
    let failCount = parseInt(getCookie('login_failed_cnt')) || 0;
    failCount++;
    setCookie('login_failed_cnt', failCount, 1);
    alert(`로그인 실패 횟수: ${failCount}`);
    if (failCount >= 3) {
        alert("로그인 3회 이상 실패. 로그인이 제한됩니다.");
        const loginBtn = document.getElementById("login_btn");
        if (loginBtn) {
            loginBtn.disabled = true;
        }
    }
}
    

//10주차추가문제
function login_count(userId) {
    let count = parseInt(getCookie(`login_cnt_${userId}`)) || 0;
    count++;
    setCookie(`login_cnt_${userId}`, count, 7);
    console.log(`로그인 카운트 (${userId}): ${count}`);
}

function logout_count(userId) {
    let count = parseInt(getCookie(`logout_cnt_${userId}`)) || 0;
    count++;
    setCookie(`logout_cnt_${userId}`, count, 7);
    console.log(`로그아웃 카운트 (${userId}): ${count}`);
}

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) +
        "; expires=" + date.toUTCString() + "; path=/";
        // + ";SameSite=None; Secure" 부분 삭제 (10주차 추가문제)
}
function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
    var cookie_array = cookie.split("; ");
    for ( var index in cookie_array) {
    var cookie_name = cookie_array[index].split("=");
    // 10주차 추가문제
    // if (cookie_name[0] == "id") {
    // return cookie_name[1];
    // }
    if (cookie_name[0].trim() == name) {  // ⭐️ trim() 추가
        return cookie_name[1];
    }
    }
    }
    return ;
    }

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if (get_id && emailInput) { // emailInput null 체크
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
    }

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    //const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    // 전역 변수 추가, 맨 위 위치
    const idsave_check = document.getElementById('idSaveCheck');
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // check_xss 함수로 값 Sanitize
    const sanitizedEmail = check_xss(emailValue);  
    const sanitizedPassword = check_xss(passwordValue);

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        login_failed();
        return false;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        login_failed();
        return false;
    }
    // if (emailValue.length < 5) {
    //     alert('아이디는 최소 5글자 이상 입력해야 합니다.');
    //     return false;
    // }
    if (emailValue.length < 5 || emailValue.length > 10) {
        alert('아이디는 5~10글자의 형식을 유지해야합니다');
        login_failed();
        return false;
    }
    if (passwordValue.length < 12 || passwordValue.length > 15) {
        alert('비밀번호는 반드시 12~15글자의 형식을 유지해야 합니다.');
        login_failed();
        return false;
    }
    if (!sanitizedEmail || !sanitizedPassword) {
        login_failed();
        return false;
    }

    // 3글자 이상 동일 문자 반복 금지
    const repeatThreePattern = /(.)\1{2,}/;
    if (repeatThreePattern.test(emailValue)) {
    alert('아이디에 동일한 문자가 3번 이상 반복되면 안 됩니다.');
    login_failed();
    return false;
    }


    // 연속된 숫자 2자리 이상이 반복될 경우 금지 (예: 12아이디12)
    const numberRepeatPattern = /(\d{2,})[a-zA-Z가-힣]*\1/;
    if (numberRepeatPattern.test(emailValue)) {
        alert('아이디에 연속된 숫자 2자리 이상이 반복되면 안 됩니다.');
        login_failed();
        return false;
    }

    // 패스워드 대소문자 포함
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        login_failed();
        return false;
    }

    //성공 시 실패 카운트 초기화
    setCookie('login_failed_cnt', 0, 1);

    // 패스워드에 특수문자 포함
    const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        login_failed();
        return false;
    }

    // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
    if(idsave_check.checked == true) { // 아이디 체크 o
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1); // 1일 저장
        alert("쿠키 값 :" + emailValue);
    }
    else{ // 아이디 체크 x
        setCookie("id", emailValue.value, 0); //날짜를 0 - 쿠키 삭제
    }

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);

    login_count(emailValue);
    session_set(); // 세션 생성
    loginForm.submit();

};

const loginOver = (obj) => {
    obj.src = "image/LOGO.png";
};

const loginOut = (obj) => {
    obj.src = "image/LOGO_2.jpg";
};


    //개인적으로 추가구현한 엔터키로 로그인(9주차) + 10주차 추가문제
    document.addEventListener('DOMContentLoaded', () => {
        const failCount = parseInt(getCookie('login_failed_cnt')) || 0;
        if (failCount >= 3) {
            const loginBtn = document.getElementById("login_btn");
            if (loginBtn) {
                loginBtn.disabled = true;
                alert(`현재 로그인 제한 상태입니다. 실패 횟수: ${failCount}`);
            }
        }
        // (기존의 loginBtn, logoutBtn, 엔터 이벤트 리스너 코드 유지) 

    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
    loginBtn.addEventListener('click', check_input);
    }
    
    const logoutBtn = document.getElementById("logout_btn");
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const userId = sessionStorage.getItem("Session_Storage_test");
            logout_count(userId);
            logout();
        });
    }
    
        // 엔터키 이벤트 추가
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const userId = document.getElementById("typeEmailX").value.trim();
                login_count(userId);
                check_input();
            }
        
        });
    });
    
