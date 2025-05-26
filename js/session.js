import { encrypt_text as encrypt_text_cbc } from './crypto.js';
import { decrypt_text as decrypt_text_cbc } from './crypto.js';
import { encrypt_text as encrypt_text_gcm } from './crypto2.js';
import { decrypt_text as decrypt_text_gcm } from './crypto2.js';



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

export async function session_set() {
    try {
        console.log("session_set 시작");
        const id = document.querySelector("#typeEmailX");
        const password = document.querySelector("#typePasswordX");

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

    } catch (error) {
        console.error("session_set 오류:", error);
    }
}

export async function session_set2(signUpObj) {
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
//     }

function session_get() {
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass_cbc");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function session_check() {
    if (sessionStorage.getItem("Session_Storage_id")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../index_login.html';
    }
}


export { session_get, session_check};

