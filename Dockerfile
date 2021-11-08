# base image
FROM node:12.17.0-alpine

WORKDIR /app

ENV TZ=Asia/Seoul

#Gitlab 모듈 경로
# ARG MODULE=wms-ui
#Build 결과 파일 경로
# ARG BUILD_DIR=${MODULE}/.next

# gitlab artifacts에 생성된 파일들 복사
COPY .next/ 		./.next/
COPY node_modules/ 	./node_modules/
COPY package.json 	./


# 앱 실행
ENTRYPOINT ["npm","start"]

#docker run -d -p 3000:3000 --rm registry.sungbae.net/angryant/angryant/angryant-doksa-web
