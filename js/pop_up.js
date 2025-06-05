function show_clock() {
    let currentDate = new Date(); // 현재 시스템 날짜 객체 생성
    let divClock = document.getElementById('divClock');
    let msg = "현재 시간 : ";
    if (currentDate.getHours() > 12) {
        msg += "오후";
        msg += currentDate.getHours() - 12 + "시";
    } else {
        msg += "오전";
        msg += currentDate.getHours() + "시";
    }
    msg += currentDate.getMinutes() + "분";
    msg += currentDate.getSeconds() + "초";
    divClock.innerText = msg;

    if (currentDate.getMinutes() > 58) {
        divClock.style.color = "red";
    }

    setTimeout(show_clock, 1000); // 1초마다 갱신
}

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/; SameSite=None; Secure";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie !== "") {
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] === name) {
                return cookie_name[1];
            }
        }
    }
    return;
}

function pop_up() {
    var cookieCheck = getCookie("popupYN");
    if (cookieCheck !== "N") {
        window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=10, left=10");
    }
}

function closePopup() {
    const checkbox = document.getElementById('check_popup');
    if (checkbox && checkbox.checked) {
        setCookie("popupYN", "N", 1);
        console.log("쿠키를 설정합니다.");
        self.close();
    }
}

// 충돌 방지를 위해 함수명을 고유하게 변경
const logoHover = (obj) => {
    obj.src = "image/LOGO.png";
};

const logoOut = (obj) => {
    obj.src = "image/LOGO_2.jpg";
};

// 필요한 함수만 전역으로 노출
window.pop_up = pop_up;
window.logoHover = logoHover;
window.logoOut = logoOut;
