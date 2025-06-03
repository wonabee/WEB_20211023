import { encrypt_text as encrypt_text_cbc } from './crypto.js';
import { decrypt_text as decrypt_text_cbc } from './crypto.js';
import { encrypt_text as encrypt_text_gcm } from './crypto2.js';
import { decrypt_text as decrypt_text_gcm } from './crypto2.js';


// session_set: 로그인 후 세션 저장
async function session_set() {
    try {
        console.log("session_set 시작");
        const id = document.querySelector("#typeEmailX");
        const password = document.querySelector("#typePasswordX");

        // null 체크 (필드 존재 여부 확인)
        if (!id || !password) {
            console.warn("ID 또는 비밀번호 입력 필드가 없습니다. 세션 저장 중단");
            return;
        }

        const obj = {
            id: id.value,
            otp: new Date()
        };

        const objString = JSON.stringify(obj);
        const encrypted_cbc = encrypt_text_cbc(objString);  // CBC 암호화
        const encrypted_gcm = await encrypt_text_gcm(objString);  // GCM 암호화

        console.log("(CBC) 복호화된 값:", objString);
        console.log("CBC 복호화 결과:", objString);
        console.log("(GCM) 복호화된 값:", objString);
        console.log("GCM 복호화 결과:", objString);

        // 세션 저장 (복수 키에 저장)
        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass_cbc", encrypted_cbc);
        sessionStorage.setItem("Session_Storage_pass_gcm", encrypted_gcm);
        

        // 저장 확인 로그
        console.log("세션 저장됨: Session_Storage_id =", sessionStorage.getItem("Session_Storage_id"));

    } catch (error) {
        console.error("session_set 오류:", error);
    }
}

// 회원가입 시 세션 저장
async function session_set2(signUpObj) {
    try {
        const data = signUpObj.getUserInfo(); // 객체 내부 정보 추출
        const jsonStr = JSON.stringify(data); // 문자열 변환

        const encrypted_cbc = encrypt_text_cbc(jsonStr);
        const encrypted_gcm = await encrypt_text_gcm(jsonStr);

        sessionStorage.setItem("signup_data_cbc", encrypted_cbc);
        sessionStorage.setItem("signup_data_gcm", encrypted_gcm);

        console.log("회원가입 CBC 암호화:", encrypted_cbc);
        console.log("회원가입 GCM 암호화:", encrypted_gcm);
    } catch (error) {
        console.error("session_set2 오류:", error);
    }
}

// 회원가입 복호화 함수
async function decrypt_signup_info_if_exists() {
    console.log("회원가입 복호화 시작");

    const encrypted_cbc = sessionStorage.getItem("signup_data_cbc");
    const encrypted_gcm = sessionStorage.getItem("signup_data_gcm");

    console.log("CBC 암호화 데이터:", encrypted_cbc);
    console.log("GCM 암호화 데이터:", encrypted_gcm);

    if (!encrypted_cbc || !encrypted_gcm) {
        console.warn("세션에 회원가입 정보 없음. 복호화 생략");
        return;
    }

    try {
        const decrypted_cbc = decrypt_text_cbc(encrypted_cbc);
        const decrypted_gcm = await decrypt_text_gcm(encrypted_gcm);

        console.log("회원가입 정보 복호화 완료:");
        console.log("CBC 복호화:", decrypted_cbc);
        console.log("GCM 복호화:", decrypted_gcm);
    } catch (error) {
        console.error("회원가입 정보 복호화 실패:", error);
    }
}


// 세션 읽기 함수 (현재 CBC 값만 가져옴)
function session_get() {
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass_cbc");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 로그인 여부 확인
function session_check() {
    if (sessionStorage.getItem("Session_Storage_id")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../index_login.html';
    }
}


/*
// async function session_set() {
//     let session_id = document.querySelector("#typeEmailX");
//     let session_pass = document.querySelector("#typePasswordX");
//     if (sessionStorage) {
//         const en_text2 = await encrypt_text_gcm(session_pass.value);
//         const en_text1 = encrypt_text_cbc(session_pass.value);

//         sessionStorage.setItem("Session_Storage_id", session_id.value);
//         sessionStorage.setItem("Session_Storage_pass", en_text1);  // CBC
//         sessionStorage.setItem("Session_Storage_pass2", en_text2); // GCM
//     } else {
//         alert("로컬 스토리지 지원 x");
//     }
// }

// async function init_logined() {
//     if (sessionStorage) {
//         decrypt_text_cbc();
//         await decrypt_text_gcm();
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// function session_get() { //세션 읽기
//     if (sessionStorage) {
//     return sessionStorage.getItem("Session_Storage_test");
//     } else {
//     alert("세션 스토리지 지원 x");
//     }
// }
*/

export {
  session_set,
  session_set2,
  session_get,
  session_check,
  decrypt_signup_info_if_exists
};
