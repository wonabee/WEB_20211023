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

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // check_xss 함수로 값 Sanitize
    const sanitizedEmail = check_xss(emailValue);  
    const sanitizedPassword = check_xss(passwordValue);

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return false;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return false;
    }
    // if (emailValue.length < 5) {
    //     alert('아이디는 최소 5글자 이상 입력해야 합니다.');
    //     return false;
    // }
    if (emailValue.length < 5 || emailValue.length > 10) {
        alert('아이디는 5~10글자의 형식을 유지해야합니다');
        return false;
    }
    if (passwordValue.length < 12 || passwordValue.length > 15) {
        alert('비밀번호는 반드시 12~15글자의 형식을 유지해야 합니다.');
        return false;
    }
    if (!sanitizedEmail || !sanitizedPassword) {
        return false;
    }

    // 3글자 이상 동일 문자 반복 금지
    const repeatThreePattern = /(.)\1{2,}/;
    if (repeatThreePattern.test(emailValue)) {
    alert('아이디에 동일한 문자가 3번 이상 반복되면 안 됩니다.');
    return false;
    }


    // 연속된 숫자 2자리 이상이 반복될 경우 금지 (예: 12아이디12)
    const numberRepeatPattern = /(\d{2,})[a-zA-Z가-힣]*\1/;
    if (numberRepeatPattern.test(emailValue)) {
        alert('아이디에 연속된 숫자 2자리 이상이 반복되면 안 됩니다.');
        return false;
    }

    // 패스워드 대소문자 포함
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    // 패스워드에 특수문자 포함
    const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    loginForm.submit();
};

document.getElementById("login_btn").addEventListener('click', check_input);
//개인적으로 추가구현한 엔터키로 로그인(9주차)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        check_input();
    }
});
