function session_set() { //세션 저장
    let session_id = document.querySelector("#typeEmailX");
    if (sessionStorage) {
    sessionStorage.setItem("Session_Storage_test", session_id.value);
    } else {
    alert("로컬 스토리지 지원 x");
    }
    }
function session_get() { //세션 읽기
    if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_test");
    } else {
    alert("세션 스토리지 지원 x");
    }
    }