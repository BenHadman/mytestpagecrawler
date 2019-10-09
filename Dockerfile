FROM node
WORKDIR /var/www/html
ADD . ./
RUN npm install
ENTRYPOINT /var/www/html
