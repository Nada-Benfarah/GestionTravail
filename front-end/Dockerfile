# FROM node:14
# WORKDIR /app
# COPY package*.json .
# RUN [ "npm","install" ]
# COPY . .
# EXPOSE 4200
# CMD  [ "npm", "start" ]

FROM node:14 as build
WORKDIR /app
COPY package*.json .
RUN npm i
RUN npm install --save-dev @angular-devkit/build-angular
RUN npm i -g @angular/cli@11.2.12
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
