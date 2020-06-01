# Image-RESTful-API

이미지 CRUD API 입니다. 허용되는 확장자는 jpg, gif, png 이며 GET, POST, PUT, DELETE, OPTIONS, HEAD
요청을 지원합니다.

## How to Request

GET, PUT, DELETE 요청의 경우 /images/:no의 URL로 요청을 보냅니다. POST 요청의 경우 /images의 URL로
요청을 보냅니다. POST, PUT 요청의 경우 요청의 바디에 BASE64로 인코딩된 IMAGE를 포함해야 합니다.

-   요청 예시

    PUT('/images/:no', send_params) send_params={image:base64로 인코딩된 이미지}

    POST('/images', send_params) send_params={no:업로드할 숫자, image:base64로 인코딩된 이미지}
