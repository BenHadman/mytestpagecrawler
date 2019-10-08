FROM node
WORKDIR /var/www/html/
ADD . ./
RUN npm install
ENTRYPOINT ./html
