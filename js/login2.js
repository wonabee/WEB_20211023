import { encrypt_text as encrypt_text_cbc, decrypt_text as decrypt_text_cbc } from './crypto.js';
import { encrypt_text as encrypt_text_gcm, decrypt_text as decrypt_text_gcm } from './crypto2.js';
import { generateJWT } from './jwt_token.js';
import {
    session_set,
    decrypt_signup_info_if_exists,
    session_check
} from './session.js';

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = `${escape(name)}=${escape(value)}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookie = document.cookie;
    if (cookie !== "") {
        const cookie_array = cookie.split("; ");
        for (const pair of cookie_array) {
            const [cookie_name, cookie_value] = pair.split("=");
            if (cookie_name.trim() === name)
                return cookie_value;
        }
    }
    return null;
}

function session_del() {
    sessionStorage.clear();
    alert('로그아웃: 세션 삭제 완료');
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
        if (loginBtn)
            loginBtn.disabled = true;
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

async function init_logined() {
    const cbcEncrypted = sessionStorage.getItem("Session_Storage_pass_cbc");
    const gcmEncrypted = sessionStorage.getItem("Session_Storage_pass_gcm");

    if (cbcEncrypted) {
        try {
            const decrypted = decrypt_text_cbc(cbcEncrypted);
            const parsed = JSON.parse(decrypted);
            console.log("복호화된 CBC ID:", parsed.id);
        } catch (e) {
            console.warn("CBC 복호화 실패:", e);
        }
    }

    if (gcmEncrypted) {
        try {
            const decrypted = await decrypt_text_gcm(gcmEncrypted);
            const parsed = JSON.parse(decrypted);
            console.log("복호화된 GCM ID:", parsed.id);
        } catch (e) {
            console.warn("GCM 복호화 실패:", e);
        }
    }
}

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    if (!emailInput || !idsave_check) {
        console.warn("필수 입력 요소가 없습니다. init() 중단");
        return;
    }

    const savedId = getCookie("id");
    if (savedId) {
        emailInput.value = savedId;
        idsave_check.checked = true;
    }

    session_check();  // 이미 로그인 상태면 자동 이동
}

const check_input = async () => {
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (!sanitizedEmail || !sanitizedPassword) {
        alert('입력값 부족');
        login_failed();
        return;
    }

    if (idsave_check.checked) {
        setCookie("id", sanitizedEmail, 7);
    } else {
        setCookie("id", "", 0);  // 쿠키 제거
    }

    login_count(sanitizedEmail);

    // 확인용 세션 값 (디버깅)
    sessionStorage.setItem("Session_Storage_test", sanitizedEmail);
    sessionStorage.setItem("Session_Storage_pass", sanitizedPassword);

    await decrypt_signup_info_if_exists(); // 등록된 회원 목록 보기

    const result = await session_set();
    if (!result) {
        alert("로그인 실패: 회원가입 정보가 없거나 일치하지 않습니다.");
        login_failed();
        return;
    }

    const payload = {
        id: sanitizedEmail,
        exp: Math.floor(Date.now() / 1000) + 3600
    };

    const jwtToken = generateJWT(payload);
    console.log("생성된 JWT:", jwtToken);
    localStorage.setItem("jwt_token", jwtToken);

    await init_logined();

    window.location.href = "../login/index_login.html";
};

document.addEventListener('DOMContentLoaded', () => {
    init();  // 아이디 자동 채우기
    init_logined();

    const loginBtn = document.getElementById("login_btn");
    if (loginBtn)
        loginBtn.addEventListener('click', check_input);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            check_input();
        }
    });
});
