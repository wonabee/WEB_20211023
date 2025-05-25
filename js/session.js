import { encrypt_text as encrypt_text_cbc } from './crypto.js';
import { encrypt_text as encrypt_text_gcm } from './crypto2.js';


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
        console.log("✅ session_set 시작");
        const id = document.querySelector("#typeEmailX");
        const password = document.querySelector("#typePasswordX");

        const obj = {
            id: id.value,
            otp: new Date()
        };

        const objString = JSON.stringify(obj);
        const en_text1 = encrypt_text_cbc(objString);
        const en_text2 = await encrypt_text_gcm(objString);

        console.log("👉 CBC 암호화:", en_text1);
        console.log("👉 GCM 암호화:", en_text2);

        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass_cbc", en_text1);
        sessionStorage.setItem("Session_Storage_pass_gcm", en_text2);
    } catch (error) {
        console.error("❌ session_set 중 오류 발생:", error);
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

export { session_get, session_check };
