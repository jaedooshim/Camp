const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTcwNjllNmQ1NDhkOTdhMjE1NjJkYTk3NTBlNGUzOSIsInN1YiI6IjY0NzA4N2RhNzI2ZmIxMDBjMmU1Yzc5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LyK-QpDwY5ZbktBvuu0TNB15xAgXZ80iQmMAmOURM9s",
    },
  };

  fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data["results"]);
      let rows = data["results"];
      let temp_html;

      rows.forEach((a) => {
        // forEach문을 돌려서 let으로 설정한 함수들을 반복시킨다.
        let title = a["title"];
        let overview = a["overview"];
        let poster_path = a["poster_path"];
        let vote_average = a["vote_average"];
        let id = a["id"];

        // temp_html 함수를 내부에서 호출하려했지만 작동이 되지않아, 외부에서 호출한다
        temp_html =
          temp_html +
          `<div class="col" id=${id}>
                                    <div class="card h-100">
                                        <img src="https://image.tmdb.org/t/p/original/${poster_path}"
                                            class="card-img-top">
                                        <div class="card-body">
                                            <h5 class="card-title">제목 : ${title}</h5>
                                            <p class="card-text">내용요약 : ${overview}</p>
                                            <p class="mycomment">평점⭐ ${vote_average}</p>
                                        </div>
                                    </div>
                                </div>`;
      });
      // 이미지 클릭시 id 값 나오는 코드
      document.querySelector("#cards-box").innerHTML = temp_html;
      //

      function output() {
        document.getElementById("output").value;
      }

      // document(html)을 querySelector로 일치하는 cards-box를 담아서 html에 inner로 넣어줬다. 그리고 그것을 temp_html로 설정을 하였다.
      document.querySelectorAll(".col").forEach(function (a) {
        a.addEventListener("click", function () {
          // querySelectorAll 모든것을 col(카드이미지,카드박스)에 담아서 forEach문으로 돌린다.
          //그리고 지정된 EventListener 를 타겟할때 호출된 함수를 설정해서 알러트 메세지를 띄운다.
          alert(`이 영화의 id는 ${this.getAttribute("id")}입니다.`);
          //클릭을 하면 alert가 실행되어 아래의 메세지 처럼 나옴
        });
      });
    })
    .catch((err) => console.error(err));
  function text() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTcwNjllNmQ1NDhkOTdhMjE1NjJkYTk3NTBlNGUzOSIsInN1YiI6IjY0NzA4N2RhNzI2ZmIxMDBjMmU1Yzc5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LyK-QpDwY5ZbktBvuu0TNB15xAgXZ80iQmMAmOURM9s",
      },
    };
  }

  function movieSearch() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTcwNjllNmQ1NDhkOTdhMjE1NjJkYTk3NTBlNGUzOSIsInN1YiI6IjY0NzA4N2RhNzI2ZmIxMDBjMmU1Yzc5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LyK-QpDwY5ZbktBvuu0TNB15xAgXZ80iQmMAmOURM9s",
      },
    };

    fetch(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data["results"]);
        let rows = data["results"];
        let temp_html;
        var input = document.getElementById("search-input").value;
        let filteredRows = rows.filter((row) => row.title.includes(input));
        //input 태그의 id값의 이름 search-input를 넣어서 검색기능을 넣는다.
        console.log(filteredRows);
        filteredRows.forEach((a) => {
          // forEach문을 돌려서 let으로 설정한 함수들을 반복시킨다.
          let title = a["title"];
          let overview = a["overview"];
          let poster_path = a["poster_path"];
          let vote_average = a["vote_average"];
          let id = a["id"];
          // i
          temp_html =
            temp_html +
            `<div class="col" id=${id}>
                                    <div class="card h-100">
                                        <img src="https://image.tmdb.org/t/p/original/${poster_path}"
                                            class="card-img-top">
                                        <div class="card-body">
                                            <h5 class="card-title">제목 : ${title}</h5>
                                            <p class="card-text">내용요약 : ${overview}</p>
                                            <p class="mycomment">평점⭐ ${vote_average}</p>
                                        </div>
                                    </div>
                                </div>`;
        });
        console.log(temp_html);
        // 이미지 클릭시 id 값 나오는 코드
        document.querySelector("#cards-box").innerHTML = temp_html;
        // 소문자로 변환  --> 소문자로 검색시 결과 나옴
        text = data;
        var string = string.toUpperCase(text);
        console.log(string);

        function output() {
          document.getElementById("output").value;
        }

        // document(html)을 querySelector로 일치하는 cards-box를 담아서 html에 inner로 넣어줬다. 그리고 그것을 temp_html로 설정을 하였다.
        document.querySelectorAll(".col").forEach(function (a) {
          a.addEventListener("click", function () {
            // querySelectorAll 모든것을 col(카드이미지,카드박스)에 담아서 forEach문으로 돌린다.
            //그리고 지정된 EventListener 를 타겟할때 호출된 함수를 설정해서 알러트 메세지를 띄운다.
            alert(`이 영화의 id는 ${this.getAttribute("id")}입니다.`);
            //클릭을 하면 alert가 실행되어 아래의 메세지 처럼 나옴
          });
        });
      })
      .catch((err) => console.error(err));
  }

  function btn() 