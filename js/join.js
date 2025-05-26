import { session_set } from './session.js';

function join() { // 회원가입 기능
    const nameRegex = /^[가-힣]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    let form = document.querySelector("#join_form");
    let name = document.querySelector("#form3Example1c");
    let email = document.querySelector("#form3Example3c");
    let password = document.querySelector("#form3Example4c");
    let re_password = document.querySelector("#form3Example4cd");
    let agree = document.querySelector("#form2Example3c");

    // 👉 유효성 검사 먼저 실행
    if (
        name.value.length === 0 ||
        email.value.length === 0 ||
        password.value.length === 0 ||
        re_password.value.length === 0
    ) {
        alert("회원가입 폼에 모든 정보를 입력해주세요.");
        return;
    }

    if (!nameRegex.test(name.value)) {
        alert("이름은 한글만 입력 가능합니다.");
        name.focus();
        return;
    }

    if (!emailRegex.test(email.value)) {
        alert("이메일 형식이 올바르지 않습니다.");
        email.focus();
        return;
    }

    if (!pwRegex.test(password.value)) {
        alert("비밀번호는 8자 이상이며 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
        password.focus();
        return;
    }

    if (password.value !== re_password.value) {
        alert("비밀번호가 일치하지 않습니다.");
        re_password.focus();
        return;
    }

    if (!agree.checked) {
        alert("약관에 동의하셔야 가입이 가능합니다.");
        return;
    }

    // ✅ 모든 조건을 통과한 후에만 실행됨
    const newSignUp = new SignUp(name.value, email.value, password.value, re_password.value);
    session_set(newSignUp);

    form.action = "../index.html";
    form.method = "get";
    form.submit(); // ✅ 이 위치가 핵심!
}

document.getElementById("join_btn").addEventListener('click', join); // 이벤트 리스너

class SignUp {
  constructor(name, email, password, re_password) {
    // 생성자 함수: 객체 생성 시 회원 정보 초기화
    this._name = name;
    this._email = email;
    this._password = password;
    this._re_password = re_password;
  }

  // 전체 회원 정보를 한 번에 설정하는 함수
  setUserInfo(name, email, password, re_password) {
    this._name = name;
    this._email = email;
    this._password = password;
    this._re_password = re_password;
  }

  // 전체 회원 정보를 한 번에 가져오는 함수
  getUserInfo() {
    return {
      name: this._name,
      email: this._email,
      password: this._password,
      re_password: this._re_password
    };
  }
}