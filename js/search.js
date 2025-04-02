document.getElementById("search_button_msg").addEventListener('click', search_message);

function search_message(){
    let m = "검색을 수행합니다!"
    alert(m);
}

/*

function search_message(){
    alert("검색을 수행ㅋ");
} 

function search_message(){
    alert("검색을 고고");
} 
//4주차 추가문제(구현완료)    
//함수가 중첩될 시 에러가 나는 것이 아닌 나중에 입력된 함수가 실행됨
//(나중에 입력된 함수가 우선순위임)

*/

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정


    //5주차 추가문제(구현완료)
    let word = ["바보", "개새끼", "병신", "미친", "썅"]; // 비속어 배열

    if (searchTerm === "") {
        alert("문자를 입력해주세요.");
        return false;
    } // 공백 검사 수행

    for (let i = 0; i < word.length; i++) {
        if (searchTerm.includes(word[i])) {
            alert("비속어가 포함되어있습니다.");
            return false;
        }
    } // 비속어 검사 수행

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    // 새 창에서 구글 검색을 수행
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기
    return false;
}