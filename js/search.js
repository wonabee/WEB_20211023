const search_message = () => {
    const c = '검색을 수행합니다';
    alert(c);
};
// 검색 버튼 클릭 시 메시지 출력
document.getElementById("search_button_msg").addEventListener('click', search_message);
// 실제로 동작하는 함수
// function search_message(){
//     let m = "검색을 수행합니다!";
//     alert(m);
// }
/*
4주차 추가문제(구현완료)    
함수가 중첩될 시 에러가 나는 것이 아닌 나중에 입력된 함수가 실행됨
(나중에 입력된 함수가 우선순위임)

function search_message(){
    alert("검색을 수행ㅋ");
} 

function search_message(){
    alert("검색을 고고");
} 
*/
function googleSearch() {
    const searchTerm = document.getElementById("search_input").value;
    // 5주차 추가문제(구현완료) - 비속어 필터링
    let word = [
        "바보",
        "개새끼",
        "병신",
        "미친",
        "썅"
    ];
    if (searchTerm === "") {
        alert("문자를 입력해주세요.");
        return false;
    }
    for (let i = 0; i < word.length; i++) {
        if (searchTerm.includes(word[i])) {
            alert("비속어가 포함되어 있습니다.");
            return false;
        }
    }
    const googleSearchUrl = `https://www.google.com/search?q=${
        encodeURIComponent(searchTerm)
    }`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
window.googleSearch = googleSearch;