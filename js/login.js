import { session_set, session_check } from './session.js';
import { encrypt_text as encrypt_text_cbc, decrypt_text as decrypt_text_cbc } from './crypto.js';
import { encrypt_text as encrypt_text_gcm, decrypt_text as decrypt_text_gcm } from './crypto2.js';
import { generateJWT, verifyJWT, isAuthenticated } from './jwt_token.js';

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

async function init_logined() {
    if (sessionStorage) {
        const result = await decrypt_text_cbc(); // 비동기로 호출
        console.log("복호화된 값 2:", result);    // 원하는 로그 출력
        await decrypt_text_gcm();                // GCM 복호화도 그대로
    } else {
        alert("세션 스토리지 지원 x");
    }
}

export function logout() {
    console.log("로그아웃 함수 호출됨");
    localStorage.setItem("isLoggedOut", "true");
    session_del();
    localStorage.removeItem("jwt_token");
    console.log("세션 및 토큰 삭제 완료, 리디렉션 시작");
    location.href = '../index.html';
}

export async function local_session_set() {
    let session_id = document.querySelector("#typeEmailX");
    let session_pass = document.querySelector("#typePasswordX");
    if (sessionStorage) {
        const en_text2 = await encrypt_text_gcm(session_pass.value); // Web Crypto AES-GCM 암호화
        const en_text1 = encrypt_text_cbc(session_pass.value); // CryptoJS AES-CBC 암호화
        sessionStorage.setItem("Session_Storage_id", session_id.value);
        sessionStorage.setItem("Session_Storage_pass", en_text1);
        sessionStorage.setItem("Session_Storage_pass2", en_text2);
    } else {
        alert("로컬 스토리지 지원 x");
    }
}

export function local_session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        sessionStorage.clear();
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function local_session_check() {
    if (window.location.pathname.includes('index_login.html')) {
        if (localStorage.getItem("isLoggedOut") === "true") {
            localStorage.removeItem("isLoggedOut");
            return;
        }
        if (sessionStorage.getItem("Session_Storage_id")) {
            alert("이미 로그인 되었습니다.");
            location.href = '../login/index_login.html';
        }
    }
}

function login_failed() {
    let failCount = parseInt(getCookie('login_failed_cnt')) || 0;
    failCount++;
    setCookie('login_failed_cnt', failCount, 1);
    alert(`로그인 실패 횟수: ${failCount}`);
    if (failCount >= 3) {
        alert("로그인 3회 이상 실패. 로그인이 제한됩니다.");
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
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    const cookie = document.cookie;
    if (cookie !== "") {
        const cookie_array = cookie.split("; ");
        for (const item of cookie_array) {
            const [key, val] = item.split("=");
            if (key.trim() === name) return val;
        }
    }
    return;
}

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    const get_id = getCookie("id");
    if (get_id && emailInput) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    local_session_check();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

const check_input = async () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    alert('아이디, 패스워드를 체크합니다');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (!emailValue || !passwordValue || !sanitizedEmail || !sanitizedPassword) {
        alert('이메일과 비밀번호를 모두 입력하세요.');
        login_failed();
        return false;
    }

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

    if (/(.)\1{2,}/.test(emailValue)) {
        alert('아이디에 동일한 문자가 3번 이상 반복되면 안 됩니다.');
        login_failed();
        return false;
    }

    if (/(\d{2,})[a-zA-Z가-힣]*\1/.test(emailValue)) {
        alert('아이디에 연속된 숫자 2자리 이상이 반복되면 안 됩니다.');
        login_failed();
        return false;
    }

    if (!/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue)) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        login_failed();
        return false;
    }

    if (!/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        login_failed();
        return false;
    }

    if (idsave_check.checked) {
        setCookie("id", emailValue, 1);
    } else {
        setCookie("id", "", -1);
    }

    console.log("이메일:", emailValue);
    console.log("비밀번호:", passwordValue);
    login_count(emailValue);

    await session_set();
    await init_logined();

    // JWT 페이로드 + 로그 출력
    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600
    };
    const token = generateJWT(payload);
    localStorage.setItem("jwt_token", token);

    console.log("> ", payload);
    console.log(JSON.stringify({ id: emailValue, otp: new Date().toISOString() }));

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
            alert(`현재 로그인 제한 상태입니다. 실패 횟수: ${failCount}`);
        }
    }

    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
        loginBtn.addEventListener('click', check_input);
    }

    const logoutBtn = document.getElementById("logout_btn");
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const userId = sessionStorage.getItem("Session_Storage_id");
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
});


