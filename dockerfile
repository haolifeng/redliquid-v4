FROM node
COPY ./gconfig /root/gconfig
COPY ./liquidApp /root/liquidApp
WORKDIR /root/liquidApp

RUN npm install -g ts-node  && yarn
ENTRYPOINT ["ts-node","index.ts"]
   

