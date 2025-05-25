import { session_set, session_get, session_check } from './session.js';
import { encrypt_text as encrypt_text_cbc, decrypt_text as decrypt_text_cbc } from './crypto.js';
import { encrypt_text as encrypt_text_gcm, decrypt_text as decrypt_text_gcm } from './crypto2.js';
import { generateJWT, checkAuth } from './jwt_token.js';

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

// function session_check() {
//     if (window.location.pathname.includes('index_login.html')) {
//         if (localStorage.getItem("isLoggedOut") === "true") {
//             localStorage.removeItem("isLoggedOut");
//             return;
//         }
//         if (sessionStorage.getItem("Session_Storage_test")) {
//             alert("이미 로그인 되었습니다.");
//             location.href = '../login/index_login.html';
//         }
//     }
// }

// async function session_set() {
//     let session_id = document.querySelector("#typeEmailX");
//     let session_pass = document.querySelector("#typePasswordX");
//     if (sessionStorage) {
//         const en_text2 = await encrypt_text_gcm(session_pass.value); // Web Crypto AES-GCM 암호화
//         const en_text1 = encrypt_text_cbc(session_pass.value); // CryptoJS AES-CBC 암호화
//         sessionStorage.setItem("Session_Storage_id", session_id.value);
//         sessionStorage.setItem("Session_Storage_pass", en_text1);
//         sessionStorage.setItem("Session_Storage_pass2", en_text2);
//     } else {
//         alert("로컬 스토리지 지원 x");
//     }
// }

function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        sessionStorage.clear();
        alert('로그아웃: 세션 삭제 완료');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function init_logined() {
    if (sessionStorage) {
        decrypt_text_cbc();
        decrypt_text_gcm();
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function logout() {
    localStorage.setItem("isLoggedOut", "true");
    session_del();
    localStorage.removeItem("jwt_token");
    location.href = '../index.html';
}

function login_failed() {
    let failCount = parseInt(getCookie('login_failed_cnt')) || 0;
    failCount++;
    setCookie('login_failed_cnt', failCount, 1);
    alert(`로그인 실패 횟수: ${failCount}`);
    if (failCount >= 3) {
        alert("로그인 3회 이상 실패. 제한됩니다.");
        const loginBtn = document.getElementById("login_btn");
        if (loginBtn) loginBtn.disabled = true;
    }
}

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
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키 요청");
    if (cookie !== "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0].trim() === name) return cookie_name[1];
        }
    }
    return;
}

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');

    if (!emailInput || !idsave_check) {
        console.warn("필수 입력 요소가 없습니다. init() 중단");
        return;
    }

    const payload = {
        id: emailInput.value,
        exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);
    localStorage.setItem('jwt_token', jwtToken);

    let get_id = getCookie("id");
    if (get_id && emailInput) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }

    session_check(); // 세션 및 토큰 검사
}

const check_input = async () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');
    alert('아이디와 비밀번호를 확인 중');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (!emailValue || !passwordValue || !sanitizedEmail || !sanitizedPassword) {
        alert('입력값 부족');
        login_failed();
        return false;
    }

    if (emailValue.length < 5 || emailValue.length > 10) {
        alert('아이디는 5~10자의 조건을 만족해야합니다');
        login_failed();
        return false;
    }
    if (passwordValue.length < 12 || passwordValue.length > 15) {
        alert('비밀번호는 12~15자의 조건을 만족해야합니다.');
        login_failed();
        return false;
    }
    if (/(.)\1{2,}/.test(emailValue)) {
        alert('아이디에 동일 문자 3회 이상이면 안됩니다.');
        login_failed();
        return false;
    }
    if (/(\d{2,})[a-zA-Z가-힣]*\1/.test(emailValue)) {
        alert('아이디에 연속된 숫자 반복 불가합니다.');
        login_failed();
        return false;
    }
    if (!/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue)) {
        alert('비밀번호에 대소문자 포함 필요합니다.');
        login_failed();
        return false;
    }
    if (!/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
        alert('비밀번호에 특수문자 필요합니다.');
        login_failed();
        return false;
    }

    if (idsave_check.checked) {
        alert(`쿠키 저장: ${emailValue}`);
        setCookie("id", emailValue, 1);
    } else {
        setCookie("id", emailValue, 0);
    }

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    login_count(emailValue);

    sessionStorage.setItem("Session_Storage_test", emailValue); // 세션 ID 저장
    sessionStorage.setItem("Session_Storage_pass", passwordValue);
    await session_set();

    //아래코드 주석처리하면, 콘솔에서 CBC GBC 복호화 볼 수 있음
    loginForm.submit();
};

const loginOver = (obj) => {
    obj.src = "image/LOGO.png";
};

const loginOut = (obj) => {
    obj.src = "image/LOGO_2.jpg";
};

document.addEventListener('DOMContentLoaded', () => {
    const failCount = parseInt(getCookie('login_failed_cnt')) || 0;
    if (failCount >= 3) {
        const loginBtn = document.getElementById("login_btn");
        if (loginBtn) {
            loginBtn.disabled = true;
            alert(`로그인 제한 중: ${failCount}회 실패`);
        }
    }

    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) loginBtn.addEventListener('click', check_input);

    const logoutBtn = document.getElementById("logout_btn");
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const userId = sessionStorage.getItem("Session_Storage_test");
            logout_count(userId);
            logout();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const userId = document.getElementById("typeEmailX").value.trim();
            login_count(userId);
            check_input();
        }
    });

    // 로그인 페이지에서만 init 실행
    if (document.getElementById('typeEmailX') && document.getElementById('idSaveCheck')) {
        init();
    }
});